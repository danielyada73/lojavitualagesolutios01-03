import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/dashboard/lib/auth/user-auth.js";


export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log("[ProtedRouter]",{ isAuthenticated, loading, path: location.pathname });

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div className="panel">Carregando…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
} 
