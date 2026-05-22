export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--black)",
        borderTop: "1px solid var(--border)",
        padding: "64px 0 32px",
      }}
    >
      <div className="container">
        {/* TOP */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "48px",
            marginBottom: "48px",
          }}
          className="footer-grid"
        >
          {/* BRAND */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.5rem",
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
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginTop: "4px",
                marginBottom: "1.25rem",
              }}
            >
              Gustavo Delgadillo
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "280px", fontWeight: 300, lineHeight: 1.7 }}>
              DJ profesional y producción de eventos en CDMX. Música, ambiente y experiencias que no se olvidan.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              {["Instagram", "Facebook", "TikTok"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "1px solid var(--border)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.05em",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--gold)";
                    e.currentTarget.style.color = "var(--gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* NAV */}
          <div>
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: "1.25rem",
                fontWeight: 500,
              }}
            >
              Sitio
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { label: "Inicio", href: "#inicio" },
                { label: "Servicios", href: "#servicios" },
                { label: "Productos", href: "#productos" },
                { label: "Contratar", href: "#evento" },
                { label: "FAQ", href: "#faq" },
                { label: "Contacto", href: "#contacto" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-muted)",
                      transition: "color 0.2s",
                      fontWeight: 300,
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "var(--gold)")}
                    onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: "1.25rem",
                fontWeight: 500,
              }}
            >
              Contacto
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "WhatsApp", value: "+52 55 1234 5678" },
                { label: "Email", value: "contacto@GustavoDelgadillo.com" },
                { label: "Ciudad", value: "CDMX, México" },
              ].map((c) => (
                <li key={c.label}>
                  <div style={{ fontSize: "0.65rem", color: "var(--gold-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.15rem", fontWeight: 300 }}>
                    {c.value}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          style={{
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 300 }}>
            © {year} Gustavo Delgadillo. Todos los derechos reservados.
          </p>
          <a
            href="/admin/login"
            style={{ fontSize: "0.7rem", color: "var(--text-muted)", opacity: 0.4, transition: "opacity 0.2s" }}
            onMouseEnter={(e) => (e.target.style.opacity = "1")}
            onMouseLeave={(e) => (e.target.style.opacity = "0.4")}
          >
            Admin
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </footer>
  );
}
