// src/pages/Stock.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchStockBalance, syncMovementsFromML } from "@/dashboard/lib/api";

function clampInt(v, def = 0) {
  const n = Number.parseInt(String(v), 10);
  return Number.isFinite(n) ? n : def;
}

const ui = {
  card: {
    padding: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.20)",
    borderRadius: 16,
  },
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
        : tone === "warn"
          ? { borderColor: "rgba(255,193,77,0.18)" }
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

function MiniBars({ title, rows, valueLabel = "value" }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="panel" style={{ ...ui.card, boxShadow: ui.shadow, display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 950, letterSpacing: 0.2 }}>{title}</div>
      {!rows.length ? (
        <div className="small" style={{ opacity: 0.75 }}>Sem dados.</div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {rows.map((r) => {
            const pct = Math.round((r.value / max) * 100);
            return (
              <div
                key={r.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 140px",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div style={{ display: "grid", gap: 6 }}>
                  <div className="small" style={{ opacity: 0.9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.label}
                  </div>
                  <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: 10, background: "rgba(120,200,255,0.90)", borderRadius: 999 }} />
                  </div>
                </div>
                <div className="small" style={{ textAlign: "right", opacity: 0.95 }}>
                  {r.fmt ?? `${r.value} ${valueLabel}`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BalanceBar({ balance, maxAbs }) {
  // barra central: negativo para esquerda, positivo para direita
  const abs = Math.abs(balance);
  const pct = maxAbs > 0 ? Math.min(100, Math.round((abs / maxAbs) * 100)) : 0;

  const isNeg = balance < 0;
  const color = isNeg ? "rgba(255,93,93,0.80)" : "rgba(93,255,176,0.80)";

  return (
    <div
      style={{
        height: 10,
        borderRadius: 999,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        position: "relative",
      }}
      title={`Saldo: ${balance}`}
    >
      {/* linha central */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(255,255,255,0.12)",
        }}
      />
      {/* barra */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: `${pct / 2}%`,
          background: color,
          left: isNeg ? `${50 - pct / 2}%` : "50%",
          borderRadius: 999,
        }}
      />
    </div>
  );
}

export default function Stock() {
  const [itemId, setItemId] = useState("");
  const [from, setFrom] = useState("2026-02-01");
  const [to, setTo] = useState("2026-02-26");

  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [err, setErr] = useState("");

  // extras gerenciais
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [sort, setSort] = useState("balance_asc"); // balance_asc, out_desc, item_asc

  const [data, setData] = useState({ ok: true, items: [], total: 0 });

  async function loadBalance() {
    setLoading(true);
    setErr("");
    try {
      const r = await fetchStockBalance({ itemId: itemId.trim() || undefined });
      if (!r?.ok) throw new Error(r?.message || "Falha ao carregar saldo");
      setData(r);
    } catch (e) {
      setErr(e?.message || "Erro ao carregar saldo");
      setData({ ok: false, items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }

  async function syncFromML() {
    setSyncing(true);
    setErr("");
    try {
      const r = await syncMovementsFromML({ from, to, limit: 50, offset: 0 });
      if (!r?.ok) throw new Error(r?.message || "Falha ao sincronizar pedidos");
      await loadBalance();
    } catch (e) {
      setErr(e?.message || "Erro ao sincronizar pedidos ML");
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    loadBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowsRaw = useMemo(() => (Array.isArray(data?.items) ? data.items : []), [data]);

  const rows = useMemo(() => {
    let arr = rowsRaw.map((r) => {
      const item = String(r.item_id || "");
      const inQty = clampInt(r.in, 0);
      const outQty = clampInt(r.out, 0);
      const adjQty = clampInt(r.adjust, 0);
      const bal = clampInt(r.balance, 0);
      return { item, inQty, outQty, adjQty, bal };
    });

    if (onlyCritical) arr = arr.filter((x) => x.bal < 0);

    arr.sort((a, b) => {
      if (sort === "balance_asc") return a.bal - b.bal; // mais negativo primeiro
      if (sort === "out_desc") return b.outQty - a.outQty;
      if (sort === "item_asc") return a.item.localeCompare(b.item);
      return 0;
    });

    return arr;
  }, [rowsRaw, onlyCritical, sort]);

  const kpis = useMemo(() => {
    const total = rowsRaw.length;
    let neg = 0;
    let zero = 0;
    let pos = 0;

    let sumIn = 0;
    let sumOut = 0;
    let sumAdj = 0;
    let sumBal = 0;

    for (const r of rowsRaw) {
      const inQty = clampInt(r.in, 0);
      const outQty = clampInt(r.out, 0);
      const adjQty = clampInt(r.adjust, 0);
      const bal = clampInt(r.balance, 0);

      sumIn += inQty;
      sumOut += outQty;
      sumAdj += adjQty;
      sumBal += bal;

      if (bal < 0) neg++;
      else if (bal === 0) zero++;
      else pos++;
    }

    return { total, neg, zero, pos, sumIn, sumOut, sumAdj, sumBal };
  }, [rowsRaw]);

  const maxAbsBalance = useMemo(() => {
    let maxAbs = 0;
    for (const r of rowsRaw) {
      const bal = Math.abs(clampInt(r.balance, 0));
      if (bal > maxAbs) maxAbs = bal;
    }
    return maxAbs || 1;
  }, [rowsRaw]);

  const topOut = useMemo(() => {
    return [...rows].sort((a, b) => b.outQty - a.outQty).slice(0, 5).map((x) => ({
      label: x.item,
      value: x.outQty,
      fmt: `${x.outQty} saídas`,
    }));
  }, [rows]);

  const mostCritical = useMemo(() => {
    return [...rows].sort((a, b) => a.bal - b.bal).slice(0, 5).map((x) => ({
      label: x.item,
      value: Math.abs(x.bal),
      fmt: `saldo ${x.bal}`,
    }));
  }, [rows]);

  function stockTone(bal) {
    if (bal < 0) return "bad";
    if (bal === 0) return "warn";
    return "good";
  }

  return (
    <div className="panel" style={{ display: "grid", gap: 14 }}>
      {/* Header */}
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
          <div style={{ fontSize: 18, fontWeight: 950 }}>Estoque (Saldo)</div>
          <div className="small" style={{ opacity: 0.82 }}>
            Saldo calculado por movimentos (IN/OUT/ADJUST). Sincronização ML cria OUT automaticamente via pedidos pagos.
            <br />
            <a
              href="https://admin.shopify.com/store/lojavitualagesolutios/products/inventory"
              target="_blank"
              rel="noreferrer"
              className="text-age-gold hover:underline font-bold mt-2 inline-block"
            >
              Acessar Estoque na Shopify (Real Time) →
            </a>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            placeholder="Filtrar por item_id (opcional)"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            style={{ minWidth: 260 }}
          />

          <label className="small" style={{ display: "flex", gap: 8, alignItems: "center", opacity: 0.9 }}>
            <input
              type="checkbox"
              checked={onlyCritical}
              onChange={(e) => setOnlyCritical(e.target.checked)}
            />
            Somente críticos (saldo negativo)
          </label>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="balance_asc">Ordenar: mais críticos</option>
            <option value="out_desc">Ordenar: mais saídas</option>
            <option value="item_asc">Ordenar: item (A-Z)</option>
          </select>

          <button className="btn" onClick={loadBalance} disabled={loading}>
            {loading ? "Carregando..." : "Recarregar saldo"}
          </button>
        </div>
      </div>

      {/* Sync ML */}
      <div className="panel" style={{ ...ui.card, boxShadow: ui.shadow, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <Badge tone="info">Sincronização</Badge>
        <div style={{ fontWeight: 900 }}>Pedidos ML → baixa no estoque</div>

        <div className="small" style={{ opacity: 0.8 }}>De</div>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <div className="small" style={{ opacity: 0.8 }}>Até</div>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />

        <button className="btn" onClick={syncFromML} disabled={syncing}>
          {syncing ? "Sincronizando..." : "Sincronizar ML"}
        </button>

        <div className="small" style={{ opacity: 0.7 }}>
          Dica: sincronize por semana pra evitar repetição e controlar volume.
        </div>
      </div>

      {err && (
        <div
          className="panel"
          style={{
            ...ui.card,
            border: "1px solid rgba(255,80,80,.35)",
            background: "rgba(255,80,80,.06)",
          }}
        >
          <b>Erro:</b> {err}
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(190px, 1fr))", gap: 12 }}>
        <StatCard title="Itens (total)" value={String(kpis.total)} subtitle="No retorno atual" />
        <StatCard title="Críticos (saldo < 0)" value={String(kpis.neg)} subtitle="Precisa entrada" tone="bad" />
        <StatCard title="Zerados (saldo = 0)" value={String(kpis.zero)} subtitle="Atenção" tone="warn" />
        <StatCard title="Positivos (saldo > 0)" value={String(kpis.pos)} subtitle="OK" tone="good" />
        <StatCard title="Entradas (Σ IN)" value={String(kpis.sumIn)} subtitle="Somatório" />
        <StatCard title="Saídas (Σ OUT)" value={String(kpis.sumOut)} subtitle="Somatório" />
      </div>

      {/* Insights rápidos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <MiniBars title="Top itens com maior saída (OUT)" rows={topOut} valueLabel="out" />
        <MiniBars title="Itens mais críticos (saldo mais baixo)" rows={mostCritical} valueLabel="crítico" />
      </div>

      {/* Tabela */}
      <div className="panel" style={{ ...ui.card, boxShadow: ui.shadow }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ fontWeight: 950 }}>Saldo por item</div>
          <div className="small" style={{ opacity: 0.75 }}>
            Mostrando: <b>{rows.length}</b>
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
                <th style={{ padding: "12px 10px" }}>Item</th>
                <th style={{ padding: "12px 10px" }}>Status</th>
                <th style={{ padding: "12px 10px" }}>Entradas</th>
                <th style={{ padding: "12px 10px" }}>Saídas</th>
                <th style={{ padding: "12px 10px" }}>Ajuste</th>
                <th style={{ padding: "12px 10px" }}>Saldo</th>
                <th style={{ padding: "12px 10px", minWidth: 220 }}>Visual</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => {
                const tone = stockTone(r.bal);
                const status =
                  r.bal < 0 ? "Crítico" : r.bal === 0 ? "Zerado" : "OK";

                return (
                  <tr
                    key={r.item}
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)", transition: "background 120ms ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 10px", fontWeight: 900, whiteSpace: "nowrap" }}>{r.item}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <Badge tone={tone}>{status}</Badge>
                    </td>
                    <td style={{ padding: "12px 10px" }}>{r.inQty}</td>
                    <td style={{ padding: "12px 10px" }}>{r.outQty}</td>
                    <td style={{ padding: "12px 10px" }}>{r.adjQty}</td>
                    <td style={{ padding: "12px 10px", fontWeight: 950, color: tone === "bad" ? "#ff5d5d" : tone === "warn" ? "#ffc14d" : "#5dffb0" }}>
                      {r.bal}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <BalanceBar balance={r.bal} maxAbs={maxAbsBalance} />
                    </td>
                  </tr>
                );
              })}

              {!rows.length && !loading && (
                <tr>
                  <td colSpan={7} style={{ padding: 14, opacity: 0.8 }}>
                    Sem dados ainda. Clique em “Sincronizar ML” ou faça entradas manuais na tela de Logística.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <Badge tone="bad">Crítico = saldo negativo</Badge>
          <Badge tone="warn">Zerado = saldo 0</Badge>
          <Badge tone="good">OK = saldo positivo</Badge>
        </div>
      </div>
    </div>
  );
}
