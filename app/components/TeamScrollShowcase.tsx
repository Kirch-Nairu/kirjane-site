import { useEffect, useRef, useState } from "react";
import { teamMembers, type TeamMember } from "../data/content";

export function TeamScrollShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;
      if (totalScrollable <= 0) return;

      const scrolled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      setScrollProgress(scrolled / totalScrollable);

      // Determine which member trigger is closest to the viewport center
      const center = viewportHeight * 0.48;
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      stepRefs.current.forEach((el, idx) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      setActiveIndex(bestIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToMember = (idx: number) => {
    const target = stepRefs.current[idx];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setActiveIndex(idx);
    }
  };

  const activeMember: TeamMember = teamMembers[activeIndex] ?? teamMembers[0];

  return (
    <div ref={containerRef} className="team-scroll-theatre">
      {/* Sticky Full-Viewport Spotlight Stage */}
      <div className="team-sticky-stage">
        <div className="team-stage-bg-glow" data-member-index={activeIndex} aria-hidden="true" />

        <div className="team-stage-shell">
          {/* Left Rail: Roster Progress & Quick Jump */}
          <div className="team-stage-rail">
            <div className="team-rail-header">
              <span className="eyebrow eyebrow-lime">ROSTER TELEMETRY</span>
              <span className="team-rail-counter">
                0{activeIndex + 1} / 0{teamMembers.length}
              </span>
            </div>

            <div className="team-progress-track" aria-hidden="true">
              <div
                className="team-progress-fill"
                style={{ transform: `scaleY(${Math.max(0.08, scrollProgress)})` }}
              />
            </div>

            <nav className="team-rail-nav" aria-label="Jump to team member spotlight">
              {teamMembers.map((member, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => scrollToMember(idx)}
                    className={isCurrent ? "team-rail-btn active" : "team-rail-btn"}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <span className="team-rail-idx">{member.index}</span>
                    <span className="team-rail-name">{member.name}</span>
                    <span className="team-rail-tag">{member.avatarCode.split("//")[1]?.trim()}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Center / Right: Active Member Cinematic Spotlight */}
          <div key={activeMember.id} className="team-spotlight-card">
            <div className="team-spotlight-visual">
              <div className="team-portrait-frame">
                <div className="portrait-corner portrait-tl" aria-hidden="true" />
                <div className="portrait-corner portrait-tr" aria-hidden="true" />
                <div className="portrait-corner portrait-bl" aria-hidden="true" />
                <div className="portrait-corner portrait-br" aria-hidden="true" />

                <span className="portrait-giant-index" aria-hidden="true">
                  {activeMember.index}
                </span>
                <div className="portrait-monogram-badge">{activeMember.avatarCode}</div>
                <span className="portrait-placeholder-label">
                  [PLACEHOLDER: HIGH-RES PORTRAIT — {activeMember.name.toUpperCase()}]
                </span>
              </div>

              <div className="portrait-telemetry-bar">
                <span>STATUS // ACTIVE</span>
                <span>
                  {activeMember.isFounder ? "TIER // FOUNDING LEADERSHIP" : "TIER // CORE SPECIALIST"}
                </span>
              </div>
            </div>

            <div className="team-spotlight-content">
              <div className="team-spotlight-badges">
                <span className="status-chip">
                  SPOTLIGHT {activeMember.index} OF 0{teamMembers.length}
                </span>
                {activeMember.isFounder ? (
                  <span className="founder-pill-highlight">FOUNDER / CO-FOUNDER</span>
                ) : (
                  <span className="ops-pill-highlight">OPERATIONS & ENGINEERING</span>
                )}
              </div>

              <h3 className="team-spotlight-name">{activeMember.name}</h3>
              <p className="team-spotlight-role">{activeMember.role}</p>
              {activeMember.secondaryRole ? (
                <p className="team-spotlight-subrole">{activeMember.secondaryRole}</p>
              ) : null}

              <div className="team-discipline-pills">
                {activeMember.discipline.split("·").map((item) => (
                  <span key={item.trim()} className="discipline-chip">
                    {item.trim()}
                  </span>
                ))}
              </div>

              <div className="team-spotlight-bio-box">
                <span className="eyebrow eyebrow-lime">OPERATIONAL FOCUS & BIO SLOT</span>
                <p>{activeMember.summaryPlaceholder}</p>
              </div>

              <div className="team-scroll-hint">
                <span>SCROLL TO TRANSITION SPOTLIGHT</span>
                <span aria-hidden="true">↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Trigger Waypoints (Drives the sticky stage as user scrolls) */}
      <div className="team-scroll-waypoints" aria-hidden="true">
        {teamMembers.map((member, idx) => (
          <div
            key={member.id}
            ref={(el) => {
              stepRefs.current[idx] = el;
            }}
            className="team-waypoint-step"
            data-step={member.index}
          />
        ))}
      </div>
    </div>
  );
}
