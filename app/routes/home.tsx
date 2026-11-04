import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { Eyebrow, SectionLabel, TextLink } from "../components/ui";

export const meta: MetaFunction = () => [
  { title: "Kirjane Labs — The Work Comes First" },
  { name: "description", content: "Kirjane Labs approaches software engineering, process automation, and digital systems by understanding the work first." },
];

const services = [
  { no: "01", name: "Custom Software", detail: "Built around real workflows." },
  { no: "02", name: "Process Automation", detail: "Less repetition. Better movement." },
  { no: "03", name: "Systems Engineering", detail: "Structure behind the interface." },
];

const steps = ["Discover", "Plan & Design", "Develop", "Validate", "Deliver & Support"];

export default function Home() {
  return <main id="main-content">
    <section className="hero">
      <div className="shell hero-shell">
        <div className="hero-overline"><Eyebrow>Software Engineering / Automation / Digital Systems</Eyebrow><span className="hero-id">01 — OFFICIAL WEBSITE</span></div>
        <h1 className="hero-heading"><span>THE WORK<span className="hero-period">.</span></span><span className="hero-heading-shift">COMES FIRST<span className="hero-period">.</span></span></h1>
        <div className="hero-lower">
          <div className="hero-trace" aria-hidden="true"><div className="trace-axis"/><span>FORM FOLLOWS FUNCTION</span><b>↘</b></div>
          <div className="hero-copy"><p>Every organization has its own way of getting things done. We start there — then build technology around what the work actually needs.</p>
            <div className="hero-actions"><TextLink to="/projects">Explore Our Work</TextLink><TextLink variant="inline" to="/contact">Discuss a Project</TextLink></div>
          </div>
        </div>
        <div className="hero-foot"><span>INDEPENDENT THINKING. PURPOSEFUL ENGINEERING.</span><a href="#services" aria-label="Scroll to services">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
      </div>
      <div className="hero-graphic" aria-hidden="true"><span>01 / 06</span></div>
    </section>

    <section className="section services-section" id="services">
      <div className="shell">
        <SectionLabel number="02" text="WHAT WE DO" />
        <div className="split-head"><h2>LESS FRICTION.<br/><em>MORE FUNCTION.</em></h2><div><p>Technology should make operations easier, not introduce unnecessary complexity. Explore how software, automation, and systems engineering can support the way your organization operates.</p><TextLink variant="inline" to="/services">Explore Our Services</TextLink></div></div>
        <div className="service-list">{services.map((s) => <Link className="service-row" key={s.no} to="/services"><span>{s.no}</span><strong>{s.name}</strong><span className="service-detail">{s.detail}</span><span className="service-arrow" aria-hidden="true">↗</span></Link>)}</div>
      </div>
    </section>

    <section className="section work-section" id="projects">
      <div className="shell">
        <SectionLabel number="03" text="SELECTED PROJECTS" />
        <div className="work-header"><div><h2>WHAT WE BUILT.<br/><em>WHY IT EXISTS.</em></h2><p>Every project begins with a reason. Take a closer look at the problems, decisions, and technical work behind selected Kirjane Labs projects.</p></div><TextLink to="/projects" variant="light">View Selected Projects</TextLink></div>
        <Link to="/projects" className="work-feature" aria-label="Explore the selected projects page">
          <div className="work-art" aria-hidden="true"><span className="work-art-grid"/><span className="work-art-circle"/><span className="work-art-center">K<span>.</span></span><span className="work-art-caption">ENGINEERED WITH INTENT / 001</span></div>
          <div className="work-caption"><div><span>THE WORK / EDITORIAL INDEX</span><strong>Project evidence, not empty promises.</strong><small>Case studies will be published after factual and client-permission review.</small></div><span className="work-open" aria-hidden="true">↗</span></div>
        </Link>
      </div>
    </section>

    <section className="section process-section">
      <div className="shell">
        <SectionLabel number="04" text="OUR APPROACH" />
        <div className="split-head"><h2>BEFORE THE CODE,<br/><em>THERE’S A QUESTION.</em></h2><div><p>What needs to change? Who will use it? What should the system accomplish? Those answers shape the technical direction.</p><TextLink variant="inline" to="/process">How We Work</TextLink></div></div>
        <ol className="process-track">{steps.map((step, i) => <li key={step}><span>0{i + 1}</span><strong>{step}</strong><span className="track-dot" aria-hidden="true"/></li>)}</ol>
      </div>
    </section>

    <section className="about-strip">
      <div className="shell about-strip-inner"><div><SectionLabel number="05" text="ABOUT KIRJANE"/><h2>THE PEOPLE<br/><em>DOING THE WORK.</em></h2></div><div><p>Meet the team, discover our disciplines, and understand the thinking behind Kirjane Labs.</p><TextLink variant="inline" to="/about">Meet the Team</TextLink></div></div>
    </section>
    <section className="contact-banner"><div className="shell"><SectionLabel number="06" text="START A CONVERSATION"/><div className="contact-banner-inner"><h2>WHAT NEEDS<br/>TO CHANGE<span>.</span></h2><div><p>A new idea. An outdated process. A system that needs rethinking. Tell us what your organization is working on.</p><TextLink variant="light" to="/contact">Start a Conversation</TextLink></div></div></div></section>
  </main>;
}
