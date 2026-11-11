import { Link } from "react-router";
import { ArrowLink } from "../components/Editorial";
import { Reveal } from "../components/Motion";
import { SalrynInteractiveSimulator } from "../components/SalrynInteractiveSimulator";
import { TeamScrollShowcase } from "../components/TeamScrollShowcase";
import {
  services,
  salrynKernelModules,
  scorynRecognitions,
  flagshipProjects,
  processSteps,
} from "../data/content";

export function meta() {
  return [
    { title: "Kirjane Labs — Kirjane IT Solutions | Enterprise Software, Salryn & Scoryn" },
    {
      name: "description",
      content:
        "Kirjane Labs (Kirjane IT Solutions) builds enterprise-grade software that matters—excelling in backend architecture, security, cloud ops, web hosting, Salryn BMS, Scoryn Automated Tabulation, and tailored digital systems.",
    },
    {
      property: "og:title",
      content: "Kirjane Labs (Kirjane IT Solutions) | Enterprise Software That Matters",
    },
    {
      property: "og:description",
      content:
        "Creators of Salryn (The Kernel for Every Business Need), Scoryn Automated Tabulation, and the Talibon Intra-Office System.",
    },
    { property: "og:type", content: "website" },
  ];
}

export default function Home() {
  const talibonProject = flagshipProjects[0];

  return (
    <>
      {/* 01 // HERO */}
      <section className="hero page-shell" aria-labelledby="hero-title">
        <div className="hero-rail">
          <span>01 // KIRJANE LABS · KIRJANE IT SOLUTIONS</span>
          <span>BACKEND · SECURITY · CLOUD OPS · WEB HOSTING</span>
        </div>

        <div className="hero-core">
          <span className="hero-diagonal-mark" aria-hidden="true" />
          <Reveal direction="up" duration={550}>
            <p className="eyebrow">
              KIRJANE LABS (KIRJANE IT SOLUTIONS) // ENTERPRISE SOFTWARE THAT ACTUALLY MATTERS
            </p>
          </Reveal>

          <Reveal direction="up" delay={90} duration={750}>
            <h1 id="hero-title" className="hero-title">
              <span>THE WORK.</span>
              <span className="hero-title-second">
                <span>COMES</span>
                <em>FIRST.</em>
              </span>
            </h1>
          </Reveal>

          <Reveal direction="up" delay={180} duration={750}>
            <div className="hero-details">
              <p>
                Founded by systems engineers and accountants, <strong>Kirjane Labs</strong> (registered
                as <strong>Kirjane IT Solutions</strong>) engineers mission-critical backend
                architectures, hardened security, cloud operations, managed web hosting, and custom
                platforms built around how your organization actually runs.
              </p>
              <div className="hero-actions">
                <Link to="/projects" className="button-primary">
                  Explore Salryn & Work <span aria-hidden="true">↗</span>
                </Link>
                <ArrowLink to="/contact">Start a Conversation</ArrowLink>
              </div>
            </div>
          </Reveal>

          <Reveal direction="up" delay={260} duration={750}>
            <div className="hero-telemetry-grid" aria-label="Core platforms and recognitions">
              <div className="telemetry-card">
                <span className="telemetry-code">PRODUCT // 01</span>
                <strong>SALRYN BMS</strong>
                <small>The kernel for every business need — Cafe, Gen Merch, Retail & more.</small>
              </div>
              <div className="telemetry-card">
                <span className="telemetry-code">PRODUCT // 02</span>
                <strong>SCORYN ENGINE</strong>
                <small>Automated tabulation featured in Miss Pob Oc, Mister Valencia & Miss Lila.</small>
              </div>
              <div className="telemetry-card">
                <span className="telemetry-code">INSTITUTIONAL // 03</span>
                <strong>TALIBON INTRA-OFFICE</strong>
                <small>Recognized large-scale intra-office workflow & operations deployment.</small>
              </div>
              <div className="telemetry-card">
                <span className="telemetry-code">INFRASTRUCTURE // 04</span>
                <strong>BACKEND, CLOUD & HOSTING</strong>
                <small>Hardened backend engineering, CI/CD, security governance & web hosting.</small>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="hero-bottom">
          <span>CONTRACT-FIRST ENGINEERING · INVARIANT PROTECTION · EVIDENCE-GATED DELIVERY</span>
          <a className="hero-scroll" href="#capabilities-heading">
            EXPLORE ARCHITECTURE <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      {/* 02 // CORE CAPABILITIES (BACKEND, SECURITY, CLOUD OPS, WEB HOSTING, CUSTOM SYSTEMS) */}
      <section
        className="home-section page-shell home-services-r4"
        aria-labelledby="capabilities-heading"
      >
        <Reveal direction="up">
          <div className="section-marker">
            <span>02 // CORE CAPABILITIES</span>
            <span>WHERE WE EXCEL MOST</span>
          </div>
        </Reveal>

        <div className="home-services-grid">
          <Reveal direction="up" delay={60} className="home-services-intro">
            <h2 id="capabilities-heading" className="section-title">
              BUILT BELOW
              <br />
              <span className="ink-green">THE SURFACE.</span>
            </h2>
            <p className="section-copy">
              Polished interfaces matter, but software lives or dies by what happens underneath. We
              excel most in{" "}
              <strong>backend engineering, security, cloud operations, and managed web hosting</strong>
              —alongside tailored enterprise systems and custom websites.
            </p>
            <p className="section-copy">
              Whether you need a custom multi-branch platform, high-availability hosting, or a
              bespoke corporate presence, every layer is engineered for durability.
            </p>
            <ArrowLink to="/services">Explore All Capabilities & Hosting</ArrowLink>
          </Reveal>

          <ol className="home-capabilities" aria-label="Core engineering areas">
            {services.map((service, index) => (
              <li key={service.number}>
                <Reveal direction="up" delay={index * 70}>
                  <Link to="/services" className="home-capability-link">
                    <span className="home-capability-index">{service.number}</span>
                    <span className="home-capability-content">
                      <span className="capability-tag-inline">{service.tag}</span>
                      <strong>{service.title}</strong>
                      <small>{service.description}</small>
                    </span>
                    <span className="home-capability-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 // SALRYN: INTERACTIVE POS, LEDGER & KERNEL ARCHITECTURE SIMULATOR */}
      <section className="salryn-section" aria-labelledby="salryn-heading">
        <div className="page-shell">
          <Reveal direction="up">
            <div className="section-marker section-marker-light">
              <span>03 // FLAGSHIP PRODUCT — SALRYN</span>
              <span>THE KERNEL FOR EVERY BUSINESS NEED</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={70}>
            <div className="salryn-header-grid">
              <div>
                <span className="eyebrow eyebrow-lime">
                  INTERACTIVE KERNEL · POS · CPA DOUBLE-ENTRY LEDGER
                </span>
                <h2 id="salryn-heading" className="section-title title-light">
                  ONE KERNEL.
                  <br />
                  <span className="text-lime">EVERY INDUSTRY FLAVOR.</span>
                </h2>
              </div>
              <div className="salryn-header-copy">
                <p>
                  <strong>Salryn</strong> is our flagship Business Management System—architected as a
                  unified operational and accounting kernel that adapts to any business type.
                </p>
                <p>
                  Test the interactive simulator below: switch between industry flavors, adjust POS
                  line items, inspect the live double-entry accounting journal, and view the mounted
                  kernel topology.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Core Kernel Layer Strip */}
          <Reveal direction="up" delay={120}>
            <div className="kernel-strip" aria-label="Salryn Core Kernel Layers">
              {salrynKernelModules.map((mod) => (
                <div key={mod.code} className="kernel-module-pill">
                  <span className="kernel-code">{mod.code}</span>
                  <strong>{mod.name}</strong>
                  <p>{mod.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Live Interactive Simulator */}
          <Reveal direction="up" delay={170}>
            <SalrynInteractiveSimulator />
          </Reveal>
        </div>
      </section>

      {/* 04 // SCORYN TABULATION & TALIBON INTRA-OFFICE RECOGNITIONS */}
      <section
        className="project-section home-projects-r4"
        aria-labelledby="projects-heading"
      >
        <div className="page-shell">
          <Reveal direction="up">
            <div className="section-marker">
              <span>04 // RECOGNITIONS & FLAGSHIP DEPLOYMENTS</span>
              <span>PROVEN IN HIGH-STAKES ENVIRONMENTS</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={70}>
            <div className="home-project-heading">
              <h2 id="projects-heading" className="section-title">
                SYSTEMS TESTED
                <br />
                <span className="ink-green">IN THE REAL WORLD.</span>
              </h2>
              <p>
                From municipal intra-office governance to live, zero-margin-for-error event
                tabulation, our systems are built to perform when accountability is on the line.
              </p>
            </div>
          </Reveal>

          <div className="recognition-dual-grid">
            {/* Talibon Intra-Office System Card */}
            <Reveal direction="up" delay={100}>
              <div className="recognition-card recognition-card-dark">
                <div className="recognition-card-top">
                  <span className="eyebrow eyebrow-lime">{talibonProject.category}</span>
                  <span className="status-chip">{talibonProject.statusBadge}</span>
                </div>
                <h3>{talibonProject.title}</h3>
                <p className="recognition-subtitle">{talibonProject.subtitle}</p>
                <p className="recognition-body">{talibonProject.summary}</p>
                <ul className="recognition-list">
                  {talibonProject.architectureHighlights.map((item) => (
                    <li key={item}>
                      <span aria-hidden="true">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <div className="placeholder-slot-box">
                  <span>{talibonProject.placeholderSlot}</span>
                </div>
                <ArrowLink to="/projects" light>
                  Read Talibon Case Overview
                </ArrowLink>
              </div>
            </Reveal>

            {/* Scoryn Automated Tabulation Card */}
            <Reveal direction="up" delay={160}>
              <div className="recognition-card recognition-card-light">
                <div className="recognition-card-top">
                  <span className="eyebrow">AUTOMATED TABULATION ENGINE</span>
                  <span className="status-chip status-chip-green">LIVE EVENT VERIFIED</span>
                </div>
                <h3>Scoryn — Automated Tabulation</h3>
                <p className="recognition-subtitle">
                  Deterministic real-time judging, multi-terminal synchronization, and instant
                  audited results.
                </p>
                <p className="recognition-body">
                  Built to eliminate manual spreadsheet errors and tally delays during high-pressure
                  live competitions and pageants.
                </p>

                <div className="scoryn-events-block">
                  <span className="eyebrow">FEATURED EVENT DEPLOYMENTS</span>
                  <ol className="scoryn-event-list">
                    {scorynRecognitions.map((ev) => (
                      <li key={ev.code}>
                        <div className="scoryn-event-head">
                          <span className="scoryn-event-code">{ev.code}</span>
                          <strong>{ev.title}</strong>
                          <span className="scoryn-short-badge">{ev.shortName}</span>
                        </div>
                        <p>{ev.detail}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <ArrowLink to="/projects">Explore Scoryn & Full Portfolio</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 // ENGINEERING METHODOLOGY (DEDUCED GOVERNANCE & WORKFLOW) */}
      <section
        className="home-section page-shell home-approach-r4"
        aria-labelledby="process-heading"
      >
        <Reveal direction="up">
          <div className="section-marker">
            <span>05 // ENGINEERING DOCTRINE</span>
            <span>HOW WE SOLVE PROBLEMS</span>
          </div>
        </Reveal>

        <div className="home-approach-grid">
          <Reveal direction="up" delay={60} className="home-approach-intro">
            <h2 id="process-heading" className="section-title">
              CONTRACT FIRST.
              <br />
              <span className="ink-green">EVIDENCE GATED.</span>
            </h2>
            <p className="section-copy">
              A screenshot or a symptom is not a complete specification. And a passing test means
              little if the underlying business contract wasn't reconciled first.
            </p>
            <p className="section-copy">
              Our engineering workflow closes the gap between business intent and production code—protecting
              your financial invariants, security boundaries, and long-term maintainability at every
              gate.
            </p>
            <ArrowLink to="/process">Examine Our 5-Gate Methodology</ArrowLink>
          </Reveal>

          <ol className="home-approach-steps">
            {processSteps.map((step, idx) => (
              <li key={step.number}>
                <Reveal direction="up" delay={idx * 65} className="home-step-inner">
                  <span className="home-step-index">{step.number}</span>
                  <div>
                    <span className="capability-tag-inline">{step.code}</span>
                    <strong>{step.title}</strong>
                    <p>{step.detail}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 06 // THE PEOPLE BEHIND KIRJANE — SCROLL-DRIVEN 7-MEMBER SPOTLIGHT STAGE */}
      <section className="home-about-r4" aria-labelledby="about-heading">
        <div className="page-shell">
          <Reveal direction="up">
            <div className="section-marker">
              <span>06 // THE PEOPLE BEHIND KIRJANE LABS</span>
              <span>SCROLL-DRIVEN INDIVIDUAL SPOTLIGHTS (01 — 07)</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={60}>
            <div className="home-about-grid">
              <div>
                <h2 id="about-heading" className="section-title">
                  THE PEOPLE
                  <br />
                  <span className="ink-green">BEHIND THE WORK.</span>
                </h2>
              </div>
              <div className="home-about-content">
                <p className="home-about-lead">
                  Scroll through each member's dedicated spotlight stage—starting with our Founder,
                  CTO & Head of Engineering.
                </p>
                <p>
                  Kirjane Labs unites founders in <strong>systems architecture & DevOps</strong> with{" "}
                  <strong>accountants</strong>, backed by specialists in CI/CD, market research, and
                  digital communications.
                </p>
                <ArrowLink to="/about">Explore Full Story & Team Page</ArrowLink>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="page-shell">
          <TeamScrollShowcase />
        </div>
      </section>

      {/* 07 // CONTACT BAND */}
      <section className="contact-band home-contact-r4" aria-labelledby="contact-heading">
        <div className="page-shell">
          <Reveal direction="up">
            <div className="section-marker section-marker-light">
              <span>07 // START HERE</span>
              <span>SALRYN · SCORYN · CUSTOM SYSTEMS · WEB HOSTING</span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <div className="contact-band-layout home-contact-layout">
              <div>
                <p className="eyebrow eyebrow-lime">READY WHEN YOUR OPERATION IS</p>
                <h2 id="contact-heading" className="section-title">
                  WHAT ARE WE
                  <br />
                  ENGINEERING NEXT?
                </h2>
                <p>
                  Whether you want to deploy a <strong>Salryn</strong> flavor for your business, book{" "}
                  <strong>Scoryn</strong> for an upcoming event, modernize an institutional workflow,
                  or host a custom web platform—let's scope the contract.
                </p>
              </div>
              <div className="home-contact-action">
                <Link className="button-light" to="/contact">
                  Discuss Your Project <span aria-hidden="true">↗</span>
                </Link>
                <small>
                  Structured scoping for enterprise software, Salryn BMS, Scoryn, and managed
                  hosting.
                </small>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
