import { Link } from "react-router";
import { company } from "../../content/company";
import { BrandMark } from "../base/BrandMark";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand column */}
        <div className={styles.brandCol}>
          <Link to="/" className={styles.brandLink} aria-label="Kirjane Labs home">
            <BrandMark variant="white" size={36} className={styles.brandMark} />
            <div>
              <span className={styles.brandName}>{company.brandName}</span>
              <span className={styles.legalName}>{company.legalName}</span>
            </div>
          </Link>
          <p className={styles.tagline}>{company.supportingLine}</p>
          <div className={styles.mottoBadge}>
            <span className={styles.mottoDot} aria-hidden="true" />
            <span>{company.motto}</span>
          </div>
        </div>

        {/* Navigation column */}
        <div className={styles.linksCol}>
          <span className={styles.colHeader}>Navigation</span>
          <nav className={styles.footerNav} aria-label="Footer navigation">
            <Link to="/" className={styles.footerLink}>Home</Link>
            <Link to="/projects" className={styles.footerLink}>Selected Work</Link>
            <Link to="/services" className={styles.footerLink}>Services & Architecture</Link>
            <Link to="/process" className={styles.footerLink}>Engineering Process</Link>
            <Link to="/about" className={styles.footerLink}>The Team</Link>
            <Link to="/contact" className={styles.footerLink}>Start a Project</Link>
          </nav>
        </div>

        {/* Projects column */}
        <div className={styles.linksCol}>
          <span className={styles.colHeader}>Platforms</span>
          <nav className={styles.footerNav} aria-label="Platform links">
            <Link to="/projects#salryn" className={styles.footerLink}>Salryn BMS (Retail & Cafe)</Link>
            <Link to="/projects#scoryn" className={styles.footerLink}>Scoryn (Live Tabulation)</Link>
            <Link to="/projects#talibon" className={styles.footerLink}>Talibon Intra-Office Platform</Link>
            <Link to="/services#backend-architecture" className={styles.footerLink}>Enterprise Backend APIs</Link>
            <Link to="/services#cloud-hosting" className={styles.footerLink}>Cloud Operations & CI/CD</Link>
          </nav>
        </div>

        {/* Direct Channels column */}
        <div className={styles.contactCol}>
          <span className={styles.colHeader}>Direct Inquiries</span>
          <p className={styles.contactDesc}>
            Connect with our engineering and business leads in Bohol.
          </p>
          <div className={styles.contactMethods}>
            <a
              href={`mailto:${company.email}`}
              className={styles.contactEmail}
              aria-label={`Send email to ${company.email}`}
            >
              <span className={styles.contactEmailIcon} aria-hidden="true">✉</span>
              <span>{company.email}</span>
            </a>
            <div className={styles.locationInfo}>
              <span className={styles.locationPin} aria-hidden="true">📍</span>
              <span>{company.location}</span>
            </div>
            <a
              href={company.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Kirjane Labs on Facebook (opens in new tab)"
            >
              <span>Facebook: {company.facebook} ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>
            © {currentYear} {company.legalName}. All rights reserved.
          </p>
          <p className={styles.operationalNote}>
            Adaptive Precision · Engineered in Bohol, Philippines.
          </p>
        </div>
      </div>
    </footer>
  );
}
