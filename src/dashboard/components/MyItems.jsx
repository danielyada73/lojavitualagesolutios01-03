import { Router } from "express";
import { ml_listProducts } from "../providers/mlProducts.js"; // ou "./ml.js" se você colocou lá

const router = Router();

/**
 * GET /my-items?limit=20
 * Retorna anúncios do usuário autenticado
 */
router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit || 20);

    // reaproveita o provider do ML
    const data = await ml_listProducts({ limit, offset: 0 });

    res.json({ ok: true, ...data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.response?.data || e.message });
  }
});

export default router;
