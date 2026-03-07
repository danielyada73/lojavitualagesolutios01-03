// src/lib/dashboardStore.js
const KEY = "dashboard_state_v1";

function makeId() {
  try {
    return crypto.randomUUID();
  } catch (e) {
    return String(Date.now() + Math.random());
  }
}

function seedCampaigns() {
  return [
    {
      id: makeId(),
      campanha: "Janeiro",
      inicio: "2026-01-05",
      fim: "2026-01-12",
      canal: "ML",
      vendasOrg: 0,
      vendasAds: 0,
      receita: 59.9,
      tarifas: 16.93,
      custoProd: 22,
      ads: 1.72,
      autoCost: false,
    },
    {
      id: makeId(),
      campanha: "Janeiro",
      inicio: "2026-01-13",
      fim: "2026-01-19",
      canal: "ML",
      vendasOrg: 1,
      vendasAds: 0,
      receita: 0,
      tarifas: 0,
      custoProd: 0,
      ads: 0.6,
      autoCost: true,
    },
    {
      id: makeId(),
      campanha: "Janeiro",
      inicio: "2026-01-20",
      fim: "2026-01-26",
      canal: "ML",
      vendasOrg: 0,
      vendasAds: 0,
      receita: 0,
      tarifas: 0,
      custoProd: 0,
      ads: 2.64,
      autoCost: true,
    },
  ];
}

export function loadDashboardState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);

      const defaultUnitCost =
        Number.isFinite(Number(s?.defaultUnitCost)) && Number(s.defaultUnitCost) > 0
          ? Number(s.defaultUnitCost)
          : 22;

      const campaigns =
        Array.isArray(s?.campaigns) && s.campaigns.length ? s.campaigns : seedCampaigns();

      return { defaultUnitCost, campaigns };
    }
  } catch (e) {
    // ignora e cai no seed
  }

  return { defaultUnitCost: 22, campaigns: seedCampaigns() };
}

export function saveDashboardState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    // não quebra a UI
  }
}

export function newCampaignRow() {
  return {
    id: makeId(),
    campanha: "Nova campanha",
    inicio: "2026-02-01",
    fim: "2026-02-07",
    canal: "ML",
    vendasOrg: 0,
    vendasAds: 0,
    receita: 0,
    tarifas: 0,
    custoProd: 0,
    ads: 0,
    autoCost: true,
  };
}
