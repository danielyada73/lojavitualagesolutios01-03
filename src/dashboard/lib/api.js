import axios from "axios";

function getApiOverride() {
  try {
    return localStorage.getItem("VITE_API_URL_OVERRIDE") || "";
  } catch {
    return "";
  }
}

export const API_BASE =
  getApiOverride() ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

function getMLUserId() {
  try {
    return localStorage.getItem("ml_user_id") || undefined;
  } catch {
    return undefined;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   ENDPOINTS                                */
/* -------------------------------------------------------------------------- */

export const endpoints = {
  health: () => `/health`,
  dashboardSummary: () => `/dashboard/summary`,

  authML: () => `/auth/ml`,
  tokensML: (userId) =>
    `/auth/ml/tokens${userId ? `?user_id=${userId}` : ""}`,

  catalog: (provider) => `/catalog/${provider}`,

  me: () => `/private/me`,
  myItems: () => `/private/my-items`,
  visits: () => `/visits`,
  searchCompetitors: () => `/public/search-competitors`,

  questions: () => `/questions`,
  answerQuestion: (id) => `/questions/${id}/answer`,

  // Logística / Estoque
  logisticsMovements: () => `/logistics/movements`,
  logisticsSyncMl: () => `/logistics/sync/ml`,
  stockBalance: () => `/stock/balance`,

  // Custos
  costs: () => `/costs`,
  costsDefault: () => `/costs/default`,
  costsItem: () => `/costs/item`,
  costsFixed: () => `/costs/fixed`,

  // Pedidos
  orders: () => `/orders`,

  // Ads
  adsMetrics: () => `/visits/ads/metrics`,
  adsWeeks: () => `/ads/weeks`,
  adsWeeksSpend: () => `/ads/weeks/spend`,
};

/* -------------------------------------------------------------------------- */
/*                                   CATALOG                                  */
/* -------------------------------------------------------------------------- */

export async function fetchCatalog(
  provider,
  { limit = 20, offset = 0, userId } = {}
) {
  const uid = userId || getMLUserId();
  const res = await api.get(endpoints.catalog(provider), {
    params: { limit, offset, ...(uid ? { user_id: uid } : {}) },
  });
  return res.data;
}

export async function fetchMe({ userId } = {}) {
  const uid = userId || getMLUserId();
  const res = await api.get(endpoints.me(), {
    params: { ...(uid ? { user_id: uid } : {}) },
  });
  return res.data;
}

export async function fetchMyItems({ userId, limit = 20 } = {}) {
  const uid = userId || getMLUserId();
  const res = await api.get(endpoints.myItems(), {
    params: { limit, ...(uid ? { user_id: uid } : {}) },
  });
  return res.data;
}

export async function fetchVisits({ itemId, from, to, userId } = {}) {
  const uid = userId || getMLUserId();
  const res = await api.get(endpoints.visits(), {
    params: {
      item_id: itemId,
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
      ...(uid ? { user_id: uid } : {}),
    },
  });
  return res.data;
}

export async function searchCompetitors({
  q,
  category,
  limit = 20,
} = {}) {
  const res = await api.get(endpoints.searchCompetitors(), {
    params: { ...(q ? { q } : {}), ...(category ? { category } : {}), limit },
  });
  return res.data;
}

/* -------------------------------------------------------------------------- */
/*                                    COSTS                                   */
/* -------------------------------------------------------------------------- */

export async function getCosts(userId) {
  const uid = userId || getMLUserId();
  const res = await api.get(endpoints.costs(), {
    params: { ...(uid ? { user_id: uid } : {}) },
  });
  return res.data;
}

export async function setDefaultCost(userId, unitCost) {
  const uid = userId || getMLUserId();
  const res = await api.put(
    endpoints.costsDefault(),
    { unitCost },
    { params: { ...(uid ? { user_id: uid } : {}) } }
  );
  return res.data;
}

export async function setItemCost(userId, itemId, unitCost) {
  const uid = userId || getMLUserId();
  const res = await api.put(
    endpoints.costsItem(),
    { unitCost },
    { params: { ...(uid ? { user_id: uid } : {}), item_id: itemId } }
  );
  return res.data;
}

export async function setFixedCost(userId, payload) {
  const uid = userId || getMLUserId();
  const res = await api.put(
    endpoints.costsFixed(),
    payload,
    { params: { ...(uid ? { user_id: uid } : {}) } }
  );
  return res.data;
}

/* -------------------------------------------------------------------------- */
/*                                 DASHBOARD                                  */
/* -------------------------------------------------------------------------- */

export async function fetchDashboardSummary({ userId, from, to } = {}) {
  const res = await api.get("/dashboard/summary", {
    params: {
      ...(userId ? { user_id: userId } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    },
  });
  return res.data;
}

/* -------------------------------------------------------------------------- */
/*                                   ORDERS                                   */
/* -------------------------------------------------------------------------- */

export async function fetchOrders({ userId, from, to, limit = 20, offset = 0 } = {}) {
  const uid = userId || getMLUserId();
  const res = await api.get(endpoints.orders(), {
    params: {
      limit,
      offset,
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
      ...(uid ? { user_id: uid } : {}),
    },
  });
  return res.data;
}

/* -------------------------------------------------------------------------- */
/*                                     ADS                                    */
/* -------------------------------------------------------------------------- */

export async function fetchAdsMetrics({ from, to, userId } = {}) {
  const uid = userId || getMLUserId();
  const res = await api.get(endpoints.adsMetrics(), {
    params: {
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
      ...(uid ? { user_id: uid } : {}),
    },
  });
  return res.data;
}

export async function fetchAdsWeeks({ userId, from, to } = {}) {
  const uid = userId || getMLUserId();
  const res = await api.get(endpoints.adsWeeks(), {
    params: {
      ...(uid ? { user_id: uid } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    },
  });
  return res.data;
}

export async function setAdsWeekSpend({ userId, weekStart, spend } = {}) {
  const uid = userId || getMLUserId();
  const res = await api.put(endpoints.adsWeeksSpend(), {
    user_id: uid,
    week_start: weekStart,
    spend: Number(spend || 0),
  });
  return res.data;
}
/* -------------------------------------------------------------------------- */
/*                                 QUESTIONS                                  */
/* -------------------------------------------------------------------------- */

export async function fetchQuestions({ userId, limit = 20, offset = 0 } = {}) {
  const uid = userId || getMLUserId();
  const res = await api.get(endpoints.questions(), {
    params: {
      limit,
      offset,
      ...(uid ? { user_id: uid } : {}),
    },
  });
  return res.data;
}

export async function answerQuestion(id, text, userId) {
  const uid = userId || getMLUserId();
  const res = await api.post(
    endpoints.answerQuestion(id),
    { text },
    {
      params: {
        ...(uid ? { user_id: uid } : {}),
      },
    }
  );
  return res.data;
}


/* -------------------------------------------------------------------------- */
/*                                  LOGÍSTICA                                 */
/* -------------------------------------------------------------------------- */

export async function fetchMovements({ userId, from, to, itemId } = {}) {
  const uid = userId || getMLUserId();
  const res = await api.get(endpoints.logisticsMovements(), {
    params: {
      ...(uid ? { user_id: uid } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
      ...(itemId ? { item_id: itemId } : {}),
    },
  });
  return res.data;
}

export async function createMovement({ userId, date, type, itemId, qty, note } = {}) {
  const uid = userId || getMLUserId();
  const res = await api.post(endpoints.logisticsMovements(), {
    user_id: uid,
    date,
    type,
    item_id: itemId,
    qty,
    note,
  });
  return res.data;
}

export async function syncMovementsFromML({ userId, from, to, limit = 50, offset = 0 } = {}) {const uid = userId || getMLUserId();
  const res = await api.post(endpoints.logisticsSyncMl(), null, {
    params: {
      ...(uid ? { user_id: uid } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
      limit,
      offset,
    },
  });
  return res.data;
}

export async function fetchStockBalance({ userId, itemId } = {}) {
  const uid = userId || getMLUserId();
  const res = await api.get(endpoints.stockBalance(), {
    params: {
      ...(uid ? { user_id: uid } : {}),
      ...(itemId ? { item_id: itemId } : {}),
    },
  });
  return res.data;
}

export default api;
