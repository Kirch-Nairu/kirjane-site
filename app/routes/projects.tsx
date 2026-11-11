import { Link } from "react-router";
import { projects } from "../content/projects";
import styles from "./projects.module.css";

export function meta() {
  return [
    {
      title: "Selected Work & Case Narratives — Kirjane Labs",
    },
    {
      name: "description",
      content:
        "Verified case narratives of Salryn BMS, Scoryn live competition scoring, and the Talibon Intra-Office document routing system engineered by Kirjane Labs.",
    },
  ];
}

export default function Projects() {
  return (
    <div className={styles.page}>
      {/* Editorial Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <span className={styles.kicker}>EVIDENCE & PLATFORMS</span>
          <h1 className={styles.headline}>Engineering Validated in Operation</h1>
          <p className={styles.lead}>
            Kirjane Labs delivers platforms engineered for distinct operational requirements.
            Below are our three signature systems, accompanied by their operational context,
            technical architecture, and verifiable deployment statuses.
          </p>

          <nav className={styles.navStrip} aria-label="Projects directory">
            {projects.map((proj) => (
              <a key={proj.id} href={`#${proj.slug}`} className={styles.stripLink}>
                <span className={styles.stripNumber}>{proj.number}</span>
                <span className={styles.stripTitle}>{proj.title}</span>
                <span className={`${styles.stripBadge} ${styles[proj.deliveryState]}`}>
                  {proj.statusBadge}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Case Narratives */}
      <section className={styles.narrativesSection}>
        <div className={styles.container}>
          <div className={styles.casesList}>
            {projects.map((project) => (
              <article key={project.id} id={project.slug} className={styles.caseArticle}>
                <div className={styles.caseHeader}>
                  <div className={styles.headerTop}>
                    <span className={styles.caseNumber}>{project.number}</span>
                    <span className={`${styles.statusBadge} ${styles[project.deliveryState]}`}>
                      {project.statusBadge}
                    </span>
                  </div>
                  <span className={styles.category}>{project.category}</span>
                  <h2 className={styles.title}>{project.title}</h2>
                  <p className={styles.subtitle}>{project.subtitle}</p>
                </div>

                <div className={styles.caseGrid}>
                  <div className={styles.narrativeCol}>
                    <div className={styles.block}>
                      <h3 className={styles.blockTitle}>Operational Context & Problem</h3>
                      <p className={styles.blockText}>{project.problem}</p>
                    </div>

                    <div className={styles.block}>
                      <h3 className={styles.blockTitle}>Architectural Solution</h3>
                      <p className={styles.blockText}>{project.solution}</p>
                    </div>

                    {project.outcome && (
                      <div className={styles.block}>
                        <h3 className={styles.blockTitle}>Measured Operational Outcome</h3>
                        <p className={styles.blockText}>{project.outcome}</p>
                      </div>
                    )}
                  </div>

                  <div className={styles.specCol}>
                    <div className={styles.specCard}>
                      <h3 className={styles.specHeading}>System Highlights</h3>
                      <ul className={styles.highlightsList}>
                        {project.architectureHighlights.map((h, i) => (
                          <li key={i} className={styles.highlightItem}>
                            <span className={styles.hDot} aria-hidden="true" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.evidenceCard}>
                      <h3 className={styles.evidenceHeading}>Verification Ledger</h3>
                      <ul className={styles.evidenceList}>
                        {project.evidence.map((ev, i) => (
                          <li key={i} className={styles.evidenceItem}>
                            <span className={styles.evCheck} aria-hidden="true">✔</span>
                            <div>
                              <span className={styles.evLabel}>{ev.sourceLabel}</span>
                              {ev.checkedAt && (
                                <span className={styles.evDate}>Verified: {ev.checkedAt}</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className={styles.demoBanner}>
                        <span>{project.demonstrationLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.caseFooter}>
                  <Link to="/contact" className={styles.inquireLink}>
                    <span>Inquire About {project.title} Architecture</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Callout */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Have a custom platform requirement?</h2>
            <p className={styles.ctaLead}>
              We architect custom business systems, intra-office workflows, and live tabulation
              engines tailored to your specific organizational hierarchy and hardware constraints.
            </p>
            <Link to="/contact" className={styles.ctaBtn}>
              <span>Start an Engineering Scope Discussion</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
