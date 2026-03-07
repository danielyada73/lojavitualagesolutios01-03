// src/components/Layout/NowPill.jsx
import { useEffect, useMemo, useState } from "react";

function formatNow(d) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

async function fetchTempOpenMeteo(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m&timezone=America%2FSao_Paulo`;

  const r = await fetch(url);
  if (!r.ok) throw new Error("Weather fetch failed");
  const data = await r.json();
  const t = data?.current?.temperature_2m;
  return typeof t === "number" ? t : null;
}

export default function NowPill() {
  const [now, setNow] = useState(() => new Date());
  const [temp, setTemp] = useState(null);
  const [tempErr, setTempErr] = useState(false);

  const label = useMemo(() => formatNow(now), [now]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 10); // a cada 10s
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // tenta buscar temperatura 1x e depois a cada 30min
    let cancelled = false;

    const run = async () => {
      try {
        setTempErr(false);

        // cache simples (evita bater toda hora)
        const cached = JSON.parse(localStorage.getItem("weather_cache") || "null");
        const fresh = cached && Date.now() - cached.ts < 30 * 60 * 1000;

        if (fresh) {
          setTemp(cached.temp);
          return;
        }

        if (!navigator.geolocation) throw new Error("no geolocation");

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const t = await fetchTempOpenMeteo(pos.coords.latitude, pos.coords.longitude);
              if (cancelled) return;
              setTemp(t);

              localStorage.setItem(
                "weather_cache",
                JSON.stringify({ ts: Date.now(), temp: t })
              );
            } catch {
              if (!cancelled) setTempErr(true);
            }
          },
          () => {
            if (!cancelled) setTempErr(true);
          },
          { enableHighAccuracy: false, timeout: 6000, maximumAge: 30 * 60 * 1000 }
        );
      } catch {
        if (!cancelled) setTempErr(true);
      }
    };

    run();
    const interval = setInterval(run, 30 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: "10px 14px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(20,20,25,0.55)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        color: "rgba(255,255,255,0.9)",
        minWidth: 260,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <strong style={{ fontSize: 14 }}>{label}</strong>
        <span style={{ fontSize: 12, opacity: 0.7 }}>Agora</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.1 }}>
        <strong style={{ fontSize: 14 }}>
          {tempErr ? "—" : temp == null ? "…" : `${temp.toFixed(0)}°C`}
        </strong>
        <span style={{ fontSize: 12, opacity: 0.7 }}>Temperatura</span>
      </div>
    </div>
  );
}
