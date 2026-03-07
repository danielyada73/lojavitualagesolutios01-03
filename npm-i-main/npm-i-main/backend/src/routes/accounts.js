// routes/accounts.js
import { Router } from "express";
const router = Router();

/**
 * Providers padronizados (evita string mágica espalhada pelo projeto)
 * - Use sempre chaves curtas e estáveis: ml, tiktok, shopee, amazon
 */
const PROVIDERS = {
  ML: "ml",
  TIKTOK: "tiktok",
  SHOPEE: "shopee",
  AMAZON: "amazon",
};

/**
 * Helper de mock
 * - Mantém o contrato que o front espera.
 * - Se amanhã isso virar DB, você troca só a fonte de dados e mantém o formato.
 */
const mk = (provider, nickname, store_id) => ({
  id: `${provider}_${store_id}`,
  provider,
  nickname,
  store_id,
  status: "active", // padronizei para "active" (evita acento e divergência)
  connected_at: new Date().toISOString(),
});

/**
 * Mock centralizado (evita duplicação em várias rotas)
 */
function getMockAccounts() {
  return [
    mk(PROVIDERS.ML, "Alpha ML", "123456"),
    mk(PROVIDERS.TIKTOK, "Alpha TikTok", "tk_001"),
    mk(PROVIDERS.SHOPEE, "Alpha Shopee", "sp_001"),
    mk(PROVIDERS.AMAZON, "Alpha Amazon", "am_001"),
  ];
}

/**
 * Rota recomendada (mais escalável):
 * GET /accounts
 * GET /accounts?provider=ml
 */
router.get("/", (req, res) => {
  const provider = typeof req.query.provider === "string" ? req.query.provider.trim() : null;

  let accounts = getMockAccounts();

  if (provider) {
    // Se vier provider inválido, eu prefiro erro explícito (não lista vazia “silenciosa”)
    const allowed = new Set(Object.values(PROVIDERS));
    if (!allowed.has(provider)) {
      return res.status(400).json({
        ok: false,
        error: "INVALID_PROVIDER",
        message: `Provider inválido: ${provider}`,
      });
    }
    accounts = accounts.filter((a) => a.provider === provider);
  }

  return res.json({ ok: true, accounts });
});

/**
 * Rotas antigas (compatibilidade com o front atual).
 * - Elas apenas redirecionam internamente para o mesmo handler.
 * - Assim você migra o front com calma depois.
 */
router.get("/ml", (req, res) => {
  req.query.provider = PROVIDERS.ML;
  return router.handle(req, res);
});

router.get("/tiktok", (req, res) => {
  req.query.provider = PROVIDERS.TIKTOK;
  return router.handle(req, res);
});

router.get("/shopee", (req, res) => {
  req.query.provider = PROVIDERS.SHOPEE;
  return router.handle(req, res);
});

router.get("/amazon", (req, res) => {
  req.query.provider = PROVIDERS.AMAZON;
  return router.handle(req, res);
});

export default router;
