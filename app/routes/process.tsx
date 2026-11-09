import { PageIntro, ArrowLink } from "../components/Editorial";
import { processSteps } from "../data/content";

export function meta() {
  return [
    { title: "Our Process | Kirjane Labs" },
    { name: "description", content: "Five stages: discovery, planning and design, development, validation, and delivery with support." },
  ];
}

export default function Process() {
  return (
    <>
      <PageIntro
        number="05"
        eyebrow="OUR PROCESS"
        lines={["THE WHY", "BEFORE THE HOW."]}
        summary="Good technical decisions begin with understanding the problem. Our working approach connects requirements to design, development, validation and handover."
      />

      <section className="page-shell subpage-content" aria-labelledby="process-sequence-title">
        <div className="section-marker"><span>HOW THE WORK MOVES</span><span>FIVE CONNECTED STAGES</span></div>
        <div className="page-lead">
          <h2 id="process-sequence-title" className="section-title compact">FROM QUESTION<br /><span className="ink-green">TO SOLUTION.</span></h2>
          <p className="section-copy">Each step exists to answer a different question. The sequence provides a shared direction; the exact activities depend on the project.</p>
        </div>
        <ol className="process-steps-list">
          {processSteps.map((step) => (
            <li key={step.number} className="process-step">
              <span className="process-step-number">{step.number}</span>
              <div className="process-step-main"><h3>{step.title}</h3><p>{step.detail}</p></div>
              <div className="process-step-aside"><span className="eyebrow">THE QUESTION</span><p>{step.question}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="subpage-contrast" aria-labelledby="process-next-title">
        <div className="page-shell contrast-grid">
          <div><span className="eyebrow">BEFORE THE FIRST LINE OF CODE</span><h2 id="process-next-title">START WITH<br />THE PROBLEM.</h2></div>
          <div><p>A clear description of the work, the people involved and the change you need is enough to begin shaping a conversation.</p><p className="contrast-footnote">Delivery, deployment and support arrangements are established within each agreed project scope.</p><ArrowLink to="/contact">Visit Our Contact Page</ArrowLink></div>
        </div>
      </section>
    </>
  );
}
