// src/providers/mlProducts.js
// Responsável APENAS por falar com a API do Mercado Livre

import axios from "axios";
import { refreshIfNeeded } from "../meliApi.js";

const BASE = "https://api.mercadolibre.com";

/**
 * Lista produtos de um seller específico.
 *
 * @param {object} params
 * @param {string|number} params.userId
 * @param {number} params.limit
 * @param {number} params.offset
 */
export async function ml_listProducts({ userId, limit = 20, offset = 0 }) {
  if (!userId) {
    const e = new Error("userId é obrigatório para listar produtos do Mercado Livre");
    e.status = 400;
    throw e;
  }

  // garante token válido
  const { access_token } = await refreshIfNeeded(userId);

  try {
    // 1) busca IDs
    const idsRes = await axios.get(`${BASE}/users/${userId}/items/search`, {
      params: { limit, offset },
      headers: { Authorization: `Bearer ${access_token}` },
      timeout: 30_000,
    });

    const ids = idsRes.data?.results ?? [];
    const total = idsRes.data?.paging?.total ?? 0;

    if (!ids.length) return { items: [], total };

    // 2) busca detalhes em batch
    const detailsRes = await axios.get(`${BASE}/items`, {
      params: { ids: ids.join(",") },
      headers: { Authorization: `Bearer ${access_token}` },
      timeout: 30_000,
    });

    const items = (detailsRes.data ?? []).map((w) => {
      const i = w.body ?? w;
      return {
        id: i.id,
        title: i.title,
        price: i.price,
        currency: i.currency_id,
        status: i.status,
        thumbnail: i.thumbnail,
        stock: i.available_quantity ?? 0,
        permalink: i.permalink,
        provider: "ml",
      };
    });

    return { items, total };

  } catch (err) {
    const status = err?.response?.status;
    const e = new Error(
      err?.response?.data?.message || "Erro ao buscar produtos no Mercado Livre"
    );
    e.status = status || 500;
    throw e;
  }
}
