// src/pages/Metrics.jsx
import { useMemo, useState } from "react";
import { api } from "@/dashboard/lib/api";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatYYYYMMDD(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

function getDefaultRange(days = 30) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);
  return { from: formatYYYYMMDD(from), to: formatYYYYMMDD(to) };
}

function safeJson(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

function clampNumber(v, def = 0) {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : def;
}

function Panel({ children, style }) {
  return (
    <div
      className="panel"
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.18)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ fontSize: 12, opacity: 0.78, fontWeight: 700 }}>{label}</div>
      {children}
      {hint ? <div style={{ fontSize: 11, opacity: 0.60 }}>{hint}</div> : null}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        height: 40,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(0,0,0,0.22)",
        color: "inherit",
        padding: "0 12px",
        outline: "none",
        ...props.style,
      }}
    />
  );
}

function Button({ children, onClick, disabled, variant = "primary", style }) {
  const base = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: "10px 14px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    fontWeight: 800,
    userSelect: "none",
    whiteSpace: "nowrap",
  };

  const styles =
    variant === "ghost"
      ? { ...base, background: "transparent" }
      : variant === "danger"
      ? { ...base, background: "rgba(239,68,68,.20)", border: "1px solid rgba(239,68,68,.35)" }
      : { ...base, background: "rgba(59,130,246,.95)" };

  return (
    <button style={{ ...styles, ...style }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function PillTabs({ value, onChange, items }) {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 8,
        padding: 6,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(0,0,0,0.20)",
      }}
    >
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              background: active ? "rgba(59,130,246,.95)" : "transparent",
              padding: "8px 12px",
              borderRadius: 999,
              fontWeight: 900,
              cursor: "pointer",
              color: active ? "white" : "rgba(255,255,255,0.85)",
            }}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <Panel style={{ padding: 14, minWidth: 220 }}>
      <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 950, marginTop: 4 }}>{value}</div>
      {subtitle ? <div style={{ fontSize: 12, opacity: 0.70, marginTop: 4 }}>{subtitle}</div> : null}
    </Panel>
  );
}

/**
 * Extrai total + série (quando existir) do retorno do backend.
 * Suporta:
 * - { ok, data: { total_visits, visits:[{date, visits}] } }
 * - { ok, data: { "<ITEM>": 923 } } (seu caso atual)
 */
function extractVisits(result, itemId) {
  const payload = result?.data;

  // caso 1: formato com visits[]
  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.visits)) {
      const series = payload.visits
        .map((x) => ({
          day: String(x?.date || x?.day || "").slice(0, 10),
          value: clampNumber(x?.visits ?? x?.value, 0),
        }))
        .filter((p) => p.day && Number.isFinite(p.value));

      const total =
        typeof payload.total_visits === "number"
          ? payload.total_visits
          : series.reduce((a, p) => a + p.value, 0);

      return { total, series };
    }

    // caso 2: seu formato atual: { "MLB...": 923 }
    // (vem dentro de result.data)
    if (itemId && payload[itemId] != null) {
      return { total: clampNumber(payload[itemId], 0), series: [] };
    }

    // fallback: pega primeiro número do objeto
    const firstNumber = Object.values(payload).find((v) => typeof v === "number");
    if (typeof firstNumber === "number") return { total: firstNumber, series: [] };
  }

  return { total: null, series: [] };
}

function MiniBars({ title, series }) {
  const max = Math.max(1, ...series.map((p) => p.value));
  return (
    <Panel style={{ padding: 14, display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 950 }}>{title}</div>

      {!series.length ? (
        <div className="small" style={{ opacity: 0.75 }}>
          Sem série diária detectável (por enquanto só total).
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${series.length}, minmax(4px, 1fr))`,
              gap: 6,
              alignItems: "end",
              height: 120,
              padding: "8px 6px",
              borderRadius: 14,
              background: "rgba(0,0,0,0.18)",
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
            title="Visitas por dia"
          >
            {series.map((p) => {
              const h = Math.max(4, Math.round((p.value / max) * 100));
              return (
                <div
                  key={p.day}
                  title={`${p.day}\nVisitas: ${p.value}`}
                  style={{
                    height: `${h}%`,
                    borderRadius: 999,
                    background: "rgba(120,200,255,0.90)",
                  }}
                />
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div className="small" style={{ opacity: 0.78 }}>
              Pico: <b>{max}</b>
            </div>
            <div className="small" style={{ opacity: 0.78 }}>
              Média/dia:{" "}
              <b>{Math.round(series.reduce((a, p) => a + p.value, 0) / Math.max(1, series.length))}</b>
            </div>
          </div>
        </>
      )}
    </Panel>
  );
}

export default function Metrics() {
  const initialRange = useMemo(() => getDefaultRange(30), []);
  const [tab, setTab] = useState("visits"); // visits | ads

  const [userId, setUserId] = useState(() => localStorage.getItem("ml_user_id") || "");
  const [itemId, setItemId] = useState("");
  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [result, setResult] = useState(null);
  const [showRaw, setShowRaw] = useState(false);

  function saveUserId() {
    const v = String(userId || "").trim();
    if (!v) localStorage.removeItem("ml_user_id");
    else localStorage.setItem("ml_user_id", v);
  }

  function setPreset(days) {
    const r = getDefaultRange(days);
    setFrom(r.from);
    setTo(r.to);
  }

  async function fetchVisits() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const uid = String(userId || "").trim();
      const iid = String(itemId || "").trim();

      if (!iid) throw new Error("Informe um item_id (ex: MLB123...).");
      if (!from || !to) throw new Error("Informe as datas (from/to).");

      const res = await api.get("/visits", {
        params: {
          item_id: iid,
          from,
          to,
          ...(uid ? { user_id: uid } : {}),
        },
      });

      setResult(res.data);
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Falha ao buscar visitas";
      setError({
        message,
        status: err?.response?.status || null,
        details: err?.response?.data || null,
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchAdsMetrics() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.get("/visits/ads/metrics", { params: { from, to } });
      setResult(res.data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Falha ao buscar Ads metrics";
      setError({
        message,
        status: err?.response?.status || null,
        details: err?.response?.data || null,
      });
    } finally {
      setLoading(false);
    }
  }

  const visitsInfo = useMemo(() => {
    if (tab !== "visits" || !result) return { total: null, series: [] };
    // seu backend retorna: { ok, item_id, period, data: {...} }
    return extractVisits(result?.data ? result : { data: result }, itemId.trim());
  }, [result, tab, itemId]);

  const periodLabel = `${from} → ${to}`;

  return (
    <div className="panel" style={{ display: "grid", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 950 }}>Métricas</div>
          <div className="small" style={{ opacity: 0.78 }}>
            Visitas por item (ML) + Ads (placeholder). Sem depender do search público (403).
          </div>
        </div>

        <PillTabs
          value={tab}
          onChange={(v) => {
            setTab(v);
            setError(null);
            setResult(null);
          }}
          items={[
            { value: "visits", label: "Visitas por item" },
            { value: "ads", label: "Ads (em breve)" },
          ]}
        />
      </div>

      {/* Layout 2 colunas */}
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 12, alignItems: "start" }}>
        {/* Coluna esquerda: filtros */}
        <Panel style={{ padding: 14, display: "grid", gap: 12 }}>
          <div style={{ fontWeight: 950 }}>Filtros</div>

          <Field label="user_id (opcional)" hint="Dica: salvamos no localStorage como ml_user_id">
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="ex: 2315864495"
            />
          </Field>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button variant="ghost" onClick={saveUserId} disabled={loading}>
              Salvar user_id
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setUserId("");
                localStorage.removeItem("ml_user_id");
              }}
              disabled={loading}
            >
              Limpar
            </Button>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="De (from)">
              <Input value={from} onChange={(e) => setFrom(e.target.value)} />
            </Field>
            <Field label="Até (to)">
              <Input value={to} onChange={(e) => setTo(e.target.value)} />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button variant="ghost" onClick={() => setPreset(7)} disabled={loading}>
              7 dias
            </Button>
            <Button variant="ghost" onClick={() => setPreset(30)} disabled={loading}>
              30 dias
            </Button>
            <Button variant="ghost" onClick={() => setPreset(90)} disabled={loading}>
              90 dias
            </Button>
          </div>

          {tab === "visits" ? (
            <>
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

              <Field label="item_id (obrigatório)" hint="Pegue de um anúncio no ML (ex: MLB123...).">
                <Input
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  placeholder="ex: MLB123456789"
                />
              </Field>

              <Button onClick={fetchVisits} disabled={loading} style={{ width: "100%" }}>
                {loading ? "Buscando..." : "Buscar visitas"}
              </Button>
            </>
          ) : (
            <Button onClick={fetchAdsMetrics} disabled={loading} style={{ width: "100%" }}>
              {loading ? "Buscando..." : "Buscar Ads metrics"}
            </Button>
          )}

          <div className="small" style={{ opacity: 0.72 }}>
            Período atual: <b>{periodLabel}</b>
          </div>
        </Panel>

        {/* Coluna direita: resultados */}
        <div style={{ display: "grid", gap: 12 }}>
          {/* Erro */}
          {error ? (
            <Panel
              style={{
                padding: 14,
                border: "1px solid rgba(239,68,68,.35)",
                background: "rgba(239,68,68,.08)",
              }}
            >
              <div style={{ fontWeight: 900 }}>
                Erro{error.status ? ` (status ${error.status})` : ""}
              </div>
              <div style={{ marginTop: 6, opacity: 0.92 }}>{error.message}</div>
              {error.details ? (
                <pre style={{ marginTop: 10, fontSize: 12, opacity: 0.85, overflow: "auto" }}>
                  {safeJson(error.details)}
                </pre>
              ) : null}
            </Panel>
          ) : null}

          {/* Sem resultado */}
          {!result && !error ? (
            <Panel style={{ padding: 18 }}>
              <div style={{ fontWeight: 950 }}>Ainda sem dados</div>
              <div className="small" style={{ opacity: 0.75, marginTop: 6 }}>
                Preencha os filtros e execute uma consulta.
              </div>
            </Panel>
          ) : null}

          {/* Resultado */}
          {result ? (
            <>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <StatCard title="Período" value={periodLabel} subtitle={tab === "visits" ? "Visitas por item" : "Ads"} />
                <StatCard title="User ID" value={userId ? userId : "—"} subtitle="opcional" />
                {tab === "visits" ? (
                  <StatCard title="Item ID" value={itemId || "—"} subtitle="obrigatório" />
                ) : null}
                <StatCard
                  title={tab === "visits" ? "Total de visitas" : "Status"}
                  value={tab === "visits" ? (visitsInfo.total != null ? String(visitsInfo.total) : "—") : "Em breve"}
                  subtitle={tab === "visits" ? (visitsInfo.series.length ? `${visitsInfo.series.length} pontos` : "Sem série diária") : "placeholder"}
                />
              </div>

              {tab === "visits" ? (
                <MiniBars
                  title="Visitas (mini gráfico)"
                  series={visitsInfo.series}
                />
              ) : (
                <Panel style={{ padding: 14 }}>
                  <div style={{ fontWeight: 950 }}>Ads (em breve)</div>
                  <div className="small" style={{ opacity: 0.78, marginTop: 6 }}>
                    Quando você conectar Mercado Ads, a gente troca esse bloco por KPIs: Impressões, Cliques, CPC, ACOS, ROAS…
                  </div>
                </Panel>
              )}

              {/* JSON colapsável */}
              <Panel style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ fontWeight: 950 }}>Retorno bruto (JSON)</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Button
                      variant="ghost"
                      onClick={() => navigator.clipboard?.writeText(safeJson(result))}
                    >
                      Copiar
                    </Button>
                    <Button variant="ghost" onClick={() => setShowRaw((v) => !v)}>
                      {showRaw ? "Ocultar" : "Mostrar"}
                    </Button>
                  </div>
                </div>

                {showRaw ? (
                  <pre style={{ marginTop: 10, fontSize: 12, overflow: "auto" }}>
                    {safeJson(result)}
                  </pre>
                ) : (
                  <div className="small" style={{ opacity: 0.72, marginTop: 8 }}>
                    Oculto para não poluir a tela (clique em “Mostrar” quando precisar).
                  </div>
                )}
              </Panel>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
