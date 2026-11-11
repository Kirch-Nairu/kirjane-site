import { Link } from "react-router";
import { company } from "../data/content";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Products & Case Studies" },
  { to: "/services", label: "Services & Web Hosting" },
  { to: "/about", label: "Meet the Team" },
  { to: "/process", label: "How We Work" },
  { to: "/contact", label: "Contact Us" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-top">
        <div className="footer-intro">
          <Link to="/" className="footer-brand" aria-label="Kirjane Labs — Kirjane IT Solutions home">
            <img
              src="/brand/chameleon-color.png"
              alt=""
              className="footer-logo-mark"
              width={56}
              height={44}
            />
            <span className="footer-brand-stack">
              <span className="footer-brand-main">{company.brandName}</span>
              <span className="footer-brand-detail">{company.legalName}</span>
            </span>
          </Link>
          <p className="footer-tagline">{company.tagline}</p>
          <p className="footer-description">
            Custom software, reliable backend systems, cloud operations, and web hosting—plus
            Salryn BMS and Scoryn automated tabulation.
          </p>
          <div className="footer-contact-meta">
            <span>📍 {company.location}</span>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </div>
        </div>

        <div className="footer-links-area">
          <span className="section-kicker">Navigation</span>
          <nav aria-label="Footer navigation" className="footer-nav">
            {links.map(({ to, label }) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="page-shell footer-bottom">
        <small>
          © 2026 {company.brandName} ({company.legalName}). Based in {company.location}.
        </small>
        <small>Salryn BMS · Scoryn Tabulation · Custom Software · Cloud & Web Hosting</small>
      </div>
    </footer>
  );
}
