// src/pages/Logistics.jsx
import { useEffect, useMemo, useState } from "react";
import { createMovement, fetchMovements, syncMovementsFromML } from "@/dashboard/lib/api";

function clampNumber(v, def = 0) {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : def;
}

function ymd(d) {
  return String(d || "").slice(0, 10);
}

/* ----------------------------- UI helpers ----------------------------- */
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
                gridTemplateColumns: "130px 1fr 90px",
                gap: 10,
                alignItems: "center",
              }}
            >
              <div className="small" style={{ opacity: 0.9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {r.label}
              </div>
              <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: 10, background: "rgba(120,200,255,0.90)", borderRadius: 999 }} />
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

function DailyMovementChart({ title, points }) {
  // points: [{ day, inQty, outQty }]
  const max = Math.max(1, ...points.map((p) => Math.max(p.inQty, p.outQty)));

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
        <div
          style={{
            height: 150,
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${points.length}, minmax(8px, 1fr))`,
              gap: 6,
              alignItems: "end",
            }}
            title="IN e OUT por dia"
          >
            {points.map((p) => {
              const hIn = Math.max(3, Math.round((p.inQty / max) * 100));
              const hOut = Math.max(3, Math.round((p.outQty / max) * 100));

              return (
                <div key={p.day} style={{ display: "grid", gap: 4, alignItems: "end" }}>
                  <div
                    title={`${p.day}\nIN: ${p.inQty}`}
                    style={{
                      height: `${hIn}%`,
                      borderRadius: 999,
                      background: "rgba(93,255,176,0.75)",
                      boxShadow: "0 10px 20px rgba(93,255,176,0.10)",
                    }}
                  />
                  <div
                    title={`${p.day}\nOUT: ${p.outQty}`}
                    style={{
                      height: `${hOut}%`,
                      borderRadius: 999,
                      background: "rgba(255,93,93,0.75)",
                      boxShadow: "0 10px 20px rgba(255,93,93,0.10)",
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.75 }}>
            <span className="small">0</span>
            <span className="small">{max}</span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Badge tone="good">IN</Badge>
        <Badge tone="bad">OUT</Badge>
        <Badge tone="neutral">Cada dia = 2 barras</Badge>
      </div>
    </div>
  );
}

export default function Logistics() {
  const [from, setFrom] = useState("2026-02-01");
  const [to, setTo] = useState("2026-02-26");

  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState({ movements: [] });

  // form manual
  const [type, setType] = useState("IN");
  const [itemId, setItemId] = useState("");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const r = await fetchMovements({ from, to });
      if (!r?.ok) throw new Error(r?.error || "Falha ao carregar movimentos");
      setData(r);
    } catch (e) {
      setErr(e?.message || "Erro");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [from, to]);

  async function onCreate() {
    setErr("");
    if (!itemId) return setErr("Informe item_id (ex: MLB123...)");
    if (!qty || qty <= 0) return setErr("qty deve ser > 0");

    try {
      const r = await createMovement({
        date: from, // depois você pode trocar por um input de data do movimento
        type,
        itemId,
        qty: Number(qty),
        note,
      });

      if (!r?.ok) throw new Error(r?.error || "Falha ao criar");
      setItemId("");
      setQty(1);
      setNote("");
      await load();
    } catch (e) {
      setErr(e?.message || "Erro ao criar movimento");
    }
  }

  async function onSyncML() {
    setSyncing(true);
    setErr("");
    try {
      const r = await syncMovementsFromML({ from, to, limit: 50, offset: 0 });
      if (!r?.ok) throw new Error(r?.message || "Falha ao sincronizar ML");
      await load();
    } catch (e) {
      setErr(e?.message || "Erro sync ML");
    } finally {
      setSyncing(false);
    }
  }

  const rows = useMemo(() => (Array.isArray(data?.movements) ? data.movements : []), [data]);

  /* ----------------------------- KPIs + charts ----------------------------- */
  const kpis = useMemo(() => {
    let inQty = 0;
    let outQty = 0;
    let adjustQty = 0;
    const itemsSet = new Set();

    for (const m of rows) {
      const q = clampNumber(m.qty, 0);
      const t = String(m.type || "").toUpperCase();
      if (m?.item_id) itemsSet.add(String(m.item_id));

      if (t === "IN") inQty += q;
      else if (t === "OUT") outQty += q;
      else adjustQty += q;
    }

    const saldo = inQty - outQty + adjustQty;

    return {
      inQty,
      outQty,
      adjustQty,
      saldo,
      uniqueItems: itemsSet.size,
      totalMoves: rows.length,
    };
  }, [rows]);

  const dailySeries = useMemo(() => {
    const map = new Map(); // day -> { inQty, outQty }
    for (const m of rows) {
      const d = ymd(m.date);
      if (!d) continue;

      const t = String(m.type || "").toUpperCase();
      const q = clampNumber(m.qty, 0);

      const prev = map.get(d) || { day: d, inQty: 0, outQty: 0 };
      if (t === "IN") prev.inQty += q;
      else if (t === "OUT") prev.outQty += q;
      map.set(d, prev);
    }

    return Array.from(map.values()).sort((a, b) => (a.day > b.day ? 1 : -1));
  }, [rows]);

  const byType = useMemo(() => {
    const map = new Map();
    for (const m of rows) {
      const t = String(m.type || "UNKNOWN").toUpperCase();
      map.set(t, (map.get(t) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [rows]);

  const bySource = useMemo(() => {
    const map = new Map();
    for (const m of rows) {
      const s = String(m.source || "UNKNOWN").toUpperCase();
      map.set(s, (map.get(s) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [rows]);

  const saldoTone = kpis.saldo >= 0 ? "good" : "bad";

  function toneForType(t) {
    const up = String(t || "").toUpperCase();
    if (up === "IN") return "good";
    if (up === "OUT") return "bad";
    if (up === "ADJUST") return "warn";
    return "neutral";
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
          <div style={{ fontSize: 18, fontWeight: 950 }}>Logística</div>
          <div className="small" style={{ opacity: 0.78 }}>
            Movimentações (IN/OUT/AJUSTE). Saídas podem vir do Mercado Livre automaticamente.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Badge tone="info">Período</Badge>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <span className="small" style={{ opacity: 0.7 }}>→</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />

          <button className="btn" onClick={load} disabled={loading}>
            {loading ? "Carregando..." : "Recarregar"}
          </button>

          <button className="btn" onClick={onSyncML} disabled={syncing}>
            {syncing ? "Sincronizando..." : "Sincronizar saídas (ML)"}
          </button>
        </div>
      </div>

      {err ? (
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
      ) : null}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(190px, 1fr))", gap: 12 }}>
        <StatCard title="Movimentos" value={String(kpis.totalMoves)} subtitle="No período" />
        <StatCard title="IN (entrada)" value={String(kpis.inQty)} subtitle="Quantidade total" tone="good" />
        <StatCard title="OUT (saída)" value={String(kpis.outQty)} subtitle="Quantidade total" tone="bad" />
        <StatCard title="ADJUST" value={String(kpis.adjustQty)} subtitle="Ajustes/Correções" tone="warn" />
        <StatCard title="Saldo (IN - OUT + AJ)" value={String(kpis.saldo)} subtitle="Visão do período" tone={saldoTone} />
        <StatCard title="Itens únicos" value={String(kpis.uniqueItems)} subtitle="SKU/MLB diferentes" />
      </div>

      {/* Linha: gráfico + breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <DailyMovementChart title="Movimento por dia (IN x OUT)" points={dailySeries} />
        <div style={{ display: "grid", gap: 12 }}>
          <MiniBars title="Movimentos por tipo" rows={byType.length ? byType : [{ label: "—", value: 0 }]} />
          <MiniBars title="Movimentos por origem" rows={bySource.length ? bySource : [{ label: "—", value: 0 }]} />
        </div>
      </div>

      {/* Form manual */}
      <div className="panel" style={{ ...ui.card, boxShadow: ui.shadow, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontWeight: 950 }}>Adicionar movimento manual</div>
          <div className="small" style={{ opacity: 0.75 }}>
            Dica: use <b>IN</b> para entrada, <b>OUT</b> para baixa manual, <b>ADJUST</b> para correção.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "160px 1fr 120px 1fr 140px",
            gap: 10,
            alignItems: "center",
          }}
        >
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="IN">IN (entrada)</option>
            <option value="OUT">OUT (saída)</option>
            <option value="ADJUST">ADJUST (ajuste)</option>
          </select>

          <input
            placeholder="item_id (MLB...)"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
          />

          <input
            placeholder="qty"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value) || 1)}
            inputMode="numeric"
          />

          <input
            placeholder="nota (opcional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button className="btn" onClick={onCreate}>
            Adicionar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="panel" style={{ ...ui.card, boxShadow: ui.shadow }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ fontWeight: 950 }}>Movimentações</div>
          <div className="small" style={{ opacity: 0.75 }}>
            Total: <b>{rows.length}</b>
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
                <th style={{ padding: "12px 10px" }}>Data</th>
                <th style={{ padding: "12px 10px" }}>Tipo</th>
                <th style={{ padding: "12px 10px" }}>Item</th>
                <th style={{ padding: "12px 10px", textAlign: "right" }}>Qty</th>
                <th style={{ padding: "12px 10px" }}>Origem</th>
                <th style={{ padding: "12px 10px" }}>Ref</th>
                <th style={{ padding: "12px 10px" }}>Nota</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((m) => (
                <tr
                  key={m.id}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)", transition: "background 120ms ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 10px", whiteSpace: "nowrap", opacity: 0.9 }}>{m.date}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <Badge tone={toneForType(m.type)}>{String(m.type || "—").toUpperCase()}</Badge>
                  </td>
                  <td style={{ padding: "12px 10px", whiteSpace: "nowrap", fontWeight: 900 }}>{m.item_id}</td>
                  <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: 900 }}>{m.qty}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <Badge tone="neutral">{String(m.source || "—").toUpperCase()}</Badge>
                  </td>
                  <td style={{ padding: "12px 10px", whiteSpace: "nowrap", opacity: 0.9 }}>{m.ref || "—"}</td>
                  <td style={{ padding: "12px 10px", opacity: 0.85 }} className="small">{m.note || "—"}</td>
                </tr>
              ))}

              {!rows.length && !loading && (
                <tr>
                  <td colSpan={7} style={{ padding: 14, opacity: 0.8 }}>
                    Sem movimentos no período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsividade: se grid do form apertar, ele quebra */}
      <style>{`
        @media (max-width: 980px) {
          .panel input, .panel select { width: 100%; }
        }
      `}</style>
    </div>
  );
}
