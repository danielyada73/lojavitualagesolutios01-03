import { useEffect, useMemo, useState } from "react";
import { fetchCatalog } from "@/dashboard/lib/api";

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

function normalizeItem(x) {
  return {
    id: x?.id ?? "",
    title: x?.title ?? "Sem título",
    price: clampNumber(x?.price ?? 0, 0),
    available_quantity: Number(x?.available_quantity ?? 0) || 0,
    status: x?.status ?? "—",
    thumbnail: x?.thumbnail ?? "",
    permalink: x?.permalink ?? "",
    sku: x?.seller_sku ?? "",
  };
}

function statusConfig(status) {
  const s = String(status || "").toLowerCase();

  if (s === "active") {
    return {
      label: "Ativo",
      color: "#5dffb0",
      bg: "rgba(93,255,176,0.12)",
      border: "rgba(93,255,176,0.35)",
    };
  }

  if (s === "paused") {
    return {
      label: "Pausado",
      color: "#ffd278",
      bg: "rgba(255,210,120,0.12)",
      border: "rgba(255,210,120,0.35)",
    };
  }

  if (s === "closed") {
    return {
      label: "Fechado",
      color: "#ff5d5d",
      bg: "rgba(255,93,93,0.12)",
      border: "rgba(255,93,93,0.35)",
    };
  }

  return {
    label: s || "—",
    color: "rgba(255,255,255,0.9)",
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.12)",
  };
}

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [tab, setTab] = useState("active");
  const [q, setQ] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sort, setSort] = useState("updated");
  const [density, setDensity] = useState("comfort");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const res = await fetchCatalog("ml");
      const raw = Array.isArray(res?.items) ? res.items : [];
      setItems(raw.map(normalizeItem));
    } catch (e) {
      setErr("Erro ao carregar catálogo");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((i) => i.status === "active").length;
    const inactive = total - active;
    const outStock = items.filter((i) => i.available_quantity <= 0).length;
    return { total, active, inactive, outStock };
  }, [items]);

  const filtered = useMemo(() => {
    let arr = [...items];

    if (tab === "active") arr = arr.filter((i) => i.status === "active");
    if (tab === "inactive") arr = arr.filter((i) => i.status !== "active");

    if (q.trim()) {
      const search = q.toLowerCase();
      arr = arr.filter((i) =>
        `${i.title} ${i.id} ${i.sku}`.toLowerCase().includes(search)
      );
    }

    if (stockFilter === "inStock") arr = arr.filter((i) => i.available_quantity > 0);
    if (stockFilter === "outStock") arr = arr.filter((i) => i.available_quantity <= 0);

    if (sort === "title")
      arr.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "priceAsc")
      arr.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc")
      arr.sort((a, b) => b.price - a.price);
    if (sort === "stockDesc")
      arr.sort((a, b) => b.available_quantity - a.available_quantity);

    return arr;
  }, [items, tab, q, stockFilter, sort]);

  const cardMinHeight = density === "compact" ? 210 : 250;
  const thumbSize = density === "compact" ? 50 : 60;

  return (
    <div className="panel" style={{ display: "grid", gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: 20, fontWeight: 900 }}>
          Catálogo — Mercado Livre
        </div>
        <div className="small" style={{ opacity: 0.8 }}>
          Visão organizada por status e estoque
        </div>
      </div>

      {err && <div style={{ color: "#ff5d5d" }}>{err}</div>}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        <div className="panel" style={{ padding: 14 }}>
          <div className="small">Total</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{stats.total}</div>
        </div>

        <div className="panel" style={{ padding: 14 }}>
          <div className="small">Ativos</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#5dffb0" }}>
            {stats.active}
          </div>
        </div>

        <div className="panel" style={{ padding: 14 }}>
          <div className="small">Inativos</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>
            {stats.inactive}
          </div>
        </div>

        <div className="panel" style={{ padding: 14 }}>
          <div className="small">Sem estoque</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#ffd278" }}>
            {stats.outStock}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="panel" style={{ padding: 14, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => setTab("active")}>Ativos</button>
          <button className="btn" onClick={() => setTab("inactive")}>Inativos</button>
          <button className="btn" onClick={() => setTab("all")}>Todos</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 200px 200px 200px", gap: 10 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, MLB, SKU..."
          />

          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
            <option value="all">Estoque: todos</option>
            <option value="inStock">Somente com estoque</option>
            <option value="outStock">Somente sem estoque</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="updated">Ordenar: padrão</option>
            <option value="title">Título A→Z</option>
            <option value="priceAsc">Preço ↑</option>
            <option value="priceDesc">Preço ↓</option>
            <option value="stockDesc">Estoque ↓</option>
          </select>

          <select value={density} onChange={(e) => setDensity(e.target.value)}>
            <option value="comfort">Conforto</option>
            <option value="compact">Compacto</option>
          </select>
        </div>
      </div>

      {/* Grid de cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 14,
        }}
      >
        {filtered.map((it) => {
  const st = statusConfig(it.status);

  return (
    <div
      key={it.id}
      className="panel"
      style={{
        padding: 14,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
        display: "grid",
        gap: 10,
        minHeight: density === "compact" ? 180 : 210,
      }}
    >
      {/* Header do card */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          style={{
            width: density === "compact" ? 46 : 54,
            height: density === "compact" ? 46 : 54,
            borderRadius: 12,
            overflow: "hidden",
            background: "rgba(255,255,255,0.06)",
            flexShrink: 0,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {it.thumbnail ? (
            <img
              src={it.thumbnail}
              alt={it.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 900,
              fontSize: 14,
              lineHeight: 1.15,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {it.title}
          </div>
          <div className="small" style={{ opacity: 0.7, marginTop: 2 }}>
            {it.id}
            {it.sku ? ` • SKU: ${it.sku}` : ""}
          </div>
        </div>

        <div
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 800,
            background: st.bg,
            border: `1px solid ${st.border}`,
            color: st.color,
            whiteSpace: "nowrap",
          }}
        >
          {st.label}
        </div>
      </div>

      {/* Meta chips */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div
          style={{
            padding: "8px 10px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gap: 2,
            minWidth: 130,
          }}
        >
          <div className="small" style={{ opacity: 0.75 }}>Preço</div>
          <div style={{ fontWeight: 900 }}>{moneyBRL(it.price)}</div>
        </div>

        <div
          style={{
            padding: "8px 10px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gap: 2,
            minWidth: 130,
          }}
        >
          <div className="small" style={{ opacity: 0.75 }}>Estoque</div>
          <div style={{ fontWeight: 900 }}>
            {it.available_quantity}
            {it.available_quantity <= 0 ? (
              <span style={{ marginLeft: 8, fontWeight: 800, color: "#ffd278" }}>
                sem estoque
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Ações (discretas) */}
      <div
        style={{
          marginTop: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div className="small" style={{ opacity: 0.7 }}>
          {it.status !== "active"
            ? "Item inativo pode não aparecer nas buscas."
            : "Item ativo em busca."}
        </div>

        {it.permalink ? (
          <a
            href={it.permalink}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(0,0,0,0.15)",
              fontWeight: 800,
              fontSize: 12,
              textDecoration: "none",
              color: "rgba(210,240,255,0.95)",
              whiteSpace: "nowrap",
            }}
          >
            Abrir no ML →
          </a>
        ) : null}
      </div>
    </div>
  );
})}
      </div>
    </div>
  );
}
