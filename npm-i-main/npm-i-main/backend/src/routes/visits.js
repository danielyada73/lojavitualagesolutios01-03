import { Router } from "express";
import { axiosAuth, refreshIfNeeded } from "../meliApi.js";
import { getAnyUserId } from "../tokenStore.js";

const router = Router();

function isValidDate(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function normalizeIds(raw) {
  // aceita:
  // ?item_id=MLB123
  // ?item_id=MLB1,MLB2
  // ?item_id[]=MLB1&item_id[]=MLB2
  if (Array.isArray(raw)) return raw.map(String).map((s) => s.trim()).filter(Boolean);
  return String(raw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function safeError(err) {
  const status = err?.response?.status || err?.status || 500;

  // ML costuma mandar um body com message/error/cause etc.
  const details = err?.response?.data ?? null;

  const message =
    details?.message ||
    details?.error_description ||
    details?.error ||
    err?.message ||
    "Erro inesperado ao buscar visitas";

  return { status, message, details };
}

/**
 * GET /visits?item_id=MLB123&from=YYYY-MM-DD&to=YYYY-MM-DD&user_id=...
 *
 * Retorna visitas do(s) item(ns) no intervalo.
 * Melhorias:
 * - suporta múltiplos ids (csv ou array)
 * - retorna "normalized" com total/series quando possível
 * - em erro, devolve status + details do ML (pra você enxergar o motivo real)
 */
router.get("/", async (req, res) => {
  try {
    const userId =
      req.query.user_id ||
      getAnyUserId() ||
      (process.env.NODE_ENV !== "production" ? process.env.DEFAULT_USER_ID : null);

    if (!userId) {
      return res.status(400).json({
        ok: false,
        error: "MISSING_USER",
        message: "Faça OAuth /auth/ml ou informe user_id",
      });
    }

    const ids = normalizeIds(req.query.item_id);
    const { from, to } = req.query;

    if (!ids.length) {
      return res.status(400).json({
        ok: false,
        error: "MISSING_ITEM",
        message: "Informe item_id (ex: MLB123...)",
      });
    }

    if (from && !isValidDate(from)) {
      return res.status(400).json({
        ok: false,
        error: "INVALID_FROM",
        message: "from deve ser YYYY-MM-DD",
      });
    }

    if (to && !isValidDate(to)) {
      return res.status(400).json({
        ok: false,
        error: "INVALID_TO",
        message: "to deve ser YYYY-MM-DD",
      });
    }

    const tokens = await refreshIfNeeded(String(userId));
    const api = axiosAuth(tokens.access_token);

    const params = new URLSearchParams();
    params.append("ids", ids.join(","));
    if (from) params.append("date_from", from);
    if (to) params.append("date_to", to);

    // endpoint atual que você está usando
    const r = await api.get(`/visits/items?${params.toString()}`, {
      timeout: 30_000,
    });

    // Normalização "best effort":
    // Se vier { MLBxxxx: 923 } -> total por item
    // Se vier série em outro formato -> tenta extrair total/points
    const raw = r.data;

    let normalized = {
      ids,
      totalsById: null,
      totalVisits: null,
      points: null, // se existir série (ex.: [{date, visits}])
    };

    // Caso comum: objeto { "MLB...": 123, "MLB...": 456 }
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const keys = Object.keys(raw);
      const allNumeric = keys.length && keys.every((k) => typeof raw[k] === "number");
      if (allNumeric) {
        normalized.totalsById = raw;
        normalized.totalVisits = keys.reduce((acc, k) => acc + (Number(raw[k]) || 0), 0);
      }
    }

    // Se você algum dia trocar o endpoint e vier { total_visits, visits:[...] }
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      if (typeof raw.total_visits === "number") normalized.totalVisits = raw.total_visits;
      if (Array.isArray(raw.visits)) {
        normalized.points = raw.visits.map((p) => ({
          date: p.date ?? p.day ?? null,
          visits: Number(p.visits ?? p.value ?? 0),
        }));
        if (normalized.totalVisits == null) {
          normalized.totalVisits = normalized.points.reduce((a, p) => a + (p.visits || 0), 0);
        }
      }
    }

    return res.json({
      ok: true,
      user_id: String(userId),
      period: { from: from || null, to: to || null },
      ids,
      data: raw,          // cru (pra debug)
      normalized,         // bonitinho pro front
    });
  } catch (err) {
    const { status, message, details } = safeError(err);
    console.error("[visits] error:", { status, message, details });
    return res.status(status).json({
      ok: false,
      error: "VISITS_ERROR",
      status,
      message,
      details, // <- aqui é onde aparece o real motivo do ML (403/401/etc)
    });
  }
});

/**
 * Placeholder Ads Metrics
 * GET /visits/ads/metrics?from=YYYY-MM-DD&to=YYYY-MM-DD
 *
 * Em vez de “parecer bug”, vamos manter 501 mas com payload claro.
 */
router.get("/ads/metrics", async (req, res) => {
  return res.status(501).json({
    ok: false,
    error: "NOT_IMPLEMENTED",
    message:
      "Ads metrics ainda não estão integrados. Aqui entra a API do Mercado Ads (Product Ads).",
    hint:
      "No front, trate 501 como 'Em breve' e não como erro vermelho.",
  });
});

export default router;