export default function StatsBox({ stats }) {
  if (!stats) return null;
  const rows = [
    ["count", stats.count],
    ["mean", stats.mean],
    ["median", stats.median],
    ["p25", stats.p25],
    ["p75", stats.p75],
    ["min", stats.min],
    ["max", stats.max],
  ];
  return (
    <div className="card">
      <h2>Estatísticas de Preço</h2>
      <div className="row" style={{gap:8}}>
        {rows.map(([k,v]) => (
          <span key={k} className="badge">{k}: {v}</span>
        ))}
      </div>
    </div>
  );
}
