import { PageIntro, ArrowLink } from "../components/Editorial";
import { Reveal } from "../components/Motion";
import { processSteps } from "../data/content";

export function meta() {
  return [
    { title: "Engineering Methodology | Kirjane IT Solutions" },
    {
      name: "description",
      content:
        "How Kirjane IT Solutions approaches enterprise software: contract-first discovery, invariant modeling, bounded systems engineering, evidence-led verification, and controlled promotion.",
    },
  ];
}

export default function Process() {
  return (
    <>
      <PageIntro
        number="05"
        eyebrow="ENGINEERING METHODOLOGY"
        badge="CONTRACT-FIRST · INVARIANT-SAFE · EVIDENCE-GATED"
        lines={["THE CONTRACT", "BEFORE THE CODE."]}
        summary="Strong execution discipline cannot compensate for an unready specification. We close the gap between business intent and production software through five explicit readiness and verification gates."
      />

      <section className="page-shell subpage-content" aria-labelledby="process-sequence-title">
        <Reveal direction="up">
          <div className="section-marker">
            <span>HOW THE WORK MOVES</span>
            <span>FIVE EVIDENCE-GATED STAGES</span>
          </div>
        </Reveal>

        <Reveal direction="up" delay={60}>
          <div className="page-lead">
            <h2 id="process-sequence-title" className="section-title compact">
              NO GUESSWORK.
              <br />
              <span className="ink-green">NO SILENT DRIFT.</span>
            </h2>
            <p className="section-copy">
              Every stage exists to answer a specific architectural and operational question—so
              requirements, permissions, and accounting invariants stay aligned from discovery to
              production.
            </p>
          </div>
        </Reveal>

        <ol className="process-steps-list">
          {processSteps.map((step, index) => (
            <li key={step.number} className="process-step">
              <Reveal direction="up" delay={index * 65} className="process-step-inner">
                <span className="process-step-number">{step.number}</span>
                <div className="process-step-main">
                  <span className="capability-tag-inline">{step.code}</span>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </div>
                <div className="process-step-aside">
                  <span className="eyebrow">THE GATE QUESTION</span>
                  <p>{step.question}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="subpage-contrast" aria-labelledby="process-next-title">
        <div className="page-shell contrast-grid">
          <Reveal direction="up">
            <div>
              <span className="eyebrow eyebrow-lime">READY TO SCOPE YOUR SYSTEM?</span>
              <h2 id="process-next-title">
                START WITH THE
                <br />
                OPERATIONAL REALITY.
              </h2>
            </div>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <div>
              <p>
                Bring us the workflow bottlenecks, the ledger requirements, or the event parameters.
                We will translate them into a clear, verifiable system architecture.
              </p>
              <p className="contrast-footnote">
                All delivery timelines, SLAs, and hosting arrangements are defined transparently
                within each project contract.
              </p>
              <ArrowLink to="/contact" light>
                Start a Scoping Conversation
              </ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
