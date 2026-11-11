import { company } from "../../../content/company";
import styles from "./StatementOfPractice.module.css";

export function StatementOfPractice() {
  return (
    <section className={styles.section} aria-label="Statement of Practice">
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.kicker}>
            <span className={styles.kickerLine} aria-hidden="true" />
            <span>PRACTICE & PHILOSOPHY</span>
          </div>
          <blockquote className={styles.quote}>
            "{company.statementOfPractice}"
          </blockquote>
          <p className={styles.subtext}>
            We combine rigorous backend architecture, financial accounting logic, and pragmatic
            interface design to create systems that reduce daily operational overhead.
          </p>
        </div>
      </div>
    </section>
  );
}
