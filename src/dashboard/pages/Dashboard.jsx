// src/pages/Dashboard.jsx
import { useMemo, useState } from "react";
import { fetchDashboardSummary } from "@/dashboard/lib/api";

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

function pctBR(v) {
  if (v == null || !Number.isFinite(v)) return "—";
  return `${(v * 100).toFixed(2)}%`;
}

function calcRow(row) {
  const receita = clampNumber(row.receita, 0);
  const tarifas = clampNumber(row.tarifas, 0);
  const custoProd = clampNumber(row.custoProd, 0);
  const ads = clampNumber(row.ads, 0);

  const lucro = receita - tarifas - custoProd - ads;

  const vendas = clampNumber(row.vendasOrg, 0) + clampNumber(row.vendasAds, 0);
  const roas = ads > 0 ? receita / ads : null;
  const cac = vendas > 0 ? ads / vendas : null;

  return { receita, tarifas, custoProd, ads, lucro, vendas, roas, cac };
}

export default function Dashboard() {
  const [from, setFrom] = useState("2026-02-01");
  const [to, setTo] = useState("2026-02-26");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [data, setData] = useState(null);
  const [showJson, setShowJson] = useState(false);

  async function load() {
    const uid = localStorage.getItem("ml_user_id");
    if (!uid) {
      setErr("Sem ml_user_id. Faça OAuth em /auth/ml.");
      return;
    }

    setErr("");
    setLoading(true);
    try {
      const r = await fetchDashboardSummary({ userId: uid, from, to });
      if (!r?.ok) throw new Error(r?.message || r?.error || "Falha ao carregar dashboard");
      setData(r);
    } catch (e) {
      setErr(e?.message || "Erro ao carregar");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const buckets = Array.isArray(data?.buckets) ? data.buckets : [];

  const totals = useMemo(() => {
    const sum = (arr, fn) => arr.reduce((acc, x) => acc + fn(x), 0);

    const receita = sum(buckets, (b) => clampNumber(b.receita, 0));
    const tarifas = sum(buckets, (b) => clampNumber(b.tarifas, 0));
    const custoProd = sum(buckets, (b) => clampNumber(b.custoProd, 0));
    const ads = sum(buckets, (b) => clampNumber(b.ads, 0));
    const lucro = receita - tarifas - custoProd - ads;

    const orders = sum(buckets, (b) => clampNumber(b.orders, 0));
    const units = sum(buckets, (b) => clampNumber(b.units, 0));

    return { receita, tarifas, custoProd, ads, lucro, orders, units };
  }, [buckets]);

  // métricas “BI”
  const insights = useMemo(() => {
    const receita = totals.receita;
    const tarifas = totals.tarifas;
    const custoProd = totals.custoProd;
    const ads = totals.ads;
    const lucro = totals.lucro;

    const orders = totals.orders;
    const units = totals.units;

    const margem = receita > 0 ? lucro / receita : null;
    const roasTotal = ads > 0 ? receita / ads : null;
    const cacMedio = units > 0 ? ads / units : null;
    const ticketMedio = orders > 0 ? receita / orders : null;

    const taxaTarifa = receita > 0 ? tarifas / receita : null;
    const taxaAds = receita > 0 ? ads / receita : null;

    const custoUnitReal = units > 0 ? custoProd / units : null;

    // melhor/pior semana por lucro
    const ranked = buckets
      .map((b) => ({ b, lucro: calcRow(b).lucro }))
      .sort((a, z) => z.lucro - a.lucro);

    const best = ranked[0]?.b || null;
    const worst = ranked[ranked.length - 1]?.b || null;

    return {
      margem,
      roasTotal,
      cacMedio,
      ticketMedio,
      taxaTarifa,
      taxaAds,
      custoUnitReal,
      best,
      worst,
    };
  }, [totals, buckets]);

  // mini chart: receita por semana
  const chart = useMemo(() => {
    const values = buckets.map((b) => clampNumber(b.receita, 0));
    const max = Math.max(1, ...values);
    return buckets.map((b) => {
      const v = clampNumber(b.receita, 0);
      const pct = Math.round((v / max) * 100);
      return { key: b.inicio, label: b.campanha, value: v, pct };
    });
  }, [buckets]);

  const lucroColor = totals.lucro >= 0 ? "#5dffb0" : "#ff5d5d";

  return (
    <div className="panel" style={{ display: "grid", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Dashboard (visualização real)</div>
          <div className="small" style={{ opacity: 0.8 }}>
            Mostrando o que o backend retorna em <b>/dashboard/summary</b>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div className="small">Período:</div>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <span className="small">→</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          <button className="btn" onClick={load} disabled={loading}>
            {loading ? "Carregando..." : "Carregar do backend"}
          </button>
          <button className="btn" onClick={() => setShowJson((v) => !v)} disabled={!data}>
            {showJson ? "Esconder JSON" : "Mostrar JSON"}
          </button>
        </div>
      </div>

      {err && <div className="small" style={{ color: "#ff7a7a" }}>{err}</div>}

      {/* ✅ BLOCO NOVO: ocupa o “espaço em branco” */}
      <div className="panel" style={{ padding: 14, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 14 }}>Saúde do Período</div>
          <div className="small" style={{ opacity: 0.8 }}>
            Lucro bruto: <b style={{ color: lucroColor }}>{moneyBRL(totals.lucro)}</b>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(220px, 1fr))", gap: 12 }}>
          <div className="panel" style={{ padding: 12 }}>
            <div className="small">Margem</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: lucroColor }}>
              {insights.margem == null ? "—" : pctBR(insights.margem)}
            </div>
            <div className="small" style={{ opacity: 0.75 }}>Lucro / Receita</div>
          </div>

          <div className="panel" style={{ padding: 12 }}>
            <div className="small">ROAS (Total)</div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>
              {insights.roasTotal == null ? "—" : insights.roasTotal.toFixed(2)}
            </div>
            <div className="small" style={{ opacity: 0.75 }}>Receita / Ads</div>
          </div>

          <div className="panel" style={{ padding: 12 }}>
            <div className="small">CAC médio (por unidade)</div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>
              {insights.cacMedio == null ? "—" : moneyBRL(insights.cacMedio)}
            </div>
            <div className="small" style={{ opacity: 0.75 }}>Ads / Unidades</div>
          </div>

          <div className="panel" style={{ padding: 12 }}>
            <div className="small">Ticket médio</div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>
              {insights.ticketMedio == null ? "—" : moneyBRL(insights.ticketMedio)}
            </div>
            <div className="small" style={{ opacity: 0.75 }}>Receita / Pedidos</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(220px, 1fr))", gap: 12 }}>
          <div className="panel" style={{ padding: 12 }}>
            <div className="small">Tarifas % da receita</div>
            <div style={{ fontSize: 16, fontWeight: 900 }}>
              {insights.taxaTarifa == null ? "—" : pctBR(insights.taxaTarifa)}
            </div>
          </div>

          <div className="panel" style={{ padding: 12 }}>
            <div className="small">Ads % da receita</div>
            <div style={{ fontSize: 16, fontWeight: 900 }}>
              {insights.taxaAds == null ? "—" : pctBR(insights.taxaAds)}
            </div>
          </div>

          <div className="panel" style={{ padding: 12 }}>
            <div className="small">Custo unitário real</div>
            <div style={{ fontSize: 16, fontWeight: 900 }}>
              {insights.custoUnitReal == null ? "—" : moneyBRL(insights.custoUnitReal)}
            </div>
            <div className="small" style={{ opacity: 0.75 }}>CustoProd / Unidades</div>
          </div>

          <div className="panel" style={{ padding: 12 }}>
            <div className="small">Status</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: lucroColor }}>
              {totals.receita <= 0
                ? "Sem vendas no período"
                : totals.lucro >= 0
                ? "✅ Lucrativo"
                : "❌ Prejuízo"}
            </div>
            <div className="small" style={{ opacity: 0.75 }}>
              {totals.receita > 0 ? "Baseado no lucro bruto" : "Carregue dados do backend"}
            </div>
          </div>
        </div>

        {/* melhor / pior semana */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(260px, 1fr))", gap: 12 }}>
          <div className="panel" style={{ padding: 12 }}>
            <div className="small">Melhor semana (lucro)</div>
            <div style={{ fontWeight: 900 }}>
              {insights.best ? insights.best.campanha : "—"}
            </div>
            <div className="small" style={{ opacity: 0.8 }}>
              Lucro: {insights.best ? moneyBRL(calcRow(insights.best).lucro) : "—"}
            </div>
          </div>

          <div className="panel" style={{ padding: 12 }}>
            <div className="small">Pior semana (lucro)</div>
            <div style={{ fontWeight: 900 }}>
              {insights.worst ? insights.worst.campanha : "—"}
            </div>
            <div className="small" style={{ opacity: 0.8 }}>
              Lucro: {insights.worst ? moneyBRL(calcRow(insights.worst).lucro) : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(220px, 1fr))", gap: 12 }}>
        <div className="panel" style={{ padding: 14 }}>
          <div className="small">Receita</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{moneyBRL(totals.receita)}</div>
          <div className="small">Pedidos: {totals.orders} • Unidades: {totals.units}</div>
        </div>

        <div className="panel" style={{ padding: 14 }}>
          <div className="small">Tarifas (ML)</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{moneyBRL(totals.tarifas)}</div>
          <div className="small">Custo Produto: {moneyBRL(totals.custoProd)}</div>
        </div>

        <div className="panel" style={{ padding: 14 }}>
          <div className="small">Ads</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{moneyBRL(totals.ads)}</div>
          <div className="small">Por enquanto pode estar 0</div>
        </div>

        <div className="panel" style={{ padding: 14 }}>
          <div className="small">Lucro</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: lucroColor }}>
            {moneyBRL(totals.lucro)}
          </div>
          <div className="small">Receita - (Tarifas + Custo + Ads)</div>
        </div>
      </div>

      {/* Mini chart */}
      <div className="panel" style={{ padding: 14, display: "grid", gap: 10 }}>
        <div style={{ fontWeight: 800 }}>Receita por semana (mini gráfico)</div>

        {!chart.length ? (
          <div className="small" style={{ opacity: 0.8 }}>Sem dados ainda. Clique em “Carregar do backend”.</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {chart.map((c) => (
              <div key={c.key} style={{ display: "grid", gridTemplateColumns: "160px 1fr 120px", gap: 10, alignItems: "center" }}>
                <div className="small" style={{ opacity: 0.9 }}>{c.label}</div>
                <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 999 }}>
                  <div style={{ width: `${c.pct}%`, height: 10, background: "rgba(120,200,255,0.9)", borderRadius: 999 }} />
                </div>
                <div className="small" style={{ textAlign: "right" }}>{moneyBRL(c.value)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabela */}
      <div className="panel" style={{ padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ fontWeight: 800 }}>Semanas / Campanhas (do backend)</div>
          <div className="small">
            Custo unitário padrão: <b>{clampNumber(data?.costs?.defaultUnitCost ?? 0, 0)}</b>
          </div>
        </div>

        <div style={{ overflowX: "auto", marginTop: 10 }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr className="small" style={{ textAlign: "left", opacity: 0.85 }}>
                <th style={{ padding: "10px 8px" }}>Campanha</th>
                <th style={{ padding: "10px 8px" }}>Início</th>
                <th style={{ padding: "10px 8px" }}>Fim</th>
                <th style={{ padding: "10px 8px" }}>Pedidos</th>
                <th style={{ padding: "10px 8px" }}>Unidades</th>
                <th style={{ padding: "10px 8px" }}>Receita</th>
                <th style={{ padding: "10px 8px" }}>Tarifas</th>
                <th style={{ padding: "10px 8px" }}>Custo Prod</th>
                <th style={{ padding: "10px 8px" }}>Ads</th>
                <th style={{ padding: "10px 8px" }}>ROAS</th>
                <th style={{ padding: "10px 8px" }}>CAC</th>
                <th style={{ padding: "10px 8px" }}>Lucro</th>
              </tr>
            </thead>

            <tbody>
              {buckets.map((b) => {
                const m = calcRow(b);
                return (
                  <tr key={b.id} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "10px 8px" }}>{b.campanha}</td>
                    <td style={{ padding: "10px 8px" }}>{b.inicio}</td>
                    <td style={{ padding: "10px 8px" }}>{b.fim}</td>
                    <td style={{ padding: "10px 8px" }}>{b.orders ?? 0}</td>
                    <td style={{ padding: "10px 8px" }}>{b.units ?? 0}</td>
                    <td style={{ padding: "10px 8px" }}>{moneyBRL(m.receita)}</td>
                    <td style={{ padding: "10px 8px" }}>{moneyBRL(m.tarifas)}</td>
                    <td style={{ padding: "10px 8px" }}>{moneyBRL(m.custoProd)}</td>
                    <td style={{ padding: "10px 8px" }}>{moneyBRL(m.ads)}</td>
                    <td style={{ padding: "10px 8px" }}>{m.roas == null ? "—" : m.roas.toFixed(2)}</td>
                    <td style={{ padding: "10px 8px" }}>{m.cac == null ? "—" : moneyBRL(m.cac)}</td>
                    <td style={{ padding: "10px 8px", fontWeight: 900, color: m.lucro >= 0 ? "#5dffb0" : "#ff5d5d" }}>
                      {moneyBRL(m.lucro)}
                    </td>
                  </tr>
                );
              })}

              {!buckets.length && (
                <tr>
                  <td colSpan={12} style={{ padding: 14, opacity: 0.8 }}>
                    Nada no período. Clique em “Carregar do backend”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showJson && data && (
          <pre
            style={{
              marginTop: 12,
              padding: 12,
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 10,
              overflowX: "auto",
              fontSize: 12,
              lineHeight: 1.35,
              maxHeight: 360,
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
