import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Tags,
  Boxes,
  BarChart3,
  ShoppingCart,
  MessageSquare,
  Truck,
  Layers3,
  Megaphone,
  Settings,
  Network,
} from "lucide-react";

const links = [
  { to: "/admin/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/pricing", label: "Pricing", icon: Tags },
  { to: "/admin/catalog", label: "Catálogo", icon: Boxes },
  { to: "/admin/metrics", label: "Métricas", icon: BarChart3 },
  { to: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
  { to: "/admin/questions", label: "Perguntas", icon: MessageSquare },
  { to: "/admin/logistics", label: "Logística", icon: Truck },
  { to: "/admin/stock", label: "Estoque", icon: Layers3 },
  { to: "/admin/ads", label: "Ads", icon: Megaphone },
  { to: "/admin/integrations", label: "Integrações", icon: Network },
  { to: "/admin/settings", label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside
      className="sidebar"
      style={{
        borderRight: "1px solid var(--stroke)",
        padding: "16px",
        overflow: "auto",

        // ✅ em mobile, 100vh dá ruim (barra do navegador muda)
        height: "100dvh",

        // ✅ tira o branco fixo (isso que está “estourando” no tema dark)
        background: "transparent",

        // ✅ evita “sombra”/padding somar no tamanho e dar sensação de bug
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 16,
          fontSize: "1rem",
          color: "var(--text-color, #fff)", // se sua UI é dark, força branco aqui
        }}
      >
        Alpha Group
      </div>

      <nav style={{ display: "grid", gap: 6 }}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `panel ${isActive ? "active" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              textDecoration: "none",
              color: "inherit",
              transition: "background 0.2s ease",
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",

            }}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
