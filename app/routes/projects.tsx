import type { MetaFunction } from "react-router";
import { PageIntro, SectionLabel, TextLink } from "../components/ui";

export const meta: MetaFunction = () => [
  { title: "Selected Projects — Kirjane Labs" },
  { name: "description", content: "The stories behind Kirjane Labs' project work, from the problem and architecture to the implementation and verified result." },
];

const evidence = [
  { number: "01", title: "The challenge", text: "What did the people and the organization actually need?" },
  { number: "02", title: "The decisions", text: "Which technical choices made sense, and why?" },
  { number: "03", title: "The implementation", text: "How was the system structured and built?" },
  { number: "04", title: "The verification", text: "What could be demonstrated and confirmed?" },
];

export default function Projects() {
  return (
    <main id="main-content">
      <PageIntro
        number="03"
        category="SELECTED WORK"
        title={<>BEYOND THE<br/><em>INTERFACE.</em></>}
        description={<>The finished screen is only part of a system. The more useful story is the problem it addresses, the decisions behind it and the behavior it delivers.</>}
      />
      <section className="section project-editorial-section">
        <div className="shell">
          <SectionLabel number="01" text="THE WORK / OUR STANDARD" />
          <div className="project-editorial" data-reveal>
            <div className="project-ledger">
              <div className="project-ledger-top"><span>WORK / INDEX</span><span>01—04</span></div>
              <div className="project-ledger-mark" aria-hidden="true"><span>K</span><i>.</i></div>
              <div className="project-ledger-bottom"><span>CONTEXT</span><span>DECISIONS</span><span>EVIDENCE</span></div>
            </div>
            <div className="project-editorial-copy">
              <span className="eyebrow eyebrow-light">PROJECT STORIES / IN PREPARATION</span>
              <h2>GOOD WORK<br/>CAN STAND<br/><em>UP TO QUESTIONS.</em></h2>
              <p>Project stories belong here when the technical details, results and permission to publish can be established. Until then, the approach matters more than an invented showcase.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section content-section shell">
        <SectionLabel number="02" text="WHAT A PROJECT STORY SHOULD ANSWER" />
        <div className="project-evidence-list">
          {evidence.map((item) => (
            <article className="project-evidence-row" key={item.number} data-reveal>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="simple-cta shell" data-reveal>
        <span>THE NEXT PROJECT</span>
        <h2>WHAT'S THE PROBLEM<br/><em>WORTH SOLVING?</em></h2>
        <TextLink to="/contact">Start a Conversation</TextLink>
      </section>
    </main>
  );
}
