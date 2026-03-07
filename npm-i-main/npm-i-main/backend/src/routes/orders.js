// backend/src/routes/orders.js
import { Router } from "express";
import { axiosAuth, refreshIfNeeded } from "../meliApi.js";
import { getAnyUserId } from "../tokenStore.js";

const router = Router();

function isValidYMD(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function isoFromYMD(ymd, end = false) {
  return end ? `${ymd}T23:59:59.000-03:00` : `${ymd}T00:00:00.000-03:00`;
}

function clampInt(v, def, min, max) {
  const n = Number.parseInt(String(v), 10);
  const x = Number.isFinite(n) ? n : def;
  return Math.min(Math.max(x, min), max);
}

function safeError(err) {
  const status = err?.response?.status || 500;
  const details = err?.response?.data;
  const message =
    details?.message ||
    details?.error_description ||
    err?.message ||
    "Erro ao buscar pedidos";
  return { status, message, details };
}

function normalizeOrder(o) {
  const items = o.order_items || [];
  const units = items.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);
  const fees = items.reduce((acc, it) => acc + (Number(it.sale_fee) || 0), 0);

  return {
    id: o.id,
    date_created: o.date_created,
    date_closed: o.date_closed,
    last_updated: o.last_updated,
    status: o.status,
    currency_id: o.currency_id,
    total_amount: Number(o.total_amount || 0),
    paid_amount: Number(o.paid_amount || 0),
    fees,
    items_count: items.length,
    units,
    pack_id: o.pack_id ?? null,
    buyer: o.buyer ? { id: o.buyer.id, nickname: o.buyer.nickname } : null,
    seller: o.seller ? { id: o.seller.id, nickname: o.seller.nickname } : null,
    item_ids: items.map((it) => it.item?.id || it.item_id).filter(Boolean),
  };
}

/**
 * GET /orders?user_id=...&role=seller|buyer&from=YYYY-MM-DD&to=YYYY-MM-DD&status=paid&q=...&expand=shipping
 */
router.get("/", async (req, res) => {
  try {
    const expand = String(req.query.expand || "").toLowerCase(); // "shipping"

    const userId = req.query.user_id || getAnyUserId();
    if (!userId) {
      return res
        .status(400)
        .json({ ok: false, error: "Informe user_id ou faça OAuth /auth/ml" });
    }

    const roleRaw = String(req.query.role || "seller").toLowerCase();
    const role = roleRaw === "buyer" ? "buyer" : "seller";

    const limit = clampInt(req.query.limit, 20, 1, 50);
    const offset = clampInt(req.query.offset, 0, 0, 100000);

    const from = typeof req.query.from === "string" ? req.query.from : null;
    const to = typeof req.query.to === "string" ? req.query.to : null;
    const status = typeof req.query.status === "string" ? req.query.status : null;
    const q = typeof req.query.q === "string" ? req.query.q : null;

    const tokens = await refreshIfNeeded(String(userId));
    const api = axiosAuth(tokens.access_token);

    const params = {
      limit,
      offset,
      sort: "date_desc",
    };

    // seller=ID ou buyer=ID
    params[role] = String(userId);

    // datas
    if (from) {
      if (!isValidYMD(from)) {
        return res
          .status(400)
          .json({ ok: false, error: "from deve ser YYYY-MM-DD" });
      }
      params["order.date_created.from"] = isoFromYMD(from, false);
    }

    if (to) {
      if (!isValidYMD(to)) {
        return res
          .status(400)
          .json({ ok: false, error: "to deve ser YYYY-MM-DD" });
      }
      params["order.date_created.to"] = isoFromYMD(to, true);
    }

    if (status) params["order.status"] = status;
    if (q) params.q = q;

    const r = await api.get("/orders/search", { params, timeout: 30_000 });

    const results = r.data?.results || [];
    const paging = r.data?.paging || { limit, offset, total: results.length };

    // ✅ sem expand: retorna rápido
    if (expand !== "shipping") {
      return res.json({
        ok: true,
        role,
        user_id: String(userId),
        paging,
        orders: results.map(normalizeOrder),
        raw_total: results.length,
      });
    }

    // ✅ expand=shipping: enriquece com shipments
    const enriched = [];
    for (const o of results) {
      const base = normalizeOrder(o);

      try {
        // 1) pega shipping.id
        const detail = await api.get(`/orders/${o.id}`, { timeout: 30_000 });
        const od = detail.data || {};
        const shipmentId = od?.shipping?.id ?? null;

        let shipping = null;

        // 2) pega detalhes reais do envio
        if (shipmentId) {
          const sh = await api.get(`/shipments/${shipmentId}`, { timeout: 30_000 });
          const sd = sh.data || {};

          shipping = {
            id: sd.id ?? shipmentId,
            status: sd.status ?? null,
            logistic_type: sd.logistic_type ?? null,
            shipping_mode: sd.shipping_mode ?? null,
            tracking_number: sd.tracking_number ?? null,
            // opcional (se quiser usar depois)
            receiver_address: sd.receiver_address ?? null,
          };
        }

        enriched.push({
          ...base,
          shipment_id: shipmentId,
          shipping,
        });
      } catch {
        enriched.push({
          ...base,
          shipment_id: null,
          shipping: null,
        });
      }
    }

    return res.json({
      ok: true,
      role,
      user_id: String(userId),
      paging,
      orders: enriched,
      raw_total: results.length,
    });
  } catch (err) {
    const { status, message, details } = safeError(err);
    console.error("[orders] error:", { status, message, details });
    return res
      .status(status)
      .json({ ok: false, error: "ORDERS_ERROR", status, message, details });
  }
});

export default router;