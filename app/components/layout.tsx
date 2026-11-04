import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

const links = [
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Link to="/" className="wordmark" aria-label="Kirjane Labs — homepage">
          <span className="wordmark-icon" aria-hidden="true">K<span>.</span></span>
          <span className="wordmark-text">KIRJANE <small>LABS</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{label}</NavLink>
          ))}
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-contact active" : "nav-contact"}>
            Let's Talk <span aria-hidden="true">↗</span>
          </NavLink>
        </nav>
        <button
          ref={menuButton}
          type="button"
          className="menu-toggle"
          aria-controls="mobile-nav"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={open ? "menu-lines is-open" : "menu-lines"} aria-hidden="true"><i/><i/></span>
          <span>{open ? "Close" : "Menu"}</span>
        </button>
      </div>
      <nav className={open ? "mobile-nav is-open" : "mobile-nav"} id="mobile-nav" aria-label="Mobile navigation" inert={!open}>
        {[...links, { to: "/process", label: "Our Process" }, { to: "/contact", label: "Contact" }].map(({ to, label }, i) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}>
            <span className="mobile-nav-index">0{i + 1}</span><span>{label}</span><span aria-hidden="true">↗</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-main">
          <div>
            <Link to="/" className="footer-brand">KIRJANE<span> LABS.</span></Link>
            <p>Adapt. Automate. Evolve.</p>
          </div>
          <div className="footer-links">
            <div>
              <span className="footer-heading">Explore</span>
              <Link to="/services">Services</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/about">About</Link>
            </div>
            <div>
              <span className="footer-heading">Connect</span>
              <Link to="/process">Our Process</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Kirjane Labs</span>
          <span>Software Engineering / Automation / Digital Systems</span>
          <Link to="/contact">Start a conversation <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </footer>
  );
}
