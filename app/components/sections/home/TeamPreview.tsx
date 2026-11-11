import { Link } from "react-router";
import { teamMembers } from "../../../content/team";
import styles from "./TeamPreview.module.css";

export function TeamPreview() {
  const leadershipPreview = teamMembers.slice(0, 4);

  return (
    <section className={styles.section} aria-label="Team and Leadership Preview">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.kicker}>05 / THE PEOPLE BEHIND KIRJANE</span>
            <h2 className={styles.title}>Engineers & Accountants in Collaboration</h2>
            <p className={styles.lead}>
              Kirjane Labs was founded on a simple principle: technical excellence is only half the
              challenge. By embedding certified accountants directly into system design, our
              software mirrors real-world fiscal rules.
            </p>
          </div>
          <Link to="/about" className={styles.fullRosterLink}>
            <span>View Full 7-Member Team</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {leadershipPreview.map((member) => (
            <div key={member.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatarBadge} style={{ borderColor: member.accentTone }}>
                  <span className={styles.avatarCode}>{member.avatarCode}</span>
                </div>
                <div className={styles.titleGroup}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <span className={styles.memberRole}>{member.role}</span>
                </div>
              </div>

              <div className={styles.disciplineBlock}>
                <span className={styles.disciplineLabel}>CORE DISCIPLINES</span>
                <p className={styles.disciplineText}>{member.discipline}</p>
              </div>

              <p className={styles.summaryText}>{member.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
