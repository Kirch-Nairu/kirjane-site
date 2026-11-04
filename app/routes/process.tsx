import type { MetaFunction } from "react-router";
import { PageIntro, SectionLabel, TextLink } from "../components/ui";
export const meta: MetaFunction = () => [
  { title: "Our Process — Kirjane Labs" },
  { name: "description", content: "Discover, plan and design, develop, validate, then deliver and support: Kirjane Labs' approved engineering process." },
];
const steps = [
  ["Discover", "Learn about the people, processes, and challenges involved."],
  ["Plan & Design", "Translate requirements into a clear technical and visual direction."],
  ["Develop", "Build the solution against agreed scope and requirements."],
  ["Validate", "Check intended behavior and requirements."],
  ["Deliver & Support", "Prepare deployment, handover, and support under agreed terms."],
];
export default function Process() {
  return <main id="main-content">
    <PageIntro number="05" category="HOW WE WORK" title={<>THE WHY<br/><em>BEFORE THE HOW.</em></>} description={<>The right technical decisions begin with understanding the problem. Each stage has a purpose, from first conversation to delivery.</>}/>
    <section className="section content-section shell"><SectionLabel number="01" text="FIVE STAGES / ONE DIRECTION"/>
      <ol className="stage-list">{steps.map(([name, detail], i) => <li key={name}><span className="stage-index">0{i + 1}</span><h2>{name}</h2><p>{detail}</p><span className="stage-arrow" aria-hidden="true">↘</span></li>)}</ol>
    </section>
    <section className="simple-cta shell"><span>BEGIN WITH THE WORK</span><h2>WHAT NEEDS<br/><em>TO CHANGE?</em></h2><TextLink to="/contact">Discuss Your Project</TextLink></section>
  </main>;
}
