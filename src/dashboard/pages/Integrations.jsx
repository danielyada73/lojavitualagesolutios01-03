import React from 'react';
import PlatformGrid from '@/dashboard/components/integrations/PlatformGrid';

export default function Integrations(){
  return (
    <div style={{ display:'grid', gap:16 }}>
      <div className="panel">
        <div style={{ fontWeight:700, fontSize:18 }}>Integrações</div>
        <div className="muted">Conecte suas lojas e marketplaces.</div>
      </div>
      <PlatformGrid />
    </div>
  );
}
