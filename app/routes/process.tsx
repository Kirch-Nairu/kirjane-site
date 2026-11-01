import { PageIntro, ArrowLink } from "../components/Editorial";
import { processSteps } from "../data/content";
export function meta() { return [{ title: "Our Process | Kirjane Labs" }, { name: "description", content: "Discover the proposed discovery, design, development, validation, and delivery stages at Kirjane Labs." }]; }
export default function Process() {
  return <>
    <PageIntro number="05" eyebrow="OUR PROCESS" lines={["THE WHY", "BEFORE THE HOW."]} summary="The right technical decisions begin with understanding the problem." />
    <section className="page-shell subpage-content">
      <div className="section-marker"><span>FIVE STAGES</span><span>PROPOSED PROJECT WORKFLOW</span></div>
      <ol className="full-process">{processSteps.map(s => <li key={s.number}><span>{s.number}</span><h2>{s.title}</h2><p>{s.detail}</p></li>)}</ol>
      <p className="disclosure">Delivery and support arrangements depend on each agreed project scope.</p>
      <ArrowLink to="/contact">Discuss Your Project</ArrowLink>
    </section>
  </>;
}
