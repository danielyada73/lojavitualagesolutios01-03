// frontend/src/lib/stockStore.js
const KEY = "alpha_stock_v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function newStockRow() {
  return {
    id: uid(),
    canal: "ML",        // ML | SP | OUTROS
    sku: "",
    itemId: "",
    produto: "",
    categoria: "",
    estoqueAtual: 0,
    estoqueMin: 0,
    custoUnit: 0,
    precoVenda: 0,
    status: "ATIVO",    // ATIVO | PAUSADO | ESGOTADO
    observacao: "",
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

export function loadStockState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    rows: [],
  };
}

export function saveStockState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}
