import { Router } from "express";
const router = Router();

/**
 * STUBS de integração externa.
 * Importante:
 * - Essas rotas NÃO são OAuth real
 * - Servem apenas para:
 *   - o front saber que a integração existe
 *   - bloquear tentativa de uso em produção
 */

/**
 * Helper padrão para OAuth não implementado
 * Mantém contrato consistente entre providers
 */
function notImplemented(provider) {
  return {
    ok: false,
    provider,
    error: "OAUTH_NOT_IMPLEMENTED",
    message: `OAuth ${provider} ainda não foi implementado`,
  };
}

/**
 * TikTok
 */
router.get("/tiktok", (req, res) => {
  // Em um OAuth real, aqui você geraria state + redirect_uri
  return res.json(notImplemented("tiktok"));
});

router.get("/tiktok/tokens", (req, res) => {
  return res.status(501).json(notImplemented("tiktok"));
});

/**
 * Shopee
 */
router.get("/shopee", (req, res) => {
  return res.json(notImplemented("shopee"));
});

router.get("/shopee/tokens", (req, res) => {
  return res.status(501).json(notImplemented("shopee"));
});

/**
 * Amazon
 */
router.get("/amazon", (req, res) => {
  return res.json(notImplemented("amazon"));
});

router.get("/amazon/tokens", (req, res) => {
  return res.status(501).json(notImplemented("amazon"));
});

export default router;
