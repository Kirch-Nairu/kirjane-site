import { Link } from "react-router";
import { services } from "../content/services";
import styles from "./services.module.css";

export function meta() {
  return [
    {
      title: "Services & Systems Architecture — Kirjane Labs",
    },
    {
      name: "description",
      content:
        "Backend architecture, database engineering, application security, cloud operations, managed web hosting, and bespoke software systems by Kirjane Labs in Bohol.",
    },
  ];
}

export default function Services() {
  return (
    <div className={styles.page}>
      {/* Editorial Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <span className={styles.kicker}>SYSTEM SERVICES & ARCHITECTURE</span>
          <h1 className={styles.headline}>Engineering Focused on Operational Stability</h1>
          <p className={styles.lead}>
            We engineer the invisible foundations that keep businesses operating without
            disruption: transaction-safe database schemas, role-governed security boundaries,
            automated CI/CD pipelines, and high-performance web systems.
          </p>

          {/* Jump Navigation */}
          <nav className={styles.jumpNav} aria-label="Jump to service area">
            {services.map((service) => (
              <a key={service.id} href={`#${service.id}`} className={styles.jumpLink}>
                <span className={styles.jumpNumber}>{service.number}</span>
                <span>{service.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Services List */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <article key={service.id} id={service.id} className={styles.serviceArticle}>
                <div className={styles.articleHeader}>
                  <div className={styles.metaRow}>
                    <span className={styles.serviceNumber}>{service.number}</span>
                    <span className={styles.serviceTag}>{service.tag}</span>
                  </div>
                  <h2 className={styles.serviceTitle}>{service.title}</h2>
                  <p className={styles.serviceHeadline}>{service.headline}</p>
                </div>

                <div className={styles.articleBody}>
                  <div className={styles.descBlock}>
                    <p className={styles.description}>{service.description}</p>
                    <div className={styles.problemCallout}>
                      <span className={styles.calloutLabel}>PRIMARY PROBLEM RESOLVED</span>
                      <p className={styles.calloutText}>{service.problemSolved}</p>
                    </div>
                  </div>

                  <div className={styles.detailsGrid}>
                    <div className={styles.detailCol}>
                      <h3 className={styles.colTitle}>Architectural Capabilities</h3>
                      <ul className={styles.list}>
                        {service.capabilities.map((cap, idx) => (
                          <li key={idx} className={styles.listItem}>
                            <span className={styles.dot} aria-hidden="true" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.detailCol}>
                      <h3 className={styles.colTitle}>Concrete Deliverables</h3>
                      <ul className={styles.list}>
                        {service.deliverables.map((deliv, idx) => (
                          <li key={idx} className={styles.listItem}>
                            <span className={styles.checkIcon} aria-hidden="true">✓</span>
                            <span>{deliv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={styles.articleFooter}>
                  <Link to="/contact" className={styles.actionBtn}>
                    <span>Consult on {service.title}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <span className={styles.ctaKicker}>TECHNICAL EVALUATION</span>
              <h2 className={styles.ctaTitle}>Need an architectural review of your current systems?</h2>
              <p className={styles.ctaDesc}>
                We audit bottlenecks, data synchronization risks, and access permissions for
                growing enterprises and public offices.
              </p>
            </div>
            <Link to="/contact" className={styles.ctaLink}>
              <span>Book an Engineering Consultation</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
