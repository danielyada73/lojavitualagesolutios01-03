// frontend/src/lib/logisticsStore.js
const KEY = "alpha_logistics_v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function newShipmentRow() {
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);

  return {
    id: uid(),
    canal: "ML",              // ML | SP | OUTROS
    pedidoId: "",
    itemId: "",
    transportadora: "",
    tracking: "",
    status: "PENDENTE",       // PENDENTE | POSTADO | EM_TRANSITO | ENTREGUE | PROBLEMA | CANCELADO
    custoFrete: 0,
    previsto: iso,
    atualizadoEm: iso,
    observacao: "",
  };
}

export function loadLogisticsState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  return {
    shipments: [],
  };
}

export function saveLogisticsState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}
