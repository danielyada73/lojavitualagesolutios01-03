import { useEffect, useMemo, useState } from "react";
import { fetchAdsWeeks, setAdsWeekSpend } from "@/dashboard/lib/api";

function moneyBRL(v) {
  const n = Number(v || 0);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function pct(v) {
  if (v === null || v === undefined) return "—";
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return (n * 100).toFixed(2) + "%";
}

export default function Ads() {
  const [from, setFrom] = useState("2026-02-01");
  const [to, setTo] = useState("2026-02-26");

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [data, setData] = useState({ weeks: [] });

  // campo de edição de spend por semana
  const [spendDraft, setSpendDraft] = useState({}); // { [week_start]: "12.34" }

  async function load() {
    setLoading(true);
    setErrMsg("");
    try {
      const d = await fetchAdsWeeks({ from, to });
      if (!d?.ok) throw new Error(d?.message || "Falha ao carregar Ads");
      setData(d);

      // preenche draft com spend atual pra editar
      const map = {};
      for (const w of d.weeks || []) map[w.week_start] = String(w.spend ?? 0);
      setSpendDraft(map);
    } catch (e) {
      setErrMsg(e?.message || "Erro ao carregar Ads");
      setData({ weeks: [] });
    } finally {
      setLoading(false);
    }
  }

  async function saveSpend(weekStart) {
    try {
      const spend = spendDraft[weekStart];
      const d = await setAdsWeekSpend({ weekStart, spend });
      if (!d?.ok) throw new Error(d?.message || "Falha ao salvar spend");
      await load(); // recarrega para atualizar ROAS/ACOS
    } catch (e) {
      setErrMsg(e?.message || "Erro ao salvar spend");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  const weeks = useMemo(() => Array.isArray(data?.weeks) ? data.weeks : [], [data]);

  const totals = useMemo(() => {
    let revenue = 0;
    let orders = 0;
    let units = 0;
    let spend = 0;

    for (const w of weeks) {
      revenue += Number(w.revenue || 0);
      orders += Number(w.orders || 0);
      units += Number(w.units || 0);
      spend += Number(w.spend || 0);
    }

    const roas = spend > 0 ? revenue / spend : null;
    const acos = revenue > 0 ? spend / revenue : null;

    return { revenue, orders, units, spend, roas, acos };
  }, [weeks]);

  return (
    <div className="panel" style={{ padding: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Ads (semanas = campanhas)</div>
          <div className="small" style={{ opacity: 0.85 }}>
            Enquanto a API de Ads não está pronta, o gasto (spend) é manual por semana — e a receita vem automática dos pedidos.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div className="small">De</div>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <div className="small">Até</div>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          <button className="btn" onClick={load} disabled={loading}>
            Recarregar
          </button>
        </div>
      </div>

      {/* resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(180px, 1fr))", gap: 12 }}>
        <div className="panel" style={{ padding: 14 }}>
          <div className="small">Receita (período)</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{moneyBRL(totals.revenue)}</div>
        </div>
        <div className="panel" style={{ padding: 14 }}>
          <div className="small">Gasto (spend)</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{moneyBRL(totals.spend)}</div>
        </div>
        <div className="panel" style={{ padding: 14 }}>
          <div className="small">ROAS</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{totals.roas === null ? "—" : totals.roas.toFixed(2)}</div>
        </div>
        <div className="panel" style={{ padding: 14 }}>
          <div className="small">ACOS</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{pct(totals.acos)}</div>
        </div>
        <div className="panel" style={{ padding: 14 }}>
          <div className="small">Pedidos</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{totals.orders}</div>
        </div>
        <div className="panel" style={{ padding: 14 }}>
          <div className="small">Unidades</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{totals.units}</div>
        </div>
      </div>

      {errMsg && (
        <div className="panel" style={{ padding: 12, border: "1px solid rgba(255,80,80,.35)" }}>
          <b>Erro:</b> {errMsg}
        </div>
      )}

      {/* tabela semanas */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr className="small" style={{ textAlign: "left", opacity: 0.85 }}>
              <th style={{ padding: "10px 8px" }}>Semana</th>
              <th style={{ padding: "10px 8px" }}>Receita</th>
              <th style={{ padding: "10px 8px" }}>Pedidos</th>
              <th style={{ padding: "10px 8px" }}>Unidades</th>
              <th style={{ padding: "10px 8px" }}>Spend</th>
              <th style={{ padding: "10px 8px" }}>ROAS</th>
              <th style={{ padding: "10px 8px" }}>ACOS</th>
              <th style={{ padding: "10px 8px" }}>Salvar</th>
            </tr>
          </thead>

          <tbody>
            {weeks.map((w) => {
              const key = w.week_start;
              return (
                <tr key={key} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 800, whiteSpace: "nowrap" }}>
                    {w.week_start} → {w.week_end}
                  </td>
                  <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>{moneyBRL(w.revenue)}</td>
                  <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>{w.orders}</td>
                  <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>{w.units}</td>

                  <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                    <input
                      style={{ width: 110 }}
                      inputMode="decimal"
                      value={spendDraft[key] ?? String(w.spend ?? 0)}
                      onChange={(e) => setSpendDraft((p) => ({ ...p, [key]: e.target.value }))}
                    />
                  </td>

                  <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                    {w.roas === null ? "—" : Number(w.roas).toFixed(2)}
                  </td>

                  <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                    {pct(w.acos)}
                  </td>

                  <td style={{ padding: "10px 8px" }}>
                    <button className="btn" disabled={loading} onClick={() => saveSpend(key)}>
                      Salvar
                    </button>
                  </td>
                </tr>
              );
            })}

            {!weeks.length && !loading && (
              <tr>
                <td colSpan={8} style={{ padding: 14, opacity: 0.8 }}>
                  Nenhuma semana no período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <div className="small" style={{ opacity: 0.8 }}>Carregando...</div>}
    </div>
  );
}
