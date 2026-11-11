import { Link } from "react-router";
import { company } from "../data/content";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Products & Selected Work" },
  { to: "/services", label: "Services & Web Hosting" },
  { to: "/about", label: "Our Team" },
  { to: "/process", label: "How We Work" },
  { to: "/contact", label: "Contact Us" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <img
        src={company.logos.chameleonWhite}
        alt=""
        aria-hidden="true"
        className="footer-watermark-logo"
      />

      <div className="page-shell footer-top">
        <div className="footer-intro">
          <Link to="/" className="footer-brand" aria-label={`${company.brandName} — ${company.legalName} home`}>
            <span className="footer-emblem-box">
              <img
                src={company.logos.chameleonColor}
                alt=""
                className="footer-logo-mark"
                width={44}
                height={35}
              />
            </span>
            <span className="footer-brand-stack">
              <span className="footer-brand-main">{company.brandName}</span>
              <span className="footer-brand-detail">{company.legalName}</span>
            </span>
          </Link>
          <p className="footer-tagline">{company.tagline}</p>
          <p className="footer-description">
            Enterprise backend systems, custom operational software, cloud infrastructure, and
            managed web hosting—alongside Salryn BMS and Scoryn live event tabulation.
          </p>
          <div className="footer-contact-meta">
            <span>{company.location}</span>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </div>
        </div>

        <div className="footer-links-area">
          <span className="section-kicker light">Site Directory</span>
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
        <small>Salryn BMS · Scoryn Tabulation · Custom Systems · Cloud &amp; Web Hosting</small>
      </div>
    </footer>
  );
}
