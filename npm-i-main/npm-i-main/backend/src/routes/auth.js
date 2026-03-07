// src/routes/auth.js
// Rotas de autenticação com o Mercado Livre usando PKCE + STATE
// ------------------------------------------------------------
// Fluxo:
// 1) GET /auth/ml
//    - gera STATE + PKCE
//    - salva code_verifier em memória (pending Map)
//    - redireciona usuário para tela do Mercado Livre
//
// 2) GET /auth/ml/callback?code=...&state=...
//    - valida state
//    - troca code -> tokens (POST /oauth/token)
//    - salva tokens no tokenStore
//
// 3) GET /auth/ml/tokens (DEV ONLY)
//    - mostra status do token sem vazar access_token completo

import { Router } from "express";
import crypto from "crypto";
import { authCodeToTokens, refreshIfNeeded } from "../meliApi.js";
import { getAnyUserId } from "../tokenStore.js";
import { generateCodeVerifier, codeChallengeS256 } from "../utils/pkce.js";

const router = Router();

/**
 * STATE pendente em memória: state -> { codeVerifier, createdAt }
 * Em produção/escala: use Redis ou banco.
 */
const pending = new Map();

/**
 * Configs operacionais/segurança
 */
const STATE_TTL_MS = Number(process.env.OAUTH_STATE_TTL_MS ?? 10 * 60 * 1000); // 10 min
const PENDING_MAX = Number(process.env.OAUTH_PENDING_MAX ?? 500);

/**
 * Limpa states expirados e limita o tamanho do Map
 */
function cleanupPending() {
  const now = Date.now();

  // remove expirados
  for (const [state, v] of pending.entries()) {
    if (!v?.createdAt || now - v.createdAt > STATE_TTL_MS) {
      pending.delete(state);
    }
  }

  // se passou do limite, remove os mais antigos
  if (pending.size > PENDING_MAX) {
    const entries = [...pending.entries()].sort(
      (a, b) => (a[1].createdAt ?? 0) - (b[1].createdAt ?? 0)
    );
    const toRemove = pending.size - PENDING_MAX;
    for (let i = 0; i < toRemove; i++) pending.delete(entries[i][0]);
  }
}

/**
 * 1) Inicia o login no Mercado Livre com STATE + PKCE (S256)
 * GET /auth/ml
 */
router.get("/ml", (req, res) => {
  cleanupPending();

  // STATE evita CSRF / replay
  const state = crypto.randomUUID();

  // PKCE evita interceptação do authorization code
  const codeVerifier = generateCodeVerifier(64);
  const codeChallenge = codeChallengeS256(codeVerifier);

  // NUNCA logue codeVerifier (segredo)
  pending.set(state, { codeVerifier, createdAt: Date.now() });

  // Parâmetros exigidos pelo Mercado Livre OAuth
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.ML_CLIENT_ID,
    redirect_uri: process.env.ML_REDIRECT_URI, // deve bater 100% com o cadastrado no ML
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const url = `https://auth.mercadolivre.com.br/authorization?${params.toString()}`;

  // log leve (não vaza segredos)
  console.log("[AUTH] redirecting to ML. state:", state);

  return res.redirect(url);
});

/**
 * 2) Callback do Mercado Livre
 * GET /auth/ml/callback?code=...&state=...
 */
router.get("/ml/callback", async (req, res) => {
  try {
    cleanupPending();

    const code = typeof req.query.code === "string" ? req.query.code : null;
    const state = typeof req.query.state === "string" ? req.query.state : null;

    if (!code || !state) {
      return res.status(400).json({
        ok: false,
        error: "Parâmetros ausentes (code/state)",
      });
    }

    const saved = pending.get(state);
    if (!saved) {
      return res.status(400).json({
        ok: false,
        error: "STATE inválido ou expirado",
      });
    }

    // Consome o state (protege contra replay)
    pending.delete(state);

    // Troca code -> tokens (e o meliApi salva no tokenStore)
    const data = await authCodeToTokens(code, saved.codeVerifier);

    // Evite devolver tokens pro browser em produção.
    return res.json({ ok: true, user_id: data.user_id });
  } catch (err) {
    // Diagnóstico real (Axios -> err.response.data)
    const status = err?.response?.status || err?.status || 500;
    const details = err?.response?.data || err?.details || err?.message || "Erro no callback";


    // Logs forçados pra aparecerem no terminal
    console.error("[AUTH CALLBACK] STATUS =", status);
    console.error("[AUTH CALLBACK] DETAILS =", JSON.stringify(details, null, 2));

    // Retorna diagnóstico pro browser (temporário para debug)
    return res.status(status).json({
      ok: false,
      error: "Falha ao trocar code por tokens do Mercado Livre",
      status,
      details,
      debug: "AUTH_CALLBACK_V2",
    });
  }
});

/**
 * 3) DEV ONLY: status do usuário autenticado (sem vazar tokens)
 * GET /auth/ml/tokens
 */
router.get("/ml/tokens", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(404).json({ ok: false, error: "Not found" });
    }

    const uid =
      (typeof req.query.user_id === "string" && req.query.user_id) ||
      getAnyUserId();

    if (!uid) {
      return res.status(404).json({ ok: false, error: "Nenhum user autenticado" });
    }

    const tokens = await refreshIfNeeded(uid);

    return res.json({
      ok: true,
      user_id: uid,
      token_info: {
        expAt: tokens.expAt,
        updatedAt: tokens.updatedAt,
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
        accessTokenPreview: tokens.access_token
          ? `${tokens.access_token.slice(0, 6)}…`
          : null,
      },
    });
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err?.message || "Erro ao buscar tokens";

    console.error("[AUTH] tokens error:", { status, details });

    return res.status(status).json({
      ok: false,
      error: "Erro ao buscar tokens",
      status,
      details,
    });
  }
});

export default router;
