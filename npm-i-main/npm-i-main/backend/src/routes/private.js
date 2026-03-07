import { Router } from "express";
import { axiosAuth, refreshIfNeeded } from "../meliApi.js";
import { getAnyUserId } from "../tokenStore.js";

const router = Router();

function clampInt(v, def, min, max) {
  const n = Number.parseInt(String(v), 10);
  const x = Number.isFinite(n) ? n : def;
  return Math.min(Math.max(x, min), max);
}

function safeError(err) {
  const status = err?.status || err?.response?.status || 500;
  const message =
    err?.message ||
    err?.response?.data?.message ||
    err?.response?.data?.error_description ||
    "Erro inesperado";
  return { status, message };
}

/**
 * GET /me
 * - Ideal: userId vir do auth (req.user)
 * - Por enquanto: query ou dev fallback (getAnyUserId)
 */
router.get("/me", async (req, res) => {
  try {
    const userId = req.query.user_id || getAnyUserId();

    if (!userId) {
      return res.status(400).json({ ok: false, error: "Faça OAuth /auth/ml ou informe user_id" });
    }

    const tokens = await refreshIfNeeded(userId);
    const api = axiosAuth(tokens.access_token);

    const me = await api.get("/users/me");
    res.json({ ok: true, me: me.data });
  } catch (err) {
    const { status, message } = safeError(err);
    console.error("[private/me] error:", message);
    res.status(status).json({ ok: false, error: message });
  }
});

/**
 * GET /my-items?user_id=&limit=20
 * Lista IDs e (opcionalmente) devolve detalhes.
 *
 * ⚠️ Antes você buscava detalhes item por item (lento).
 * Aqui eu troco para batch: /items?ids=... (muito mais rápido).
 */
router.get("/my-items", async (req, res) => {
  try {
    // DEV fallback: ok por enquanto, mas não trate isso como produção.
    const userId =
      req.query.user_id ||
      getAnyUserId() ||
      (process.env.NODE_ENV !== "production" ? process.env.DEFAULT_USER_ID : null);

    if (!userId) {
      return res.status(400).json({ ok: false, error: "Informe user_id ou faça OAuth" });
    }

    const limit = clampInt(req.query.limit, 20, 1, 50); // 1..50

    const tokens = await refreshIfNeeded(userId);
    const api = axiosAuth(tokens.access_token);

    // lista IDs (pode paginar depois com limit/offset se quiser)
    const list = await api.get(`/users/${userId}/items/search`, {
      params: { limit, offset: 0 },
    });

    const itemIds = list.data?.results ?? [];
    const totalIds = list.data?.paging?.total ?? itemIds.length;

    if (!itemIds.length) {
      return res.json({
        ok: true,
        user_id: userId,
        total_ids: totalIds,
        returned: 0,
        item_ids: [],
        items: [],
      });
    }

    // detalhes em batch (bem mais eficiente que loop)
    const idsSlice = itemIds.slice(0, limit);
    const detailsRes = await api.get("/items", {
      params: { ids: idsSlice.join(",") },
    });

    // /items retorna wrapper [{ code, body }, ...]
    const items = (detailsRes.data ?? []).map((w) => w.body ?? w);

    res.json({
      ok: true,
      user_id: userId,
      total_ids: totalIds,
      returned: items.length,
      item_ids: idsSlice,
      items,
    });
  } catch (err) {
    const { status, message } = safeError(err);
    console.error("[private/my-items] error:", message);
    res.status(status).json({ ok: false, error: message });
  }
});

export default router;
