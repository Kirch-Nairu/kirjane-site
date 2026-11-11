import { Link } from "react-router";
import {
  company,
  services,
  scorynRecognitions,
  flagshipProjects,
  processSteps,
  teamMembers,
} from "../data/content";
import { Reveal, Stagger } from "../components/Motion";
import { SalrynInteractiveSimulator } from "../components/SalrynInteractiveSimulator";
import { TeamScrollShowcase } from "../components/TeamScrollShowcase";

export function meta() {
  return [
    {
      title: "Kirjane Labs — Software, Backend Engineering & Business Systems | Bohol, Philippines",
    },
    {
      name: "description",
      content:
        "Based in Bohol, Philippines, Kirjane Labs (Kirjane IT Solutions) builds dependable backend architecture, web hosting, custom software, the Salryn business management system, Scoryn live event tabulation, and the Talibon Intra-Office System.",
    },
  ];
}

export default function Home() {
  const talibonProject = flagshipProjects.find((p) => p.id === "talibon-intra-office")!;

  return (
    <>
      {/* 01 · Hero — Immediate Clarity & Official Brand Identity */}
      <section className="hero-surface">
        <div className="hero-backdrop-grid" aria-hidden="true" />
        <div className="page-shell hero-inner">
          <div className="hero-main-grid">
            <div className="hero-copy-col">
              <Reveal direction="up" duration={550}>
                <div className="hero-kicker-bar">
                  <span className="hero-location-badge">
                    <span className="status-dot" aria-hidden="true" />
                    {company.location}
                  </span>
                  <span className="hero-legal-pill">{company.legalName}</span>
                </div>
              </Reveal>

              <Reveal direction="up" delay={70} duration={650}>
                <h1 className="hero-headline">{company.hero.headline}</h1>
              </Reveal>

              <Reveal direction="up" delay={140} duration={650}>
                <p className="hero-lead">{company.hero.subheadline}</p>
              </Reveal>

              <Reveal direction="up" delay={210} duration={650}>
                <div className="hero-cta-group">
                  <Link to="/contact" className="btn-hero-primary">
                    {company.hero.primaryCta}
                  </Link>
                  <Link to="/projects" className="btn-hero-secondary">
                    {company.hero.secondaryCta}
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal direction="scale" delay={140} duration={700} className="hero-brand-col">
              <aside className="hero-brand-card" aria-label="Kirjane Labs Overview">
                <div className="hero-brand-card-top">
                  <div className="hero-emblem-frame">
                    <img
                      src={company.logos.chameleonColor}
                      alt="Kirjane Labs Chameleon K Emblem"
                      className="hero-emblem-img"
                    />
                  </div>
                  <div className="hero-brand-titles">
                    <span className="hero-brand-name">{company.brandName}</span>
                    <span className="hero-brand-motto">{company.motto}</span>
                  </div>
                </div>

                <p className="hero-brand-statement">
                  Founded by systems engineers and accountants—combining dependable backend
                  engineering with accurate financial and operational workflows.
                </p>

                <dl className="hero-quick-facts">
                  <div>
                    <dt>Core Strengths</dt>
                    <dd>Backend, Security, Cloud &amp; Web Hosting</dd>
                  </div>
                  <div>
                    <dt>Flagship Products</dt>
                    <dd>Salryn BMS &amp; Scoryn Tabulation</dd>
                  </div>
                  <div>
                    <dt>Institutional Work</dt>
                    <dd>Talibon Intra-Office System</dd>
                  </div>
                  <div>
                    <dt>Direct Contact</dt>
                    <dd>{company.email}</dd>
                  </div>
                </dl>
              </aside>
            </Reveal>
          </div>

          <Stagger className="hero-pillars-bar" baseDelay={260} step={65}>
            {company.pillars.map((pillar) => (
              <Link key={pillar.title} to={pillar.href} className="hero-pillar-card">
                <span className="hero-pillar-label">{pillar.label}</span>
                <strong className="hero-pillar-title">{pillar.title}</strong>
                <p className="hero-pillar-summary">{pillar.summary}</p>
              </Link>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 02 · Flagship Products & Institutional Work */}
      <section className="page-shell section-block">
        <Reveal className="section-header-split">
          <div>
            <span className="section-kicker">Products &amp; Flagship Work</span>
            <h2 className="section-heading">
              Proven systems running in businesses, offices, and live events.
            </h2>
          </div>
          <p className="section-subcopy">
            Whether you need a ready-to-run business management system, automated event scoring, or
            a custom platform built around your organization, our software is engineered for daily
            reliability.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <SalrynInteractiveSimulator />
        </Reveal>

        <div className="dual-showcase-grid">
          <Reveal direction="up" delay={60} className="showcase-card">
            <div className="showcase-card-top">
              <span className="badge-pill">Live Event Software</span>
              <span className="showcase-meta-tag">Automated Tabulation</span>
            </div>
            <h3>Scoryn — Instant Pageant &amp; Event Scoring</h3>
            <p className="showcase-description">
              Manual score sheets and spreadsheet formulas slow down live events and invite errors.
              Scoryn connects every judge&apos;s tablet directly to a central scoring engine—computing
              weighted criteria, round rankings, and audit-ready results immediately.
            </p>

            <div className="recognition-block">
              <span className="recognition-heading">Trusted Official Tabulator For:</span>
              <div className="recognition-list">
                {scorynRecognitions.map((event) => (
                  <div key={event.title} className="recognition-row">
                    <div>
                      <strong>{event.title}</strong>
                      <span>{event.detail}</span>
                    </div>
                    <span className="recognition-pill">{event.shortName}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="showcase-footer">
              <Link to="/contact" className="text-link">
                Book Scoryn for your next event
              </Link>
              <Link to="/projects#scoryn-tabulation" className="text-link-muted">
                Read full overview
              </Link>
            </div>
          </Reveal>

          <Reveal direction="up" delay={140} className="showcase-card showcase-card-dark">
            <div className="showcase-card-top">
              <span className="badge-pill badge-pill-accent">Government &amp; Institutional</span>
              <span className="showcase-meta-tag light">{talibonProject.statusBadge}</span>
            </div>
            <h3>{talibonProject.title}</h3>
            <p className="showcase-description">{talibonProject.summary}</p>

            <ul className="clean-check-list light">
              {talibonProject.architectureHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="institutional-callout">
              <span>Recognized Milestone</span>
              <strong>Municipal Inter-Office Workflow &amp; Document Tracking System</strong>
            </div>

            <div className="showcase-footer">
              <Link to="/projects#talibon-intra-office" className="text-link light">
                Explore the Talibon deployment
              </Link>
              <Link to="/contact" className="text-link light">
                Discuss a custom system
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 · Core Capabilities & Web Hosting */}
      <section className="surface-band">
        <div className="page-shell section-block">
          <Reveal className="section-header-split">
            <div>
              <span className="section-kicker">What We Do Best</span>
              <h2 className="section-heading">
                Strong backend engineering, secure systems, and dependable web hosting.
              </h2>
            </div>
            <p className="section-subcopy">
              A great interface means nothing if the system behind it is slow, insecure, or offline.
              We specialize in the foundation that keeps your business running smoothly—from
              database design and cloud operations to custom websites and managed hosting.
            </p>
          </Reveal>

          <Stagger className="capabilities-grid" baseDelay={60} step={75}>
            {services.map((service) => (
              <article key={service.number} className="capability-card">
                <div className="capability-card-top">
                  <span className="capability-num">{service.number}</span>
                  <span className="capability-tag">{service.tag}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="capability-list">
                  {service.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </Stagger>

          <Reveal delay={160} className="section-action-bar">
            <p>Need custom software, backend engineering, or reliable hosting for your website?</p>
            <div className="section-action-links">
              <Link to="/services" className="btn-secondary">
                See All Services
              </Link>
              <Link to="/contact" className="btn-primary">
                Talk to Our Team
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04 · The People Behind Kirjane — Scroll-Driven Spotlight Stage */}
      <section className="page-shell section-block">
        <Reveal className="section-header-split">
          <div>
            <span className="section-kicker">The People Behind Kirjane</span>
            <h2 className="section-heading">
              Engineers, accountants, and builders working as one team.
            </h2>
          </div>
          <p className="section-subcopy">
            Scroll through our seven-person roster—led by Founder &amp; CTO Kirch alongside
            co-founders Paul, James Karl, and Siris, and specialists Kurt, Jesse, and Ace.
          </p>
        </Reveal>

        <TeamScrollShowcase members={teamMembers} />
      </section>

      {/* 05 · How We Work — Simple 5-Step Delivery */}
      <section className="surface-band">
        <div className="page-shell section-block">
          <Reveal className="section-header-split">
            <div>
              <span className="section-kicker">How We Work</span>
              <h2 className="section-heading">
                A clear, straightforward process from first conversation to launch.
              </h2>
            </div>
            <p className="section-subcopy">
              No confusing technical jargon. We listen to how your team operates, map out the exact
              rules and numbers, and build software that makes daily work easier.
            </p>
          </Reveal>

          <Stagger className="steps-horizontal-grid" baseDelay={60} step={70}>
            {processSteps.map((step) => (
              <article key={step.number} className="step-card">
                <span className="step-badge">{step.code}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 06 · Closing CTA Banner */}
      <section className="page-shell section-block">
        <Reveal direction="scale" duration={650}>
          <div className="closing-cta-banner">
            <div className="closing-cta-copy">
              <div className="closing-brand-row">
                <img
                  src={company.logos.chameleonColor}
                  alt=""
                  className="closing-brand-logo"
                  aria-hidden="true"
                />
                <span>
                  {company.brandName} · {company.location}
                </span>
              </div>
              <h2>Ready to upgrade how your business runs?</h2>
              <p>
                Whether you want a live demo of Salryn, need Scoryn for an upcoming event, or have a
                custom website or internal system in mind, our team in Bohol is ready to help.
              </p>
            </div>
            <div className="closing-cta-actions">
              <Link to="/contact" className="btn-hero-primary">
                Start a Conversation
              </Link>
              <a href={`mailto:${company.email}`} className="btn-hero-secondary">
                {company.email}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
