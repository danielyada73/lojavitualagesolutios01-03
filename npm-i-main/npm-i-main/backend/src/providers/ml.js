// src/providers/ml.js
import axios from "axios";
import { refreshIfNeeded } from "../meliApi.js";
import { getAnyUserId } from "../tokenStore.js";

const BASE = "https://api.mercadolibre.com";

/**
 * Garante que o valor seja um inteiro dentro de uma faixa.
 */
function clampInt(v, def, min, max) {
  const n = Number.parseInt(String(v), 10);
  const x = Number.isFinite(n) ? n : def;
  return Math.min(Math.max(x, min), max);
}

/**
 * Lista produtos/anúncios do Mercado Livre (seller items).
 *
 * Regras:
 * - Se `userId` vier no params: usa ele.
 * - Se não vier: tenta pegar do tokenStore (getAnyUserId).
 *   (Funciona enquanto o backend não reiniciar; depois você persiste em Postgres.)
 */
export async function ml_listProducts({ userId, limit = 20, offset = 0 } = {}) {
  // ✅ fallback automático para algum user autenticado em memória
  const uid = String(userId || getAnyUserId() || "").trim();

  if (!uid) {
    const e = new Error(
      'Tokens não encontrados. Faça login em "/auth/ml" ou passe ?user_id=...'
    );
    e.status = 401;
    e.code = "MISSING_USER_ID";
    throw e;
  }

  // ✅ sanitiza paginação
  const safeLimit = clampInt(limit, 20, 1, 50);
  const safeOffset = clampInt(offset, 0, 0, Number.MAX_SAFE_INTEGER);

  // ✅ garante token válido (refresh se precisar)
  const { access_token } = await refreshIfNeeded(uid);

  try {
    // 1) Busca IDs dos itens do seller
    const idsRes = await axios.get(`${BASE}/users/${uid}/items/search`, {
      params: { limit: safeLimit, offset: safeOffset },
      headers: { Authorization: `Bearer ${access_token}` },
      timeout: 30_000,
    });

    const ids = idsRes.data?.results ?? [];
    const total = idsRes.data?.paging?.total ?? 0;

    // ✅ DEBUG (AGORA está no lugar certo)
    console.log("[ml_listProducts] userId:", uid);
    console.log("[ml_listProducts] paging:", idsRes.data?.paging);
    console.log("[ml_listProducts] results length:", ids.length);

    // Sem anúncios? retorna vazio
    if (!ids.length) return { items: [], total };

    // 2) Busca detalhes em batch
    const detailsRes = await axios.get(`${BASE}/items`, {
      params: { ids: ids.join(",") },
      headers: { Authorization: `Bearer ${access_token}` },
      timeout: 30_000,
    });

    const items = (detailsRes.data ?? []).map((w) => {
      const i = w.body ?? w; // às vezes vem wrapper { code, body }
      return {
        id: i.id,
        title: i.title,
        price: i.price,
        currency: i.currency_id,
        status: i.status,
        thumbnail: i.thumbnail,
        stock: i.available_quantity ?? 0,
        permalink: i.permalink,
        provider: "mercado-livre",
      };
    });

    return { items, total: total || items.length };
  } catch (err) {
    const status = err?.response?.status || 500;
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error_description ||
      err?.message ||
      "Erro ao listar produtos do Mercado Livre";

    const e = new Error(message);
    e.status = status;
    e.code = "ML_LIST_PRODUCTS_ERROR";
    e.details = err?.response?.data;
    throw e;
  }
}
