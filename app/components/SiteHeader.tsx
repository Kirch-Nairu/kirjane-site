import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setIsOpen(false); }, [location.pathname]);
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
        <Link className="brand" to="/" aria-label="Kirjane Labs home">
          <span className="brand-word">KIRJANE<span className="brand-dot">.</span></span>
          <span className="brand-sub">LABS</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              {label}
            </NavLink>
          ))}
          <Link className="nav-contact" to="/contact">Let's Talk <span aria-hidden="true">↗</span></Link>
        </nav>
        <button type="button" className="menu-toggle" aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen} aria-controls="mobile-menu" onClick={() => setIsOpen(!isOpen)}>
          <span aria-hidden="true">{isOpen ? "Close ×" : "Menu ☰"}</span>
        </button>
      </div>
      {isOpen && (
        <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">
          {nav.map(({ to, label }) => <NavLink key={to} to={to} className="mobile-link">{label} <span aria-hidden="true">↗</span></NavLink>)}
          <NavLink to="/process" className="mobile-link">Our Process <span aria-hidden="true">↗</span></NavLink>
          <NavLink to="/contact" className="mobile-link">Let's Talk <span aria-hidden="true">↗</span></NavLink>
        </nav>
      )}
    </header>
  );
}
