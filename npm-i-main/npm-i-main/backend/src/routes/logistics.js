// backend/src/routes/logistics.js
import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { axiosAuth, refreshIfNeeded } from "../meliApi.js";
import { getAnyUserId } from "../tokenStore.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// arquivo simples (sem DB por enquanto)
const DATA_DIR = path.join(__dirname, "..", "storage");
const MOVEMENTS_FILE = path.join(DATA_DIR, "movements.json");

async function ensureStorage() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(MOVEMENTS_FILE);
  } catch {
    await fs.writeFile(MOVEMENTS_FILE, JSON.stringify({ movements: [] }, null, 2), "utf-8");
  }
}

async function readMovements() {
  await ensureStorage();
  const raw = await fs.readFile(MOVEMENTS_FILE, "utf-8");
  const json = JSON.parse(raw || "{}");
  return Array.isArray(json.movements) ? json.movements : [];
}

async function writeMovements(movements) {
  await ensureStorage();
  await fs.writeFile(MOVEMENTS_FILE, JSON.stringify({ movements }, null, 2), "utf-8");
}

function ymdNow() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isValidYMD(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function clampInt(v, def, min, max) {
  const n = Number.parseInt(String(v), 10);
  const x = Number.isFinite(n) ? n : def;
  return Math.min(Math.max(x, min), max);
}

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isoFromYMD(from, end = false) {
  // string ISO (sem template literal errado)
  return end
    ? `${from}T23:00:00.000-03:00`
    : `${from}T00:00:00.000-03:00`;
}

/**
 * GET /logistics/movements?user_id=...&from=YYYY-MM-DD&to=YYYY-MM-DD&item_id=MLB...
 */
router.get("/movements", async (req, res) => {
  try {
    const userId = String(req.query.user_id || getAnyUserId() || "");
    if (!userId) return res.status(400).json({ ok: false, error: "MISSING_USER_ID" });

    const from = req.query.from ? String(req.query.from) : "";
    const to = req.query.to ? String(req.query.to) : "";
    const itemId = req.query.item_id ? String(req.query.item_id) : "";

    if (from && !isValidYMD(from)) return res.status(400).json({ ok: false, error: "from deve ser YYYY-MM-DD" });
    if (to && !isValidYMD(to)) return res.status(400).json({ ok: false, error: "to deve ser YYYY-MM-DD" });

    const all = await readMovements();

    const filtered = all
      .filter((m) => String(m.user_id) === userId)
      .filter((m) => (itemId ? String(m.item_id) === itemId : true))
      .filter((m) => {
        if (!from && !to) return true;
        const d = String(m.date || "");
        if (!d) return false;
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      })
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));

    return res.json({ ok: true, user_id: userId, movements: filtered, total: filtered.length });
  } catch (err) {
    console.error("[logistics/movements] error:", err);
    return res.status(500).json({ ok: false, error: "INTERNAL_ERROR", message: err.message });
  }
});

/**
 * POST /logistics/movements
 * body: { user_id, date, type:IN|OUT|ADJUST, item_id, qty, note? }
 */
router.post("/movements", async (req, res) => {
  try {
    const body = req.body || {};
    const userId = String(body.user_id || getAnyUserId() || "");
    if (!userId) return res.status(400).json({ ok: false, error: "MISSING_USER_ID" });

    const date = body.date ? String(body.date) : ymdNow();
    if (!isValidYMD(date)) return res.status(400).json({ ok: false, error: "date deve ser YYYY-MM-DD" });

    const type = String(body.type || "").toUpperCase();
    if (!["IN", "OUT", "ADJUST"].includes(type)) {
      return res.status(400).json({ ok: false, error: "type inválido (IN|OUT|ADJUST)" });
    }

    const item_id = String(body.item_id || "");
    if (!item_id) return res.status(400).json({ ok: false, error: "MISSING_ITEM_ID" });

    const qty = clampInt(body.qty, 0, 0, 1000000);
    if (qty <= 0) return res.status(400).json({ ok: false, error: "qty deve ser > 0" });

    const note = body.note ? String(body.note) : "";

    const all = await readMovements();
    const movement = {
      id: makeId(),
      user_id: userId,
      date,
      type,
      item_id,
      qty,
      source: "MANUAL",
      ref: null,
      note,
      created_at: new Date().toISOString(),
    };

    all.push(movement);
    await writeMovements(all);

    return res.json({ ok: true, movement });
  } catch (err) {
    console.error("[logistics POST] error:", err);
    return res.status(500).json({ ok: false, error: "INTERNAL_ERROR", message: err.message });
  }
});

/**
 * POST /logistics/sync/ml?user_id=...&from=YYYY-MM-DD&to=YYYY-MM-DD&limit=50&offset=0
 * - cria movimentos OUT com source=ML_ORDER e ref=order_id
 * - dedupe: não cria se já existe (user_id + ref + item_id)
 */
router.post("/sync/ml", async (req, res) => {
  try {
    const userId = String(req.query.user_id || getAnyUserId() || "");
    if (!userId) return res.status(400).json({ ok: false, error: "MISSING_USER_ID" });

    const from = req.query.from ? String(req.query.from) : "";
    const to = req.query.to ? String(req.query.to) : "";
    if (from && !isValidYMD(from)) return res.status(400).json({ ok: false, error: "from deve ser YYYY-MM-DD" });
    if (to && !isValidYMD(to)) return res.status(400).json({ ok: false, error: "to deve ser YYYY-MM-DD" });

    const limit = clampInt(req.query.limit, 50, 1, 50);
    const offset = clampInt(req.query.offset, 0, 0, 100000);

    const tokens = await refreshIfNeeded(userId);
    const api = axiosAuth(tokens.access_token);

    const params = {
      limit,
      offset,
      sort: "date_desc",
      seller: userId,
    };

    // filtro por data do pedido criado
    if (from) params["order.date_created.from"] = isoFromYMD(from, false);
    if (to) params["order.date_created.to"] = isoFromYMD(to, true);

    // busca pedidos pagos (pra baixa)
    params["order.status"] = "paid";

    const r = await api.get("/orders/search", { params, timeout: 30000 });
    const results = r.data?.results || [];

    // carrega movimentos atuais e prepara dedupe
    const all = await readMovements();
    const exists = new Set(
      all
        .filter((m) => String(m.user_id) === userId && m.source === "ML_ORDER" && m.ref)
        .map((m) => `${m.ref}::${m.item_id}`)
    );

    let created = 0;
    let skipped = 0;

    for (const o of results) {
      const orderId = String(o.id);
      const dateCreated = (o.date_created || "").slice(0, 10);
      const date = isValidYMD(dateCreated) ? dateCreated : ymdNow();

      const items = o.order_items || [];
      const itemIds = items
        .map((it) => it.item?.id || it.item_id)
        .filter(Boolean);

      // “pedido padrão”: usa o primeiro item como principal
      const mainItem = itemIds[0];
      const units = items.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0) || 1;

      // se não vier item, ignora
      if (!mainItem) continue;

      // 1 pedido -> 1 baixa principal
      const keyMain = `${orderId}::${mainItem}`;
      if (!exists.has(keyMain)) {
        all.push({
          id: makeId(),
          user_id: userId,
          date,
          type: "OUT",
          item_id: String(mainItem),
          qty: clampInt(units, 1, 1, 1000000),
          source: "ML_ORDER",
          ref: orderId,
          note: "Baixa automática (pedido ML)",
          created_at: new Date().toISOString(),
        });
        exists.add(keyMain);
        created++;
      } else {
        skipped++;
      }

      // se tiver mais itens, cria “OUT 1” pra cada (sem rateio)
      for (const extra of itemIds.slice(1)) {
        const k = `${orderId}::${extra}`;
        if (exists.has(k)) {
          skipped++;
          continue;
        }
        all.push({
          id: makeId(),
          user_id: userId,
          date,
          type: "OUT",
          item_id: String(extra),
          qty: 1,
          source: "ML_ORDER",
          ref: orderId,
          note: "Baixa extra (pedido ML com múltiplos itens)",
          created_at: new Date().toISOString(),
        });
        exists.add(k);
        created++;
      }
    }

    await writeMovements(all);

    return res.json({
      ok: true,
      user_id: userId,
      synced_orders: results.length,
      created,
      skipped,
    });
  } catch (err) {
    console.error("[logistics sync ml] error:", err?.response?.data || err);
    return res.status(err?.response?.status || 500).json({
      ok: false,
      error: "SYNC_ML_ERROR",
      message: err?.response?.data?.message || err.message,
      details: err?.response?.data,
    });
  }
});

export default router;