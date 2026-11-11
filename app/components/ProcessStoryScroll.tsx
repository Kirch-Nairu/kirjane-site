import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { processSteps } from "../data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function ProcessStoryScroll() {
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(1 / processSteps.length);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const manualLockRef = useRef<number>(0);
  const touchStartX = useRef<number | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: track,
          start: "top 72px",
          end: "bottom 72px",
          onUpdate: (self) => {
            if (Date.now() < manualLockRef.current) return;
            if (typeof window !== "undefined" && window.scrollY <= 20) {
              setActiveStep(0);
              setScrollProgress(1 / processSteps.length);
              return;
            }
            const ratio = self.progress;
            const count = processSteps.length;
            const idx = Math.min(count - 1, Math.max(0, Math.floor(ratio * count)));
            setActiveStep(idx);
            setScrollProgress(Math.max(1 / count, (idx + 1) / count));
          },
        });
      });

      return () => mm.revert();
    },
    { scope: trackRef },
  );

  useGSAP(
    () => {
      const inactiveSlides =
        deckRef.current?.querySelectorAll(".process-story-slide:not(.is-active)") ?? [];
      gsap.set(inactiveSlides, { clearProps: "all" });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const activeSlide = deckRef.current?.querySelector(".process-story-slide.is-active");
        if (activeSlide) {
          gsap.fromTo(
            activeSlide,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out", overwrite: "auto" },
          );
        }
      });
      return () => mm.revert();
    },
    { dependencies: [activeStep] },
  );

  const goToStep = (index: number) => {
    const bounded = Math.max(0, Math.min(processSteps.length - 1, index));
    manualLockRef.current = Date.now() + 1500;
    setActiveStep(bounded);
    setScrollProgress((bounded + 1) / processSteps.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToStep(activeStep + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToStep(activeStep - 1);
    }
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
      onKeyDown={handleKeyDown}
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
              transform: `translate3d(0, ${activeStep * -14}px, 0) rotate(${activeStep * 2.5}deg)`,
            }}
          />
          <img
            src="/brand/chameleon-color.png"
            alt=""
            className="process-bg-logo-right"
            style={{
              transform: `translate3d(${activeStep * -16}px, 0, 0) scale(${1 + activeStep * 0.03})`,
            }}
          />
        </div>

        <div className="page-shell process-story-shell">
          {/* Header & Interactive Progress Timeline */}
          <div className="process-story-top">
            <div className="process-story-title-row">
              <div>
                <span className="section-kicker">How We Work</span>
                <h2 className="process-story-heading">
                  From first conversation to live system—in five structured stages.
                </h2>
              </div>
              <div className="process-swipe-controls">
                <button
                  type="button"
                  className="process-step-arrow"
                  onClick={() => goToStep(activeStep - 1)}
                  disabled={activeStep === 0}
                  aria-label="Previous delivery stage"
                >
                  ←
                </button>
                <span className="process-step-readout" aria-live="polite">
                  0{activeStep + 1} / 0{processSteps.length}
                </span>
                <button
                  type="button"
                  className="process-step-arrow"
                  onClick={() => goToStep(activeStep + 1)}
                  disabled={activeStep === processSteps.length - 1}
                  aria-label="Next delivery stage"
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
                    transform: `scaleX(${Math.max(0.15, scrollProgress)})`,
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
                      <span className="node-label">{step.shortTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Animated Storytelling Stage */}
          <div ref={deckRef} className="process-stage-deck">
            {processSteps.map((step, idx) => {
              const state = idx === activeStep ? "active" : idx < activeStep ? "past" : "upcoming";

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
                      <span className="arch-tag-solid">{step.phaseTag}</span>
                    </div>
                    <h3>{step.title}</h3>
                    <p className="process-slide-lead">{step.detail}</p>
                    <div className="process-question-strip">
                      <span>Key Question Addressed</span>
                      <strong>“{step.question}”</strong>
                    </div>
                  </div>

                  {/* Right: Architectural Deliverable Card */}
                  <div className="process-slide-schematic">
                    <div className="schematic-top-bar">
                      <span>Stage Deliverable</span>
                      <strong>{step.deliverable}</strong>
                    </div>

                    <div className="schematic-pipeline">
                      {step.nodes.map((node, nIdx) => (
                        <div key={node} className="schematic-node-box">
                          <span className="schematic-node-idx">
                            {step.number}.0{nIdx + 1}
                          </span>
                          <strong>{node}</strong>
                          <span className="schematic-node-check" aria-hidden="true">
                            ✓
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="schematic-bottom-bar">
                      <div className="schematic-brand-seal">
                        <img src="/brand/chameleon-color.png" alt="" />
                        <div>
                          <span>{step.metricLabel}</span>
                          <strong>{step.metricValue}</strong>
                        </div>
                      </div>
                      <span className="schematic-step-indicator">Stage {step.number}</span>
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
