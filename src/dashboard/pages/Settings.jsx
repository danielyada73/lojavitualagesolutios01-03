// src/pages/Settings.jsx
import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "@/dashboard/lib/api";
import { loadDashboardState, saveDashboardState } from "@/dashboard/lib/dashboardStore";

const LS = {
  mlUserId: "ml_user_id",
  apiUrl: "VITE_API_URL_OVERRIDE", // override local (não mexe no .env)
};

function getLS(key, fallback = "") {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function setLS(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function delLS(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

function clampNumber(v, fallback = 0) {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

export default function Settings() {
  // ML user_id
  const [mlUserId, setMlUserId] = useState(() => getLS(LS.mlUserId, ""));

  // custo unitário (vem do dashboardStore)
  const [unitCost, setUnitCost] = useState(() => loadDashboardState().defaultUnitCost ?? 22);

  // API override (opcional)
  const [apiOverride, setApiOverride] = useState(() => getLS(LS.apiUrl, ""));

  const effectiveApi = useMemo(() => apiOverride || API_BASE, [apiOverride]);

  // persiste custo unitário dentro do dashboardStore
  useEffect(() => {
    const s = loadDashboardState();
    saveDashboardState({ ...s, defaultUnitCost: clampNumber(unitCost, 22) });
  }, [unitCost]);

  function saveMlUserId() {
    const v = String(mlUserId || "").trim();
    if (!v) return;
    setLS(LS.mlUserId, v);
    alert("✅ ml_user_id salvo!");
  }

  function clearMlUserId() {
    delLS(LS.mlUserId);
    setMlUserId("");
    alert("🧹 ml_user_id removido!");
  }

  function saveApiOverride() {
    const v = String(apiOverride || "").trim();
    if (!v) {
      delLS(LS.apiUrl);
      alert("✅ API override removido (voltou para padrão).");
      return;
    }
    setLS(LS.apiUrl, v);
    alert("✅ API override salvo. Recarregue a página.");
  }

  function resetDashboard() {
    // apaga só o dashboard (chave do store)
    try {
      localStorage.removeItem("alpha_dashboard_state_v1");
    } catch {}
    alert("🧹 Dashboard resetado. Recarregue a página.");
  }

  function startOAuth() {
    // abre a rota do backend (via API efetiva)
    window.location.href = `${effectiveApi}/auth/ml`;
  }

  return (
    <div className="panel" style={{ padding: 16, display: "grid", gap: 14 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 900 }}>Configurações</div>
        <div className="small" style={{ opacity: 0.85 }}>
          Salva preferências locais do painel e integrações.
        </div>
      </div>

      {/* Integração Mercado Livre */}
      <div className="panel" style={{ padding: 14, display: "grid", gap: 10 }}>
        <div style={{ fontWeight: 800 }}>Mercado Livre</div>

        <div className="small" style={{ opacity: 0.85 }}>
          ml_user_id (usado para puxar dados no backend)
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            placeholder="ex: 2315864495"
            value={mlUserId}
            onChange={(e) => setMlUserId(e.target.value)}
            style={{ width: 240 }}
          />
          <button className="btn" onClick={saveMlUserId}>Salvar</button>
          <button className="btn" onClick={clearMlUserId}>Remover</button>
          <button className="btn" onClick={startOAuth}>Login / OAuth</button>
        </div>

        <div className="small" style={{ opacity: 0.75 }}>
          API atual: <b>{effectiveApi}</b>
        </div>
      </div>

      {/* Custos */}
      <div className="panel" style={{ padding: 14, display: "grid", gap: 10 }}>
        <div style={{ fontWeight: 800 }}>Custos / Produção</div>
        <div className="small" style={{ opacity: 0.85 }}>
          Custo unitário padrão usado no Dashboard (auto cost).
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={unitCost}
            onChange={(e) => setUnitCost(clampNumber(e.target.value, 0))}
            inputMode="decimal"
            style={{ width: 120 }}
          />
          <div className="small" style={{ opacity: 0.8 }}>
            (salva automaticamente)
          </div>
        </div>
      </div>

      {/* API override (opcional) */}
      <div className="panel" style={{ padding: 14, display: "grid", gap: 10 }}>
        <div style={{ fontWeight: 800 }}>API (opcional)</div>
        <div className="small" style={{ opacity: 0.85 }}>
          Se você quiser apontar o front para outro backend (ngrok/VPS). Deixe vazio para usar o padrão.
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            placeholder="ex: https://xxxx.ngrok-free.app"
            value={apiOverride}
            onChange={(e) => setApiOverride(e.target.value)}
            style={{ width: 360, maxWidth: "100%" }}
          />
          <button className="btn" onClick={saveApiOverride}>Salvar</button>
        </div>

        <div className="small" style={{ opacity: 0.75 }}>
          Efetivo: <b>{effectiveApi}</b>
        </div>
      </div>

      {/* Ações */}
      <div className="panel" style={{ padding: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn" onClick={resetDashboard}>Resetar Dashboard</button>
      </div>
    </div>
  );
}
