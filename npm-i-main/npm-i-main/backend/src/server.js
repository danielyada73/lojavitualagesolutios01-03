/**
 * src/server.js
 *
 * ENTRYPOINT DA API
 * ==================
 * Este arquivo é o ponto de entrada do backend.
 */

import "dotenv/config";

import express from "express";
import cors from "cors";

/* -------------------------------------------------------------------------- */
/*                                  ROTAS                                     */
/* -------------------------------------------------------------------------- */

import healthRoutes from "./routes/health.js";
import authLocalRoutes from "./routes/authLocal.js";
import auth from "./routes/auth.js";

import publicRoutes from "./routes/public.js";
import mlDiag from "./routes/mlDiag.js";
import privateRoutes from "./routes/private.js";
import visitsRoutes from "./routes/visits.js";
import accounts from "./routes/accounts.js";
import catalog from "./routes/catalog.js";
import questionsRoutes from "./routes/questions.js";
import costsRoutes from "./routes/costs.js";
import dashboardRoutes from "./routes/dashboard.js";
import ordersRoutes from "./routes/orders.js"; // ✅ CORRIGIDO (./) e sem duplicar
import logisticsRoutes from "./routes/logistics.js";
import stockRoutes from "./routes/stock.js";
import adsRoutes from "./routes/ads.js";

/* -------------------------------------------------------------------------- */
/*                         INICIALIZAÇÃO DO APP                                */
/* -------------------------------------------------------------------------- */

const app = express();

/* -------------------------------------------------------------------------- */
/*                          MIDDLEWARE: JSON                                   */
/* -------------------------------------------------------------------------- */

app.use(express.json({ limit: "1mb" }));

/* -------------------------------------------------------------------------- */
/*                           MIDDLEWARE: CORS                                  */
/* -------------------------------------------------------------------------- */

const allowedOrigins = (process.env.DASHBOARD_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

/* -------------------------------------------------------------------------- */
/*                         MIDDLEWARE: LOGGER                                  */
/* -------------------------------------------------------------------------- */

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
});

/* -------------------------------------------------------------------------- */
/*                               ROTAS                                        */
/* -------------------------------------------------------------------------- */

app.use(healthRoutes);

app.use("/auth/local", authLocalRoutes);
app.use("/auth", auth);

app.use("/public", publicRoutes);
app.use("/private", privateRoutes);
app.use("/visits", visitsRoutes);
app.use("/accounts", accounts);
app.use("/catalog", catalog);

app.use("/questions", questionsRoutes);
app.use("/orders", ordersRoutes);       // ✅ aqui é o lugar certo
app.use("/costs", costsRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/_debug", mlDiag);

app.use("/logistics", logisticsRoutes);
app.use("/stock", stockRoutes);
app.use("/ads", adsRoutes);
/* -------------------------------------------------------------------------- */
/*                         DEBUG: LISTAR ROTAS (DEV)                           */
/* -------------------------------------------------------------------------- */

app.get("/_debug/routes", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ ok: false, error: "NOT_FOUND" });
  }

  const routes = [];

  function walk(stack, prefix = "") {
    for (const layer of stack) {
      if (layer.route?.path) {
        const methods = Object.keys(layer.route.methods || {})
          .filter((m) => layer.route.methods[m])
          .map((m) => m.toUpperCase());

        routes.push({ methods, path: prefix + layer.route.path });
        continue;
      }

      if (layer.name === "router" && layer.handle?.stack) {
        const raw = layer.regexp?.toString?.() || "";
        let p = "";

        const m = raw.match(/^\/\^\\\/(.+?)\\\/\?\(\?\=\\\/\|\$\)\/i$/);
        if (m?.[1]) {
          p = "/" + m[1].replace(/\\\//g, "/");
        }

        walk(layer.handle.stack, prefix + p);
      }
    }
  }

  const stack = app._router?.stack || [];
  walk(stack);

  routes.sort((a, b) => a.path.localeCompare(b.path));
  return res.json({ ok: true, routes });
});

/* -------------------------------------------------------------------------- */
/*                           HANDLER 404                                       */
/* -------------------------------------------------------------------------- */

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "NOT_FOUND",
    path: req.originalUrl,
  });
});

/* -------------------------------------------------------------------------- */
/*                         ERROR HANDLER GLOBAL                                */
/* -------------------------------------------------------------------------- */

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === "production";

  res.status(status).json({
    ok: false,
    error: "INTERNAL_SERVER_ERROR",
    message: isProd ? "Unexpected error" : err.message,
  });
});

/* -------------------------------------------------------------------------- */
/*                          START DO SERVIDOR                                  */
/* -------------------------------------------------------------------------- */

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});