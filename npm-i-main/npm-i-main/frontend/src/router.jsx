import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "@/components/Layout/AppLayout";
// import ProtectedRoute from "@/components/auth/ProtectedRoute"; // 🔕 desativado por enquanto
import Login from "@/pages/Login";

import Dashboard from "@/pages/Dashboard";
import Pricing from "@/pages/Pricing";
import Catalog from "@/pages/Catalog";
import Metrics from "@/pages/Metrics";
import Orders from "@/pages/Orders";
import Questions from "@/pages/Questions";
import Logistics from "@/pages/Logistics";
import Stock from "@/pages/Stock";
import Ads from "@/pages/Ads";
import Settings from "@/pages/Settings";
import Integrations from "@/pages/Integrations";
import PlatformHome from "@/pages/PlatformHome";
import Marketing from "@/pages/Marketing";
import Fabricacao from "@/pages/Fabricacao";

const router = createBrowserRouter([
  // ✅ em vez de mostrar login, manda direto pro app
  { path: "/login", element: <Navigate to="/" replace /> },

  // ✅ tudo livre por enquanto (sem ProtectedRoute)
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "pricing", element: <Pricing /> },
      { path: "catalog", element: <Catalog /> },
      { path: "metrics", element: <Metrics /> },
      { path: "orders", element: <Orders /> },
      { path: "questions", element: <Questions /> },
      { path: "logistics", element: <Logistics /> },
      { path: "stock", element: <Stock /> },
      { path: "ads", element: <Ads /> },
      { path: "integrations", element: <Integrations /> },
      { path: "platform/:provider", element: <PlatformHome /> },
      { path: "settings", element: <Settings /> },

      // menu do header
      { path: "marketing", element: <Marketing /> },
      { path: "fabricacao", element: <Fabricacao /> },
    ],
  },

  // ✅ fallback: qualquer rota desconhecida cai pro /
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;
