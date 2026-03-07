// backend/src/routes/stock.js
import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getAnyUserId } from "../tokenStore.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "storage");
const MOVEMENTS_FILE = path.join(DATA_DIR, "movements.json");

async function readMovements() {
  const raw = await fs.readFile(MOVEMENTS_FILE, "utf-8");
  const json = JSON.parse(raw || "{}");
  return Array.isArray(json.movements) ? json.movements : [];
}

/**
 * GET /stock/balance?user_id=...&item_id=...
 */
router.get("/balance", async (req, res) => {
  try {
    const userId = String(req.query.user_id || getAnyUserId() || "");
    if (!userId) return res.status(400).json({ ok: false, error: "MISSING_USER_ID" });

    const itemId = req.query.item_id ? String(req.query.item_id) : "";

    const all = await readMovements();
    const mine = all.filter((m) => String(m.user_id) === userId);

    const byItem = new Map();

    for (const m of mine) {
      const id = String(m.item_id || "");
      if (!id) continue;
      if (itemId && id !== itemId) continue;

      const qty = Number(m.qty || 0);
      const prev = byItem.get(id) || { item_id: id, in: 0, out: 0, adjust: 0, balance: 0 };

      if (m.type === "IN") prev.in += qty;
      else if (m.type === "OUT") prev.out += qty;
      else prev.adjust += qty;

      byItem.set(id, prev);
    }

    const rows = Array.from(byItem.values()).map((x) => ({
      ...x,
      balance: x.in - x.out + x.adjust,
    }));

    rows.sort((a, b) => b.balance - a.balance);

    return res.json({ ok: true, user_id: userId, items: rows, total: rows.length });
  } catch (err) {
    console.error("[stock/balance] error:", err);
    return res.status(500).json({ ok: false, error: "INTERNAL_ERROR", message: err.message });
  }
});

export default router;