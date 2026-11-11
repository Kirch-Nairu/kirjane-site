import { Link } from "react-router";
import { company } from "../../../content/company";
import { BrandMark } from "../../base/BrandMark";
import styles from "./HeroScene.module.css";

export function HeroScene() {
  return (
    <section className={styles.heroSection} aria-label="Introduction">
      {/* Precision architectural background grid */}
      <div className={styles.gridOverlay} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.heroGrid}>
          {/* Left Column: Editorial Headline & Actions */}
          <div className={styles.contentCol}>
            {/* Kicker badge */}
            <div className={styles.kickerRow}>
              <span className={styles.kickerDot} aria-hidden="true" />
              <span className={styles.kickerText}>
                ENGINEERING & SYSTEMS ARCHITECTURE · BOHOL, PH
              </span>
            </div>

            {/* Signature Headline */}
            <h1 className={styles.headline}>
              <span className={styles.headlineLine}>COMPLEX WORK.</span>
              <span className={styles.headlineAccent}>CLEAR SYSTEMS.</span>
            </h1>

            {/* Plain-Language Supporting Line */}
            <p className={styles.leadText}>
              {company.supportingLine}
            </p>

            {/* Honest Action CTAs */}
            <div className={styles.actions}>
              <Link to="/projects" className={styles.primaryCta}>
                <span>Explore Our Work</span>
                <span className={styles.ctaArrow} aria-hidden="true">→</span>
              </Link>
              <Link to="/contact" className={styles.secondaryCta}>
                <span>Start a Project</span>
              </Link>
            </div>

            {/* Direct capability markers */}
            <div className={styles.capabilitiesRow}>
              <div className={styles.capItem}>
                <span className={styles.capLabel}>01 · PLATFORMS</span>
                <span className={styles.capTitle}>Salryn BMS</span>
              </div>
              <div className={styles.capDivider} aria-hidden="true" />
              <div className={styles.capItem}>
                <span className={styles.capLabel}>02 · TABULATION</span>
                <span className={styles.capTitle}>Scoryn Event Suite</span>
              </div>
              <div className={styles.capDivider} aria-hidden="true" />
              <div className={styles.capItem}>
                <span className={styles.capLabel}>03 · INSTITUTIONAL</span>
                <span className={styles.capTitle}>Talibon Intra-Office</span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Chameleon Stage */}
          <div className={styles.stageCol} aria-hidden="true">
            <div className={styles.chameleonFrame}>
              {/* Faceted architectural corner accents */}
              <div className={styles.cornerTL} />
              <div className={styles.cornerTR} />
              <div className={styles.cornerBL} />
              <div className={styles.cornerBR} />

              {/* Coordinates / Studio stamp */}
              <div className={styles.stampHeader}>
                <span className={styles.stampCode}>BOHOL / 9.8500° N, 124.1435° E</span>
                <span className={styles.stampLabel}>KIRJANE LABS</span>
              </div>

              {/* Physical Chameleon Emblem Presentation */}
              <div className={styles.emblemContainer}>
                {/* Subtle soft backdrop glow */}
                <div className={styles.emblemGlow} />
                <BrandMark
                  variant="color"
                  size={320}
                  className={styles.chameleonImage}
                  alt="Kirjane Chameleon Brand Emblem"
                />
              </div>

              {/* Emblem footer annotation */}
              <div className={styles.stampFooter}>
                <span className={styles.mottoText}>{company.motto}</span>
                <span className={styles.legalNotice}>{company.legalName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
