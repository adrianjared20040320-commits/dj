import { useState } from "react";

const faqs = [
  {
    q: "¿Cuánto tiempo de anticipación necesito para reservar?",
    a: "Recomendamos reservar con al menos 3 semanas de anticipación para fechas regulares. Para fechas de alta demanda (diciembre, semana santa, puentes) sugerimos hacerlo con 1 a 2 meses de antelación.",
  },
  {
    q: "¿Qué incluye el precio base?",
    a: "El precio base cubre 5 horas de servicio con DJ profesional, equipo de sonido calibrado para el espacio e iluminación básica. El paquete Premium agrega show de luces LED completo y cabina personalizada GDL.",
  },
  {
    q: "¿Cómo se calculan las horas adicionales?",
    a: "Cada hora adicional a las 5 del paquete base tiene un costo de $1,200 MXN. Puedes especificar el número de horas en el formulario de cotización y el precio se calcula automáticamente.",
  },
  {
    q: "¿Hacen eventos fuera de CDMX?",
    a: "Sí. Para eventos en Estado de México y zona metropolitana cotizamos sin problema. Para interior de la república evaluamos cada caso; incluye traslado y hospedaje. Contáctanos para más detalles.",
  },
  {
    q: "¿Puedo personalizar el repertorio musical?",
    a: "Por supuesto. En todos los paquetes trabajamos con el cliente para definir géneros, épocas y canciones específicas. Puedes enviar una lista de canciones obligatorias y canciones prohibidas.",
  },
  {
    q: "¿Qué pasa si hay problemas técnicos el día del evento?",
    a: "Contamos con equipo de respaldo para las situaciones más críticas. En más de 200 eventos no hemos tenido una interrupción mayor, pero siempre llegamos con margen de tiempo para pruebas de sonido.",
  },
  {
    q: "¿Cuándo y cómo se realiza el pago?",
    a: "Solicitamos un anticipo del 50% para confirmar la fecha (vía transferencia bancaria o Mercado Pago). El saldo restante se liquida el día del evento antes de iniciar el servicio.",
  },
];

export default function FAQs() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" style={{ padding: "100px 0", background: "var(--surface)" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "80px",
            alignItems: "start",
          }}
          className="faq-grid"
        >
          {/* LEFT */}
          <div style={{ position: "sticky", top: "100px" }}>
            <span className="section-label">Preguntas frecuentes</span>
            <h2 className="section-title">
              Todo lo que
              <br />
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>necesitas saber</em>
            </h2>
            <span className="gold-line" />
            <p style={{ color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.8 }}>
              Si tu pregunta no está aquí, escríbenos directamente.
            </p>
            <a href="#contacto" className="btn-outline" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
              Hacer otra pregunta
            </a>
          </div>

          {/* RIGHT — ACCORDION */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.5rem 0",
                    textAlign: "left",
                    color: open === i ? "var(--gold)" : "var(--text)",
                    transition: "color 0.2s",
                  }}
                >
                  <span style={{ fontSize: "0.95rem", fontWeight: 400, lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  <span
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--gold)",
                      flexShrink: 0,
                      transition: "transform 0.3s",
                      transform: open === i ? "rotate(45deg)" : "rotate(0)",
                      display: "inline-block",
                    }}
                  >
                    +
                  </span>
                </button>

                {open === i && (
                  <div
                    style={{
                      paddingBottom: "1.5rem",
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.8,
                      fontWeight: 300,
                      animation: "fadeUp 0.3s ease both",
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .faq-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
