const reviews = [
  {
    name: "Karla Martínez",
    event: "Boda · Octubre 2024",
    rating: 5,
    text: "Gustavo superó todas nuestras expectativas. La música estuvo perfecta durante toda la noche, supo leer al público y mantener el ambiente increíble. Altamente recomendado.",
  },
  {
    name: "Luis Hernández",
    event: "Cumpleaños 40 · Agosto 2024",
    rating: 5,
    text: "Profesional desde el primer contacto. La cabina que nos rentó era espectacular y el sonido impresionante. Fue la mejor fiesta que hemos hecho. Ya lo tenemos agendado para el próximo año.",
  },
  {
    name: "Sofía Ramírez",
    event: "Evento corporativo · Mayo 2024",
    rating: 5,
    text: "Lo contratamos para el evento anual de nuestra empresa. Puntual, discreto y con un set list adaptado perfecto para el ambiente de negocios. El equipo de sonido excelente.",
  },
  {
    name: "Diego & Ana Torres",
    event: "XV Años · Marzo 2024",
    rating: 5,
    text: "Desde la cotización hasta el final del evento, todo fue perfecto. Gustavo es muy atento y cuidó cada detalle. La pista de baile nunca se vació. ¡Gracias!",
  },
];

function Stars({ count }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < count ? "var(--gold)" : "var(--border)", fontSize: "0.85rem" }}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="resenas" style={{ padding: "100px 0", background: "var(--black)" }}>
      <div className="container">
        {/* HEADER */}
        <div style={{ marginBottom: "56px", textAlign: "center" }}>
          <span className="section-label" style={{ justifyContent: "center", display: "flex" }}>Reseñas</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>
            Lo que dicen
            <br />
            <em style={{ fontStyle: "italic", color: "var(--gold)" }}>nuestros clientes</em>
          </h2>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span className="gold-line" />
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1.25rem",
              background: "rgba(201,168,76,0.08)",
              border: "1px solid var(--border)",
              borderRadius: "40px",
              marginTop: "0.5rem",
            }}
          >
            <span style={{ color: "var(--gold)", fontSize: "1rem" }}>★★★★★</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>4.9 en Google Business</span>
          </div>
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {reviews.map((r, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <Stars count={r.rating} />
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  flex: 1,
                  fontStyle: "italic",
                }}
              >
                "{r.text}"
              </p>
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: "1rem",
                }}
              >
                <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)" }}>{r.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--gold-dim)", marginTop: "0.15rem" }}>{r.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
