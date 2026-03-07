// backend/src/routes/costs.js
import { Router } from "express";
import { getAnyUserId } from "../tokenStore.js";
import {
  getCostsForUser,
  setDefaultUnitCost,
  setItemUnitCost,
  setFixedCosts,
} from "../stores/costStore.js";

const router = Router();

function pickUserId(req) {
  return req.query.user_id || getAnyUserId();
}

router.get("/", async (req, res) => {
  const userId = pickUserId(req);
  if (!userId) return res.status(400).json({ ok: false, error: "Informe user_id" });
  const data = await getCostsForUser(userId);
  res.json({ ok: true, user_id: String(userId), data });
});

router.put("/default", async (req, res) => {
  const userId = pickUserId(req);
  if (!userId) return res.status(400).json({ ok: false, error: "Informe user_id" });

  const unitCost = req.body?.unitCost;
  const data = await setDefaultUnitCost(userId, unitCost);
  res.json({ ok: true, user_id: String(userId), data });
});

router.put("/item", async (req, res) => {
  const userId = pickUserId(req);
  const itemId = req.query.item_id;
  if (!userId) return res.status(400).json({ ok: false, error: "Informe user_id" });
  if (!itemId) return res.status(400).json({ ok: false, error: "Informe item_id" });

  const unitCost = req.body?.unitCost;
  const data = await setItemUnitCost(userId, itemId, unitCost);
  res.json({ ok: true, user_id: String(userId), item_id: String(itemId), data });
});

router.put("/fixed", async (req, res) => {
  const userId = pickUserId(req);
  if (!userId) return res.status(400).json({ ok: false, error: "Informe user_id" });

  const data = await setFixedCosts(userId, req.body || {});
  res.json({ ok: true, user_id: String(userId), data });
});

export default router;
