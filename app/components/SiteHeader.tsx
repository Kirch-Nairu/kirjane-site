import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { company } from "../data/content";

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
      <div className="page-shell header-bar">
        <Link
          className="brand-lockup"
          to="/"
          aria-label={`${company.brandName} — ${company.legalName}, home`}
        >
          <span className="brand-emblem-frame">
            <img
              src={company.logos.chameleonColor}
              alt=""
              className="brand-logo-mark"
              width={38}
              height={30}
            />
          </span>
          <span className="brand-text-stack">
            <span className="brand-word">{company.brandName}</span>
            <span className="brand-sub">{company.legalName}</span>
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
        </nav>

        <div className="header-actions">
          <span className="header-location-tag" aria-label={`Location: ${company.location}`}>
            <span className="header-loc-dot" aria-hidden="true" />
            <span>Bohol, PH</span>
          </span>

          <Link className="header-cta-btn" to="/contact">
            <span>{company.hero.primaryCta}</span>
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
            <span className="menu-toggle-label" aria-hidden="true">
              {isOpen ? "Close" : "Menu"}
            </span>
            <span className={isOpen ? "menu-mark open" : "menu-mark"} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation" hidden={!isOpen}>
        <div className="page-shell mobile-nav-inner">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "mobile-link active" : "mobile-link")}
            >
              <span>{label}</span>
              <span aria-hidden="true">→</span>
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "mobile-link mobile-link-cta active" : "mobile-link mobile-link-cta"
            }
          >
            <span>{company.hero.primaryCta}</span>
            <span aria-hidden="true">→</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
