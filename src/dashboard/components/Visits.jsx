import { useState } from "react";
import api from "@/dashboard/lib/api";

export default function Visits() {
  const [itemId, setItemId] = useState("");
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState("2025-01-31");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!itemId) {
      alert("Informe um item_id (ex.: MLB123...)");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/visits", {
        params: { item_id: itemId, from, to },
      });
      setData(response.data);
    } catch (e) {
      setData({
        ok: false,
        error: e.response?.data || e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Visitas do anúncio (privado)</h2>

      <div className="row">
        <div style={{ flex: 2 }}>
          <label>item_id</label>
          <input
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="MLBxxxxxxxxx"
          />
        </div>

        <div>
          <label>de</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div>
          <label>até</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <button className="primary" onClick={load}>
          Consultar
        </button>
      </div>

      {loading && <p className="small">Carregando…</p>}

      {data && (
        <pre className="small" style={{ whiteSpace: "pre-wrap", marginTop: 10 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
