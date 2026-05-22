import { useState, useEffect } from "react";
import api from "../lib/axios.js";

// Productos de ejemplo mientras carga la API
const PLACEHOLDER_PRODUCTS = [
  {
    _id: "1",
    name: "Cabina Blackout Pro",
    price: 18500,
    description: "Cabina de DJ en vinil negro mate con iluminación LED integrada. Estructura reforzada, perfecta para eventos de mediana a gran escala.",
    dimensions: "120 × 60 × 100 cm",
    tags: ["profesional", "led", "negro"],
    colors: ["Negro mate", "Negro brillante"],
    deliveryOptions: { homeDelivery: true, freeZoneKm: 5 },
    customMeasures: true,
  },
  {
    _id: "2",
    name: "Cabina Ivory Edition",
    price: 16000,
    description: "Acabado en blanco perlado con detalles en oro. Diseñada para bodas y eventos de gala. Incluye porta-monitor y porta-laptop.",
    dimensions: "110 × 55 × 95 cm",
    tags: ["boda", "elegante", "blanco"],
    colors: ["Blanco perla", "Champagne"],
    deliveryOptions: { homeDelivery: true, freeZoneKm: 5 },
    customMeasures: false,
  },
  {
    _id: "3",
    name: "Cabina Compact Tour",
    price: 9800,
    description: "Modelo plegable y ligero para movilidad máxima. Ideal para quien necesita montar y desmontar en minutos.",
    dimensions: "90 × 50 × 85 cm",
    tags: ["compacta", "plegable", "transporte"],
    colors: ["Negro", "Madera oscura"],
    deliveryOptions: { homeDelivery: true, freeZoneKm: 5 },
    customMeasures: false,
  },
];

function formatPrice(n) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

export default function Products() {
  const [products, setProducts] = useState(PLACEHOLDER_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/products")
      .then((res) => {
        if (res.data?.data?.length > 0) setProducts(res.data.data);
      })
      .catch(() => {}) // usa placeholders si la API no responde
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="productos" style={{ padding: "100px 0", background: "var(--surface)" }}>
      <div className="container">
        {/* HEADER */}
        <div style={{ marginBottom: "56px" }}>
          <span className="section-label">Catálogo</span>
          <h2 className="section-title">
            Cabinas
            <em style={{ fontStyle: "italic", color: "var(--gold)" }}> a la medida</em>
          </h2>
          <span className="gold-line" />
          <p style={{ color: "var(--text-muted)", maxWidth: "460px", fontWeight: 300 }}>
            Fabricamos y rentamos cabinas de DJ personalizadas. Cada pieza es construida según tus especificaciones de color, dimensión y acabado.
          </p>
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {products.map((p) => (
            <article
              key={p._id}
              style={{
                background: "var(--black)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "border-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* IMAGEN PLACEHOLDER */}
              <div
                style={{
                  height: "200px",
                  background: `linear-gradient(135deg, var(--surface) 0%, rgba(201,168,76,0.08) 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "4rem",
                    color: "rgba(201,168,76,0.15)",
                    fontWeight: 300,
                    userSelect: "none",
                  }}
                >
                  GDL
                </span>
              </div>

              {/* INFO */}
              <div style={{ padding: "1.5rem" }}>
                {/* TAGS */}
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  {p.tags?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "0.6rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        background: "rgba(201,168,76,0.1)",
                        color: "var(--gold-dim)",
                        borderRadius: "2px",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 300,
                    color: "var(--text)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {p.name}
                </h3>

                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    marginBottom: "1rem",
                    fontWeight: 300,
                  }}
                >
                  {p.description}
                </p>

                {/* DETAILS */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1.25rem" }}>
                  {p.dimensions && (
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      📐 {p.dimensions}
                    </span>
                  )}
                  {p.colors?.length > 0 && (
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      🎨 {p.colors.join(", ")}
                    </span>
                  )}
                  {p.customMeasures && (
                    <span style={{ fontSize: "0.78rem", color: "var(--gold-dim)" }}>
                      ✦ Medidas personalizadas disponibles
                    </span>
                  )}
                </div>

                {/* PRICE + CTA */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      color: "var(--gold)",
                      fontWeight: 400,
                    }}
                  >
                    {formatPrice(p.price)}
                  </span>
                  <a href="#contacto" className="btn-outline" style={{ padding: "0.5rem 1.25rem", fontSize: "0.7rem" }}>
                    Consultar
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* NOTE */}
        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Zona de entrega gratuita: 5 km a la redonda · CDMX: $200 · Interior de la república: cotización
        </p>
      </div>
    </section>
  );
}
