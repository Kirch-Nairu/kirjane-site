import type { MetaFunction } from "react-router";
import { PageIntro, SectionLabel, TextLink } from "../components/ui";

export const meta: MetaFunction = () => [
  { title: "Services — Kirjane Labs" },
  { name: "description", content: "Technology should fit the work. Explore Kirjane Labs' proposed software, automation, integration, and technical infrastructure capabilities." },
];

const services = [
  ["Custom Software Development", "Applications built around specific workflows and requirements."],
  ["Process Automation", "Reducing repetitive tasks and improving the movement of information."],
  ["Systems Engineering & Integration", "Designing technical solutions and connecting systems where needed."],
  ["Technical Infrastructure & Support", "Supporting the environments and services that software depends on."],
];

export default function Services() {
  return <main id="main-content">
    <PageIntro number="02" category="OUR CAPABILITIES" title={<>TECHNOLOGY SHOULD FIT<br/><em>THE WORK.</em></>} description={<>Not the other way around. Every organization has its own requirements, challenges, and ways of operating. Our focus is on understanding those needs before deciding how technology should respond.</>}/>
    <section className="section content-section shell"><SectionLabel number="01" text="CAPABILITY AREAS"/><p className="approval-note">The service categories below are part of the approved planning direction and are pending final company confirmation before public release.</p><div className="detail-grid">{services.map(([name, desc], i) => <article className="detail-item" key={name}><span>0{i + 1} / CAPABILITY</span><h2>{name}</h2><p>{desc}</p></article>)}</div></section>
    <section className="simple-cta shell"><span>THE NEXT STEP</span><h2>START WITH THE PROBLEM.<br/><em>WE’LL DISCUSS THE OPTIONS.</em></h2><TextLink to="/contact">Tell Us What You Need</TextLink></section>
  </main>;
}
