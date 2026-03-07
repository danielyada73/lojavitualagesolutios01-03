// src/routes/catalog.js
import { Router } from "express";
import { listProductsByProvider } from "../providers/index.js";

const router = Router();

/**
 * Normaliza provider vindo na URL.
 * Aceita:
 * - mercado-livre / mercado-livre / mercadolivre
 * - ml / meli
 */
function normalizeProvider(raw) {
  const s = String(raw || "").trim().toLowerCase();
  const key = s.replace(/[^a-z0-9]/g, ""); // remove '-' '_' espaços etc.

  if (["mercadolivre", "mercadlivre", "ml", "meli"].includes(key)) {
    return "mercado-livre"; // forma canônica
  }
  return s;
}

function clampInt(v, def, min, max) {
  const n = Number.parseInt(String(v), 10);
  const x = Number.isFinite(n) ? n : def;
  return Math.min(Math.max(x, min), max);
}

// GET /catalog/:provider?limit=20&offset=0&user_id=...
router.get("/:provider", async (req, res) => {
  try {
    const providerRaw = req.params.provider;
    const provider = normalizeProvider(providerRaw);

    const safeLimit = clampInt(req.query.limit, 20, 1, 200);
    const safeOffset = clampInt(req.query.offset, 0, 0, Number.MAX_SAFE_INTEGER);

    // ✅ pega user_id se vier na query (pra não depender do tokenStore em memória)
    const userId =
      typeof req.query.user_id === "string" && req.query.user_id.trim()
        ? req.query.user_id.trim()
        : undefined;

    const data = await listProductsByProvider(provider, {
      userId,
      limit: safeLimit,
      offset: safeOffset,
    });

    return res.json({
      ok: true,
      provider,
      providerRaw,
      paging: { limit: safeLimit, offset: safeOffset, total: data.total ?? 0 },
      items: data.items ?? [],
      warning: data.warning ?? null,
    });
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({
      ok: false,
      error: e.code || "CATALOG_ERROR",
      message: e.message || "Erro ao listar catálogo",
    });
  }
});

export default router;
