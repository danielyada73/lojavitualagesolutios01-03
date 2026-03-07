// backend/src/routes/dashboard.js
import { Router } from "express";
import { axiosAuth, refreshIfNeeded } from "../meliApi.js";
import { getAnyUserId } from "../tokenStore.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

/* ------------------------------- helpers ------------------------------- */
function isValidYMD(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function clampInt(v, def, min, max) {
  const n = Number.parseInt(String(v), 10);
  const x = Number.isFinite(n) ? n : def;
  return Math.min(Math.max(x, min), max);
}

function clampNumber(v, def = 0) {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : def;
}

function isoFromYMD(ymd, end = false) {
  return end ? `${ymd}T23:59:59.000-03:00` : `${ymd}T00:00:00.000-03:00`;
}

function addDays(ymd, days) {
  const d = new Date(`${ymd}T00:00:00.000-03:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// semana começa na segunda (padrão BR)
function startOfWeekMonday(ymd) {
  const d = new Date(`${ymd}T00:00:00.000-03:00`);
  const day = d.getDay(); // 0=Dom, 1=Seg...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function listWeeks(from, to) {
  const weeks = [];
  let cur = startOfWeekMonday(from);
  while (cur <= to) {
    weeks.push({ week_start: cur, week_end: addDays(cur, 6) });
    cur = addDays(cur, 7);
  }
  return weeks;
}

function safeError(err) {
  const status = err?.response?.status || 500;
  const details = err?.response?.data;
  const message =
    details?.message ||
    details?.error_description ||
    err?.message ||
    "Erro no dashboard";
  return { status, message, details };
}

/* --------------------------- storage (file-based) -------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "..", "storage");

const COSTS_FILE = path.join(DATA_DIR, "costs.json");
const ADS_FILE = path.join(DATA_DIR, "ads_spend.json");

async function readDefaultUnitCost(userId) {
  try {
    const raw = await fs.readFile(COSTS_FILE, "utf-8");
    const json = JSON.parse(raw || "{}");
    const fromUsers = json?.users?.[String(userId)]?.defaultUnitCost;
    const direct = json?.defaultUnitCost;
    const v = fromUsers ?? direct;
    const n = clampNumber(v, 0);
    return n > 0 ? n : 22;
  } catch {
    return 22;
  }
}

// week_start (segunda) -> spend
async function readAdsSpendMap(userId) {
  try {
    const raw = await fs.readFile(ADS_FILE, "utf-8");
    const json = JSON.parse(raw || "{}");
    const spends = Array.isArray(json.spends) ? json.spends : [];

    const map = new Map();
    for (const s of spends) {
      if (String(s?.user_id) !== String(userId)) continue;

      const wk = String(s?.week_start || "").trim();
      if (!wk) continue;

      const v = clampNumber(s?.spend, 0);
      map.set(wk, (map.get(wk) || 0) + v);
    }
    return map;
  } catch {
    return new Map();
  }
}

/* -------------------------- normalize order (IGUAL orders.js) -------------------------- */
function normalizeOrderFromSearch(o) {
  const items = Array.isArray(o?.order_items) ? o.order_items : [];
  const units = items.reduce((acc, it) => acc + (Number(it?.quantity) || 0), 0);

  // ✅ TAXAS REAIS: mesma lógica do orders.js
  const fees = items.reduce((acc, it) => acc + (Number(it?.sale_fee) || 0), 0);

  const paid_amount = clampNumber(o?.paid_amount ?? o?.total_amount ?? 0);

  return {
    id: o?.id,
    date_created: o?.date_created,
    status: o?.status,
    paid_amount,
    fees,
    units,
  };
}

/* -------------------------------- endpoint -------------------------------- */
/**
 * GET /dashboard/summary?user_id=...&from=YYYY-MM-DD&to=YYYY-MM-DD
 *
 * Agrega por semana:
 * - receita (paid_amount)
 * - tarifas (sum order_items.sale_fee)  ✅ MESMA DO /orders
 * - units (sum order_items.quantity)
 * - custoProd (units * defaultUnitCost)
 * - ads (manual/importado do ads_spend.json)
 */
router.get("/summary", async (req, res) => {
  try {
    const userId = String(req.query.user_id || getAnyUserId() || "").trim();
    if (!userId) return res.status(400).json({ ok: false, error: "MISSING_USER_ID" });

    const from = String(req.query.from || "").trim();
    const to = String(req.query.to || "").trim();
    if (!isValidYMD(from) || !isValidYMD(to)) {
      return res.status(400).json({ ok: false, error: "from/to devem ser YYYY-MM-DD" });
    }

    // por padrão: paid (pra BI fazer sentido)
    const onlyStatus = String(req.query.status || "paid").trim();

    const limit = clampInt(req.query.limit, 50, 1, 50);
    let offset = clampInt(req.query.offset, 0, 0, 100000);

    const defaultUnitCost = await readDefaultUnitCost(userId);
    const adsSpendMap = await readAdsSpendMap(userId);

    const tokens = await refreshIfNeeded(String(userId));
    const api = axiosAuth(tokens.access_token);

    // 1) buscar TODOS os pedidos do range (paginando)
    const allOrders = [];
    const maxPages = 80; // segurança (80*50=4000)
    for (let page = 0; page < maxPages; page++) {
      const params = {
        seller: String(userId),
        sort: "date_desc",
        limit,
        offset,
        "order.date_created.from": isoFromYMD(from, false),
        "order.date_created.to": isoFromYMD(to, true),
      };

      // filtro opcional por status
      if (onlyStatus) params["order.status"] = onlyStatus;

      const r = await api.get("/orders/search", { params, timeout: 30_000 });
      const results = Array.isArray(r.data?.results) ? r.data.results : [];

      for (const o of results) {
        allOrders.push(normalizeOrderFromSearch(o));
      }

      const paging = r.data?.paging || {};
      const total = clampInt(paging.total, allOrders.length, 0, 10_000_000);

      offset += limit;
      if (allOrders.length >= total) break;
      if (results.length < 1) break;
    }

    // 2) cria buckets das semanas do range
    const weeks = listWeeks(from, to);
    const bucketMap = new Map();

    for (const w of weeks) {
      bucketMap.set(w.week_start, {
        id: `${userId}:${w.week_start}`,
        campanha: `Semana ${w.week_start}`,
        inicio: w.week_start,
        fim: w.week_end,
        canal: "ML",

        vendasOrg: 0,
        vendasAds: 0,

        receita: 0,
        tarifas: 0,
        custoProd: 0,
        ads: clampNumber(adsSpendMap.get(w.week_start) ?? 0, 0),

        autoCost: true,
        orders: 0,
        units: 0,
      });
    }

    // 3) agrega pedidos por semana
    for (const o of allOrders) {
      const ymd = String(o.date_created || "").slice(0, 10);
      if (!isValidYMD(ymd)) continue;

      const wk = startOfWeekMonday(ymd);
      const b = bucketMap.get(wk);
      if (!b) continue;

      b.orders += 1;
      b.units += clampInt(o.units, 0, 0, 1_000_000);
      b.receita += clampNumber(o.paid_amount, 0);
      b.tarifas += clampNumber(o.fees, 0);
    }

    // 4) finaliza campos derivados
    const buckets = Array.from(bucketMap.values()).map((b) => {
      const units = clampInt(b.units, 0, 0, 1_000_000);

      b.vendasOrg = units;
      b.vendasAds = 0; // por enquanto não temos split real org/ads
      b.custoProd = Number((units * defaultUnitCost).toFixed(2));

      b.receita = Number(b.receita.toFixed(2));
      b.tarifas = Number(b.tarifas.toFixed(2));
      b.ads = Number(clampNumber(b.ads, 0).toFixed(2));

      return b;
    });

    return res.json({
      ok: true,
      user_id: String(userId),
      range: { from, to },
      costs: { defaultUnitCost },
      buckets,
      totals: { orders: allOrders.length },
    });
  } catch (err) {
    const { status, message, details } = safeError(err);
    console.error("[dashboard/summary] error:", { status, message, details });
    return res.status(status).json({ ok: false, error: "DASHBOARD_ERROR", status, message, details });
  }
});

export default router;