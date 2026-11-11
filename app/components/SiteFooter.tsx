import { Link } from "react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Capabilities & Hosting" },
  { to: "/projects", label: "Salryn · Scoryn · Work" },
  { to: "/process", label: "Engineering Methodology" },
  { to: "/about", label: "The People Behind Kirjane" },
  { to: "/contact", label: "Start a Conversation" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-top">
        <div className="footer-intro">
          <Link to="/" className="footer-brand" aria-label="Kirjane Labs — Kirjane IT Solutions home">
            <span className="footer-brand-main">KIRJANE LABS.</span>
            <span className="footer-brand-detail">KIRJANE IT SOLUTIONS</span>
          </Link>
          <p className="footer-tagline">Enterprise Software That Actually Matters.</p>
          <p className="footer-description">
            Backend architecture, hardened security, cloud operations, managed web hosting, and mission-critical systems built by engineers and accountants.
          </p>
          <div className="footer-pill-row">
            <span className="telemetry-pill">SALRYN BMS KERNEL</span>
            <span className="telemetry-pill">SCORYN TABULATION</span>
            <span className="telemetry-pill">CLOUD & WEB HOSTING</span>
          </div>
        </div>
        <div className="footer-links-area">
          <span className="eyebrow">EXPLORE KIRJANE LABS</span>
          <nav aria-label="Footer navigation" className="footer-nav">
            {links.map(({ to, label }) => (
              <Link key={to} to={to}>
                {label}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="page-shell footer-bottom">
        <small>© 2026 Kirjane Labs (Kirjane IT Solutions). All rights reserved.</small>
        <small>Backend Architecture / Security / Cloud Ops / Web Hosting / Tailored Enterprise Systems</small>
      </div>
    </footer>
  );
}
