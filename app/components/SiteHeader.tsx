import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

const navItems = [
  { index: "01", to: "/projects", label: "Products & Work" },
  { index: "02", to: "/services", label: "Capabilities" },
  { index: "03", to: "/about", label: "The Team" },
  { index: "04", to: "/process", label: "How We Work" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="header-grid-bar">
        <Link className="brand-cell" to="/" aria-label="Kirjane Labs — Kirjane IT Solutions, home">
          <img
            src="/brand/chameleon-color.png"
            alt=""
            className="brand-logo-mark"
            width={40}
            height={32}
          />
          <span className="brand-text-stack">
            <span className="brand-word">KIRJANE LABS</span>
            <span className="brand-sub">Kirjane IT Solutions</span>
          </span>
        </Link>

        <nav className="desktop-nav-cells" aria-label="Primary navigation">
          {navItems.map(({ index, to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "nav-cell active" : "nav-cell")}
            >
              <span className="nav-cell-index">{index}</span>
              <span className="nav-cell-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="header-meta-cell">
          <span className="header-loc-dot" aria-hidden="true" />
          <span>Bohol, PH</span>
        </div>

        <Link className="header-cta-cell" to="/contact">
          <span>Start a Project</span>
          <span className="header-cta-arrow" aria-hidden="true">
            →
          </span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span aria-hidden="true">{isOpen ? "CLOSE" : "MENU"}</span>
          <span className={isOpen ? "menu-mark open" : "menu-mark"} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation" hidden={!isOpen}>
        {navItems.map(({ index, to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? "mobile-link active" : "mobile-link")}
          >
            <span className="nav-cell-index">{index}</span>
            <span>{label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "mobile-link active" : "mobile-link")}
        >
          <span className="nav-cell-index">05</span>
          <span>Start a Project</span>
        </NavLink>
      </nav>
    </header>
  );
}
