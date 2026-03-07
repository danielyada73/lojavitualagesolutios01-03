// src/pages/Questions.jsx
import { useEffect, useMemo, useState } from "react";
import { answerQuestion, fetchQuestions } from "@/dashboard/lib/api";

function fmtDate(v) {
  try {
    return new Date(v).toLocaleString("pt-BR");
  } catch {
    return String(v || "");
  }
}

function safeStr(v) {
  return String(v ?? "").trim();
}

function Badge({ tone = "neutral", children }) {
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
    <div
      className="panel"
      style={{
        padding: 14,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.20)",
        borderRadius: 16,
        boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
        ...toneStyle,
      }}
    >
      <div className="small" style={{ opacity: 0.78 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 950, marginTop: 4 }}>{value}</div>
      {subtitle ? <div className="small" style={{ opacity: 0.70, marginTop: 2 }}>{subtitle}</div> : null}
    </div>
  );
}

function mlItemUrl(itemId) {
  // Link genérico (funciona pra maioria dos itens BR)
  // Se você quiser, depois dá pra buscar permalink no backend.
  return itemId ? `https://produto.mercadolivre.com.br/${itemId}` : null;
}

const QUICK_REPLIES = [
  "Olá! Sim, temos disponível. 😊",
  "Olá! O envio é feito pelo Mercado Livre (Full/Coleta), chega bem rápido.",
  "Olá! Pode comprar tranquilo(a), o produto é original e lacrado.",
  "Olá! Caso tenha alguma dúvida, me diga o que você precisa e eu te ajudo.",
];

export default function Questions() {
  const [status, setStatus] = useState("UNANSWERED"); // UNANSWERED | ANSWERED | ALL
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    questions: [],
    paging: { total: 0, limit: 20, offset: 0 },
    // opcional: se o backend passar contadores, a gente usa
    counters: null,
  });

  const total = data?.paging?.total ?? 0;

  async function load() {
    setLoading(true);
    setError("");
    try {
      const d = await fetchQuestions({ status, limit, offset });
      setData(d);
    } catch (e) {
      setError(e?.message || "Falha ao carregar perguntas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, limit, offset]);

  const canPrev = offset > 0;
  const canNext = offset + limit < total;

  const rows = useMemo(() => (Array.isArray(data?.questions) ? data.questions : []), [data]);

  const kpis = useMemo(() => {
    let answered = 0;
    let unanswered = 0;

    for (const q of rows) {
      const st = String(q?.status || (q?.answer ? "ANSWERED" : "UNANSWERED")).toUpperCase();
      if (st === "ANSWERED") answered++;
      else unanswered++;
    }

    const pct = rows.length ? Math.round((answered / rows.length) * 100) : 0;
    return { answered, unanswered, pct };
  }, [rows]);

  async function onAnswer(qid, text) {
    const t = String(text || "").trim();
    if (!t) return;

    try {
      setLoading(true);
      await answerQuestion({ questionId: qid, text: t });
      await load();
    } catch (e) {
      alert(e?.message || "Erro ao responder");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel" style={{ padding: 16, display: "grid", gap: 14 }}>
      {/* Header + filtros */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 950 }}>Perguntas (Mercado Livre)</div>
          <div className="small" style={{ opacity: 0.82 }}>
            Painel para responder perguntas com prioridade e agilidade.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={status}
            onChange={(e) => {
              setOffset(0);
              setStatus(e.target.value);
            }}
          >
            <option value="UNANSWERED">Não respondidas</option>
            <option value="ANSWERED">Respondidas</option>
            <option value="ALL">Todas</option>
          </select>

          <input
            style={{ width: 90 }}
            value={limit}
            onChange={(e) => {
              setOffset(0);
              setLimit(Number(e.target.value) || 20);
            }}
            inputMode="numeric"
          />

          <button className="btn" onClick={load} disabled={loading}>
            {loading ? "Carregando..." : "Recarregar"}
          </button>
        </div>
      </div>

      {error && (
        <div className="panel" style={{ padding: 12, border: "1px solid rgba(255,80,80,.35)", background: "rgba(255,80,80,.06)" }}>
          <b>Erro:</b> {error}
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(220px, 1fr))", gap: 12 }}>
        <StatCard title="Total (API)" value={String(total)} subtitle={`Página: ${Math.floor(offset / limit) + 1}`} />
        <StatCard title="Não respondidas (página)" value={String(kpis.unanswered)} subtitle="Prioridade" tone="bad" />
        <StatCard title="Respondidas (página)" value={String(kpis.answered)} subtitle={`Taxa: ${kpis.pct}%`} tone="good" />
        <StatCard title="Modo" value={status} subtitle="Filtro atual" tone="info" />
      </div>

      {/* Paginação */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button className="btn" disabled={!canPrev || loading} onClick={() => setOffset((o) => Math.max(0, o - limit))}>
          ← Anterior
        </button>
        <button className="btn" disabled={!canNext || loading} onClick={() => setOffset((o) => o + limit)}>
          Próxima →
        </button>

        <div className="small" style={{ opacity: 0.8, marginLeft: 6 }}>
          Total: <b>{total}</b> • Mostrando: <b>{rows.length}</b>
        </div>
      </div>

      {/* Lista em cards (orgânico pros olhos) */}
      {!rows.length && !loading ? (
        <div className="panel" style={{ padding: 18, borderRadius: 16, background: "rgba(0,0,0,0.20)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontWeight: 900 }}>Nenhuma pergunta encontrada</div>
          <div className="small" style={{ opacity: 0.75, marginTop: 4 }}>
            Tente trocar o filtro (Não respondidas / Respondidas / Todas) e clicar em “Recarregar”.
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {rows.map((q) => {
            const qid = q?.id;
            const itemId = q?.item_id || q?.item?.id;
            const text = q?.text;
            const stRaw = q?.status || (q?.answer ? "ANSWERED" : "UNANSWERED");
            const st = String(stRaw).toUpperCase();
            const created = q?.date_created || q?.created_at || q?.created;

            const tone = st === "ANSWERED" ? "good" : "bad";
            const link = mlItemUrl(itemId);

            return (
              <div
                key={qid}
                className="panel"
                style={{
                  padding: 14,
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.20)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
                  display: "grid",
                  gap: 12,
                }}
              >
                {/* topo do card */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <Badge tone={tone}>{st === "ANSWERED" ? "Respondida" : "Não respondida"}</Badge>
                    <div className="small" style={{ opacity: 0.75 }}>{fmtDate(created)}</div>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <Badge tone="info">{itemId || "—"}</Badge>
                    {link ? (
                      <a className="btn" href={link} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                        Ver item no ML
                      </a>
                    ) : null}
                  </div>
                </div>

                {/* pergunta */}
                <div style={{ display: "grid", gap: 6 }}>
                  <div className="small" style={{ opacity: 0.8, fontWeight: 800 }}>Pergunta</div>
                  <div style={{ fontSize: 15, lineHeight: 1.45, fontWeight: 700 }}>
                    {text || "—"}
                  </div>
                  <div className="small" style={{ opacity: 0.65 }}>
                    ID: {qid}
                  </div>
                </div>

                {/* resposta */}
                {st === "ANSWERED" ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div className="small" style={{ opacity: 0.8 }}>
                      Respondida ✅
                    </div>
                    <Badge tone="good">OK</Badge>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {QUICK_REPLIES.map((r) => (
                        <button
                          key={r}
                          className="btn"
                          disabled={loading}
                          onClick={() => onAnswer(qid, r)}
                          title="Enviar resposta rápida"
                        >
                          Resposta rápida
                        </button>
                      ))}
                    </div>

                    <AnswerBox onSend={(msg) => onAnswer(qid, msg)} disabled={loading} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="small" style={{ opacity: 0.8 }}>
          Carregando...
        </div>
      )}
    </div>
  );
}

function AnswerBox({ onSend, disabled }) {
  const [msg, setMsg] = useState("");

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Digite a resposta..."
        disabled={disabled}
        style={{ flex: 1, minWidth: 260 }}
      />
      <button
        className="btn"
        disabled={disabled || !safeStr(msg)}
        onClick={() => {
          const t = msg.trim();
          setMsg("");
          onSend(t);
        }}
      >
        Enviar
      </button>
    </div>
  );
}
