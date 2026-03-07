/**
 * Gera estatísticas básicas de preço a partir de uma lista de itens.
 *
 * Espera itens no formato:
 * { price: number }
 *
 * Retorna:
 * - count: quantidade de preços válidos
 * - mean: média aritmética (não arredondada)
 * - median: mediana
 * - p25 / p75: percentis
 * - min / max: extremos
 */
export function summarizePrices(items) {
  const prices = items
    .map(i => i.price)
    .filter(p => typeof p === "number" && !Number.isNaN(p))
    .sort((a, b) => a - b);

  if (prices.length === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      p25: 0,
      p75: 0,
      min: 0,
      max: 0
    };
  }

  const count = prices.length;
  const mean = prices.reduce((a, b) => a + b, 0) / count;

  return {
    count,
    mean,                 // média bruta (não arredondada)
    median: quantile(prices, 0.5),
    p25: quantile(prices, 0.25),
    p75: quantile(prices, 0.75),
    min: prices[0],
    max: prices[prices.length - 1],
  };
}

/**
 * Calcula quantil interpolado de um array ordenado.
 * q deve estar entre 0 e 1.
 */
function quantile(sorted, q) {
  if (q < 0 || q > 1) {
    throw new Error("quantile q must be between 0 and 1");
  }

  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;

  return sorted[base + 1] !== undefined
    ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
    : sorted[base];
}
