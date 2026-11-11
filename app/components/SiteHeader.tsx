import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

const navItems = [
  { to: "/projects", label: "Products & Work" },
  { to: "/services", label: "Services & Hosting" },
  { to: "/about", label: "Our Team" },
  { to: "/process", label: "How We Work" },
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
      <div className="page-shell header-inner">
        <Link className="brand" to="/" aria-label="Kirjane Labs — Kirjane IT Solutions, home">
          <img
            src="/brand/chameleon-color.png"
            alt=""
            className="brand-logo-mark"
            width={46}
            height={36}
          />
          <span className="brand-text-stack">
            <span className="brand-word">Kirjane Labs</span>
            <span className="brand-sub">Kirjane IT Solutions</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {label}
            </NavLink>
          ))}
          <Link className="nav-contact" to="/contact">
            Talk to Our Team
          </Link>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span aria-hidden="true">{isOpen ? "Close" : "Menu"}</span>
          <span className={isOpen ? "menu-mark open" : "menu-mark"} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation" hidden={!isOpen}>
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? "mobile-link active" : "mobile-link")}
          >
            {label}
          </NavLink>
        ))}
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "mobile-link active" : "mobile-link")}
        >
          Talk to Our Team
        </NavLink>
      </nav>
    </header>
  );
}
