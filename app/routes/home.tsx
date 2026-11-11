import { Link } from "react-router";
import { company, scorynRecognitions, teamMembers } from "../data/content";
import { Reveal } from "../components/Motion";
import { SalrynInteractiveSimulator } from "../components/SalrynInteractiveSimulator";
import { TeamScrollShowcase } from "../components/TeamScrollShowcase";
import { ProcessStoryScroll } from "../components/ProcessStoryScroll";

export function meta() {
  return [
    {
      title: "Kirjane Labs — Enterprise Software, Backend & Business Systems | Bohol, Philippines",
    },
    {
      name: "description",
      content:
        "Kirjane Labs (Kirjane IT Solutions) in Bohol, Philippines engineers enterprise backend architecture, managed web hosting, Salryn BMS, Scoryn automated tabulation, and the Talibon Intra-Office System.",
    },
  ];
}

const conciseCapabilities = [
  {
    num: "01",
    label: "CORE SPECIALTY",
    title: "Backend & Database Architecture",
    line: "High-speed APIs and accounting-grade databases engineered by systems architects and CPAs.",
    tags: ["Zero-Drift Ledgers", "Multi-Branch Sync", "High-Load APIs"],
  },
  {
    num: "02",
    label: "ACCESS & AUDIT",
    title: "Security & Staff Permissions",
    line: "Strict role boundaries and tamper-proof audit trails for cashiers, managers, and executives.",
    tags: ["Role-Based Control", "Action Audit Logs", "Encrypted Sessions"],
  },
  {
    num: "03",
    label: "INFRASTRUCTURE",
    title: "Cloud Ops & Managed Web Hosting",
    line: "Automated CI/CD deployments, 24/7 server monitoring, and fast managed web hosting.",
    tags: ["Managed Hosting", "Automated Releases", "Daily Backups"],
  },
  {
    num: "04",
    label: "BESPOKE BUILD",
    title: "Tailored Systems & Custom Websites",
    line: "Custom intra-office platforms, municipal workflows, and high-craft corporate websites.",
    tags: ["Intra-Office Systems", "Custom Web Apps", "Corporate Sites"],
  },
];

export default function Home() {
  return (
    <>
      {/* 01 · ARCHITECTURAL CORPORATE HERO — CLEAN LIGHT GRID + LAYERED CHAMELEON LOGOS */}
      <section className="arch-hero">
        {/* Multi-depth background logo layers */}
        <div className="arch-hero-logo-layers" aria-hidden="true">
          <img
            src="/brand/chameleon-green.png"
            alt=""
            className="hero-bg-logo hero-bg-logo-outer"
          />
          <img
            src="/brand/chameleon-color.png"
            alt=""
            className="hero-bg-logo hero-bg-logo-inner"
          />
        </div>

        <div className="page-shell arch-hero-grid">
          {/* Left: High-Impact Corporate Headline */}
          <div className="arch-hero-left">
            <Reveal direction="up" duration={500}>
              <div className="arch-hero-meta-row">
                <span className="arch-eyebrow">01 / KIRJANE LABS · BOHOL, PHILIPPINES</span>
                <span className="arch-legal-tag">{company.legalName}</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={60} duration={600}>
              <h1 className="arch-hero-title">
                ENTERPRISE SOFTWARE BUILT FOR HOW YOUR BUSINESS ACTUALLY RUNS.
              </h1>
            </Reveal>

            <Reveal direction="up" delay={120} duration={600}>
              <p className="arch-hero-sub">
                Founded by systems engineers and accountants in Bohol. We architect rock-solid
                backend systems, custom enterprise platforms, and managed web hosting—alongside{" "}
                <strong>Salryn BMS</strong> and <strong>Scoryn</strong> live tabulation.
              </p>
            </Reveal>

            <Reveal direction="up" delay={180} duration={600}>
              <div className="arch-hero-actions">
                <Link to="/contact" className="btn-arch-primary">
                  <span>Start a Project</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link to="/projects" className="btn-arch-secondary">
                  Explore Products &amp; Work
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right: Sharp Corporate Emblem & System Spec Matrix */}
          <Reveal direction="scale" delay={120} duration={650} className="arch-hero-right">
            <div className="arch-spec-panel">
              <div className="arch-spec-header">
                <img
                  src="/brand/chameleon-color.png"
                  alt="Kirjane Labs Chameleon K Emblem"
                  className="arch-spec-logo"
                />
                <div className="arch-spec-titles">
                  <strong>KIRJANE LABS</strong>
                  <span>{company.motto}</span>
                </div>
                <span className="arch-live-badge">BOHOL, PH</span>
              </div>

              <div className="arch-spec-cells">
                <div className="arch-spec-cell">
                  <span>FLAGSHIP BMS</span>
                  <strong>Salryn Business Kernel</strong>
                  <small>Cafe · Retail · Hardware · Pharmacy · Custom</small>
                </div>
                <div className="arch-spec-cell">
                  <span>EVENT TABULATION</span>
                  <strong>Scoryn Live Scoring</strong>
                  <small>Miss Pob Oc · Mister Valencia · Miss Lila</small>
                </div>
                <div className="arch-spec-cell">
                  <span>GOVT &amp; INSTITUTIONAL</span>
                  <strong>Talibon Intra-Office</strong>
                  <small>Municipal routing &amp; digital workflow</small>
                </div>
                <div className="arch-spec-cell">
                  <span>CORE ENGINEERING</span>
                  <strong>Backend, Cloud &amp; Hosting</strong>
                  <small>Security, CI/CD &amp; managed web hosting</small>
                </div>
              </div>

              <div className="arch-spec-footer">
                <span>DIRECT CHANNEL</span>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Flush 4-Column Architectural Index Bar */}
        <div className="arch-hero-bottom-strip">
          <div className="page-shell arch-pillars-row">
            {company.pillars.map((pillar, idx) => (
              <Link key={pillar.title} to={pillar.href} className="arch-pillar-cell">
                <div className="arch-pillar-top">
                  <span className="arch-pillar-idx">0{idx + 1}</span>
                  <span className="arch-pillar-label">{pillar.label}</span>
                </div>
                <strong className="arch-pillar-name">{pillar.title}</strong>
                <span className="arch-pillar-arrow">Inspect →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 02 · FLAGSHIP PRODUCTS & INSTITUTIONAL deployments */}
      <section className="arch-section arch-section-light">
        <img
          src="/brand/chameleon-green.png"
          alt=""
          aria-hidden="true"
          className="section-watermark-logo watermark-right"
        />

        <div className="page-shell">
          <Reveal className="arch-section-header">
            <div>
              <span className="arch-eyebrow">02 / PRODUCTS &amp; DEPLOYMENTS</span>
              <h2 className="arch-section-title">
                SALRYN KERNEL, SCORYN TABULATION &amp; TALIBON INTRA-OFFICE.
              </h2>
            </div>
            <p className="arch-section-lead">
              Test the interactive Salryn BMS terminal below across six industry setups, or inspect
              our live municipal and pageant deployments.
            </p>
          </Reveal>

          <Reveal delay={70}>
            <SalrynInteractiveSimulator />
          </Reveal>

          {/* Clean, Low-Text Architectural Split for Scoryn & Talibon */}
          <div className="arch-deployments-split">
            <Reveal direction="up" delay={50} className="arch-deployment-box">
              <div className="arch-deployment-top">
                <span className="arch-eyebrow">PRODUCT // SCORYN</span>
                <span className="arch-tag-outline">AUTOMATED TABULATION</span>
              </div>
              <h3>Scoryn — Live Event &amp; Pageant Scoring</h3>
              <p>
                Zero manual encoding. Judges score on tablets while Scoryn computes weighted rounds,
                tie-breakers, and official audit sheets in real time.
              </p>

              <div className="arch-event-badges">
                {scorynRecognitions.map((ev) => (
                  <div key={ev.title} className="arch-event-item">
                    <strong>{ev.title}</strong>
                    <span>Official Tabulator</span>
                  </div>
                ))}
              </div>

              <div className="arch-deployment-foot">
                <Link to="/contact" className="btn-arch-inline">
                  Book Scoryn →
                </Link>
                <Link to="/projects#scoryn-tabulation" className="arch-muted-link">
                  Specifications
                </Link>
              </div>
            </Reveal>

            <Reveal direction="up" delay={120} className="arch-deployment-box arch-deployment-dark">
              <img
                src="/brand/chameleon-white.png"
                alt=""
                aria-hidden="true"
                className="deployment-box-watermark"
              />
              <div className="arch-deployment-top">
                <span className="arch-eyebrow light">CASE STUDY // MUNICIPAL</span>
                <span className="arch-tag-solid">LIVE DEPLOYMENT</span>
              </div>
              <h3>Talibon Intra-Office System</h3>
              <p>
                Engineered for municipal operations in Talibon—replacing paper trails with real-time
                inter-departmental document routing, approval tracking, and digital archiving.
              </p>

              <div className="arch-stat-strip">
                <div>
                  <span>ROUTING</span>
                  <strong>Real-Time Inter-Office</strong>
                </div>
                <div>
                  <span>ACCESS</span>
                  <strong>Role-Verified</strong>
                </div>
                <div>
                  <span>AUDIT</span>
                  <strong>100% Traceable</strong>
                </div>
              </div>

              <div className="arch-deployment-foot">
                <Link to="/projects#talibon-intra-office" className="btn-arch-inline light">
                  Case Study →
                </Link>
                <Link to="/contact" className="arch-muted-link light">
                  Build a Custom System
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 · CORE CAPABILITIES — PUNCHY, LOW-TEXT ARCHITECTURAL MATRIX */}
      <section className="arch-section arch-section-surface">
        <div className="arch-capabilities-bg-logos" aria-hidden="true">
          <img src="/brand/chameleon-color.png" alt="" className="cap-bg-logo-1" />
          <img src="/brand/chameleon-green.png" alt="" className="cap-bg-logo-2" />
        </div>

        <div className="page-shell">
          <Reveal className="arch-section-header">
            <div>
              <span className="arch-eyebrow">03 / CORE ENGINEERING &amp; HOSTING</span>
              <h2 className="arch-section-title">
                BUILT STRONG UNDERNEATH: BACKEND, SECURITY, CLOUD &amp; WEB HOSTING.
              </h2>
            </div>
            <div className="arch-header-cta">
              <Link to="/services" className="btn-arch-secondary">
                Full Capability Breakdown →
              </Link>
            </div>
          </Reveal>

          <div className="arch-cap-matrix">
            {conciseCapabilities.map((cap) => (
              <article key={cap.num} className="arch-cap-cell">
                <div className="arch-cap-cell-top">
                  <span className="arch-cap-num">{cap.num}</span>
                  <span className="arch-cap-label">{cap.label}</span>
                </div>
                <h3>{cap.title}</h3>
                <p>{cap.line}</p>
                <div className="arch-cap-tags">
                  {cap.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · THE PEOPLE BEHIND KIRJANE — FULL-BLEED 50/50 SPLIT SCREEN */}
      <section className="arch-fullbleed-section">
        <TeamScrollShowcase members={teamMembers} />
      </section>

      {/* 05 · HOW WE WORK — PROGRESSIVE STORYTELLING SCROLL / SWIPE ENGINE */}
      <section className="arch-process-section">
        <ProcessStoryScroll />
      </section>

      {/* 06 · ARCHITECTURAL CLOSING CALLOUT */}
      <section className="arch-closing-band">
        <img
          src="/brand/chameleon-white.png"
          alt=""
          aria-hidden="true"
          className="closing-watermark-logo"
        />
        <div className="page-shell arch-closing-grid">
          <div>
            <span className="arch-eyebrow light">06 / START A CONVERSATION</span>
            <h2>READY TO DEPLOY SALRYN, SCORYN, OR A CUSTOM SYSTEM?</h2>
            <p>
              Based in Bohol, Philippines. Reach our engineering and accounting leads directly.
            </p>
          </div>
          <div className="arch-closing-actions">
            <Link to="/contact" className="btn-arch-primary">
              <span>Talk to Our Team</span>
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
