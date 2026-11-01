import { PageIntro, ArrowLink } from "../components/Editorial";
import { services } from "../data/content";

export function meta() {
  return [{ title: "Services | Kirjane Labs" }, { name: "description", content: "Explore Kirjane Labs' proposed software development, automation, integration and infrastructure capabilities." }];
}
export default function Services() {
  return <>
    <PageIntro number="02" eyebrow="SERVICES" lines={["TECHNOLOGY SHOULD FIT", "THE WORK."]} summary="Not the other way around. Every organization has its own requirements, challenges, and ways of operating. Our focus is on understanding those needs before deciding how technology should respond." />
    <section className="page-shell subpage-content" aria-labelledby="capabilities-title">
      <div className="section-marker"><span>CAPABILITIES</span><span>SUBJECT TO COMPANY CONFIRMATION</span></div>
      <h2 id="capabilities-title" className="section-title compact">HOW WE CAN HELP.</h2>
      <div className="service-grid">{services.map(s => <article key={s.number} className="service-card"><span className="eyebrow">{s.number} / PROPOSED SERVICE</span><h3>{s.title}</h3><p>{s.description}</p></article>)}</div>
      <p className="disclosure">Service categories are proposed editorial content and require confirmation before publication.</p>
      <ArrowLink to="/contact">Tell Us What You Need</ArrowLink>
    </section>
  </>;
}
