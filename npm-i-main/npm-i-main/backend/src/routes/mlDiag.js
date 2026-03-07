// backend/src/routes/mlDiag.js
// Diagnóstico de conectividade com Mercado Livre.
// Testa endpoints diferentes e devolve status por endpoint.

import { Router } from "express";
import { axiosAuth, refreshIfNeeded } from "../meliApi.js";
import { getAnyUserId } from "../tokenStore.js";

const router = Router();

async function probe(name, fn) {
  try {
    const data = await fn();
    return { name, ok: true, status: 200, dataPreview: data };
  } catch (err) {
    const status = err?.response?.status || err?.status || 500;
    const details = err?.response?.data || err?.message || "erro";
    const requestId = err?.response?.headers?.["x-request-id"] || null;
    return { name, ok: false, status, requestId, details };
  }
}

// GET /_debug/ml
router.get("/ml", async (req, res) => {
  const userId =
    (typeof req.query.user_id === "string" && req.query.user_id.trim()) ||
    getAnyUserId();

  if (!userId) {
    return res.status(401).json({
      ok: false,
      error: "NO_TOKENS",
      message: "Sem tokens. Faça OAuth em /auth/ml",
    });
  }

  const tokens = await refreshIfNeeded(userId);
  const api = axiosAuth(tokens.access_token);

  const out = [];
  out.push(await probe("users/me", async () => (await api.get("/users/me")).data));
  out.push(
    await probe("seller items search", async () =>
      (await api.get(`/users/${userId}/items/search`, { params: { limit: 1, offset: 0 } })).data
    )
  );
  out.push(
    await probe("site search (problematic)", async () =>
      (await api.get(`/sites/MLB/search`, { params: { q: "whey", limit: 1, offset: 0 } })).data
    )
  );

  return res.json({
    ok: true,
    user_id: userId,
    probes: out,
  });
});

export default router;
