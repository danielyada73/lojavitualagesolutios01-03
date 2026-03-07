import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AlertCenter from "./AlertCenter";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-shell">
        <Header />

        <div className="app-alerts">
          <AlertCenter />
        </div>

        <main className="app-main">
          <Outlet />
        </main>

        {/* Footer sempre no final do layout autenticado */}
        <Footer />
      </div>
    </div>
  );
}
