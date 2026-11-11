import { useState } from "react";
import { Link } from "react-router";
import { processStages } from "../../../content/process";
import styles from "./ProcessPreview.module.css";

export function ProcessPreview() {
  const [activeStageId, setActiveStageId] = useState(processStages[0].id);
  const activeStage =
    processStages.find((stage) => stage.id === activeStageId) || processStages[0];

  return (
    <section className={styles.section} aria-label="Five-Stage Engineering Process Preview">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.kicker}>04 / METHODOLOGY & DELIVERY</span>
          <h2 className={styles.title}>Five Stages of Disciplined Engineering</h2>
          <p className={styles.lead}>
            From field observation to automated deployment, our structured methodology ensures
            zero guesswork, strict ledger balancing, and seamless operational adoption.
          </p>
        </div>

        {/* Interactive stage selector tabs */}
        <div className={styles.tabList} role="tablist" aria-label="Engineering process stages">
          {processStages.map((stage) => {
            const isSelected = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                role="tab"
                id={`tab-${stage.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${stage.id}`}
                tabIndex={isSelected ? 0 : -1}
                className={`${styles.tabButton} ${isSelected ? styles.tabButtonActive : ""}`}
                onClick={() => setActiveStageId(stage.id)}
              >
                <span className={styles.tabNumber}>{stage.number}</span>
                <span className={styles.tabName}>{stage.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Display Panel */}
        <div
          id={`panel-${activeStage.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeStage.id}`}
          className={styles.stagePanel}
        >
          <div className={styles.panelHeader}>
            <span className={styles.panelPhase}>{activeStage.phase}</span>
            <h3 className={styles.panelTitle}>{activeStage.title}</h3>
          </div>

          <p className={styles.panelDetail}>{activeStage.detail}</p>

          <div className={styles.panelGrid}>
            <div className={styles.metaCard}>
              <span className={styles.metaLabel}>CONCRETE DELIVERABLE</span>
              <p className={styles.metaContent}>{activeStage.deliverable}</p>
            </div>
            <div className={styles.metaCard}>
              <span className={styles.metaLabel}>WHY IT MATTERS</span>
              <p className={styles.metaContent}>{activeStage.whyItMatters}</p>
            </div>
          </div>
        </div>

        <div className={styles.footerAction}>
          <Link to="/process" className={styles.processLink}>
            <span>View Complete Engineering Deliverables & Checkpoints</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
