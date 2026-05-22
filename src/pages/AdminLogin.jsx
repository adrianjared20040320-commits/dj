import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import api from "../lib/axios.js";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Ingresa tus credenciales."); return; }

    setLoading(true);
    try {
      await api.post("/api/auth/login", {
        email: DOMPurify.sanitize(form.email.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
        password: form.password,
      });
      navigate("/admin");
    } catch (err) {
      const msg = err.response?.data?.error || "Error al iniciar sesión.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--black)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {/* FONDO */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "3rem",
              fontWeight: 300,
              color: "var(--gold)",
              letterSpacing: "0.05em",
              lineHeight: 1,
            }}
          >
            GDL
          </div>
          <div
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginTop: "4px",
            }}
          >
            Panel de administración
          </div>
        </div>

        {/* CARD */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "2.5rem",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 300,
              marginBottom: "1.75rem",
              color: "var(--text)",
            }}
          >
            Iniciar sesión
          </h1>

          {error && (
            <div
              style={{
                background: "rgba(229,115,115,0.1)",
                border: "1px solid rgba(229,115,115,0.3)",
                borderRadius: "6px",
                padding: "0.875rem 1rem",
                marginBottom: "1.25rem",
                fontSize: "0.875rem",
                color: "#E57373",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="field">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@dominio.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                maxLength={128}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Verificando…" : "Entrar"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <a href="/" style={{ color: "var(--gold-dim)" }}>← Volver al sitio</a>
        </p>
      </div>
    </div>
  );
}
