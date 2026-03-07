import React from 'react';
import ConnectCard from './ConnectCard';
import { PROVIDER_LIST } from '@/dashboard/lib/providers';

export default function PlatformGrid(){
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
      {PROVIDER_LIST.map(p => <ConnectCard key={p.key} provider={p} />)}
    </div>
  );
}
