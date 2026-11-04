import type { MetaFunction } from "react-router";
import { PageIntro, SectionLabel, TextLink } from "../components/ui";

export const meta: MetaFunction = () => [
  { title: "Our Process — Kirjane Labs" },
  { name: "description", content: "Discover, plan and design, develop, validate, then deliver and support: Kirjane Labs' engineering process." },
];

const steps = [
  { number: "01", title: "Discover", action: "UNDERSTAND", detail: "Learn about the people, processes, constraints and challenges involved. Make sure the problem is defined before deciding what to build." },
  { number: "02", title: "Plan & Design", action: "DECIDE", detail: "Turn requirements into a clear technical direction, interface structure and practical implementation plan." },
  { number: "03", title: "Develop", action: "BUILD", detail: "Implement the system against the agreed scope. Keep architecture and user needs connected throughout the work." },
  { number: "04", title: "Validate", action: "VERIFY", detail: "Check intended behavior, requirements and usability. Make problems visible before delivery rather than after." },
  { number: "05", title: "Deliver & Support", action: "HAND OVER", detail: "Prepare deployment, documentation, handover and support according to the agreed responsibilities." },
];

export default function Process() {
  return (
    <main id="main-content">
      <PageIntro
        number="05"
        category="HOW WE WORK"
        title={<>THE WHY<br/><em>BEFORE THE HOW.</em></>}
        description={<>The right technical decisions begin with understanding the problem. Each stage moves the work toward something useful, deliberate and verifiable.</>}
      />
      <section className="section content-section shell">
        <SectionLabel number="01" text="FIVE STAGES / ONE DIRECTION"/>
        <div className="process-intro-grid" data-reveal>
          <h2>AN APPROACH<br/><em>WITH INTENTION.</em></h2>
          <p>Every project is different. The structure stays clear: establish the need, shape the solution, build it, check it and hand it over responsibly.</p>
        </div>
        <ol className="stage-list">
          {steps.map((step) => (
            <li key={step.number} data-reveal>
              <span className="stage-index">{step.number}</span>
              <div className="stage-heading"><span className="eyebrow">{step.action}</span><h3>{step.title}</h3></div>
              <p>{step.detail}</p>
              <span className="stage-arrow" aria-hidden="true">↘</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="simple-cta shell" data-reveal>
        <span>THE FIRST STEP</span>
        <h2>WHAT NEEDS<br/><em>TO CHANGE?</em></h2>
        <TextLink to="/contact">Discuss the Work</TextLink>
      </section>
    </main>
  );
}
