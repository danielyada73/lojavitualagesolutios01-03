import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/dashboard/lib/auth/user-auth.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    if (!email.trim()) return "Informe seu e-mail.";
    if (!email.includes("@")) return "E-mail inválido.";
    if (!password) return "Informe sua senha.";
    if (password.length < 6) return "Senha deve ter pelo menos 6 caracteres.";
    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setSubmitting(true);
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      setError("Falha no login. Verifique e-mail/senha ou backend offline.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div className="panel" style={{ width: 420, maxWidth: "100%", padding: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 20 }}>Alpha Group</div>
        <div className="muted" style={{ marginTop: 6 }}>
          Acesse a plataforma com seu e-mail e senha.
        </div>

        <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span className="muted">E-mail</span>
            <input
              className="input"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@empresa.com"
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span className="muted">Senha</span>
            <input
              className="input"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <div className="panel" style={{ padding: 10, border: "1px solid rgba(255,0,0,.25)" }}>
              <span style={{ color: "var(--text)" }}>{error}</span>
            </div>
          ) : null}

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
