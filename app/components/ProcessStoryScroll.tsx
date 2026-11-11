import { useEffect, useRef, useState } from "react";
import { processSteps } from "../data/content";

const stepVisualMetrics: Record<
  string,
  {
    phaseTag: string;
    deliverable: string;
    nodes: [string, string, string];
    metricLabel: string;
    metricValue: string;
  }
> = {
  "01": {
    phaseTag: "OPERATIONAL AUDIT",
    deliverable: "Workflow & Bottleneck Map",
    nodes: ["Cashier / Frontline Flow", "Department Hand-offs", "Pain-Point Audit"],
    metricLabel: "Discovery Focus",
    metricValue: "Real Staff Workflows",
  },
  "02": {
    phaseTag: "ACCOUNTING & DATA SCHEMA",
    deliverable: "Ledger & Permission Blueprint",
    nodes: ["Double-Entry Rules", "Role Access Matrix", "Database Schema"],
    metricLabel: "Co-Designed By",
    metricValue: "Engineers + Accountants",
  },
  "03": {
    phaseTag: "CORE ENGINEERING",
    deliverable: "Backend Kernel & Fast UI",
    nodes: ["Zero-Drift API Core", "Sub-Second Interface", "Offline-Safe Sync"],
    metricLabel: "Architecture Standard",
    metricValue: "Enterprise Grade",
  },
  "04": {
    phaseTag: "STRESS VERIFICATION",
    deliverable: "Audit & Load Certification",
    nodes: ["Balance Sheet Check", "Role Boundary Test", "Peak Traffic Simulation"],
    metricLabel: "Accuracy Target",
    metricValue: "100% Verified",
  },
  "05": {
    phaseTag: "CLOUD & MANAGED HOSTING",
    deliverable: "Live Deployment & 24/7 Care",
    nodes: ["Automated CI/CD Release", "Managed Web Hosting", "Daily Encrypted Backups"],
    metricLabel: "Bohol Support Team",
    metricValue: "Always On Standby",
  },
};

export function ProcessStoryScroll() {
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let rafId = 0;

    const updateFromScroll = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable <= 0) {
        return;
      }

      const scrolled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const ratio = scrolled / totalScrollable;
      setScrollProgress(ratio);

      const count = processSteps.length;
      const idx = Math.min(count - 1, Math.max(0, Math.floor(ratio * count)));
      setActiveStep(idx);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateFromScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateFromScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goToStep = (index: number) => {
    const bounded = Math.max(0, Math.min(processSteps.length - 1, index));
    const track = trackRef.current;
    if (!track) {
      setActiveStep(bounded);
      return;
    }
    const rect = track.getBoundingClientRect();
    const trackTopDoc = window.scrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;

    if (totalScrollable <= 10) {
      setActiveStep(bounded);
      setScrollProgress((bounded + 1) / processSteps.length);
      return;
    }

    const targetRatio = (bounded + 0.35) / processSteps.length;
    window.scrollTo({
      top: trackTopDoc + targetRatio * totalScrollable,
      behavior: "smooth",
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) goToStep(activeStep + 1);
      else goToStep(activeStep - 1);
    }
    touchStartX.current = null;
  };

  return (
    <div
      ref={trackRef}
      className="process-story-track"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="process-story-sticky">
        {/* Layered Kirjane Chameleon logos in the background */}
        <div className="process-bg-logos" aria-hidden="true">
          <img
            src="/brand/chameleon-green.png"
            alt=""
            className="process-bg-logo-left"
            style={{
              transform: `translate3d(0, ${activeStep * -16}px, 0) rotate(${activeStep * 3}deg)`,
            }}
          />
          <img
            src="/brand/chameleon-color.png"
            alt=""
            className="process-bg-logo-right"
            style={{
              transform: `translate3d(${activeStep * -18}px, 0, 0) scale(${1 + activeStep * 0.04})`,
            }}
          />
        </div>

        <div className="page-shell process-story-shell">
          {/* Header & Interactive Progress Timeline */}
          <div className="process-story-top">
            <div className="process-story-title-row">
              <div>
                <span className="arch-eyebrow">05 / HOW WE WORK</span>
                <h2 className="process-story-heading">
                  From first conversation to live system—in five clear stages.
                </h2>
              </div>
              <div className="process-swipe-controls">
                <button
                  type="button"
                  className="process-step-arrow"
                  onClick={() => goToStep(activeStep - 1)}
                  disabled={activeStep === 0}
                  aria-label="Previous step"
                >
                  ←
                </button>
                <span className="process-step-readout">
                  0{activeStep + 1} / 0{processSteps.length}
                </span>
                <button
                  type="button"
                  className="process-step-arrow"
                  onClick={() => goToStep(activeStep + 1)}
                  disabled={activeStep === processSteps.length - 1}
                  aria-label="Next step"
                >
                  →
                </button>
              </div>
            </div>

            {/* Progressive Horizontal Timeline Bar */}
            <div className="process-timeline-bar" role="tablist" aria-label="Delivery stages">
              <div className="process-timeline-line" aria-hidden="true">
                <div
                  className="process-timeline-line-fill"
                  style={{
                    transform: `scaleX(${Math.max(0.12, scrollProgress || (activeStep + 1) / processSteps.length)})`,
                  }}
                />
              </div>
              <div className="process-timeline-nodes">
                {processSteps.map((step, idx) => {
                  const isCurrent = idx === activeStep;
                  const isDone = idx <= activeStep;
                  return (
                    <button
                      key={step.number}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      onClick={() => goToStep(idx)}
                      className={`process-timeline-node ${isCurrent ? "is-current" : ""} ${isDone ? "is-done" : ""}`.trim()}
                    >
                      <span className="node-dot" />
                      <span className="node-num">{step.number}</span>
                      <span className="node-label">{step.title.split("&")[0].trim()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Animated Storytelling Stage */}
          <div className="process-stage-deck">
            {processSteps.map((step, idx) => {
              const state = idx === activeStep ? "active" : idx < activeStep ? "past" : "upcoming";
              const meta = stepVisualMetrics[step.number] ?? stepVisualMetrics["01"];

              return (
                <article
                  key={step.number}
                  className={`process-story-slide is-${state}`}
                  aria-hidden={state !== "active"}
                >
                  {/* Left: Concise Storytelling Narrative */}
                  <div className="process-slide-narrative">
                    <div className="process-slide-num-row">
                      <span className="process-giant-num">{step.number}</span>
                      <span className="arch-tag-solid">{meta.phaseTag}</span>
                    </div>
                    <h3>{step.title}</h3>
                    <p className="process-slide-lead">{step.detail}</p>
                    <div className="process-question-strip">
                      <span>KEY QUESTION SOLVED</span>
                      <strong>“{step.question}”</strong>
                    </div>
                  </div>

                  {/* Right: Live Architectural Schematic Card */}
                  <div className="process-slide-schematic">
                    <div className="schematic-top-bar">
                      <span>STAGE DELIVERABLE</span>
                      <strong>{meta.deliverable}</strong>
                    </div>

                    <div className="schematic-pipeline">
                      {meta.nodes.map((node, nIdx) => (
                        <div key={node} className="schematic-node-box">
                          <span className="schematic-node-idx">
                            {step.number}.0{nIdx + 1}
                          </span>
                          <strong>{node}</strong>
                          <span className="schematic-node-check">✓</span>
                        </div>
                      ))}
                    </div>

                    <div className="schematic-bottom-bar">
                      <div className="schematic-brand-seal">
                        <img src="/brand/chameleon-color.png" alt="" />
                        <div>
                          <span>{meta.metricLabel}</span>
                          <strong>{meta.metricValue}</strong>
                        </div>
                      </div>
                      <span className="schematic-step-indicator">STAGE {step.number} ACTIVE</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
