const packages = [
  {
    id: "dj",
    tag: "Paquete esencial",
    name: "DJ",
    price: "$5,500",
    suffix: "/ 5 horas base",
    desc: "Ideal para bodas, XV años y celebraciones íntimas. Sonido profesional y sets diseñados para tu evento.",
    features: [
      "DJ profesional por 5 horas",
      "Equipo de sonido premium",
      "Iluminación básica incluida",
      "Repertorio personalizado",
      "Horas adicionales: $1,200 c/u",
    ],
    cta: "Contratar DJ",
    highlight: false,
  },
  {
    id: "premium",
    tag: "Más popular",
    name: "Premium",
    price: "$7,500",
    suffix: "/ 5 horas base",
    desc: "Producción completa para eventos grandes. Cabina personalizada, luces de espectáculo y gestión total del ambiente.",
    features: [
      "DJ profesional por 5 horas",
      "Producción de sonido avanzada",
      "Show de luces LED completo",
      "Cabina personalizada GDL",
      "Coordinación de ambiente",
      "Horas adicionales: $1,200 c/u",
    ],
    cta: "Contratar Premium",
    highlight: true,
  },
  {
    id: "cotizar",
    tag: "A tu medida",
    name: "Cotización",
    price: "Personalizado",
    suffix: "",
    desc: "Eventos corporativos, festivales o producciones especiales. Cuéntanos qué necesitas y armamos el paquete ideal.",
    features: [
      "Evaluación sin costo",
      "Propuesta en 24 horas",
      "Equipo escalable",
      "Integración con otros proveedores",
      "Soporte técnico incluido",
    ],
    cta: "Solicitar cotización",
    highlight: false,
  },
];

// Recargos por número de invitados (del modelo)
const surcharges = [
  { range: "10 – 100", extra: "Incluido" },
  { range: "100 – 200", extra: "+ $3,000" },
  { range: "200 – 300", extra: "+ $5,500" },
  { range: "300+", extra: "+ $7,500" },
];

export default function Services() {
  return (
    <section id="servicios" style={{ padding: "120px 0 80px", background: "var(--black)" }}>
      <div className="container">
        {/* HEADER */}
        <div style={{ marginBottom: "64px" }}>
          <span className="section-label">Servicios</span>
          <h2 className="section-title">
            Elige el paquete
            <br />
            <em style={{ fontStyle: "italic", color: "var(--gold)" }}>para tu evento</em>
          </h2>
          <span className="gold-line" />
          <p style={{ color: "var(--text-muted)", maxWidth: "480px", fontWeight: 300 }}>
            Todos los paquetes incluyen 5 horas base. Las horas adicionales se calculan automáticamente al cotizar.
          </p>
        </div>

        {/* CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            alignItems: "stretch",
          }}
        >
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                background: pkg.highlight ? "rgba(201,168,76,0.06)" : "var(--surface)",
                border: `1px solid ${pkg.highlight ? "rgba(201,168,76,0.4)" : "var(--border)"}`,
                borderRadius: "8px",
                padding: "2.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "border-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = pkg.highlight
                  ? "rgba(201,168,76,0.4)"
                  : "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* TAG */}
              <span
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: pkg.highlight ? "var(--gold)" : "var(--text-muted)",
                  fontWeight: 500,
                  marginBottom: "1rem",
                }}
              >
                {pkg.tag}
              </span>

              {/* NAME */}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.5rem",
                  fontWeight: 300,
                  color: "var(--text)",
                  marginBottom: "0.5rem",
                }}
              >
                {pkg.name}
              </h3>

              {/* PRICE */}
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    fontWeight: 400,
                    color: "var(--gold)",
                  }}
                >
                  {pkg.price}
                </span>
                {pkg.suffix && (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      marginLeft: "0.4rem",
                    }}
                  >
                    {pkg.suffix}
                  </span>
                )}
              </div>

              {/* DESC */}
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                  fontWeight: 300,
                }}
              >
                {pkg.desc}
              </p>

              {/* DIVIDER */}
              <div
                style={{
                  height: "1px",
                  background: "var(--border)",
                  marginBottom: "1.5rem",
                }}
              />

              {/* FEATURES */}
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
                {pkg.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-muted)",
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>—</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#evento"
                style={{ marginTop: "2rem" }}
                className={pkg.highlight ? "btn-primary" : "btn-outline"}
              >
                {pkg.cta}
              </a>
            </div>
          ))}
        </div>

        {/* TABLA RECARGOS */}
        <div
          style={{
            marginTop: "3rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "1.25rem",
              fontWeight: 500,
            }}
          >
            Recargo por número de invitados
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {surcharges.map((s) => (
              <div
                key={s.range}
                style={{
                  padding: "1rem",
                  background: "var(--surface-2)",
                  borderRadius: "4px",
                  borderLeft: "2px solid var(--gold-dim)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    marginBottom: "0.25rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.range} personas
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                    color: s.extra === "Incluido" ? "var(--gold)" : "var(--text)",
                  }}
                >
                  {s.extra}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
