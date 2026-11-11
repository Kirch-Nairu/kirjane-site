import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { BrandMark } from "../base/BrandMark";
import styles from "./SiteHeader.module.css";

const navItems = [
  { to: "/projects", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/process", label: "Process" },
  { to: "/about", label: "About" },
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
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand identity */}
        <Link to="/" className={styles.brand} aria-label="Kirjane Labs home">
          <BrandMark variant="color" size={32} className={styles.brandMark} />
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>KIRJANE LABS</span>
            <span className={styles.brandSub}>Kirjane IT Solutions</span>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Location & CTA */}
        <div className={styles.actions}>
          <div className={styles.locationPill} title="Bohol, Philippines">
            <span className={styles.locationDot} aria-hidden="true" />
            <span>Bohol, PH</span>
          </div>

          <Link to="/contact" className={styles.ctaButton}>
            <span>Start a Project</span>
            <span aria-hidden="true">→</span>
          </Link>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            className={styles.menuToggle}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className={styles.menuLabel}>{isOpen ? "CLOSE" : "MENU"}</span>
            <span className={`${styles.menuIcon} ${isOpen ? styles.menuIconOpen : ""}`} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-nav-panel"
        className={`${styles.mobileDrawer} ${isOpen ? styles.mobileDrawerOpen : ""}`}
        aria-hidden={!isOpen}
      >
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${styles.mobileLink} ${styles.mobileCtaLink} ${isActive ? styles.mobileLinkActive : ""}`
            }
          >
            Start a Project →
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
