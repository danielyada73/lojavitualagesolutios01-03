// src/App.jsx (se ainda for manter por algum motivo)
import "./styles/global.css";
import AuthCard from "./components/AuthCard";
import CompetitorsSearch from "./components/CompetitorsSearch";
import MyItems from "./components/MyItems";
import Visits from "./components/Visits";

export default function App() {
  return (
    <main className="app-main">
      <h1>ML Dashboard – Alpha</h1>
      <p className="small">
        Use os blocos abaixo para autenticar, analisar concorrentes, listar anúncios e consultar visitas.
      </p>

      <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
        <AuthCard />
        <CompetitorsSearch />
        <MyItems />
        <Visits />
      </div>
    </main>
  );
}
