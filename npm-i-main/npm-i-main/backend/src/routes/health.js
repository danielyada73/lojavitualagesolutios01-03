import { Router } from "express";

const router = Router();

/**
 * Health check
 * - Endpoint técnico
 * - Usado para monitoramento, deploy, cloud
 */
router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: process.env.SERVICE_NAME || "alpha-api",
    version: process.env.APP_VERSION || "0.3.0",
    env: process.env.NODE_ENV || "dev",
    ts: Date.now(),
  });
});

export default router;
