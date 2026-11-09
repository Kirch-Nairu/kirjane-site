import { Link } from "react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/process", label: "Our Process" },
  { to: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-top">
        <div className="footer-intro">
          <Link to="/" className="footer-brand" aria-label="Kirjane Labs home">KIRJANE<span>.</span></Link>
          <p className="footer-tagline">Adapt. Automate. Evolve.</p>
          <p className="footer-description">Technology built around the work it needs to do.</p>
        </div>
        <div className="footer-links-area">
          <span className="eyebrow">EXPLORE KIRJANE LABS</span>
          <nav aria-label="Footer navigation" className="footer-nav">
            {links.map(({ to, label }) => <Link key={to} to={to}>{label}<span aria-hidden="true">↗</span></Link>)}
          </nav>
        </div>
      </div>
      <div className="page-shell footer-bottom">
        <small>© {new Date().getFullYear()} Kirjane Labs. All rights reserved.</small>
        <small>Software Engineering / Automation / Digital Systems</small>
      </div>
    </footer>
  );
}
