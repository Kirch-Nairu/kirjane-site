import type { MetaFunction } from "react-router";
import { PageIntro, SectionLabel, TextLink } from "../components/ui";

export const meta: MetaFunction = () => [
  { title: "Services — Kirjane Labs" },
  { name: "description", content: "Explore Kirjane Labs' software, automation, systems integration and infrastructure capability areas." },
];

const capabilities = [
  {
    number: "01",
    title: "Custom Software Development",
    tagline: "SOFTWARE SHAPED BY THE WORK",
    description: "Applications designed for the workflows, requirements and people they need to support. The goal is clarity in the experience and discipline behind the implementation.",
  },
  {
    number: "02",
    title: "Process Automation",
    tagline: "REPETITION IS NOT THE REQUIREMENT",
    description: "Examine recurring manual steps, information handoffs and operational friction. Identify where automation can remove unnecessary work without losing oversight.",
  },
  {
    number: "03",
    title: "Systems Engineering & Integration",
    tagline: "THE PARTS HAVE TO WORK TOGETHER",
    description: "Plan how software, services and data interact. Design the boundaries and connections that keep a system maintainable as requirements evolve.",
  },
  {
    number: "04",
    title: "Technical Infrastructure & Support",
    tagline: "THE ENVIRONMENT MATTERS",
    description: "Consider hosting, deployment, technical operations and ongoing support as part of the system, not as details added at the end.",
  },
];

export default function Services() {
  return (
    <main id="main-content">
      <PageIntro
        number="02"
        category="OUR CAPABILITIES"
        title={<>TECHNOLOGY SHOULD FIT<br/><em>THE WORK.</em></>}
        description={<>Not the other way around. Every organization has its own requirements and ways of operating. Those realities should shape the technical approach.</>}
      />
      <section className="section content-section shell capabilities-section">
        <SectionLabel number="01" text="FOUR AREAS / ONE APPROACH" />
        <div className="capabilities-lead" data-reveal>
          <h2>THOUGHTFUL SYSTEMS.<br/><em>USEFUL OUTCOMES.</em></h2>
          <p>These are the areas in which we structure technical discussions. The right combination depends on what the organization is trying to accomplish.</p>
        </div>
        <div className="capability-list">
          {capabilities.map((item) => (
            <article className="capability-row" key={item.number} data-reveal>
              <span className="capability-number">{item.number}</span>
              <div>
                <span className="eyebrow">{item.tagline}</span>
                <h3>{item.title}</h3>
              </div>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="simple-cta shell" data-reveal>
        <span>START WITH CONTEXT</span>
        <h2>THE RIGHT SOLUTION<br/><em>STARTS WITH A QUESTION.</em></h2>
        <TextLink to="/process">See Our Process</TextLink>
      </section>
    </main>
  );
}
