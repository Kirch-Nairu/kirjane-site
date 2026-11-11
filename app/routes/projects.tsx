import { PageIntro, ArrowLink } from "../components/Editorial";
import { Reveal } from "../components/Motion";
import {
  flagshipProjects,
  salrynFlavors,
  salrynKernelModules,
  scorynRecognitions,
} from "../data/content";

export function meta() {
  return [
    { title: "Products & Work — Salryn, Scoryn & Talibon | Kirjane IT Solutions" },
    {
      name: "description",
      content:
        "Explore Salryn (The Kernel for Every Business Need), Scoryn Automated Tabulation (featured in Miss Pob Oc, Mister Valencia, Miss Lila), and the Talibon Intra-Office System.",
    },
  ];
}

export default function Projects() {
  return (
    <>
      <PageIntro
        number="03"
        eyebrow="PRODUCTS, PLATFORMS & RECOGNITIONS"
        badge="SALRYN BMS · SCORYN TABULATION · TALIBON INTRA-OFFICE SYSTEM"
        lines={["SOFTWARE BUILT", "FOR REAL STAKES."]}
        summary="From our flagship Business Management Kernel (Salryn) and live competition tabulation engine (Scoryn) to large-scale institutional workflows in Talibon, every system is engineered around operational truth."
      />

      {/* FLAGSHIP DEPLOYMENTS & PRODUCTS */}
      <section className="page-shell subpage-content" aria-labelledby="projects-story-heading">
        <Reveal direction="up">
          <div className="section-marker">
            <span>01—03 // FLAGSHIP ECOSYSTEM</span>
            <span>INSTITUTIONAL & COMMERCIAL SYSTEMS</span>
          </div>
        </Reveal>

        <Reveal direction="up" delay={60}>
          <div className="page-lead">
            <h2 id="projects-story-heading" className="section-title compact">
              PROVEN KERNELS.
              <br />
              <span className="ink-green">VERIFIED RESULTS.</span>
            </h2>
            <p className="section-copy">
              Every project below represents a live architecture designed by Kirjane. Visual media
              and extended client telemetry slots are structured for progressive publication.
            </p>
          </div>
        </Reveal>

        <div className="project-case-stack">
          {flagshipProjects.map((project, index) => (
            <Reveal key={project.id} direction="up" delay={index * 70}>
              <article className="project-case-card">
                <div className="project-case-head">
                  <div>
                    <span className="eyebrow">
                      {project.number} // {project.category}
                    </span>
                    <h3>{project.title}</h3>
                    <p className="project-case-subtitle">{project.subtitle}</p>
                  </div>
                  <span className="status-chip status-chip-green">{project.statusBadge}</span>
                </div>

                <div className="project-case-body">
                  <div>
                    <p className="project-case-summary">{project.summary}</p>
                    {project.recognitions && project.recognitions.length > 0 ? (
                      <div className="project-recognitions-box">
                        <span className="eyebrow">RECOGNITIONS & DEPLOYMENTS</span>
                        <ul>
                          {project.recognitions.map((rec) => (
                            <li key={rec}>★ {rec}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <span className="eyebrow">ARCHITECTURAL HIGHLIGHTS</span>
                    <ul className="project-arch-list">
                      {project.architectureHighlights.map((item) => (
                        <li key={item}>
                          <span aria-hidden="true">→</span> {item}
                        </li>
                      ))}
                    </ul>
                    <div className="placeholder-slot-box placeholder-slot-light">
                      <span>{project.placeholderSlot}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SALRYN FLAVORS MATRIX */}
      <section className="salryn-section" aria-labelledby="salryn-matrix-heading">
        <div className="page-shell">
          <Reveal direction="up">
            <div className="section-marker section-marker-light">
              <span>SALRYN PRODUCT MATRIX</span>
              <span>THE KERNEL FOR EVERY BUSINESS NEED</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={60}>
            <div className="salryn-header-grid">
              <div>
                <span className="eyebrow eyebrow-lime">INDUSTRY VERTICALS</span>
                <h2 id="salryn-matrix-heading" className="section-title title-light">
                  SALRYN
                  <br />
                  <span className="text-lime">FLAVORS.</span>
                </h2>
              </div>
              <div className="salryn-header-copy">
                <p>
                  Every business shares core financial and operational laws—yet every industry has
                  its own front-line rhythm. Salryn solves both with one accounting-grade kernel and
                  modular industry flavors.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="up" delay={110}>
            <div className="kernel-strip">
              {salrynKernelModules.map((mod) => (
                <div key={mod.code} className="kernel-module-pill">
                  <span className="kernel-code">{mod.code}</span>
                  <strong>{mod.name}</strong>
                  <p>{mod.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="flavor-cards-grid">
            {salrynFlavors.map((flavor, idx) => (
              <Reveal key={flavor.id} direction="up" delay={idx * 55}>
                <article className="flavor-matrix-card">
                  <div className="flavor-matrix-top">
                    <span className="kernel-code">{flavor.code}</span>
                    <span className="flavor-industry-tag">{flavor.industry}</span>
                  </div>
                  <h3>{flavor.name}</h3>
                  <p className="flavor-matrix-tagline">{flavor.tagline}</p>
                  <p className="flavor-matrix-desc">{flavor.description}</p>
                  <ul className="flavor-matrix-list">
                    {flavor.modules.map((m) => (
                      <li key={m}>◆ {m}</li>
                    ))}
                  </ul>
                  <div className="placeholder-slot-box">
                    <span>{flavor.placeholderNote}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SCORYN EVENT RECOGNITIONS */}
      <section className="page-shell subpage-content" aria-labelledby="scoryn-events-heading">
        <Reveal direction="up">
          <div className="section-marker">
            <span>SCORYN // LIVE EVENT RECOGNITIONS</span>
            <span>AUTOMATED TABULATION IN ACTION</span>
          </div>
        </Reveal>

        <Reveal direction="up" delay={60}>
          <div className="page-lead">
            <h2 id="scoryn-events-heading" className="section-title compact">
              ZERO ERROR.
              <br />
              <span className="ink-green">LIVE TABULATION.</span>
            </h2>
            <p className="section-copy">
              Scoryn has powered official automated tabulation for major regional pageants and
              competitions—delivering instant, audit-verified results under live stage pressure.
            </p>
          </div>
        </Reveal>

        <ol className="case-chapter-grid scoryn-recognition-grid">
          {scorynRecognitions.map((event, idx) => (
            <li key={event.code}>
              <Reveal direction="up" delay={idx * 70}>
                <span className="eyebrow">
                  {event.code} // {event.shortName}
                </span>
                <h3>{event.title}</h3>
                <p className="scoryn-role-tag">{event.role}</p>
                <p>{event.detail}</p>
                <div className="placeholder-slot-box placeholder-slot-light" style={{ marginTop: "16px" }}>
                  <span>[PLACEHOLDER: Official event badge / tabulation audit certificate]</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal direction="up" delay={140}>
          <div style={{ marginTop: "48px" }}>
            <ArrowLink to="/contact">Book Salryn, Scoryn, or a Custom Project</ArrowLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
