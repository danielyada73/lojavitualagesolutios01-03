import { useParams } from "react-router-dom";
import { PROVIDERS } from "@/dashboard/lib/providers";
import AccountsTable from "@/dashboard/components/integrations/AccountsTable"; // <— caminho bate com o arquivo

export default function PlatformHome() {
  const { provider } = useParams();
  const meta = PROVIDERS[provider]; // ex.: { label: "Mercado Livre", ... }

  if (!meta) {
    return <div className="panel">Plataforma inválida: {provider}</div>;
  }

  // Mock para testar a tabela
  const mockedAccounts = [
    { id: "1", provider, nickname: "conta_demo", status: "OK", updatedAt: "2025-11-07 13:00" },
  ];

  return (
    <div className="stack page">
      <h1>{meta.label}</h1>
      <p>{meta.description}</p>

      <div style={{ display: 'flex', gap: 12 }}>
        <a className="btn" href={meta.authUrl}>Conectar conta</a>
        <a className="btn secondary" href="/integrations">Voltar para Integrações</a>
      </div>

      <AccountsTable accounts={mockedAccounts} />
    </div>
  );
}
