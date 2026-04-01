// src/pages/Orders.jsx
import { useMemo, useState, useEffect } from "react";
import { getAllOrders } from "../../lib/yampi";

function clampNumber(v, def = 0) {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : def;
}

function moneyBRL(v) {
  return clampNumber(v, 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function ymd(d) {
  return String(d || "").slice(0, 10);
}

function monthKey(ymdStr) {
  return String(ymdStr || "").slice(0, 7); // YYYY-MM
}

function safeStr(v) {
  return String(v ?? "").trim();
}

/**
 * Marketplace/canal
 */
function inferMarketplace(o) {
  return (
    safeStr(o.marketplace) ||
    safeStr(o.provider) ||
    safeStr(o.canal) ||
    "ML"
  ).toUpperCase();
}

function calcOrderMetrics(o) {
  const receita = clampNumber(o.paid_amount ?? o.total_amount, 0);
  const items = clampNumber(o.items_count, 0);
  const units = clampNumber(o.units, 0);
  const fees = clampNumber(o.fees, 0);
  return { receita, items, units, fees };
}

/* ----------------------------- UI helpers ----------------------------- */
const ui = {
  card: {
    padding: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.20)",
    borderRadius: 16,
  },
  softBorder: "1px solid rgba(255,255,255,0.08)",
  softBg: "rgba(0,0,0,0.20)",
  shadow: "0 8px 30px rgba(0,0,0,0.35)",
};

function Badge({ children, tone = "neutral" }) {
  const styles = {
    neutral: {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      color: "rgba(255,255,255,0.90)",
    },
    good: {
      background: "rgba(93,255,176,0.10)",
      border: "1px solid rgba(93,255,176,0.22)",
      color: "#5dffb0",
    },
    warn: {
      background: "rgba(255,193,77,0.10)",
      border: "1px solid rgba(255,193,77,0.22)",
      color: "#ffc14d",
    },
    bad: {
      background: "rgba(255,93,93,0.10)",
      border: "1px solid rgba(255,93,93,0.22)",
      color: "#ff5d5d",
    },
    info: {
      background: "rgba(120,200,255,0.10)",
      border: "1px solid rgba(120,200,255,0.22)",
      color: "rgba(120,200,255,0.95)",
    },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: 0.2,
        ...styles[tone],
      }}
    >
      {children}
    </span>
  );
}

function StatCard({ title, value, subtitle, tone = "neutral" }) {
  const toneStyle =
    tone === "good"
      ? { borderColor: "rgba(93,255,176,0.18)" }
      : tone === "bad"
      ? { borderColor: "rgba(255,93,93,0.18)" }
      : tone === "info"
      ? { borderColor: "rgba(120,200,255,0.18)" }
      : {};

  return (
    <div className="panel" style={{ ...ui.card, ...toneStyle, boxShadow: ui.shadow }}>
      <div className="small" style={{ opacity: 0.78 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 950, marginTop: 4 }}>{value}</div>
      {subtitle ? <div className="small" style={{ opacity: 0.70, marginTop: 2 }}>{subtitle}</div> : null}
    </div>
  );
}

function MiniBars({ title, rows }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="panel" style={{ ...ui.card, boxShadow: ui.shadow, display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 950, letterSpacing: 0.2 }}>{title}</div>
      <div style={{ display: "grid", gap: 10 }}>
        {rows.map((r) => {
          const pct = Math.round((r.value / max) * 100);
          return (
            <div
              key={r.label}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 90px",
                gap: 10,
                alignItems: "center",
              }}
            >
              <div className="small" style={{ opacity: 0.9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {r.label}
              </div>

              <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: 10,
                    background: "rgba(120,200,255,0.90)",
                    borderRadius: 999,
                  }}
                />
              </div>

              <div className="small" style={{ textAlign: "right", opacity: 0.9 }}>
                {r.fmt ?? r.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthlyChart({ title, points }) {
  const max = Math.max(1, ...points.map((p) => p.receita));
  const total = points.reduce((a, p) => a + p.receita, 0);
  const avg = points.length ? total / points.length : 0;

  return (
    <div className="panel" style={{ ...ui.card, boxShadow: ui.shadow, display: "grid", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 950, letterSpacing: 0.2 }}>{title}</div>
        <div className="small" style={{ opacity: 0.75 }}>
          {points.length ? `${points[0].day} → ${points[points.length - 1].day}` : "Sem dados"}
        </div>
      </div>

      {!points.length ? (
        <div className="small" style={{ opacity: 0.8 }}>Sem dados no período.</div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          <div
            style={{
              height: 140,
              borderRadius: 16,
              padding: 10,
              background: "linear-gradient(180deg, rgba(120,200,255,0.10), rgba(0,0,0,0.15))",
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
              display: "grid",
              gridTemplateRows: "1fr auto",
              gap: 8,
            }}
          >
            {/* Bars */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${points.length}, minmax(6px, 1fr))`,
                gap: 6,
                alignItems: "end",
              }}
            >
              {points.map((p) => {
                const h = Math.max(3, Math.round((p.receita / max) * 100));
                return (
                  <div
                    key={p.day}
                    title={`${p.day}\nReceita: ${moneyBRL(p.receita)}\nPedidos: ${p.pedidos}`}
                    style={{
                      height: `${h}%`,
                      borderRadius: 999,
                      background: "rgba(120,200,255,0.92)",
                      boxShadow: "0 10px 30px rgba(120,200,255,0.12)",
                      cursor: "default",
                    }}
                  />
                );
              })}
            </div>

            {/* Baseline labels */}
            <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.7 }}>
              <span className="small">0</span>
              <span className="small">{moneyBRL(max)}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div className="small" style={{ opacity: 0.8 }}>
              Total mês: <b>{moneyBRL(total)}</b>
            </div>
            <div className="small" style={{ opacity: 0.8 }}>
              Média/dia: <b>{moneyBRL(avg)}</b>
            </div>
            <div className="small" style={{ opacity: 0.8 }}>
              Pico: <b>{moneyBRL(max)}</b>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const [from, setFrom] = useState("2026-01-29");
  const [to, setTo] = useState("2026-02-28");
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);

  const [status, setStatus] = useState("");
  const [market, setMarket] = useState("ALL");
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const yampiOrders = await getAllOrders(limit);
      
      if (!yampiOrders) throw new Error("Falha ao carregar pedidos da Yampi");
      
      // Mapeia os pedidos da Yampi para o formato esperado pelo componente
      const mapped = yampiOrders.map(o => ({
        id: o.id || o.number,
        date_created: o.created_at?.date || o.created_at || o.date_created,
        status: o.status_label || o.status,
        marketplace: "YAMPI",
        buyer: {
          nickname: `${o.customer?.data?.first_name || ''} ${o.customer?.data?.last_name || ''}`.trim() || o.customer?.data?.email || "Cliente Yampi"
        },
        paid_amount: parseFloat(o.total || 0),
        items_count: o.items?.data?.length || 0,
        units: o.items?.data?.reduce((acc, i) => acc + (i.quantity || 1), 0) || 0,
        item_ids: o.items?.data?.map(i => i.product_id) || [],
        fees: 0
      }));

      setData({ ok: true, orders: mapped });
    } catch (e) {
      setErr(e?.message || "Erro ao carregar");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  // Carregamento inicial
  useEffect(() => {
    load();
  }, []);

  const orders = Array.isArray(data?.orders) ? data.orders : [];

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const mk = inferMarketplace(o);
      if (market !== "ALL" && mk !== market) return false;

      if (q) {
        const s = `${o.id} ${o?.buyer?.nickname ?? ""} ${(o.item_ids || []).join(" ")}`.toLowerCase();
        if (!s.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [orders, market, q]);

  const totals = useMemo(() => {
    let receita = 0;
    let fees = 0;
    let units = 0;
    let items = 0;

    let paidCount = 0;

    for (const o of filtered) {
      const m = calcOrderMetrics(o);
      receita += m.receita;
      fees += m.fees;
      units += m.units;
      items += m.items;

      if (String(o.status).toLowerCase() === "paid") paidCount++;
    }

    const count = filtered.length;
    const ticket = count ? receita / count : 0;
    const paidPct = count ? (paidCount / count) * 100 : 0;

    return { receita, fees, units, items, count, ticket, paidPct };
  }, [filtered]);

  const monthSeries = useMemo(() => {
    const month = monthKey(to);
    const dayMap = new Map();

    for (const o of filtered) {
      const d = ymd(o.date_created);
      if (!d.startsWith(month)) continue;

      const m = calcOrderMetrics(o);
      const prev = dayMap.get(d) || { receita: 0, pedidos: 0 };
      prev.receita += m.receita;
      prev.pedidos += 1;
      dayMap.set(d, prev);
    }

    const days = Array.from(dayMap.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([day, v]) => ({ day, receita: Number(v.receita.toFixed(2)), pedidos: v.pedidos }));

    return { month, points: days };
  }, [filtered, to]);

  const byMarket = useMemo(() => {
    const map = new Map();
    for (const o of filtered) {
      const mk = inferMarketplace(o);
      const prev = map.get(mk) || { pedidos: 0, receita: 0 };
      const m = calcOrderMetrics(o);
      prev.pedidos += 1;
      prev.receita += m.receita;
      map.set(mk, prev);
    }

    return Array.from(map.entries())
      .map(([label, v]) => ({
        label,
        value: v.pedidos,
        fmt: `${v.pedidos} • ${moneyBRL(v.receita)}`,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const byStatus = useMemo(() => {
    const map = new Map();
    for (const o of filtered) {
      const st = String(o.status || "unknown").toLowerCase();
      map.set(st, (map.get(st) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const paidTone = totals.paidPct >= 70 ? "good" : totals.paidPct >= 35 ? "warn" : "bad";

  return (
    <div className="panel" style={{ display: "grid", gap: 14 }}>
      {/* Header + filtros */}
      <div
        className="panel"
        style={{
          ...ui.card,
          boxShadow: ui.shadow,
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 950 }}>Pedidos</div>
          <div className="small" style={{ opacity: 0.75 }}>
            Visão gerencial • KPIs • gráfico mensal • breakdown
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Badge tone="info">Período</Badge>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <span className="small" style={{ opacity: 0.7 }}>→</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Status: todos</option>
            <option value="paid">paid</option>
            <option value="cancelled">cancelled</option>
          </select>

          <select value={market} onChange={(e) => setMarket(e.target.value)}>
            <option value="ALL">Marketplace: todos</option>
            <option value="ML">ML</option>
            <option value="SHOPEE">SHOPEE</option>
            <option value="AMAZON">AMAZON</option>
            <option value="TIKTOK">TIKTOK</option>
          </select>

          <input
            placeholder="Buscar por ID, comprador, MLB..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ minWidth: 240 }}
          />

          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value || 20))}
            style={{ width: 90 }}
            min={1}
            max={50}
          />

          <button className="btn" onClick={load} disabled={loading}>
            {loading ? "Carregando..." : "Recarregar"}
          </button>
        </div>
      </div>

      {err ? <div className="small" style={{ color: "#ff7a7a" }}>{err}</div> : null}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(220px, 1fr))", gap: 12 }}>
        <StatCard
          tone="info"
          title="Receita (página)"
          value={moneyBRL(totals.receita)}
          subtitle={`Ticket médio: ${moneyBRL(totals.ticket)}`}
        />
        <StatCard
          title="Pedidos (página)"
          value={String(totals.count)}
          subtitle={
            <>
              Pagos: <span style={{ fontWeight: 950 }}>{totals.paidPct.toFixed(0)}%</span>
            </>
          }
          tone={paidTone}
        />
        <StatCard
          title="Itens vendidos (página)"
          value={String(totals.units)}
          subtitle={`Items_count: ${totals.items}`}
        />
        <StatCard
          title="Tarifas (página)"
          value={moneyBRL(totals.fees)}
          subtitle="(Se vier 0: revisar origem do fee no backend)"
        />
        <StatCard
          title="Marketplace (filtro)"
          value={market === "ALL" ? "Todos" : market}
          subtitle="Quebra por canal ao lado"
        />
      </div>

      {/* Gráfico + breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <MonthlyChart
          title={`Mensal (${monthSeries.month}) — Receita por dia`}
          points={monthSeries.points}
        />

        <div style={{ display: "grid", gap: 12 }}>
          <MiniBars
            title="Pedidos por marketplace"
            rows={byMarket.length ? byMarket : [{ label: "—", value: 0, fmt: "0" }]}
          />
          <MiniBars
            title="Pedidos por status"
            rows={byStatus.length ? byStatus : [{ label: "—", value: 0, fmt: "0" }]}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="panel" style={{ ...ui.card, boxShadow: ui.shadow }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ fontWeight: 950 }}>Lista de pedidos</div>
          <div className="small" style={{ opacity: 0.75 }}>
            Página: <b>{page + 1}</b> • Mostrando <b>{filtered.length}</b> itens (do retorno atual)
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => setPage((p) => Math.max(0, p - 1))}>
            ← Anterior
          </button>
          <button className="btn" onClick={() => setPage((p) => p + 1)}>
            Próxima →
          </button>
          <div className="small" style={{ opacity: 0.75, alignSelf: "center" }}>
            (Depois que trocar página, clique em “Recarregar”)
          </div>
        </div>

        <div
          style={{
            overflowX: "auto",
            marginTop: 12,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr
                className="small"
                style={{
                  textAlign: "left",
                  opacity: 0.9,
                  position: "sticky",
                  top: 0,
                  background: "rgba(10,12,18,0.92)",
                  backdropFilter: "blur(10px)",
                  zIndex: 2,
                }}
              >
                <th style={{ padding: "12px 10px" }}>Pedido</th>
                <th style={{ padding: "12px 10px" }}>Data</th>
                <th style={{ padding: "12px 10px" }}>Marketplace</th>
                <th style={{ padding: "12px 10px" }}>Status</th>
                <th style={{ padding: "12px 10px" }}>Comprador</th>
                <th style={{ padding: "12px 10px", textAlign: "right" }}>Pago</th>
                <th style={{ padding: "12px 10px", textAlign: "right" }}>Unidades</th>
                <th style={{ padding: "12px 10px", textAlign: "right" }}>Tarifas</th>
                <th style={{ padding: "12px 10px" }}>Item IDs</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((o) => {
                const mk = inferMarketplace(o);
                const m = calcOrderMetrics(o);
                const st = String(o.status || "").toLowerCase();
                const paid = st === "paid";

                const stTone =
                  paid ? "good" : st.includes("cancel") ? "bad" : "neutral";

                return (
                  <tr
                    key={o.id}
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      transition: "background 120ms ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 10px", fontWeight: 950 }}>{o.id}</td>

                    <td style={{ padding: "12px 10px", opacity: 0.9 }}>
                      {String(o.date_created || "").replace("T", " ").slice(0, 19)}
                    </td>

                    <td style={{ padding: "12px 10px" }}>
                      <Badge tone="info">{mk}</Badge>
                    </td>

                    <td style={{ padding: "12px 10px" }}>
                      <Badge tone={stTone}>{st || "—"}</Badge>
                    </td>

                    <td style={{ padding: "12px 10px", opacity: 0.9 }}>
                      {o?.buyer?.nickname ?? "—"}
                    </td>

                    <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: 950 }}>
                      {moneyBRL(m.receita)}
                    </td>

                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      {o.units ?? 0}
                    </td>

                    <td style={{ padding: "12px 10px", textAlign: "right", opacity: 0.95 }}>
                      {moneyBRL(m.fees)}
                    </td>

                    <td style={{ padding: "12px 10px", opacity: 0.85 }}>
                      {(o.item_ids || []).slice(0, 3).join(", ")}
                      {(o.item_ids || []).length > 3 ? "…" : ""}
                    </td>
                  </tr>
                );
              })}

              {!filtered.length ? (
                <tr>
                  <td colSpan={9} style={{ padding: 14, opacity: 0.8 }}>
                    Nada no período/ filtro atual. Clique em “Recarregar”.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
