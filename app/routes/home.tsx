import { useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { company, scorynRecognitions, services, teamMembers } from "../data/content";
import { Reveal } from "../components/Motion";
import { SalrynInteractiveSimulator } from "../components/SalrynInteractiveSimulator";
import { TeamScrollShowcase } from "../components/TeamScrollShowcase";
import { ProcessStoryScroll } from "../components/ProcessStoryScroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function meta() {
  return [
    {
      title: "Kirjane Labs — Enterprise Software, Backend & Business Systems | Bohol, Philippines",
    },
    {
      name: "description",
      content:
        "Kirjane Labs (Kirjane IT Solutions) in Bohol, Philippines engineers dependable backend architecture, managed web hosting, Salryn BMS, Scoryn automated tabulation, and the Talibon Intra-Office System.",
    },
  ];
}

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!hero) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          ".arch-hero-logo-layers",
          { autoAlpha: 0, scale: 0.98 },
          { autoAlpha: 1, scale: 1, duration: 0.85 },
          0,
        )
          .fromTo(
            ".hero-anim-item",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.065 },
            0.05,
          )
          .fromTo(
            ".arch-spec-panel",
            { autoAlpha: 0, y: 18, scale: 0.99 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 },
            0.14,
          )
          .fromTo(
            ".arch-pillar-cell",
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.045 },
            0.22,
          );

        gsap.to(".hero-bg-logo-outer", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });

        gsap.to(".hero-bg-logo-inner", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [".arch-hero-logo-layers", ".hero-anim-item", ".arch-spec-panel", ".arch-pillar-cell"],
          {
            clearProps: "all",
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
          },
        );
      });

      return () => mm.revert();
    },
    { scope: heroRef },
  );

  return (
    <>
      {/* 01 · CORPORATE EDITORIAL HERO — CLEAN PAPER GRID + MULTI-LAYER CHAMELEON DEPTH */}
      <section ref={heroRef} className="arch-hero">
        <div className="arch-hero-logo-layers" aria-hidden="true">
          <img
            src={company.logos.chameleonGreen}
            alt=""
            className="hero-bg-logo hero-bg-logo-outer"
          />
          <img
            src={company.logos.chameleonColor}
            alt=""
            className="hero-bg-logo hero-bg-logo-inner"
          />
          <img
            src={company.logos.chameleonGreen}
            alt=""
            className="hero-bg-logo hero-bg-logo-accent"
          />
        </div>

        <div className="page-shell arch-hero-grid">
          {/* Left: Corporate Editorial Headline & Direct Actions */}
          <div className="arch-hero-left">
            <div className="arch-hero-meta-row hero-anim-item">
              <span className="section-kicker">{company.hero.eyebrow}</span>
              <span className="arch-legal-tag">{company.legalName}</span>
            </div>

            <h1 className="arch-hero-title hero-anim-item">{company.hero.headline}</h1>

            <p className="arch-hero-sub hero-anim-item">{company.hero.subheadline}</p>

            <div className="arch-hero-actions hero-anim-item">
              <Link to="/contact" className="btn-arch-primary">
                <span>{company.hero.primaryCta}</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/projects" className="btn-arch-secondary">
                {company.hero.secondaryCta}
              </Link>
            </div>
          </div>

          {/* Right: Kirjane System & Product Overview Panel */}
          <div className="arch-hero-right">
            <aside className="arch-spec-panel" aria-label="Kirjane Labs company and product summary">
              <div className="arch-spec-header">
                <span className="arch-spec-logo-box">
                  <img
                    src={company.logos.chameleonColor}
                    alt="Kirjane Labs Chameleon K emblem"
                    className="arch-spec-logo"
                  />
                </span>
                <div className="arch-spec-titles">
                  <strong>{company.brandName}</strong>
                  <span>{company.motto}</span>
                </div>
                <span className="arch-live-badge">{company.location}</span>
              </div>

              <div className="arch-spec-cells">
                {company.hero.specCells.map((cell) => (
                  <div key={cell.title} className="arch-spec-cell">
                    <span>{cell.label}</span>
                    <strong>{cell.title}</strong>
                    <small>{cell.detail}</small>
                  </div>
                ))}
              </div>

              <div className="arch-spec-footer">
                <span>Direct Engineering Inquiry</span>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>
            </aside>
          </div>
        </div>

        {/* Bottom 4-Pillar Quick Index Bar */}
        <div className="arch-hero-bottom-strip">
          <div className="page-shell arch-pillars-row">
            {company.pillars.map((pillar) => (
              <Link key={pillar.title} to={pillar.href} className="arch-pillar-cell">
                <div className="arch-pillar-top">
                  <span className="arch-pillar-idx">{pillar.index}</span>
                  <span className="arch-pillar-label">{pillar.label}</span>
                </div>
                <strong className="arch-pillar-name">{pillar.title}</strong>
                <span className="arch-pillar-arrow">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 02 · CORE CAPABILITIES — CONCISE, LOW-TEXT EDITORIAL LEDGER */}
      <section className="arch-section arch-section-surface">
        <div className="arch-capabilities-bg-logos" aria-hidden="true">
          <img src={company.logos.chameleonColor} alt="" className="cap-bg-logo-1" />
          <img src={company.logos.chameleonGreen} alt="" className="cap-bg-logo-2" />
        </div>

        <div className="page-shell">
          <Reveal className="arch-section-header">
            <div>
              <span className="section-kicker">Core Engineering &amp; Web Hosting</span>
              <h2 className="arch-section-title">
                Strong backend architecture, security, cloud operations, and web hosting.
              </h2>
            </div>
            <div className="arch-header-cta">
              <Link to="/services" className="btn-arch-secondary">
                See Full Service Scope →
              </Link>
            </div>
          </Reveal>

          <ol className="editorial-cap-ledger">
            {services.map((cap) => (
              <li key={cap.number} className="editorial-cap-row">
                <div className="editorial-cap-meta">
                  <span className="editorial-cap-num">{cap.number}</span>
                  <span className="editorial-cap-label">{cap.shortLabel}</span>
                </div>

                <div className="editorial-cap-main">
                  <h3>{cap.title}</h3>
                  <p>{cap.shortSummary}</p>
                </div>

                <div className="editorial-cap-tags">
                  {cap.tags.map((tag) => (
                    <span key={tag} className="editorial-cap-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 · FLAGSHIP PRODUCTS & INSTITUTIONAL WORK */}
      <section className="arch-section arch-section-light">
        <img
          src={company.logos.chameleonGreen}
          alt=""
          aria-hidden="true"
          className="section-watermark-logo watermark-right"
        />

        <div className="page-shell">
          <Reveal className="arch-section-header">
            <div>
              <span className="section-kicker">Products &amp; Institutional Work</span>
              <h2 className="arch-section-title">
                Salryn business kernel, Scoryn live tabulation, and the Talibon Intra-Office System.
              </h2>
            </div>
            <p className="arch-section-lead">
              Explore the interactive Salryn BMS product demonstration across six industry
              configurations, or review our municipal workflow and live event systems.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <SalrynInteractiveSimulator />
          </Reveal>

          {/* Architectural Split for Scoryn & Talibon Intra-Office */}
          <div className="arch-deployments-split">
            <Reveal direction="up" delay={40} className="arch-deployment-box">
              <div className="arch-deployment-top">
                <span className="section-kicker">Product · Scoryn</span>
                <span className="arch-tag-outline">Automated Tabulation</span>
              </div>
              <h3>Scoryn — Live Event &amp; Pageant Scoring</h3>
              <p>
                Judges score on digital terminals while Scoryn computes weighted criteria, round
                rankings, tie-breakers, and print-ready audit sheets for event organizers.
              </p>

              <div className="arch-event-badges">
                {scorynRecognitions.map((ev) => (
                  <div key={ev.title} className="arch-event-item">
                    <strong>{ev.title}</strong>
                    <span>Featured Event</span>
                  </div>
                ))}
              </div>

              <div className="arch-deployment-foot">
                <Link to="/contact" className="btn-arch-inline">
                  Inquire About Scoryn →
                </Link>
                <Link to="/projects#scoryn-tabulation" className="arch-muted-link">
                  System Overview
                </Link>
              </div>
            </Reveal>

            <Reveal direction="up" delay={100} className="arch-deployment-box arch-deployment-dark">
              <img
                src={company.logos.chameleonWhite}
                alt=""
                aria-hidden="true"
                className="deployment-box-watermark"
              />
              <div className="arch-deployment-top">
                <span className="section-kicker light">Institutional Project · Municipal</span>
                <span className="arch-tag-solid">Talibon, Bohol</span>
              </div>
              <h3>Talibon Intra-Office System</h3>
              <p>
                Developed for municipal office operations in Talibon—replacing manual paper routing
                with inter-departmental document tracking, status logs, and digital archiving.
              </p>

              <div className="arch-stat-strip">
                <div>
                  <span>Workflow</span>
                  <strong>Inter-Office Routing</strong>
                </div>
                <div>
                  <span>Permissions</span>
                  <strong>Role-Based Access</strong>
                </div>
                <div>
                  <span>Records</span>
                  <strong>Receiving &amp; Status Logs</strong>
                </div>
              </div>

              <div className="arch-deployment-foot">
                <Link to="/projects#talibon-intra-office" className="btn-arch-inline light">
                  Project Details →
                </Link>
                <Link to="/contact" className="arch-muted-link light">
                  Discuss a Custom System
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 · THE PEOPLE BEHIND KIRJANE — FULL-BLEED 50/50 SPLIT SCREEN */}
      <section className="arch-fullbleed-section" aria-label="The People Behind Kirjane">
        <TeamScrollShowcase members={teamMembers} />
      </section>

      {/* 05 · HOW WE WORK — PROGRESSIVE 5-STAGE STORYTELLING MOTION */}
      <section className="arch-process-section" aria-label="How We Work">
        <ProcessStoryScroll />
      </section>

      {/* 06 · CLOSING CALLOUT */}
      <section className="arch-closing-band">
        <img
          src={company.logos.chameleonWhite}
          alt=""
          aria-hidden="true"
          className="closing-watermark-logo"
        />
        <div className="page-shell arch-closing-grid">
          <div>
            <span className="section-kicker light">Start a Conversation</span>
            <h2>Ready to deploy Salryn, book Scoryn, or build a custom system?</h2>
            <p>
              Based in {company.location}. Speak directly with our engineering and accounting leads.
            </p>
          </div>
          <div className="arch-closing-actions">
            <Link to="/contact" className="btn-arch-primary">
              <span>{company.hero.primaryCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
            <a href={`mailto:${company.email}`} className="btn-arch-secondary light">
              {company.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
