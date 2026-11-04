import type { MetaFunction } from "react-router";
import { PageIntro, SectionLabel, TextLink } from "../components/ui";
export const meta: MetaFunction = () => [
  { title: "About Us — Kirjane Labs" },
  { name: "description", content: "Meet the thinking behind Kirjane Labs: practical problem-solving across software, automation, and digital systems." },
];
export default function About() {
  return <main id="main-content">
    <PageIntro number="04" category="ABOUT KIRJANE LABS" title={<>THE THINKING<br/><em>BEHIND THE BUILD.</em></>} description={<>Good technology takes more than good code. Kirjane Labs brings together technical disciplines to approach software, automation, and systems development through practical problem-solving.</>}/>
    <section className="section content-section shell"><SectionLabel number="01" text="WHAT GUIDES THE WORK"/>
      <div className="statement-grid"><h2>UNDERSTAND FIRST.<br/><em>ENGINEER SECOND.</em></h2><div><p>Our work starts with how an organization operates: the people using a system, the processes it supports, and the outcomes it needs to achieve.</p><p>We use that understanding to guide technical decisions, rather than introducing complexity for its own sake.</p></div></div>
      <div className="values-row"><div><span>01 / DISCOVER</span><strong>Understand the problem</strong></div><div><span>02 / DESIGN</span><strong>Make deliberate decisions</strong></div><div><span>03 / VALIDATE</span><strong>Check the intended behavior</strong></div></div>
      <p className="approval-note">Official team biographies, company background, and approved photography will be added after company verification.</p>
    </section>
    <section className="simple-cta shell"><span>HOW WE OPERATE</span><h2>THE WHY,<br/><em>BEFORE THE HOW.</em></h2><TextLink to="/process">Explore Our Process</TextLink></section>
  </main>;
}
