// src/lib/adsStore.js
const KEY = "alpha_ads_state_v1";

export function newAdRow() {
  const id = crypto?.randomUUID?.() || String(Date.now() + Math.random());
  return {
    id,
    campanha: "Nova campanha",
    canal: "ML_ADS", // ML_ADS | META | GOOGLE | OUTROS
    inicio: "2026-01-01",
    fim: "2026-01-07",

    investimento: 0, // R$
    impressoes: 0,
    cliques: 0,

    vendasAds: 0,
    receitaAds: 0, // R$
  };
}

export function loadAdsState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const seed = {
        from: "2026-01-03",
        to: "2026-02-02",
        campaigns: [],
        lastSync: null,
        lastSyncError: null,
      };
      return seed;
    }
    const data = JSON.parse(raw);

    // defesa
    return {
      from: data.from || "2026-01-03",
      to: data.to || "2026-02-02",
      campaigns: Array.isArray(data.campaigns) ? data.campaigns : [],
      lastSync: data.lastSync || null,
      lastSyncError: data.lastSyncError || null,
    };
  } catch {
    return {
      from: "2026-01-03",
      to: "2026-02-02",
      campaigns: [],
      lastSync: null,
      lastSyncError: null,
    };
  }
}

export function saveAdsState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}
