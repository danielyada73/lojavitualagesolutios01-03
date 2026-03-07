import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConnectCard({ provider }) {
  const navigate = useNavigate();

  return (
    <div className="panel" style={{ border: `1px solid ${provider.color}`, display:'grid', gap:8 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <img src={provider.logo} alt={provider.name} width={28} height={28}/>
        <div style={{ fontWeight:700 }}>{provider.name}</div>
      </div>

      <div className="muted">Ligue sua conta {provider.name} para sincronizar anúncios, pedidos e métricas.</div>

      <div style={{ display:'flex', gap:8 }}>
        <button
          className="btn"
          style={{ background: provider.color, color: provider.textColor }}
          onClick={() => (window.location.href = provider.authUrl)}
        >
          Conectar
        </button>
        <button className="btn ghost" onClick={() => navigate(`/platform/${provider.key}`)}>
          Abrir
        </button>
      </div>
    </div>
  );
}
