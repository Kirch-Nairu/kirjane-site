import { Link } from "react-router";

const links = [
  { to: "/", label: "Home" }, { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" }, { to: "/about", label: "About" },
  { to: "/process", label: "Our Process" }, { to: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-top">
        <div>
          <Link to="/" className="footer-brand">KIRJANE<span>.</span></Link>
          <p className="footer-tagline">Adapt. Automate. Evolve.</p>
        </div>
        <nav aria-label="Footer navigation" className="footer-nav">
          {links.map(({ to, label }) => <Link key={to} to={to}>{label}</Link>)}
        </nav>
      </div>
      <div className="page-shell footer-bottom">
        <small>Kirjane Labs · Software Engineering / Automation / Digital Systems</small>
        <small>Website in development · Publication subject to company approval</small>
      </div>
    </footer>
  );
}
