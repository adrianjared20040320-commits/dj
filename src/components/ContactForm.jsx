import { useState } from "react";
import DOMPurify from "dompurify";
import api from "../lib/axios.js";

function sanitize(val) {
  if (typeof val !== "string") return val;
  return DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nombre obligatorio";
    if (!/^\+?[0-9\s\-()]{7,20}$/.test(form.phone)) e.phone = "Teléfono inválido";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Correo inválido";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus("loading");
    try {
      const sanitized = { name: sanitize(form.name), phone: sanitize(form.phone), email: sanitize(form.email) };
      const res = await api.post("/api/contact", sanitized);
      setStatus("success");
      setMessage(res.data.message);
      setForm({ name: "", phone: "", email: "" });
    } catch (err) {
      setStatus("error");
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) { setErrors(serverErrors); setStatus(null); return; }
      setMessage(err.response?.data?.error || "Error al enviar. Intenta de nuevo.");
    }
  };

  return (
    <section id="contacto" style={{ padding: "100px 0", background: "var(--surface)" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
          className="contact-grid"
        >
          {/* LEFT */}
          <div>
            <span className="section-label">Contacto</span>
            <h2 className="section-title">
              Hablemos de
              <br />
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>tu proyecto</em>
            </h2>
            <span className="gold-line" />
            <p style={{ color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.8 }}>
              ¿Tienes dudas rápidas o quieres explorar opciones? Déjanos tus datos y te contactamos a la brevedad.
            </p>

            <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "WhatsApp", value: "+52 55 1234 5678", href: "https://wa.me/5215512345678" },
                { label: "Correo", value: "contacto@GustavoDelgadillo.com", href: "mailto:contacto@GustavoDelgadillo.com" },
                { label: "Instagram", value: "@gdl.eventos", href: "https://instagram.com" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "1rem 1.25rem",
                    background: "var(--black)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "var(--gold)", marginTop: "0.2rem" }}>{item.value}</span>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT — FORM */}
          <div
            style={{
              background: "var(--black)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "2.5rem",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 300,
                marginBottom: "1.5rem",
              }}
            >
              Consulta rápida
            </h3>

            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✓</div>
                <div style={{ color: "var(--gold)", fontWeight: 500, marginBottom: "0.5rem" }}>¡Mensaje recibido!</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{message}</div>
                <button
                  onClick={() => setStatus(null)}
                  className="btn-outline"
                  style={{ marginTop: "1.5rem" }}
                >
                  Enviar otro
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {status === "error" && (
                  <div style={{ padding: "0.875rem 1rem", background: "rgba(229,115,115,0.1)", border: "1px solid rgba(229,115,115,0.3)", borderRadius: "6px", fontSize: "0.875rem", color: "#E57373" }}>
                    {message}
                  </div>
                )}

                <div className="field">
                  <label>Nombre</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" autoComplete="name" />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="field">
                  <label>Teléfono</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+52 55 1234 5678" autoComplete="tel" />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>

                <div className="field">
                  <label>Correo electrónico</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@correo.com" autoComplete="email" />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    opacity: status === "loading" ? 0.6 : 1,
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                  }}
                >
                  {status === "loading" ? "Enviando…" : "Enviar mensaje"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
