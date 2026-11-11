import { useState } from "react";
import { Link } from "react-router";
import { processStages } from "../content/process";
import styles from "./process.module.css";

export function meta() {
  return [
    {
      title: "Five-Stage Engineering Process — Kirjane Labs",
    },
    {
      name: "description",
      content:
        "The five-stage engineering and delivery process of Kirjane Labs: Discover, Define, Build, Verify, and Support. Disciplined software delivery in Bohol.",
    },
  ];
}

export default function Process() {
  const [activeStageId, setActiveStageId] = useState(processStages[0].id);
  const activeStage =
    processStages.find((s) => s.id === activeStageId) || processStages[0];

  return (
    <div className={styles.page}>
      {/* Editorial Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <span className={styles.kicker}>DELIVERY FRAMEWORK</span>
          <h1 className={styles.headline}>Engineering Governed by Strict Verification</h1>
          <p className={styles.lead}>
            Kirjane Labs follows a transparent, five-stage delivery process designed to eliminate
            costly rework, align financial ledgers with code from the start, and ensure personnel
            actually adopt the systems we build.
          </p>

          <div className={styles.stageTimelineNav}>
            {processStages.map((stage) => {
              const isActive = stage.id === activeStageId;
              return (
                <button
                  key={stage.id}
                  className={`${styles.navStep} ${isActive ? styles.navStepActive : ""}`}
                  onClick={() => setActiveStageId(stage.id)}
                  aria-label={`Jump to stage ${stage.number}: ${stage.name}`}
                >
                  <span className={styles.stepNum}>{stage.number}</span>
                  <span className={styles.stepName}>{stage.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Interactive Deep-Dive Stage */}
      <section className={styles.stageSection} aria-label="Selected Stage Deep-Dive">
        <div className={styles.container}>
          <div className={styles.stageDisplayCard}>
            <div className={styles.stageHeader}>
              <div className={styles.stageBadgeRow}>
                <span className={styles.stageNumberBadge}>STAGE {activeStage.number} / 05</span>
                <span className={styles.stagePhase}>{activeStage.phase}</span>
              </div>
              <h2 className={styles.stageTitle}>{activeStage.title}</h2>
            </div>

            <p className={styles.stageDetail}>{activeStage.detail}</p>

            <div className={styles.stageDetailsGrid}>
              <div className={styles.detailCard}>
                <span className={styles.cardKicker}>CONCRETE DELIVERABLE</span>
                <p className={styles.cardText}>{activeStage.deliverable}</p>
              </div>

              <div className={styles.detailCard}>
                <span className={styles.cardKicker}>WHY THIS STEP MATTERS</span>
                <p className={styles.cardText}>{activeStage.whyItMatters}</p>
              </div>

              <div className={`${styles.detailCard} ${styles.verificationCard}`}>
                <span className={styles.cardKicker}>GATE VERIFICATION CHECKPOINT</span>
                <p className={styles.cardText}>
                  <span className={styles.checkIcon} aria-hidden="true">✔</span>
                  <span>{activeStage.verificationCheck}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Full Stage Narrative */}
      <section className={styles.allStagesSection} aria-label="All Five Stages in Detail">
        <div className={styles.container}>
          <div className={styles.allStagesHeader}>
            <span className={styles.kicker}>CHRONOLOGICAL BREAKDOWN</span>
            <h2 className={styles.sectionTitle}>Full Lifecycle Architecture</h2>
            <p className={styles.sectionLead}>
              Every engagement progresses through these non-negotiable milestones. We do not skip
              verification or handover checkpoints.
            </p>
          </div>

          <div className={styles.stagesAccordion}>
            {processStages.map((stage) => (
              <div key={stage.id} className={styles.fullStageRow}>
                <div className={styles.rowNumberCol}>
                  <span className={styles.rowNum}>{stage.number}</span>
                  <span className={styles.rowName}>{stage.name}</span>
                </div>

                <div className={styles.rowContentCol}>
                  <span className={styles.rowPhase}>{stage.phase}</span>
                  <h3 className={styles.rowTitle}>{stage.title}</h3>
                  <p className={styles.rowDetail}>{stage.detail}</p>

                  <div className={styles.rowDeliverables}>
                    <div className={styles.dItem}>
                      <span className={styles.dLabel}>Deliverable:</span>
                      <span className={styles.dVal}>{stage.deliverable}</span>
                    </div>
                    <div className={styles.dItem}>
                      <span className={styles.dLabel}>Verification Gate:</span>
                      <span className={styles.dVal}>{stage.verificationCheck}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <span className={styles.ctaKicker}>INITIATE ENGAGEMENT</span>
              <h2 className={styles.ctaTitle}>Ready to begin Stage 01: Discover?</h2>
              <p className={styles.ctaDesc}>
                Contact our engineering team to schedule a field investigation and workflow mapping
                session for your organization.
              </p>
            </div>
            <Link to="/contact" className={styles.ctaBtn}>
              <span>Schedule Workflow Discovery</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
