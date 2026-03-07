import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { AuthContext } from "./auth-context";

const STORAGE_KEY = "alpha_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token) {
          setToken(parsed.token);
          setUser(parsed.user ?? { name: "Usuário" });
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete api.defaults.headers.common.Authorization;
  }, [token]);

  async function login({ email, password }) {
    const res = await api.post("/auth/login", { email, password });
    const nextToken = res.data?.token;
    const nextUser = res.data?.user;

    if (!nextToken) throw new Error("Token ausente no login.");

    setToken(nextToken);
    setUser(nextUser ?? { email });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser ?? { email } })
    );
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: !!token, login, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
