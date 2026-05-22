import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef = useRef(null);

  // Partículas ambientales (puntos dorados flotando)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <section
      id="inicio"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* FONDO RADIAL */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 40% 80% at 80% 50%, rgba(201,168,76,0.04) 0%, transparent 60%),
            #080808
          `,
          zIndex: 0,
        }}
      />

      {/* LÍNEAS DECORATIVAS */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              rgba(201,168,76,0.03) 0px,
              rgba(201,168,76,0.03) 1px,
              transparent 1px,
              transparent 120px
            )
          `,
          zIndex: 0,
        }}
      />

      {/* CANVAS PARTÍCULAS */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* CONTENIDO */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 2,
          paddingTop: "120px",
          paddingBottom: "80px",
        }}
      >
        <div style={{ maxWidth: "780px" }}>
          {/* EYEBROW */}
          <span
            className="section-label fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            DJ · Producción de Eventos · CDMX
          </span>

          {/* HEADLINE */}
          <h1
            className="fade-up"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: "-0.01em",
              color: "var(--text)",
              animationDelay: "0.2s",
            }}
          >
            Gustavo
            <br />
            <em
              style={{
                fontStyle: "italic",
                color: "var(--gold)",
                display: "block",
              }}
            >
              Delgadillo
            </em>
          </h1>

          {/* TAGLINE */}
          <p
            className="fade-up"
            style={{
              marginTop: "1.5rem",
              fontSize: "1.1rem",
              color: "var(--text-muted)",
              maxWidth: "520px",
              lineHeight: 1.7,
              fontWeight: 300,
              animationDelay: "0.35s",
            }}
          >
            Producción musical y DJ profesional para eventos que no se olvidan.
            Equipo premium, ambientes diseñados para cada ocasión.
          </p>

          {/* CTA */}
          <div
            className="fade-up"
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "2.5rem",
              flexWrap: "wrap",
              animationDelay: "0.5s",
            }}
          >
            <a href="#evento" className="btn-primary">
              Cotizar mi evento
            </a>
            <a href="#servicios" className="btn-outline">
              Ver servicios
            </a>
          </div>

          {/* STATS */}
          <div
            className="fade-up"
            style={{
              display: "flex",
              gap: "3rem",
              marginTop: "4rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--border)",
              animationDelay: "0.65s",
              flexWrap: "wrap",
            }}
          >
            {[
              { num: "200+", label: "Eventos realizados" },
              { num: "10+", label: "Años de experiencia" },
              { num: "4.9★", label: "Calificación Google" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    fontWeight: 300,
                    color: "var(--gold)",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginTop: "0.25rem",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          animation: "fadeIn 1s 1s both",
        }}
      >
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, var(--gold), transparent)",
            animation: "fadeIn 0.5s ease infinite alternate",
          }}
        />
      </div>
    </section>
  );
}
