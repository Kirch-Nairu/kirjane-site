import { Link } from "react-router";
import { projects } from "../../../content/projects";
import styles from "./FeaturedWork.module.css";

export function FeaturedWork() {
  return (
    <section className={styles.section} aria-label="Selected Work and Platforms">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.kicker}>03 / EVIDENCE & SELECTED WORK</span>
            <span className={styles.headerBadge}>VERIFIED PROJECTS</span>
          </div>
          <h2 className={styles.title}>Engineered Platforms in the Real World</h2>
          <p className={styles.lead}>
            Each system we deliver is measured by actual operational adoption—from commercial
            counters and live competition stages to municipal office corridors.
          </p>
        </div>

        <div className={styles.projectsGrid}>
          {projects.map((project) => (
            <article key={project.id} id={project.slug} className={styles.projectCard}>
              <div className={styles.cardHeader}>
                <div className={styles.numberRow}>
                  <span className={styles.projectNumber}>{project.number}</span>
                  <span className={`${styles.statusBadge} ${styles[project.deliveryState]}`}>
                    {project.statusBadge}
                  </span>
                </div>
                <span className={styles.category}>{project.category}</span>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectSubtitle}>{project.subtitle}</p>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.block}>
                  <h4 className={styles.blockHeading}>The Operational Problem</h4>
                  <p className={styles.blockText}>{project.problem}</p>
                </div>

                <div className={styles.block}>
                  <h4 className={styles.blockHeading}>What We Engineered</h4>
                  <p className={styles.blockText}>{project.solution}</p>
                </div>

                <div className={styles.highlightsBlock}>
                  <h4 className={styles.blockHeading}>Architecture & Verification</h4>
                  <ul className={styles.highlightsList}>
                    {project.architectureHighlights.map((highlight, idx) => (
                      <li key={idx} className={styles.highlightItem}>
                        <span className={styles.highlightDot} aria-hidden="true" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.demonstrationNotice}>
                  <span className={styles.demoIcon} aria-hidden="true">✔</span>
                  <span>{project.demonstrationLabel}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <Link to={`/projects#${project.slug}`} className={styles.detailLink}>
                  <span>Read Full Case Narrative</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
