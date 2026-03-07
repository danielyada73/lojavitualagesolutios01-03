// backend/src/routes/ads.js
import express, { Router } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { axiosAuth, refreshIfNeeded } from "../meliApi.js";
import { getAnyUserId } from "../tokenStore.js";

const router = Router();

/* ---------------------------------- FS ---------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "storage");
const ADS_FILE = path.join(DATA_DIR, "ads_spend.json");

async function ensureStorage() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(ADS_FILE);
  } catch {
    const init = { spends: [] }; // { user_id, week_start, spend, updated_at }
    await fs.writeFile(ADS_FILE, JSON.stringify(init, null, 2), "utf-8");
  }
}

async function readAdsFile() {
  await ensureStorage();
  const raw = await fs.readFile(ADS_FILE, "utf-8");
  const json = JSON.parse(raw || "{}");
  return Array.isArray(json.spends) ? json.spends : [];
}

async function writeAdsFile(spends) {
  await ensureStorage();
  await fs.writeFile(ADS_FILE, JSON.stringify({ spends }, null, 2), "utf-8");
}

/* -------------------------------- helpers -------------------------------- */
function isValidYMD(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function clampNumber(v, def = 0) {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : def;
}

function addDays(ymd, days) {
  const d = new Date(`${ymd}T00:00:00.000-03:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

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
    const end = addDays(cur, 6);
    weeks.push({ week_start: cur, week_end: end });
    cur = addDays(cur, 7);
  }
  return weeks;
}

function buildManualSpendMap(spends, userId) {
  const my = spends.filter((s) => String(s.user_id) === String(userId));
  const map = new Map();
  for (const s of my) {
    const wk = String(s.week_start || "");
    if (!wk) continue;
    map.set(wk, clampNumber(s.spend, 0));
  }
  return map;
}

/**
 * ✅ AQUI é onde entra o "automático".
 * Você vai plugar o endpoint real que sua conta suporta (a gente confirma pelo Postman).
 *
 * Retorno esperado:
 * Map(week_start -> spend)
 */
async function fetchAdsSpendFromML({ userId, from, to }) {
  // 1) garante token
  const tokens = await refreshIfNeeded(String(userId));
  const api = axiosAuth(tokens.access_token);

  // 2) TODO: troque este bloco pelo endpoint real do Mercado Ads que sua conta libera.
  // Exemplo de comportamento:
  // - buscar spend diário no range
  // - agregar por semana (startOfWeekMonday)
  //
  // Por enquanto vamos lançar erro controlado para cair no fallback manual:
  const e = new Error("ADS_API_NOT_CONFIGURED");
  e.status = 501;
  e.details = { hint: "Configure fetchAdsSpendFromML() com o endpoint de Ads que seu token suporta." };
  throw e;

  // return new Map();
}

/* -------------------------------- routes --------------------------------- */
/**
 * GET /ads/weeks?user_id=...&from=YYYY-MM-DD&to=YYYY-MM-DD&mode=auto|manual|mixed
 *
 * mode:
 * - manual: só arquivo ads_spend.json
 * - auto: só API (se falhar, dá erro)
 * - mixed (default): tenta API, se falhar usa manual
 */
router.get("/weeks", async (req, res) => {
  try {
    const userId = String(req.query.user_id || getAnyUserId() || "").trim();
    if (!userId) return res.status(400).json({ ok: false, error: "MISSING_USER_ID" });

    const from = String(req.query.from || "").trim();
    const to = String(req.query.to || "").trim();
    const mode = String(req.query.mode || "mixed").toLowerCase();

    if (!isValidYMD(from) || !isValidYMD(to)) {
      return res.status(400).json({ ok: false, error: "from/to devem ser YYYY-MM-DD" });
    }

    const weeks = listWeeks(from, to);

    const spends = await readAdsFile();
    const manualMap = buildManualSpendMap(spends, userId);

    let autoMap = null;
    let autoStatus = "not_requested";

    if (mode === "auto" || mode === "mixed") {
      try {
        autoMap = await fetchAdsSpendFromML({ userId, from, to });
        autoStatus = "ok";
      } catch (err) {
        autoStatus = "failed";
        if (mode === "auto") {
          return res.status(err?.status || 500).json({
            ok: false,
            error: "ADS_AUTO_FAILED",
            message: err?.message || "Falha ao puxar Ads automático",
            details: err?.details,
          });
        }
        // mixed: cai pro manual
        autoMap = null;
      }
    }

    const payload = weeks.map((w) => {
      const manual = manualMap.get(w.week_start) ?? 0;
      const auto = autoMap?.get?.(w.week_start);

      // mixed: se tiver auto usa auto, senão manual
      const spend =
        mode === "manual" ? manual :
        mode === "auto" ? (auto ?? 0) :
        (auto ?? manual);

      return {
        week_start: w.week_start,
        week_end: w.week_end,
        spend: Number(clampNumber(spend, 0).toFixed(2)),
        // placeholders (depois você liga com dashboard)
        revenue: 0,
        orders: 0,
        units: 0,
        source:
          mode === "manual" ? "manual" :
          mode === "auto" ? "auto" :
          (auto != null ? "auto" : "manual"),
      };
    });

    return res.json({
      ok: true,
      user_id: userId,
      mode,
      auto_status: autoStatus,
      weeks: payload,
      total: payload.length,
    });
  } catch (err) {
    console.error("[ads/weeks] error:", err);
    return res.status(500).json({ ok: false, error: "ADS_WEEKS_ERROR", message: err?.message });
  }
});

/**
 * PUT /ads/weeks/spend
 * body: { user_id?, week_start: YYYY-MM-DD, spend: number }
 */
router.put("/weeks/spend", async (req, res) => {
  try {
    const body = req.body || {};
    const userId = String(body.user_id || getAnyUserId() || "").trim();
    if (!userId) return res.status(400).json({ ok: false, error: "MISSING_USER_ID" });

    const weekStartRaw = String(body.week_start || "").trim();
    if (!isValidYMD(weekStartRaw)) {
      return res.status(400).json({ ok: false, error: "week_start deve ser YYYY-MM-DD" });
    }

    const week_start = startOfWeekMonday(weekStartRaw);
    const spend = clampNumber(body.spend, 0);

    const spends = await readAdsFile();
    const idx = spends.findIndex(
      (s) => String(s.user_id) === userId && String(s.week_start) === week_start
    );

    const row = { user_id: userId, week_start, spend, updated_at: new Date().toISOString() };

    if (idx >= 0) spends[idx] = row;
    else spends.push(row);

    await writeAdsFile(spends);
    return res.json({ ok: true, saved: row });
  } catch (err) {
    console.error("[ads/weeks/spend] error:", err);
    return res.status(500).json({ ok: false, error: "ADS_WEEK_SPEND_ERROR", message: err?.message });
  }
});

export default router;