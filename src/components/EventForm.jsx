import { useEventForm } from "../hooks/useEventForm.js";

const PACKAGES = [
  { value: "dj", label: "DJ — $5,500 base" },
  { value: "premium", label: "Premium — $7,500 base" },
  { value: "cotizar", label: "Cotización personalizada" },
];

function Field({ label, error, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

// Fecha mínima: mañana
function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function EventForm() {
  const { form, isSubmitting, submitResult, onSubmit } = useEventForm();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <section
      id="evento"
      style={{
        padding: "100px 0",
        background: "var(--black)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* FONDO DECORATIVO */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: "10%",
          width: "40%",
          height: "80%",
          background: "radial-gradient(ellipse at right, rgba(201,168,76,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "start",
          }}
          className="event-grid"
        >
          {/* LEFT — COPY */}
          <div>
            <span className="section-label">Contratar</span>
            <h2 className="section-title">
              Cuéntanos de
              <br />
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>tu evento</em>
            </h2>
            <span className="gold-line" />
            <p style={{ color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.8 }}>
              Completa el formulario y te enviamos una cotización detallada en menos de 24 horas. Sin compromiso.
            </p>

            <div
              style={{
                marginTop: "2.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {[
                { icon: "📋", title: "Sin costo de cotización", desc: "La evaluación es completamente gratuita." },
                { icon: "⚡", title: "Respuesta en 24 h", desc: "Te contactamos el mismo día o al siguiente." },
                { icon: "🔒", title: "Datos protegidos", desc: "Tu información no se comparte con terceros." },
              ].map((item) => (
                <div key={item.title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "var(--text)",
                        marginBottom: "0.15rem",
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 300 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — FORM */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "2.5rem",
            }}
          >
            {/* ÉXITO */}
            {submitResult?.success && (
              <div
                style={{
                  background: "rgba(201,168,76,0.1)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✓</div>
                <div style={{ color: "var(--gold)", fontWeight: 500, marginBottom: "0.25rem" }}>
                  ¡Solicitud enviada!
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  {submitResult.message}
                </div>
                {submitResult.totalPrice > 0 && (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      color: "var(--gold)",
                    }}
                  >
                    Precio estimado:{" "}
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      maximumFractionDigits: 0,
                    }).format(submitResult.totalPrice)}
                  </div>
                )}
              </div>
            )}

            {/* ERROR GENERAL */}
            {submitResult && !submitResult.success && (
              <div
                style={{
                  background: "rgba(229,115,115,0.1)",
                  border: "1px solid rgba(229,115,115,0.3)",
                  borderRadius: "8px",
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                  fontSize: "0.875rem",
                  color: "#E57373",
                }}
              >
                {submitResult.message}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* NOMBRE + TELÉFONO */}
              <div className="form-grid">
                <Field label="Nombre completo" error={errors.name?.message}>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    {...register("name")}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Teléfono" error={errors.phone?.message}>
                  <input
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    {...register("phone")}
                    autoComplete="tel"
                  />
                </Field>
              </div>

              {/* EMAIL */}
              <Field label="Correo electrónico" error={errors.email?.message}>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  {...register("email")}
                  autoComplete="email"
                />
              </Field>

              {/* FECHA + TIPO */}
              <div className="form-grid">
                <Field label="Fecha del evento" error={errors.eventDate?.message}>
                  <input type="date" min={getMinDate()} {...register("eventDate")} />
                </Field>
                <Field label="Tipo de evento" error={errors.eventType?.message}>
                  <select {...register("eventType")}>
                    <option value="interior">Interior</option>
                    <option value="exterior">Exterior</option>
                  </select>
                </Field>
              </div>

              {/* HORAS + PERSONAS */}
              <div className="form-grid">
                <Field label="Horas de servicio" error={errors.hours?.message}>
                  <input
                    type="number"
                    min={5}
                    max={24}
                    placeholder="5"
                    {...register("hours", { valueAsNumber: true })}
                  />
                </Field>
                <Field label="Número de invitados" error={errors.guestCount?.message}>
                  <input
                    type="number"
                    min={10}
                    placeholder="100"
                    {...register("guestCount", { valueAsNumber: true })}
                  />
                </Field>
              </div>

              {/* PAQUETE */}
              <Field label="Paquete" error={errors.package?.message}>
                <select {...register("package")}>
                  {PACKAGES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>

              {/* DIRECCIÓN */}
              <Field label="Dirección del evento" error={errors.address?.message}>
                <input
                  type="text"
                  placeholder="Calle, colonia, municipio"
                  {...register("address")}
                />
              </Field>

              {/* SUBMIT */}
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Enviando…" : "Solicitar cotización"}
              </button>

              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center" }}>
                Al enviar aceptas que usemos tus datos para contactarte sobre este evento.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .event-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
