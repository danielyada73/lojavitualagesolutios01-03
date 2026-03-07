// src/routes/questions.js
import { Router } from "express";
import { axiosAuth, refreshIfNeeded } from "../meliApi.js";
import { getAnyUserId } from "../tokenStore.js";

const router = Router();

function clampInt(v, def, min, max) {
  const n = Number.parseInt(String(v), 10);
  const x = Number.isFinite(n) ? n : def;
  return Math.min(Math.max(x, min), max);
}

function safeError(err) {
  const status = err?.status || err?.response?.status || 500;
  const message =
    err?.response?.data?.message ||
    err?.response?.data?.error_description ||
    err?.message ||
    "Erro inesperado";
  return { status, message, details: err?.response?.data };
}

/**
 * GET /questions?user_id=&status=UNANSWERED|ANSWERED|ALL&limit=20&offset=0
 * Lista perguntas do vendedor.
 */
router.get("/", async (req, res) => {
  try {
    const userId =
      req.query.user_id ||
      getAnyUserId() ||
      (process.env.NODE_ENV !== "production" ? process.env.DEFAULT_USER_ID : null);

    if (!userId) {
      return res.status(400).json({ ok: false, error: "Informe user_id ou faça OAuth em /auth/ml" });
    }

    const statusRaw = String(req.query.status || "UNANSWERED").toUpperCase();
    const limit = clampInt(req.query.limit, 20, 1, 50);
    const offset = clampInt(req.query.offset, 0, 0, Number.MAX_SAFE_INTEGER);

    // ML aceita status: UNANSWERED / ANSWERED (e talvez outras variações)
    const mlStatus = statusRaw === "ALL" ? null : statusRaw;

    const tokens = await refreshIfNeeded(userId);
    const api = axiosAuth(tokens.access_token);

    // endpoint padrão de perguntas do ML
    const r = await api.get("/my/received_questions/search", {
      params: {
        ...(mlStatus ? { status: mlStatus } : {}),
        limit,
        offset,
      },
      timeout: 30_000,
    });

    res.json({
      ok: true,
      user_id: String(userId),
      paging: r.data?.paging || { limit, offset, total: 0 },
      questions: r.data?.questions || [],
      raw: r.data, // útil pra debug
    });
  } catch (err) {
    const { status, message, details } = safeError(err);
    console.error("[questions/list] error:", { status, message, details });
    res.status(status).json({ ok: false, error: "QUESTIONS_LIST_ERROR", message, details });
  }
});

/**
 * POST /questions/:questionId/answer?user_id=
 * body: { text: "..." }
 */
router.post("/:questionId/answer", async (req, res) => {
  try {
    const userId =
      req.query.user_id ||
      getAnyUserId() ||
      (process.env.NODE_ENV !== "production" ? process.env.DEFAULT_USER_ID : null);

    if (!userId) {
      return res.status(400).json({ ok: false, error: "Informe user_id ou faça OAuth em /auth/ml" });
    }

    const questionId = String(req.params.questionId || "").trim();
    const text = String(req.body?.text || "").trim();

    if (!questionId) return res.status(400).json({ ok: false, error: "questionId obrigatório" });
    if (!text) return res.status(400).json({ ok: false, error: "Texto da resposta obrigatório" });

    const tokens = await refreshIfNeeded(userId);
    const api = axiosAuth(tokens.access_token);

    const r = await api.post(
      "/answers",
      { question_id: questionId, text },
      { timeout: 30_000 }
    );

    res.json({ ok: true, answered: true, data: r.data });
  } catch (err) {
    const { status, message, details } = safeError(err);
    console.error("[questions/answer] error:", { status, message, details });
    res.status(status).json({ ok: false, error: "QUESTION_ANSWER_ERROR", message, details });
  }
});

export default router;
