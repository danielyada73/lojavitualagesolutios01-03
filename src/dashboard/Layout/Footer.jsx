import { useEffect, useState } from "react";
import { api } from "@/dashboard/lib/api.js";

export default function Footer() {
  const frontVersion = import.meta.env.VITE_APP_VERSION ?? "dev";
  const [apiVersion, setApiVersion] = useState("…"); // loading
  const [apiOk, setApiOk] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await api.get("/health");
        const v = res.data?.version ?? "unknown";
        if (alive) {
          setApiVersion(v);
          setApiOk(true);
        }
      } catch {
        if (alive) {
          setApiVersion("offline");
          setApiOk(false);
        }
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <footer
      style={{
        textAlign: "center",
        padding: "12px 0",
        fontSize: 12,
        color: "var(--muted)",
        opacity: 0.75,
      }}
    >
      Alpha Group • Front v{frontVersion} • API v{apiVersion}
      {!apiOk ? " (offline)" : ""}
    </footer>
  );
}
