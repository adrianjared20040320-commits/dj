import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#servicios", label: "Servicios" },
    { href: "#productos", label: "Productos" },
    { href: "#evento", label: "Contratar" },
    { href: "#blog", label: "Blog" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background 0.4s, backdrop-filter 0.4s, border-color 0.4s",
        background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.15)" : "1px solid transparent",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* LOGO */}
        <a href="#" style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.6rem",
              fontWeight: 300,
              color: "var(--gold)",
              letterSpacing: "0.05em",
            }}
          >
            GDL
          </span>
          <span
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginTop: "1px",
            }}
          >
            Gustavo Delgadillo
          </span>
        </a>

        {/* LINKS DESKTOP */}
        <nav
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
          }}
          className="nav-desktop"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                transition: "color 0.2s",
                fontWeight: 400,
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--gold)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
            >
              {l.label}
            </a>
          ))}
          <a href="#evento" className="btn-primary" style={{ padding: "0.6rem 1.5rem" }}>
            Cotizar evento
          </a>
        </nav>

        {/* HAMBURGER MOBILE */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
          style={{
            display: "none",
            flexDirection: "column",
            gap: "5px",
            padding: "4px",
          }}
          className="nav-hamburger"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "var(--gold)",
                transition: "transform 0.3s",
              }}
            />
          ))}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(8,8,8,0.97)",
            borderTop: "1px solid var(--border)",
            padding: "1.5rem 2rem 2rem",
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "0.75rem 0",
                borderBottom: "1px solid var(--border)",
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#evento"
            onClick={() => setMenuOpen(false)}
            className="btn-primary"
            style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}
          >
            Cotizar evento
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
