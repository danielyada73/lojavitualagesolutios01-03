// backend/src/providers/index.js
import { ml_listProducts } from "./ml.js"; // <- ajuste aqui se seu arquivo tiver outro nome

// Confirma no terminal qual arquivo está rodando de verdade
console.log("[providers] loaded from:", import.meta.url);

/**
 * Normaliza provider vindo da URL para um valor canônico.
 * Ex.:
 * - /catalog/mercado-livre
 * - /catalog/mercado-livre
 * - /catalog/ml
 * - /catalog/meli
 * -> "mercado-livre"
 */
function normalizeProvider(provider) {
  const raw = String(provider || "").trim().toLowerCase();
  const key = raw.replace(/[^a-z0-9]/g, ""); // remove hífen, underscore, espaços etc.

  // aceita variações (inclui o caso sem "o": mercadlivre)
  if (["mercadolivre", "mercadlivre", "ml", "meli"].includes(key)) {
    return "mercado-livre";
  }

  return raw;
}

export async function listProductsByProvider(provider, params = {}) {
  const p = normalizeProvider(provider);

  console.log("[providers] provider raw:", provider, "| normalized:", p);

  // Mercado Livre
  if (p === "mercado-livre") {
    return ml_listProducts(params); // aqui vai userId/limit/offset se vierem da rota
  }

  // Para não travar seu desenvolvimento agora, cai no ML por padrão com warning
  console.warn("[providers] provider desconhecido:", provider, "-> usando Mercado Livre por padrão");
  const data = await ml_listProducts(params);
  return {
    ...data,
    warning: `Provider '${provider}' não reconhecido; usando Mercado Livre por padrão.`,
  };
}
