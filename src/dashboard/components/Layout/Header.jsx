import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

/**
 * Pill simples para mostrar:
 * - data/hora (ao vivo)
 * - temperatura (placeholder por enquanto)
 *
 * Depois você pode plugar um endpoint /weather (ou navigator.geolocation + API),
 * mas por agora não depende de nada externo.
 */
function NowPill() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = useMemo(() => {
    return now.toLocaleString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [now]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.06)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        minWidth: 320,
        justifyContent: "space-between",
      }}
      title="Horário atual (temperatura será integrada depois)"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 12, opacity: 0.85 }}>Agora</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{formatted}</div>
      </div>

      <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.10)" }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
        <div style={{ fontSize: 12, opacity: 0.85 }}>Temperatura</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>
          --°C
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        gap: 24,
      }}
    >
      {/* Lado esquerdo: título + menu */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            Dashboard Alpha
          </div>
          <div className="small">Alpha Group</div>
        </div>

        {/* Menu de áreas */}
        <nav style={{ display: "flex", gap: 16 }}>
          <NavLink
            to="/admin/"
            className={({ isActive }) =>
              "header-tab" + (isActive ? " active" : "")
            }
          >
            Alpha Vendas
          </NavLink>

          <NavLink
            to="/admin/marketing"
            className={({ isActive }) =>
              "header-tab" + (isActive ? " active" : "")
            }
          >
            Alpha Marketing
          </NavLink>

          <NavLink
            to="/admin/fabricacao"
            className={({ isActive }) =>
              "header-tab" + (isActive ? " active" : "")
            }
          >
            Alpha Fabricação
          </NavLink>
        </nav>
      </div>

      {/* ✅ Lado direito: agora é data/hora + temperatura */}
      <NowPill />
    </header>
  );
}
