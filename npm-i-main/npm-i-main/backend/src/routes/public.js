// backend/src/routes/public.js
// Rotas públicas de leitura.
// - /public/items/:id => tenta público (sem token) e, se tiver token, usa também.
// - /public/search-competitors => AGORA usa OAuth (token) para evitar 403 do CloudFront.

import { Router } from "express";
import axios from "axios";
import { axiosAuth, refreshIfNeeded } from "../meliApi.js";
import { getAnyUserId } from "../tokenStore.js";

const router = Router();
const ML_BASE = "https://api.mercadolibre.com";

// Axios "público" (sem Authorization)
const mlPublic = axios.create({
  baseURL: ML_BASE,
  timeout: 30_000,
  headers: {
    // UA mais "normal" ajuda com alguns WAFs
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  },
});

function clampInt(v, def, min, max) {
  const n = Number.parseInt(String(v), 10);
  const x = Number.isFinite(n) ? n : def;
  return Math.min(Math.max(x, min), max);
}

function pickAxiosDebug(err) {
  const status = err?.response?.status || 500;
  const data = err?.response?.data || null;
  const cfg = err?.config || {};

  return {
    status,
    message:
      data?.message ||
      data?.error_description ||
      err?.message ||
      "Erro inesperado",
    ml_error: data || undefined,
    request: {
      method: cfg?.method,
      baseURL: cfg?.baseURL,
      url: cfg?.url,
      params: cfg?.params,
    },
    headers: err?.response?.headers,
  };
}

function getUserIdFromReq(req) {
  const qid = typeof req.query.user_id === "string" ? req.query.user_id.trim() : "";
  return qid || getAnyUserId() || null;
}

/**
 * GET /public/items/:id
 * Detalhes de item (leitura).
 * Aqui pode funcionar público. Se o ML bloquear, você ainda consegue via token.
 */
router.get("/items/:id", async (req, res) => {
  const id = String(req.params.id || "").trim();
  if (!id) return res.status(400).json({ ok: false, error: "Informe o id do item" });

  try {
    const r = await mlPublic.get(`/items/${encodeURIComponent(id)}`);
    return res.json({ ok: true, item: r.data });
  } catch (err) {
    // fallback: se tiver token, tenta autenticado
    try {
      const userId = getUserIdFromReq(req);
      if (!userId) throw err;

      const tokens = await refreshIfNeeded(userId);
      const api = axiosAuth(tokens.access_token);

      const r2 = await api.get(`/items/${encodeURIComponent(id)}`);
      return res.json({ ok: true, item: r2.data, usedAuth: true });
    } catch (err2) {
      const dbg = pickAxiosDebug(err2);
      console.error("[public/items/:id] error:", dbg);

      return res.status(dbg.status).json({
        ok: false,
        error: "PUBLIC_ITEM_ERROR",
        status: dbg.status,
        details: dbg.ml_error || { message: dbg.message },
      });
    }
  }
});

/**
 * GET /public/search-competitors?q=whey
 * GET /public/search-competitors?category=MLBxxxx
 *
 * ✅ IMPORTANTE:
 * O ML está retornando 403 para chamada pública (CloudFront/WAF).
 * Então esta rota passa a usar OAuth (token) para evitar o 403.
 */
router.get("/search-competitors", async (req, res) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const category = typeof req.query.category === "string" ? req.query.category.trim() : "";

    if (!q && !category) {
      return res.status(400).json({
        ok: false,
        error: "Informe q (palavra-chave) ou category",
      });
    }

    // precisa de token
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({
        ok: false,
        error: "TOKENS_REQUIRED",
        message: "Faça login em /auth/ml para liberar a busca de concorrentes (ML está bloqueando público com 403).",
      });
    }

    const limit = clampInt(req.query.limit, 20, 1, 50);
    const offset = clampInt(req.query.offset, 0, 0, 10_000);

    const params = { limit, offset };
    if (q) params.q = q;
    if (category) params.category = category;

    // ✅ autenticado
    const tokens = await refreshIfNeeded(userId);
    const api = axiosAuth(tokens.access_token);

    const r = await api.get(`/sites/MLB/search`, { params });

    const results = r.data?.results ?? [];
    const paging = r.data?.paging ?? { total: 0, limit, offset };

    const items = results.map((i) => ({
      id: i.id,
      title: i.title,
      price: i.price,
      currency: i.currency_id,
      thumbnail: i.thumbnail,
      permalink: i.permalink,
      status: i.status,
      stock: i.available_quantity ?? null,
      sold: i.sold_quantity ?? null,
      provider: "mercado-livre",
      seller: {
        id: i.seller?.id ?? null,
        nickname: i.seller?.nickname ?? null,
      },
      shipping: {
        free_shipping: i.shipping?.free_shipping ?? false,
        logistic_type: i.shipping?.logistic_type ?? null,
      },
    }));

    return res.json({
      ok: true,
      query: { q: q || null, category: category || null },
      paging: { total: paging.total ?? items.length, limit, offset },
      items,
    });
  } catch (err) {
    const dbg = pickAxiosDebug(err);
    console.error("[public/search-competitors] error:", dbg);

    return res.status(dbg.status).json({
      ok: false,
      error: "COMPETITOR_SEARCH_ERROR",
      status: dbg.status,
      details: dbg.ml_error || { message: dbg.message },
    });
  }
});
export default router;
