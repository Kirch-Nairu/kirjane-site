import { PageIntro, ArrowLink } from "../components/Editorial";
import { Reveal } from "../components/Motion";
import { services } from "../data/content";

export function meta() {
  return [
    { title: "Capabilities & Hosting | Kirjane IT Solutions" },
    {
      name: "description",
      content:
        "Enterprise backend engineering, application security, cloud ops, CI/CD, managed web hosting, tailored software, and custom websites by Kirjane IT Solutions.",
    },
  ];
}

export default function Services() {
  return (
    <>
      <PageIntro
        number="02"
        eyebrow="CAPABILITIES & INFRASTRUCTURE"
        badge="BACKEND · SECURITY · CLOUD OPS · WEB HOSTING · CUSTOM SYSTEMS"
        lines={["ENGINEERED FOR", "REAL OPERATIONS."]}
        summary="We build enterprise-grade software that actually matters. While we craft responsive interfaces and custom websites, our deepest strength is underneath—in high-integrity backend systems, strict security boundaries, automated cloud operations, and dependable web hosting."
      />

      <section className="page-shell subpage-content" aria-labelledby="capabilities-title">
        <Reveal direction="up">
          <div className="section-marker">
            <span>01—04 // CORE ENGINEERING PILLARS</span>
            <span>BUILT FOR DURABILITY & ACCOUNTABILITY</span>
          </div>
        </Reveal>

        <Reveal direction="up" delay={60}>
          <div className="page-lead">
            <h2 id="capabilities-title" className="section-title compact">
              LESS FRICTION.
              <br />
              <span className="ink-green">HARDENED FUNCTION.</span>
            </h2>
            <p className="section-copy">
              Every system we deliver—from multi-branch business platforms to custom websites and
              managed hosting environments—is governed by explicit contracts, auditability, and
              operational reliability.
            </p>
          </div>
        </Reveal>

        <ol className="capability-list">
          {services.map((service, index) => (
            <li className="capability-item" key={service.number}>
              <Reveal direction="up" delay={index * 60} className="capability-item-inner">
                <div className="capability-number">{service.number} / 04</div>
                <div className="capability-main">
                  <span className="capability-tag-inline">{service.tag}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <div className="capability-aside">
                  <span className="eyebrow">ARCHITECTURAL QUESTION</span>
                  <p className="capability-question">{service.question}</p>
                  <ul className="capability-tags">
                    {service.focus.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="subpage-contrast" aria-labelledby="services-approach-title">
        <div className="page-shell contrast-grid">
          <Reveal direction="up">
            <div>
              <span className="eyebrow eyebrow-lime">INFRASTRUCTURE & PRODUCT SYNERGY</span>
              <h2 id="services-approach-title">
                NEED A PRODUCT OR
                <br />A CUSTOM BUILD?
              </h2>
            </div>
          </Reveal>
          <Reveal direction="up" delay={90}>
            <div>
              <p>
                Explore how our backend and cloud engineering powers our flagship products—
                <strong>Salryn BMS</strong> and <strong>Scoryn Tabulation</strong>—as well as
                institutional deployments like the <strong>Talibon Intra-Office System</strong>.
              </p>
              <div className="hero-actions" style={{ justifyContent: "flex-start" }}>
                <ArrowLink to="/projects" light>
                  Explore Products & Work
                </ArrowLink>
                <ArrowLink to="/contact" light>
                  Request Hosting or Custom Scope
                </ArrowLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
