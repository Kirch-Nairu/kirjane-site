import { Link } from "react-router";
import { company } from "../../../content/company";
import styles from "./ContactClose.module.css";

export function ContactClose() {
  return (
    <section className={styles.section} aria-label="Project Consultation and Inquiries">
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.content}>
            <span className={styles.kicker}>06 / ENGAGE OUR TEAM</span>
            <h2 className={styles.title}>Tell us what you need to build.</h2>
            <p className={styles.lead}>
              Whether you need to streamline daily sales operations, automate institutional
              document routing, or architect high-speed backend infrastructure, our team is ready to
              review your operational scope.
            </p>

            <div className={styles.actions}>
              <Link to="/contact" className={styles.primaryBtn}>
                <span>Start a Project Discussion</span>
                <span aria-hidden="true">→</span>
              </Link>
              <a href={`mailto:${company.email}`} className={styles.emailBtn}>
                <span>Email Us Directly: {company.email}</span>
              </a>
            </div>
          </div>

          <div className={styles.detailsCol}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>LOCATION</span>
              <span className={styles.detailValue}>{company.location}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>DIRECT INBOX</span>
              <span className={styles.detailValue}>{company.email}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>LEGAL ENTITY</span>
              <span className={styles.detailValue}>{company.legalName}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
