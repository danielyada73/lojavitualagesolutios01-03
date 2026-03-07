import {
  LineChart as RC,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function LineChart({ data = [], xKey = "date", yKey = "value" }) {
  const HEIGHT = 320;

  return (
    <div className="panel" style={{ minWidth: 0, height: HEIGHT }}>
      <ResponsiveContainer width="100%" height={HEIGHT}>
        <RC data={data}>
          <CartesianGrid stroke="rgba(255,255,255,.07)" />
          <XAxis dataKey={xKey} stroke="var(--muted)" />
          <YAxis stroke="var(--muted)" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="var(--accent)"
            strokeWidth={2}
            dot={false}
          />
        </RC>
      </ResponsiveContainer>
    </div>
  );
}
