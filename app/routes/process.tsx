import { Link } from "react-router";
import { processSteps } from "../data/content";
import { PageIntro } from "../components/Editorial";
import { Reveal } from "../components/Motion";

export function meta() {
  return [
    {
      title: "How We Work — Our 5-Step Delivery Process | Kirjane Labs",
    },
    {
      name: "description",
      content:
        "See how Kirjane Labs takes your project from initial workflow discovery and accounting blueprint to engineering, testing, and managed cloud hosting.",
    },
  ];
}

export default function Process() {
  return (
    <>
      <PageIntro
        eyebrow="How We Work"
        badge="Clear 5-Step Process"
        lines={["A calm, disciplined way to build software that fits your team."]}
        summary="You don't need to speak programmer jargon to work with us. We guide you through five clear steps so you always know what is being built, how much it costs, and when it launches."
      />

      <section className="page-shell section-block">
        <div className="process-vertical-stack">
          {processSteps.map((step, idx) => (
            <Reveal key={step.number} delay={idx * 65}>
              <article className="process-step-row">
                <div className="process-step-left">
                  <span className="process-step-num">{step.number}</span>
                  <span className="badge-pill">{step.code}</span>
                </div>
                <div className="process-step-center">
                  <h2>{step.title}</h2>
                  <p>{step.detail}</p>
                </div>
                <div className="process-step-right">
                  <span className="process-question-label">Key Question Answered</span>
                  <p>&ldquo;{step.question}&rdquo;</p>
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
              <h2>Have a workflow you want to simplify?</h2>
              <p>
                Start with a simple conversation. We&apos;ll listen to how your team works today and
                recommend the clearest solution.
              </p>
            </div>
            <div className="closing-cta-actions">
              <Link to="/contact" className="btn-hero-primary">
                Talk to Our Team
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
