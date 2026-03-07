export const PROVIDERS = {
  ml: { key: "ml", label: "Mercado Livre", authUrl: "/auth/ml" },
  tiktok: { key: "tiktok", label: "TikTok Shop", authUrl: "/auth/tiktok" },
  shopee: { key: "shopee", label: "Shopee", authUrl: "/auth/shopee" },
  amazon: { key: "amazon", label: "Amazon", authUrl: "/auth/amazon" },
};

// lista pronta para mapear em grids/cards
export const PROVIDER_LIST = Object.values(PROVIDERS);
