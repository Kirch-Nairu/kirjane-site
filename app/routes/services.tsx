import { Link } from "react-router";
import { services, company } from "../data/content";
import { PageIntro } from "../components/Editorial";
import { Reveal } from "../components/Motion";

export function meta() {
  return [
    {
      title: "Services — Backend Engineering, Security, Cloud & Web Hosting | Kirjane Labs",
    },
    {
      name: "description",
      content:
        "Kirjane Labs (Kirjane IT Solutions) specializes in backend architecture, application security, cloud operations, managed web hosting, and custom websites in Bohol, Philippines.",
    },
  ];
}

export default function Services() {
  return (
    <>
      <PageIntro
        eyebrow="Engineering & Services"
        badge="Backend · Security · Cloud · Web Hosting"
        lines={["Software engineering that prioritizes reliability, security, and clarity."]}
        summary="While we craft clean, modern websites and interfaces, our deepest strength is underneath the surface: accurate databases, strict role permissions, cloud infrastructure, and dependable web hosting."
      />

      <section className="page-shell section-block">
        <div className="services-detailed-stack">
          {services.map((service, idx) => (
            <Reveal key={service.number} delay={idx * 65}>
              <article className="service-detail-row">
                <div className="service-detail-left">
                  <span className="service-detail-num">{service.number}</span>
                  <span className="badge-pill">{service.tag}</span>
                  {service.isCoreStrength && (
                    <span className="core-strength-note">Core Specialty</span>
                  )}
                </div>

                <div className="service-detail-center">
                  <h2>{service.title}</h2>
                  <p className="service-detail-desc">{service.description}</p>
                  <blockquote className="service-question-box">
                    <span>The question we solve for you:</span>
                    <p>&ldquo;{service.question}&rdquo;</p>
                  </blockquote>
                </div>

                <div className="service-detail-right">
                  <h3>What&apos;s Included</h3>
                  <ul className="clean-check-list">
                    {service.focus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-shell section-block">
        <Reveal direction="scale">
          <div className="closing-cta-banner">
            <div className="closing-cta-copy">
              <span className="section-kicker light">Web Hosting &amp; Custom Development</span>
              <h2>Need a custom system, a company website, or managed hosting?</h2>
              <p>
                Tell us what your organization needs. We&apos;ll recommend the simplest, most
                dependable path forward—whether that&apos;s a Salryn setup, a custom build, or
                managed cloud hosting.
              </p>
            </div>
            <div className="closing-cta-actions">
              <Link to="/contact" className="btn-hero-primary">
                Talk to Our Team
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
