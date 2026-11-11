import { Link } from "react-router";
import {
  flagshipProjects,
  salrynFlavors,
  salrynKernelModules,
  scorynRecognitions,
} from "../data/content";
import { PageIntro } from "../components/Editorial";
import { Reveal, Stagger } from "../components/Motion";
import { SalrynInteractiveSimulator } from "../components/SalrynInteractiveSimulator";

export function meta() {
  return [
    {
      title: "Products & Work — Salryn BMS, Scoryn & Talibon Intra-Office | Kirjane Labs",
    },
    {
      name: "description",
      content:
        "Explore Kirjane Labs' flagship software: Salryn Business Management System and its industry setups, Scoryn live event tabulation, and the Talibon Intra-Office System.",
    },
  ];
}

export default function Projects() {
  return (
    <>
      <PageIntro
        eyebrow="Products & Selected Work"
        badge="Bohol, Philippines"
        lines={["Software built for daily operations, accurate accounting, and live events."]}
        summary="We build both ready-to-deploy software platforms and custom institutional systems. Every product is engineered around a dependable database core and an interface your staff can learn in minutes."
      />

      {/* Flagship Case Studies */}
      <section className="page-shell section-block">
        <div className="case-study-stack">
          {flagshipProjects.map((project, idx) => (
            <Reveal key={project.id} delay={idx * 70}>
              <article id={project.id} className="case-study-card">
                <div className="case-study-meta-col">
                  <span className="case-study-num">{project.number}</span>
                  <span className="case-study-category">{project.category}</span>
                  <span className="badge-pill">{project.statusBadge}</span>
                </div>

                <div className="case-study-body-col">
                  <h2>{project.title}</h2>
                  <p className="case-study-subtitle">{project.subtitle}</p>
                  <p className="case-study-summary">{project.summary}</p>

                  {project.recognitions && project.recognitions.length > 0 && (
                    <div className="case-study-recognitions">
                      <span className="recognition-heading">Proven In Action</span>
                      <div className="tag-cluster">
                        {project.recognitions.map((rec) => (
                          <span key={rec} className="tag-chip-strong">
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="case-study-highlights-col">
                  <h3>Key Capabilities</h3>
                  <ul className="clean-check-list">
                    {project.architectureHighlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="case-study-note">{project.placeholderSlot}</p>
                  <Link to="/contact" className="btn-secondary">
                    Inquire About {project.title.split("—")[0].trim()}
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Salryn Interactive Demo & Industry Setups */}
      <section id="salryn" className="surface-band">
        <div className="page-shell section-block">
          <Reveal className="section-header-split">
            <div>
              <span className="section-kicker">Salryn — The Business Kernel</span>
              <h2 className="section-heading">
                One dependable core, tailored for your specific industry.
              </h2>
            </div>
            <p className="section-subcopy">
              Co-designed by our engineers and accountants, Salryn handles your checkout, stock, and
              financial ledger automatically—with specialized setups for food &amp; beverage, retail,
              hardware, pharmacies, and service shops.
            </p>
          </Reveal>

          <Stagger className="kernel-pillars-grid" baseDelay={50} step={65}>
            {salrynKernelModules.map((mod) => (
              <div key={mod.code} className="kernel-pillar-card">
                <span className="kernel-pillar-tag">{mod.code}</span>
                <h3>{mod.name}</h3>
                <p>{mod.detail}</p>
              </div>
            ))}
          </Stagger>

          <Reveal delay={120}>
            <SalrynInteractiveSimulator />
          </Reveal>

          <div className="flavors-catalog-block">
            <Reveal>
              <h3 className="subsection-heading">All Salryn Industry Setups</h3>
            </Reveal>
            <Stagger className="flavors-grid" baseDelay={60} step={60}>
              {salrynFlavors.map((flavor) => (
                <article key={flavor.id} className="flavor-detail-card">
                  <div className="flavor-detail-top">
                    <span className="badge-pill">{flavor.code}</span>
                    <span className="badge-pill" style={{ background: "rgba(36, 104, 68, 0.12)", color: "var(--forest-emerald, #246844)", borderColor: "rgba(36, 104, 68, 0.25)" }}>
                      {flavor.statusBadge}
                    </span>
                  </div>
                  <h4>{flavor.name}</h4>
                  <p>{flavor.description}</p>
                  <p className="flavor-readiness-callout" style={{ fontSize: "0.82rem", color: "var(--ink-secondary)", background: "var(--bg-mist)", padding: "0.5rem 0.65rem", borderRadius: "4px", margin: "0.5rem 0 0.85rem" }}>
                    <strong>Readiness:</strong> {flavor.readinessDetail}
                  </p>
                  <ul className="clean-check-list">
                    {flavor.modules.map((m) => (
                      <li key={m.name}>
                        <span>{m.name}</span>
                        <small style={{ display: "inline-block", marginLeft: "0.4rem", opacity: 0.75, fontSize: "0.75rem" }}>
                          ({m.status})
                        </small>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Scoryn Event Recognitions */}
      <section id="scoryn" className="page-shell section-block">
        <Reveal className="section-header-split">
          <div>
            <span className="section-kicker">Scoryn — Live Event Tabulation</span>
            <h2 className="section-heading">
              Trusted by municipal pageants and live competitions across Bohol.
            </h2>
          </div>
          <p className="section-subcopy">
            Scoryn replaces stressful manual tallying with instant, verified digital tabulation—so
            hosts and organizers can announce results on time with complete confidence.
          </p>
        </Reveal>

        <Stagger className="scoryn-events-grid" baseDelay={60} step={80}>
          {scorynRecognitions.map((item) => (
            <article key={item.title} className="scoryn-event-card">
              <span className="badge-pill">{item.code}</span>
              <h3>{item.title}</h3>
              <p className="scoryn-event-role">{item.role}</p>
              <p>{item.detail}</p>
            </article>
          ))}
        </Stagger>
      </section>
    </>
  );
}
