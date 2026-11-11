import { useEffect, useRef, useState } from "react";
import { teamMembers, type TeamMember } from "../data/content";

export function TeamScrollShowcase({ members = teamMembers }: { members?: TeamMember[] } = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;

    const updateFromScroll = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable <= 0) {
        setScrollProgress(0);
        return;
      }

      const scrolled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const ratio = scrolled / totalScrollable;
      setScrollProgress(ratio);

      const count = members.length;
      const nextIdx = Math.min(count - 1, Math.max(0, Math.floor(ratio * count)));
      setActiveIndex(nextIdx);
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
  }, [members.length]);

  const jumpToMember = (index: number) => {
    const track = trackRef.current;
    if (!track) {
      setActiveIndex(index);
      return;
    }
    const rect = track.getBoundingClientRect();
    const trackTopDocument = window.scrollY + rect.top;
    const viewportHeight = window.innerHeight;
    const totalScrollable = rect.height - viewportHeight;

    if (totalScrollable <= 0) {
      setActiveIndex(index);
      return;
    }

    const targetRatio = (index + 0.35) / members.length;
    window.scrollTo({
      top: trackTopDocument + targetRatio * totalScrollable,
      behavior: "smooth",
    });
  };

  const activeMember = members[activeIndex] ?? members[0];

  return (
    <div ref={trackRef} className="team-theatre-track">
      <div className="team-theatre-sticky">
        {/* Ambient radial glow that shifts subtly per member */}
        <div
          className="team-theatre-glow"
          style={{
            background: `radial-gradient(650px circle at ${28 + activeIndex * 9}% 38%, rgba(149, 193, 89, 0.16), rgba(45, 114, 70, 0.08) 45%, transparent 72%)`,
          }}
          aria-hidden="true"
        />

        <div className="team-theatre-grid">
          {/* Left Column: Roster Index & Smooth Progress */}
          <aside className="team-roster-sidebar" aria-label="Team spotlight navigation">
            <div className="team-roster-top">
              <span className="team-roster-label">Leadership & Team</span>
              <span className="team-roster-fraction">
                {activeMember.index} <span>/ 0{members.length}</span>
              </span>
            </div>

            <div className="team-roster-progress" aria-hidden="true">
              <div
                className="team-roster-progress-bar"
                style={{ transform: `scaleX(${Math.max(0.14, scrollProgress)})` }}
              />
            </div>

            <div className="team-roster-list" role="tablist" aria-label="People of Kirjane">
              {members.map((member, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={member.id}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    onClick={() => jumpToMember(idx)}
                    className={isCurrent ? "team-roster-item is-active" : "team-roster-item"}
                  >
                    <span className="team-roster-num">{member.index}</span>
                    <span className="team-roster-person">
                      <strong>{member.name}</strong>
                      <small>{member.secondaryRole ?? member.role}</small>
                    </span>
                    <span className="team-roster-dot" aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <p className="team-scroll-caption">
              Scroll down to step through each spotlight, or select a name above.
            </p>
          </aside>

          {/* Center & Right: Layered Animated Spotlight Stage */}
          <div className="team-stage-deck">
            {members.map((member, idx) => {
              const state =
                idx === activeIndex ? "active" : idx < activeIndex ? "past" : "upcoming";
              const disciplines = member.discipline.split("·").map((d) => d.trim());

              return (
                <article
                  key={member.id}
                  className={`team-slide-panel is-${state}`}
                  aria-hidden={state !== "active"}
                >
                  {/* Editorial Portrait Frame Placeholder */}
                  <div className="team-editorial-portrait">
                    <div className="portrait-backdrop-mesh" aria-hidden="true">
                      <img
                        src="/brand/chameleon-white.png"
                        alt=""
                        className="portrait-watermark-logo"
                      />
                    </div>

                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="portrait-real-photo"
                      />
                    ) : (
                      <div className="portrait-silhouette-stage" aria-hidden="true">
                        {/* Refined Architectural Silhouette SVG */}
                        <svg
                          viewBox="0 0 240 280"
                          className="portrait-silhouette-svg"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="120"
                            cy="92"
                            r="42"
                            fill="rgba(255,255,255,0.1)"
                            stroke="rgba(149,193,89,0.55)"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M44 260C44 206 76 174 120 174C164 174 196 206 196 260"
                            fill="rgba(255,255,255,0.06)"
                            stroke="rgba(149,193,89,0.45)"
                            strokeWidth="1.5"
                          />
                        </svg>
                        <div className="portrait-monogram-pill">{member.avatarCode}</div>
                      </div>
                    )}

                    <div className="portrait-frame-footer">
                      <span className="portrait-frame-number">{member.index}</span>
                      <span className="portrait-frame-caption">Portrait Reserved · {member.name}</span>
                    </div>
                  </div>

                  {/* Editorial Narrative Column */}
                  <div className="team-editorial-copy">
                    <div className="team-meta-row">
                      <span className="team-tier-badge">
                        {member.isFounder ? "Founding Leadership" : "Operations & Growth"}
                      </span>
                      {member.secondaryRole ? (
                        <span className="team-credential-badge">{member.secondaryRole}</span>
                      ) : null}
                    </div>

                    <h3 className="team-display-name">{member.name}</h3>
                    <p className="team-display-role">{member.role}</p>

                    <blockquote className="team-pull-quote">“{member.quote}”</blockquote>

                    <p className="team-bio-paragraph">{member.summaryPlaceholder}</p>

                    <div className="team-focus-row">
                      {disciplines.map((d) => (
                        <span key={d} className="team-focus-tag">
                          {d}
                        </span>
                      ))}
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
