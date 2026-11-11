import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { teamMembers, type TeamMember } from "../data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function TeamScrollShowcase({ members = teamMembers }: { members?: TeamMember[] } = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(1 / members.length);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const leftStageRef = useRef<HTMLDivElement | null>(null);
  const rightStageRef = useRef<HTMLDivElement | null>(null);
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
              setActiveIndex(0);
              setScrollProgress(1 / members.length);
              return;
            }
            const ratio = self.progress;
            const count = members.length;
            const nextIdx = Math.min(count - 1, Math.max(0, Math.floor(ratio * count)));
            setActiveIndex(nextIdx);
            setScrollProgress(Math.max(1 / count, (nextIdx + 1) / count));
          },
        });
      });

      return () => mm.revert();
    },
    { scope: trackRef, dependencies: [members.length] },
  );

  useGSAP(
    () => {
      const inactivePortraits =
        leftStageRef.current?.querySelectorAll(".team-portrait-slide:not(.is-active)") ?? [];
      const inactiveCopies =
        rightStageRef.current?.querySelectorAll(".team-copy-slide:not(.is-active)") ?? [];

      gsap.set(inactivePortraits, { clearProps: "all" });
      gsap.set(inactiveCopies, { clearProps: "all" });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const activePortrait = leftStageRef.current?.querySelector(".team-portrait-slide.is-active");
        const activeCopy = rightStageRef.current?.querySelector(".team-copy-slide.is-active");

        if (activePortrait) {
          gsap.fromTo(
            activePortrait,
            { autoAlpha: 0, scale: 0.985, y: 12 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.38, ease: "power3.out", overwrite: "auto" },
          );
        }
        if (activeCopy) {
          gsap.fromTo(
            activeCopy,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out", overwrite: "auto" },
          );
        }
      });
      return () => mm.revert();
    },
    { dependencies: [activeIndex] },
  );

  const jumpToMember = (index: number) => {
    const bounded = Math.max(0, Math.min(members.length - 1, index));
    manualLockRef.current = Date.now() + 1500;
    setActiveIndex(bounded);
    setScrollProgress((bounded + 1) / members.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      jumpToMember(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      jumpToMember(activeIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) jumpToMember(activeIndex + 1);
      else jumpToMember(activeIndex - 1);
    }
    touchStartX.current = null;
  };

  const activeMember = members[activeIndex] ?? members[0];

  return (
    <div
      ref={trackRef}
      className="team-fullbleed-track"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="team-fullbleed-sticky">
        <div className="team-split-screen">
          {/* LEFT 50% OF SCREEN: FULL-BLEED PORTRAIT & LAYERED CHAMELEON VISUAL STAGE */}
          <div ref={leftStageRef} className="team-left-visual-pane">
            {/* Multi-layered Kirjane Chameleon logos in the background */}
            <div className="team-visual-logo-layers" aria-hidden="true">
              <img
                src="/brand/chameleon-green.png"
                alt=""
                className="bg-logo-layer bg-logo-giant"
                style={{
                  transform: `translate3d(${activeIndex * -12}px, ${activeIndex * 8}px, 0) scale(${1.04 + activeIndex * 0.02})`,
                }}
              />
              <img
                src="/brand/chameleon-white.png"
                alt=""
                className="bg-logo-layer bg-logo-ghost"
                style={{
                  transform: `translate3d(${activeIndex * 10}px, ${activeIndex * -6}px, 0)`,
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
                            r="66"
                            fill="rgba(146, 192, 86, 0.10)"
                            stroke="rgba(163, 209, 101, 0.55)"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M66 460C66 352 124 292 200 292C276 292 334 352 334 460"
                            fill="rgba(15, 38, 26, 0.78)"
                            stroke="rgba(163, 209, 101, 0.45)"
                            strokeWidth="1.5"
                          />
                        </svg>
                        <div className="figure-monogram-stamp">{member.avatarCode}</div>
                      </div>
                    )}

                    <div className="portrait-bottom-bar">
                      <div className="portrait-bottom-meta">
                        <span className="portrait-slot-code">
                          ROSTER PROFILE · {member.index} / 0{members.length}
                        </span>
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

          {/* RIGHT 50% OF SCREEN: VERIFIED ROLE, RESPONSIBILITIES & ROSTER CONTROLS */}
          <div ref={rightStageRef} className="team-right-content-pane">
            <img
              src="/brand/chameleon-green.png"
              alt=""
              aria-hidden="true"
              className="team-right-watermark"
            />

            {/* Top Header & Prev/Next Controls */}
            <div className="team-right-header">
              <div className="team-right-kicker-group">
                <span className="section-kicker">The People Behind Kirjane</span>
                <div className="team-step-controls">
                  <button
                    type="button"
                    className="team-nav-arrow"
                    onClick={() => jumpToMember(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    aria-label="Previous team member"
                  >
                    ←
                  </button>
                  <span className="team-step-counter" aria-live="polite">
                    {activeMember.index} <em>/ 0{members.length}</em>
                  </span>
                  <button
                    type="button"
                    className="team-nav-arrow"
                    onClick={() => jumpToMember(activeIndex + 1)}
                    disabled={activeIndex === members.length - 1}
                    aria-label="Next team member"
                  >
                    →
                  </button>
                </div>
              </div>
              <div className="team-progress-rail" aria-hidden="true">
                <div
                  className="team-progress-fill"
                  style={{ transform: `scaleX(${Math.max(0.14, scrollProgress)})` }}
                />
              </div>
            </div>

            {/* Center Verified Bio Deck */}
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

                    <div className="team-member-focus-box">
                      <span className="focus-box-label">Operational Focus</span>
                      <p className="focus-box-copy">{member.focusHighlight}</p>
                    </div>

                    <p className="team-member-bio">{member.summaryPlaceholder}</p>

                    <div className="team-deliverables-row">
                      {member.deliverables.map((item) => (
                        <div key={item} className="team-deliverable-pill">
                          <span aria-hidden="true">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

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
