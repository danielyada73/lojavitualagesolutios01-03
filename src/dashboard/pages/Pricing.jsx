// src/pages/Pricing.jsx
import { useMemo, useState } from "react";
import api from "@/dashboard/lib/api";

/* ---------------- helpers ---------------- */
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

function safeStr(v) {
  return String(v ?? "").trim();
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "rgba(255,255,255,0.06)", bd: "rgba(255,255,255,0.12)", fg: "rgba(255,255,255,0.9)" },
    green: { bg: "rgba(80,255,160,0.10)", bd: "rgba(80,255,160,0.25)", fg: "rgba(160,255,210,1)" },
    red: { bg: "rgba(255,80,80,0.10)", bd: "rgba(255,80,80,0.25)", fg: "rgba(255,180,180,1)" },
    yellow: { bg: "rgba(255,200,80,0.10)", bd: "rgba(255,200,80,0.25)", fg: "rgba(255,225,180,1)" },
    blue: { bg: "rgba(120,200,255,0.10)", bd: "rgba(120,200,255,0.25)", fg: "rgba(180,230,255,1)" },
  };

  const t = tones[tone] || tones.neutral;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        border: `1px solid ${t.bd}`,
        background: t.bg,
        color: t.fg,
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="panel" style={{ padding: 14 }}>
      <div className="small" style={{ opacity: 0.8 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{value}</div>
      {subtitle ? <div className="small" style={{ opacity: 0.75, marginTop: 4 }}>{subtitle}</div> : null}
    </div>
  );
}

function TabBtn({ active, children, onClick }) {
  return (
    <button
      className="btn"
      onClick={onClick}
      style={{
        background: active ? "rgba(120,200,255,0.20)" : "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        fontWeight: 900,
      }}
    >
      {children}
    </button>
  );
}

function buildMlSearchUrl({ q, category }) {
  const term = (q || "").trim();
  if (term) return `https://lista.mercadolivre.com.br/${encodeURIComponent(term)}`;
  const cat = (category || "").trim();
  if (cat) return `https://www.mercadolivre.com.br/c/${encodeURIComponent(cat)}`;
  return "https://www.mercadolivre.com.br/";
}

function inferStatusTone(status) {
  const st = String(status || "").toLowerCase();
  if (st === "active") return { label: "ATIVO", tone: "green" };
  if (st === "paused") return { label: "PAUSADO", tone: "yellow" };
  if (st === "closed") return { label: "FECHADO", tone: "red" };
  return { label: (st || "—").toUpperCase(), tone: "neutral" };
}

/* ---------------- component ---------------- */
export default function Pricing() {
  const [tab, setTab] = useState("my"); // my | lookup | competitors

  // estados - MY
  const [myLimit, setMyLimit] = useState(50);
  const [myOffset, setMyOffset] = useState(0);
  const [mySearch, setMySearch] = useState("");
  const [myStatus, setMyStatus] = useState("ALL"); // ALL | active | paused | closed
  const [myStock, setMyStock] = useState("ALL"); // ALL | in | out
  const [mySort, setMySort] = useState("status"); // status | price_desc | price_asc | sold_desc

  // estados - LOOKUP
  const [lookupId, setLookupId] = useState("");

  // estados - competitors (seu antigo)
  const [q, setQ] = useState("whey");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(20);

  // request global
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [data, setData] = useState(null);

  const uid = useMemo(() => localStorage.getItem("ml_user_id") || "", []);

  async function loadMyCatalog() {
    setLoading(true);
    setErr(null);
    setData(null);

    try {
      const userId = safeStr(localStorage.getItem("ml_user_id"));
      if (!userId) throw new Error("Sem ml_user_id. Faça OAuth em /auth/ml.");

      const res = await api.get("/pricing/my", {
        params: {
          user_id: userId,
          limit: Number(myLimit) || 50,
          offset: Number(myOffset) || 0,
        },
      });

      setData(res.data);
    } catch (e2) {
      const status = e2?.response?.status;
      const payload = e2?.response?.data;
      setErr({
        status,
        payload,
        message: payload?.message || payload?.error || e2?.message || "Erro ao carregar catálogo",
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadLookup() {
    setLoading(true);
    setErr(null);
    setData(null);

    try {
      const itemId = safeStr(lookupId);
      if (!itemId) throw new Error("Informe um item_id (MLB...).");

      const userId = safeStr(localStorage.getItem("ml_user_id"));
      const res = await api.get(`/pricing/item/${encodeURIComponent(itemId)}`, {
        params: userId ? { user_id: userId } : {},
      });

      setData(res.data);
    } catch (e2) {
      const status = e2?.response?.status;
      const payload = e2?.response?.data;
      setErr({
        status,
        payload,
        message: payload?.message || payload?.error || e2?.message || "Erro no lookup",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchCompetitors(e) {
    e?.preventDefault?.();

    const term = (q || "").trim();
    const cat = (category || "").trim();

    if (!term && !cat) {
      setErr({ message: "Informe q (palavra-chave) ou category." });
      setData(null);
      return;
    }

    setLoading(true);
    setErr(null);
    setData(null);

    try {
      const res = await api.get("/public/search-competitors", {
        params: {
          ...(term ? { q: term } : {}),
          ...(cat ? { category: cat } : {}),
          limit: Number(limit) || 20,
          offset: 0,
        },
      });

      setData(res.data);
    } catch (e2) {
      const status = e2?.response?.status;
      const payload = e2?.response?.data;
      setErr({
        status,
        payload,
        message:
          payload?.message ||
          payload?.error ||
          e2?.message ||
          "Erro ao pesquisar concorrentes",
      });
    } finally {
      setLoading(false);
    }
  }

  const competitorResults =
    data?.results ||
    data?.items ||
    data?.data?.results ||
    data?.data?.items ||
    null;

  const isBlocked =
    err?.status === 403 ||
    err?.status === 501 ||
    err?.payload?.error === "COMPETITOR_SEARCH_BLOCKED" ||
    err?.payload?.error === "COMPETITOR_SEARCH_ERROR";

  const myItems = useMemo(() => {
    const items = Array.isArray(data?.items) ? data.items : [];
    const s = safeStr(mySearch).toLowerCase();

    let filtered = items.filter((it) => {
      const st = String(it.status || "").toLowerCase();
      if (myStatus !== "ALL" && st !== myStatus) return false;

      const qty = clampNumber(it.available_quantity, 0);
      if (myStock === "in" && qty <= 0) return false;
      if (myStock === "out" && qty > 0) return false;

      if (s) {
        const hay = `${it.id} ${it.title} ${it.permalink}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });

    const sorter = {
      status: (a, b) => String(a.status).localeCompare(String(b.status)),
      price_desc: (a, b) => clampNumber(b.price, 0) - clampNumber(a.price, 0),
      price_asc: (a, b) => clampNumber(a.price, 0) - clampNumber(b.price, 0),
      sold_desc: (a, b) => clampNumber(b.sold_quantity, 0) - clampNumber(a.sold_quantity, 0),
    }[mySort];

    if (sorter) filtered = filtered.slice().sort(sorter);
    return filtered;
  }, [data, mySearch, myStatus, myStock, mySort]);

  const myStats = useMemo(() => {
    const items = Array.isArray(data?.items) ? data.items : [];
    const total = items.length;

    let active = 0;
    let paused = 0;
    let closed = 0;
    let outOfStock = 0;

    let inventory = 0;
    let gmvPotential = 0;

    for (const it of items) {
      const st = String(it.status || "").toLowerCase();
      if (st === "active") active++;
      else if (st === "paused") paused++;
      else if (st === "closed") closed++;

      const qty = clampNumber(it.available_quantity, 0);
      if (qty <= 0) outOfStock++;

      inventory += qty;
      gmvPotential += qty * clampNumber(it.price, 0);
    }

    return {
      total,
      active,
      paused,
      closed,
      outOfStock,
      inventory,
      gmvPotential: Number(gmvPotential.toFixed(2)),
    };
  }, [data]);

  return (
    <div className="panel" style={{ display: "grid", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Pricing / Inteligência</div>
          <div className="small" style={{ opacity: 0.8 }}>
            Agora com modo <b>Meu Catálogo</b> (sem 403), <b>Lookup por item</b> e <b>Concorrentes (opcional)</b>.
          </div>
          <div className="small" style={{ opacity: 0.7 }}>
            ml_user_id atual: <b>{uid || "—"}</b>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <TabBtn active={tab === "my"} onClick={() => { setTab("my"); setErr(null); }}>
            Meu catálogo
          </TabBtn>
          <TabBtn active={tab === "lookup"} onClick={() => { setTab("lookup"); setErr(null); }}>
            Lookup item (MLB…)
          </TabBtn>
          <TabBtn active={tab === "competitors"} onClick={() => { setTab("competitors"); setErr(null); }}>
            Concorrentes (pode bloquear)
          </TabBtn>
        </div>
      </div>

      {/* Erro */}
      {err && (
        <div
          className="panel"
          style={{
            padding: 12,
            border: "1px solid rgba(255,120,120,0.25)",
            background: "rgba(255,60,60,0.08)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6 }}>
            Erro {err.status ? `(status ${err.status})` : ""}
          </div>
          <div style={{ opacity: 0.92 }}>{err.message}</div>

          {tab === "competitors" && isBlocked && (
            <div style={{ marginTop: 10, opacity: 0.9 }}>
              Esse erro é típico de bloqueio WAF/CloudFront. Use o botão “Abrir no Mercado Livre ↗”.
            </div>
          )}
        </div>
      )}

      {/* ---------------- TAB: MY CATALOG ---------------- */}
      {tab === "my" && (
        <>
          {/* actions */}
          <div className="panel" style={{ padding: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn" onClick={loadMyCatalog} disabled={loading}>
              {loading ? "Carregando..." : "Carregar catálogo (ML)"}
            </button>

            <input
              value={mySearch}
              onChange={(e) => setMySearch(e.target.value)}
              placeholder="Filtrar por título ou MLB..."
              style={{ minWidth: 260 }}
            />

            <select value={myStatus} onChange={(e) => setMyStatus(e.target.value)}>
              <option value="ALL">Status: todos</option>
              <option value="active">active</option>
              <option value="paused">paused</option>
              <option value="closed">closed</option>
            </select>

            <select value={myStock} onChange={(e) => setMyStock(e.target.value)}>
              <option value="ALL">Estoque: todos</option>
              <option value="in">com estoque</option>
              <option value="out">sem estoque</option>
            </select>

            <select value={mySort} onChange={(e) => setMySort(e.target.value)}>
              <option value="status">Ordenar: status</option>
              <option value="price_desc">preço ↓</option>
              <option value="price_asc">preço ↑</option>
              <option value="sold_desc">mais vendidos</option>
            </select>

            <div style={{ flex: 1 }} />

            <input
              type="number"
              value={myLimit}
              min={1}
              max={50}
              onChange={(e) => setMyLimit(Number(e.target.value || 50))}
              style={{ width: 90 }}
              title="limit"
            />
            <input
              type="number"
              value={myOffset}
              min={0}
              onChange={(e) => setMyOffset(Number(e.target.value || 0))}
              style={{ width: 100 }}
              title="offset"
            />

            <button className="btn" onClick={() => setMyOffset((o) => Math.max(0, o - myLimit))} disabled={loading}>
              ←
            </button>
            <button className="btn" onClick={() => setMyOffset((o) => o + myLimit)} disabled={loading}>
              →
            </button>
          </div>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(220px, 1fr))", gap: 12 }}>
            <StatCard title="Total itens" value={String(myStats.total)} subtitle="(retorno atual do ML)" />
            <StatCard title="Ativos" value={String(myStats.active)} subtitle="status=active" />
            <StatCard title="Pausados" value={String(myStats.paused)} subtitle="status=paused" />
            <StatCard title="Sem estoque" value={String(myStats.outOfStock)} subtitle="available_quantity ≤ 0" />
            <StatCard title="Estoque total" value={String(myStats.inventory)} subtitle={`GMV potencial: ${moneyBRL(myStats.gmvPotential)}`} />
          </div>

          {/* Grid cards */}
          <div
            className="panel"
            style={{
              padding: 14,
              display: "grid",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ fontWeight: 900 }}>Itens</div>
              <div className="small" style={{ opacity: 0.8 }}>
                Mostrando <b>{myItems.length}</b> (após filtros)
              </div>
            </div>

            {!Array.isArray(data?.items) ? (
              <div className="small" style={{ opacity: 0.8 }}>
                Ainda sem dados. Clique em “Carregar catálogo (ML)”.
              </div>
            ) : !myItems.length ? (
              <div className="small" style={{ opacity: 0.8 }}>
                Nenhum item bate com os filtros.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(260px, 1fr))",
                  gap: 12,
                }}
              >
                {myItems.map((it) => {
                  const { label, tone } = inferStatusTone(it.status);
                  const qty = clampNumber(it.available_quantity, 0);
                  const sold = clampNumber(it.sold_quantity, 0);
                  const price = clampNumber(it.price, 0);

                  const stockTone = qty > 0 ? "blue" : "red";

                  return (
                    <div
                      key={it.id}
                      className="panel"
                      style={{
                        padding: 14,
                        display: "grid",
                        gap: 10,
                        border: "1px solid rgba(255,255,255,0.10)",
                      }}
                    >
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        {it.thumbnail ? (
                          <img
                            src={it.thumbnail}
                            alt=""
                            style={{
                              width: 54,
                              height: 54,
                              borderRadius: 14,
                              objectFit: "cover",
                              border: "1px solid rgba(255,255,255,0.12)",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 54,
                              height: 54,
                              borderRadius: 14,
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.12)",
                            }}
                          />
                        )}

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {it.title || it.id}
                          </div>
                          <div className="small" style={{ opacity: 0.75 }}>
                            {it.id}
                          </div>
                        </div>

                        <Badge tone={tone}>{label}</Badge>
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Badge tone="neutral">{moneyBRL(price)}</Badge>
                        <Badge tone={stockTone}>Estoque: {qty}</Badge>
                        <Badge tone="neutral">Vendidos: {sold}</Badge>
                      </div>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {it.permalink ? (
                          <a className="btn" href={it.permalink} target="_blank" rel="noreferrer">
                            Abrir anúncio ↗
                          </a>
                        ) : (
                          <span className="small" style={{ opacity: 0.7 }}>Sem link</span>
                        )}

                        <button
                          className="btn"
                          onClick={() => { setTab("lookup"); setLookupId(it.id); setData(null); setErr(null); }}
                        >
                          Ver detalhe (lookup)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* JSON opcional */}
          {data && (
            <pre
              style={{
                marginTop: 0,
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.25)",
                overflow: "auto",
                maxHeight: 360,
                fontSize: 12,
              }}
            >
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </>
      )}

      {/* ---------------- TAB: LOOKUP ---------------- */}
      {tab === "lookup" && (
        <div className="panel" style={{ padding: 14, display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="Informe item_id (MLB...)"
              style={{ minWidth: 320 }}
            />
            <button className="btn" onClick={loadLookup} disabled={loading}>
              {loading ? "Buscando..." : "Buscar item"}
            </button>
            <div className="small" style={{ opacity: 0.75 }}>
              Usa `/pricing/item/:id` (auth + fallback) — feito pra não cair em 403.
            </div>
          </div>

          {!data ? (
            <div className="small" style={{ opacity: 0.8 }}>
              Digite um MLB e clique em “Buscar item”.
            </div>
          ) : (
            <>
              {/* resumo */}
              {data?.item ? (
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ fontSize: 16, fontWeight: 900 }}>{data.item.title || data.item.id}</div>
                    <Badge tone={inferStatusTone(data.item.status).tone}>
                      {inferStatusTone(data.item.status).label}
                    </Badge>
                    <Badge tone="neutral">{moneyBRL(data.item.price)}</Badge>
                    <Badge tone={clampNumber(data.item.available_quantity, 0) > 0 ? "blue" : "red"}>
                      Estoque: {clampNumber(data.item.available_quantity, 0)}
                    </Badge>
                  </div>

                  {data.item.permalink ? (
                    <a className="btn" href={data.item.permalink} target="_blank" rel="noreferrer">
                      Abrir anúncio ↗
                    </a>
                  ) : null}
                </div>
              ) : null}

              <pre
                style={{
                  marginTop: 0,
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(0,0,0,0.25)",
                  overflow: "auto",
                  maxHeight: 420,
                  fontSize: 12,
                }}
              >
                {JSON.stringify(data, null, 2)}
              </pre>
            </>
          )}
        </div>
      )}

      {/* ---------------- TAB: COMPETITORS (optional) ---------------- */}
      {tab === "competitors" && (
        <div className="panel" style={{ padding: 14, display: "grid", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 900 }}>Concorrentes (keyword/categoria)</div>
              <div className="small" style={{ opacity: 0.8 }}>
                Pode ser bloqueado (403/501). Use como extra — o core do pricing é “Meu catálogo”.
              </div>
            </div>

            <a
              href={buildMlSearchUrl({ q, category })}
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{ textDecoration: "none" }}
              title="Fallback: abre a busca direto no site do Mercado Livre"
            >
              Abrir no Mercado Livre ↗
            </a>
          </div>

          <form onSubmit={handleSearchCompetitors}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px 140px", gap: 10 }}>
              <div>
                <div className="small" style={{ opacity: 0.8, marginBottom: 6 }}>Palavra-chave (q)</div>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ex: whey, creatina..." style={{ width: "100%" }} />
              </div>

              <div>
                <div className="small" style={{ opacity: 0.8, marginBottom: 6 }}>Categoria (opcional)</div>
                <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="ex: MLB4121134505" style={{ width: "100%" }} />
              </div>

              <div>
                <div className="small" style={{ opacity: 0.8, marginBottom: 6 }}>Limite</div>
                <input type="number" value={limit} min={1} max={50} onChange={(e) => setLimit(e.target.value)} style={{ width: "100%" }} />
              </div>

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button className="btn" disabled={loading} style={{ width: "100%" }}>
                  {loading ? "Pesquisando..." : "Pesquisar"}
                </button>
              </div>
            </div>
          </form>

          {Array.isArray(competitorResults) && competitorResults.length > 0 ? (
            <div
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 140px",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.06)",
                  fontWeight: 900,
                }}
              >
                <div>Título</div>
                <div>Preço</div>
                <div>Link</div>
              </div>

              {competitorResults.slice(0, Number(limit) || 20).map((r, idx) => {
                const title = r.title || r.name || `Item ${idx + 1}`;
                const price = r.price ?? r.current_price ?? r?.prices?.amount;
                const currency = r.currency_id || r.currency || "BRL";
                const link = r.permalink || r.link || r?.url;

                return (
                  <div
                    key={r.id || r.permalink || idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 120px 140px",
                      padding: "10px 12px",
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
                    <div>
                      {typeof price === "number"
                        ? price.toLocaleString("pt-BR", { style: "currency", currency })
                        : price ?? "-"}
                    </div>
                    <div>
                      {link ? (
                        <a href={link} target="_blank" rel="noreferrer">
                          Abrir ↗
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="small" style={{ opacity: 0.8 }}>
              {data ? "Sem lista padronizada — veja JSON." : "Faça uma busca para ver resultados."}
            </div>
          )}

          {data && (
            <pre
              style={{
                marginTop: 0,
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.25)",
                overflow: "auto",
                maxHeight: 420,
                fontSize: 12,
              }}
            >
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
