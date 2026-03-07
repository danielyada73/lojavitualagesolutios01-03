// src/meliApi.js
import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";
import { getTokens, saveTokens, isExpired } from "./tokenStore.js";

dotenv.config();

/**
 * ✅ Domínio correto da API do Mercado Livre:
 * https://api.mercadolibre.com
 *
 * (Se estiver usando "mercadolivre.com" aqui, a troca de token pode falhar.)
 */
export const ML_API_BASE = "https://api.mercadolibre.com";

// Endpoint oficial para troca/refresh de token
const TOKEN_URL = `${ML_API_BASE}/oauth/token`;

/**
 * Valida envs obrigatórias (melhor erro, mais rápido de diagnosticar)
 */
function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`ENV ausente: ${name}`);
  return v;
}

/**
 * Normaliza erros do Axios para não “sumir” com o motivo real.
 */
function normalizeAxiosError(err) {
  const status = err?.response?.status || 0;
  const data = err?.response?.data;
  const message = err?.message || "Erro desconhecido";

  return { status, data, message };
}

/**
 * Cria um cliente axios autenticado com Bearer token.
 */
export function axiosAuth(access_token) {
  return axios.create({
    baseURL: ML_API_BASE,
    headers: { Authorization: `Bearer ${access_token}` },
  });
}

/**
 * Cliente público (sem token).
 */
export const axiosPublic = axios.create({ baseURL: ML_API_BASE });

/**
 * Renova tokens se expirados usando refresh_token.
 * ⚠️ Importante: o refresh_token do ML é de uso único.
 */
export async function refreshIfNeeded(userId) {
  const tokens = getTokens(userId);
  if (!tokens) {
    const e = new Error("Tokens não encontrados. Faça login em /auth/ml");
    e.status = 401;
    e.details = { reason: "missing_tokens", userId };
    throw e;
  }

  if (!isExpired(tokens)) return tokens;

  const body = {
    grant_type: "refresh_token",
    client_id: requireEnv("ML_CLIENT_ID"),
    client_secret: requireEnv("ML_CLIENT_SECRET"),
    refresh_token: tokens.refresh_token,
  };

  try {
    const res = await axios.post(TOKEN_URL, qs.stringify(body), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 20000,
    });

    // Salva o NOVO par (vem novo refresh_token também)
    saveTokens(res.data);
    return getTokens(userId);
  } catch (err) {
    const n = normalizeAxiosError(err);

    const e = new Error("Falha ao renovar tokens do Mercado Livre");
    e.status = n.status || 500;
    e.details = n.data || { message: n.message, step: "refresh_token" };
    throw e;
  }
}

/**
 * Troca o authorization code por tokens.
 * Suporta PKCE quando `codeVerifier` é informado.
 */
export async function authCodeToTokens(code, codeVerifier) {
  const body = {
    grant_type: "authorization_code",
    client_id: requireEnv("ML_CLIENT_ID"),
    client_secret: requireEnv("ML_CLIENT_SECRET"),
    code,
    redirect_uri: requireEnv("ML_REDIRECT_URI"),
  };

  // PKCE (se você estiver usando PKCE)
  if (codeVerifier) body.code_verifier = codeVerifier;

  try {
    const res = await axios.post(TOKEN_URL, qs.stringify(body), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 20000,
    });

    saveTokens(res.data);
    return res.data;
  } catch (err) {
    const n = normalizeAxiosError(err);

    // 🔥 Não jogamos fora o erro real
    const e = new Error("Falha ao trocar code por tokens do Mercado Livre");
    e.status = n.status || 500;
    e.details = n.data || { message: n.message, step: "authorization_code" };
    throw e;
  }
}
