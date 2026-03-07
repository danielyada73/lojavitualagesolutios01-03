import { useState } from "react";
import { api } from "@/dashboard/lib/api";
import StatsBox from "./UI/StatsBox";

export default function CompetitorsSearch() {
  const [q, setQ] = useState("creatina");
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(2);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/search-competitors", {
        params: { q, limit, pages }
      });
      setData(data);
    } catch (e) {
      setData({ ok:false, error: e.response?.data || e.message });
    } finally {
      setLoading(false);
    }
  };

  const exportCsvUrl =
    `${import.meta.env.VITE_API_BASE}/export/competitors.csv?q=${encodeURIComponent(q)}&limit=${limit}&pages=${pages}`;

  return (
    <div className="card">
      <h2>Concorrentes (público)</h2>
      <div className="row">
        <div style={{flex:2}}>
          <label>Busca (q)</label>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="ex.: creatina"/>
        </div>
        <div>
          <label>limit</label>
          <input type="number" value={limit} onChange={e=>setLimit(e.target.value)} />
        </div>
        <div>
          <label>pages</label>
          <input type="number" value={pages} onChange={e=>setPages(e.target.value)} />
        </div>
      </div>
      <div style={{marginTop:10}}>
        <button className="primary" onClick={search}>Buscar</button>
        <a className="link" style={{marginLeft:12}} href={exportCsvUrl}>Exportar CSV</a>
      </div>

      {loading && <p className="small">Carregando…</p>}
      {data?.stats && <StatsBox stats={data.stats} />}
      {data?.items && (
        <div className="card" style={{marginTop:12}}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th><th>Título</th><th>Preço</th><th>Moeda</th><th>Seller</th><th>Link</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map(it=>(
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.title}</td>
                  <td>{it.price}</td>
                  <td>{it.currency_id}</td>
                  <td>{it.seller_id}</td>
                  <td><a className="link" href={it.permalink} target="_blank">ver</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data?.error && <p className="small">Erro: {JSON.stringify(data.error)}</p>}
    </div>
  );
}
