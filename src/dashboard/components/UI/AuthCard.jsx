import { useState } from "react";
import api from "../api";

export default function AuthCard() {
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(false);

  const openAuth = () => {
    // abre o fluxo OAuth do teu backend
    window.open(`${import.meta.env.VITE_API_BASE}/auth/ml`, "_blank");
  };

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/ml/tokens");
      setTokens(data);
    } catch (e) {
      setTokens({ ok:false, error: e.response?.data || e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Conexão Mercado Livre (OAuth + PKCE)</h2>
      <div className="row">
        <button className="primary" onClick={openAuth}>Conectar / Autorizar</button>
        <button onClick={fetchTokens}>Ver Tokens</button>
      </div>
      <div className="small" style={{marginTop:8}}>
        Base API: {import.meta.env.VITE_API_BASE}
      </div>
      {loading && <p className="small">Carregando…</p>}
      {tokens && (
        <pre className="small" style={{whiteSpace:"pre-wrap"}}>
{JSON.stringify(tokens, null, 2)}
        </pre>
      )}
    </div>
  );
}
