export default function DateRange() {
  // simples por enquanto (podes evoluir depois)
  const today = new Date().toISOString().slice(0, 10);
  const thirty = new Date(Date.now() - 30 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);

  return (
    <div className="panel" style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input
        className="input"
        type="date"
        name="startDate"
        defaultValue={thirty}
      />
      <span>→</span>
      <input
        className="input"
        type="date"
        name="endDate"
        defaultValue={today}
      />
    </div>
  );
}
