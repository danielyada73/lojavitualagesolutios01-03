// src/components/integrations/AccountsTable.jsx
export default function AccountsTable({ accounts = [] }) {
  if (!accounts.length) {
    return (
      <div className="panel">
        <strong>Nenhuma conta conectada ainda.</strong>
        <p>Use o botão “Conectar conta” para iniciar o OAuth.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Plataforma</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Usuário</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Atualizado</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id}>
              <td style={{ padding: 8 }}>{a.provider}</td>
              <td style={{ padding: 8 }}>{a.nickname}</td>
              <td style={{ padding: 8 }}>{a.status}</td>
              <td style={{ padding: 8 }}>{a.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
