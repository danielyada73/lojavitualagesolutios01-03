import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "@/dashboard/components/Layout/AppLayout";
// import ProtectedRoute from "@/dashboard/components/auth/ProtectedRoute"; // 🔕 desativado por enquanto
import Login from "@/dashboard/pages/Login";

import Dashboard from "@/dashboard/pages/Dashboard";
import Pricing from "@/dashboard/pages/Pricing";
import Catalog from "@/dashboard/pages/Catalog";
import Metrics from "@/dashboard/pages/Metrics";
import Orders from "@/dashboard/pages/Orders";
import Questions from "@/dashboard/pages/Questions";
import Logistics from "@/dashboard/pages/Logistics";
import Stock from "@/dashboard/pages/Stock";
import Ads from "@/dashboard/pages/Ads";
import Settings from "@/dashboard/pages/Settings";
import Integrations from "@/dashboard/pages/Integrations";
import PlatformHome from "@/dashboard/pages/PlatformHome";
import Marketing from "@/dashboard/pages/Marketing";
import Fabricacao from "@/dashboard/pages/Fabricacao";

const router = createBrowserRouter([
  // ✅ em vez de mostrar login, manda direto pro app
  { path: "/login", element: <Navigate to="/admin/" replace /> },

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
  { path: "*", element: <Navigate to="/admin/" replace /> },
]);

export default router;
