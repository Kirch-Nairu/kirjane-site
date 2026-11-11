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
    <div ref={trackRef} className="team-fullbleed-track">
      <div className="team-fullbleed-sticky">
        <div className="team-split-screen">
          {/* LEFT 50% OF SCREEN: FULL-BLEED PORTRAIT & LAYERED LOGO VISUAL STAGE */}
          <div className="team-left-visual-pane">
            {/* Multi-layered Kirjane Chameleon logos in the background */}
            <div className="team-visual-logo-layers" aria-hidden="true">
              <img
                src="/brand/chameleon-green.png"
                alt=""
                className="bg-logo-layer bg-logo-giant"
                style={{
                  transform: `translate3d(${activeIndex * -14}px, ${activeIndex * 10}px, 0) scale(${1.05 + activeIndex * 0.03})`,
                }}
              />
              <img
                src="/brand/chameleon-white.png"
                alt=""
                className="bg-logo-layer bg-logo-Ghost"
                style={{
                  transform: `translate3d(${activeIndex * 12}px, ${activeIndex * -8}px, 0)`,
                }}
              />
            </div>

            <div className="team-left-grid-overlay" aria-hidden="true" />

            {/* Stacked Full-Height Portrait Slides */}
            <div className="team-portrait-stack">
              {members.map((member, idx) => {
                const state =
                  idx === activeIndex ? "active" : idx < activeIndex ? "past" : "upcoming";
                return (
                  <div
                    key={member.id}
                    className={`team-portrait-slide is-${state}`}
                    aria-hidden={state !== "active"}
                  >
                    <div className="portrait-giant-index" aria-hidden="true">
                      {member.index}
                    </div>

                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="team-fullbleed-photo"
                      />
                    ) : (
                      <div className="team-architectural-figure" aria-hidden="true">
                        <div className="figure-halo" />
                        <img
                          src="/brand/chameleon-color.png"
                          alt=""
                          className="figure-crest-mark"
                        />
                        <svg
                          viewBox="0 0 400 480"
                          className="figure-silhouette-svg"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="200"
                            cy="155"
                            r="68"
                            fill="rgba(149, 193, 89, 0.08)"
                            stroke="rgba(149, 193, 89, 0.55)"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M64 460C64 352 122 292 200 292C278 292 336 352 336 460"
                            fill="rgba(15, 36, 24, 0.72)"
                            stroke="rgba(149, 193, 89, 0.45)"
                            strokeWidth="1.5"
                          />
                        </svg>
                        <div className="figure-monogram-stamp">{member.avatarCode}</div>
                      </div>
                    )}

                    <div className="portrait-bottom-bar">
                      <div className="portrait-bottom-meta">
                        <span className="portrait-slot-code">PORTRAIT // {member.index}</span>
                        <strong>{member.name}</strong>
                      </div>
                      <span className="portrait-role-pill">
                        {member.secondaryRole ?? (member.isFounder ? "Co-Founder" : "Specialist")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT 50% OF SCREEN: EDITORIAL BIO, QUOTE & ROSTER STAGE */}
          <div className="team-right-content-pane">
            <img
              src="/brand/chameleon-green.png"
              alt=""
              aria-hidden="true"
              className="team-right-watermark"
            />

            {/* Top Bar */}
            <div className="team-right-header">
              <div className="team-right-kicker-group">
                <span className="arch-eyebrow">04 / THE PEOPLE BEHIND KIRJANE</span>
                <span className="team-step-counter">
                  {activeMember.index} <em>/ 0{members.length}</em>
                </span>
              </div>
              <div className="team-progress-rail" aria-hidden="true">
                <div
                  className="team-progress-fill"
                  style={{ transform: `scaleX(${Math.max(0.14, scrollProgress)})` }}
                />
              </div>
            </div>

            {/* Center Bio Deck */}
            <div className="team-copy-deck">
              {members.map((member, idx) => {
                const state =
                  idx === activeIndex ? "active" : idx < activeIndex ? "past" : "upcoming";
                const disciplines = member.discipline.split("·").map((d) => d.trim());

                return (
                  <article
                    key={member.id}
                    className={`team-copy-slide is-${state}`}
                    aria-hidden={state !== "active"}
                  >
                    <div className="team-badges-row">
                      <span className="arch-tag-solid">
                        {member.isFounder ? "Founding Leadership" : "Core Specialist"}
                      </span>
                      {member.secondaryRole ? (
                        <span className="arch-tag-outline">{member.secondaryRole}</span>
                      ) : null}
                    </div>

                    <h3 className="team-member-heading">{member.name}</h3>
                    <p className="team-member-title">{member.role}</p>

                    <blockquote className="team-member-quote">“{member.quote}”</blockquote>

                    <p className="team-member-bio">{member.summaryPlaceholder}</p>

                    <div className="team-discipline-chips">
                      {disciplines.map((d) => (
                        <span key={d} className="discipline-chip">
                          {d}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Bottom Interactive Roster Strip */}
            <div className="team-roster-Dock" role="tablist" aria-label="Select team member">
              {members.map((member, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={member.id}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    onClick={() => jumpToMember(idx)}
                    className={isCurrent ? "roster-dock-btn is-active" : "roster-dock-btn"}
                  >
                    <span className="roster-dock-idx">{member.index}</span>
                    <span className="roster-dock-name">{member.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
