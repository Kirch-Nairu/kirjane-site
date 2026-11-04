import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { Eyebrow, SectionLabel, TextLink } from "../components/ui";

export const meta: MetaFunction = () => [
  { title: "Kirjane Labs — The Work Comes First" },
  { name: "description", content: "Kirjane Labs approaches software engineering, process automation and digital systems by understanding the work first." },
];

const services = [
  { no: "01", name: "Custom Software", detail: "Built around real workflows." },
  { no: "02", name: "Process Automation", detail: "Less repetition. Better movement." },
  { no: "03", name: "Systems Engineering", detail: "Structure behind the interface." },
  { no: "04", name: "Infrastructure & Support", detail: "The environment matters too." },
];

const steps = ["Discover", "Plan & Design", "Develop", "Validate", "Deliver & Support"];

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero">
        <div className="shell hero-shell">
          <div className="hero-overline">
            <Eyebrow>Software Engineering / Automation / Digital Systems</Eyebrow>
            <span className="hero-id">KIRJANE / 001</span>
          </div>
          <h1 className="hero-heading">
            <span>THE WORK<span className="hero-period">.</span></span>
            <span className="hero-heading-shift">COMES FIRST<span className="hero-period">.</span></span>
          </h1>
          <div className="hero-lower">
            <div className="hero-trace" aria-hidden="true">
              <div className="trace-axis"/>
              <span>FORM FOLLOWS FUNCTION</span>
              <b>↘</b>
            </div>
            <div className="hero-copy">
              <p>Every organization has its own way of getting things done. We start there — then build technology around what the work actually needs.</p>
              <div className="hero-actions">
                <TextLink to="/projects">Explore Our Work</TextLink>
                <TextLink variant="inline" to="/contact">Discuss a Project</TextLink>
              </div>
            </div>
          </div>
          <div className="hero-foot">
            <span>INDEPENDENT THINKING. PURPOSEFUL ENGINEERING.</span>
            <a href="#services" aria-label="Scroll to services">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero-graphic" aria-hidden="true"><span>01 / 06</span></div>
      </section>

      <section className="section services-section" id="services">
        <div className="shell">
          <SectionLabel number="02" text="WHAT WE DO"/>
          <div className="split-head" data-reveal>
            <h2>LESS FRICTION.<br/><em>MORE FUNCTION.</em></h2>
            <div><p>Technology should make operations easier, not introduce unnecessary complexity. We approach software, automation and systems engineering around the work they need to support.</p><TextLink variant="inline" to="/services">Explore Our Services</TextLink></div>
          </div>
          <div className="service-list">
            {services.map((s) => (
              <Link className="service-row" key={s.no} to="/services" data-reveal>
                <span>{s.no}</span>
                <strong>{s.name}</strong>
                <span className="service-detail">{s.detail}</span>
                <span className="service-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section work-section" id="projects">
        <div className="shell">
          <SectionLabel number="03" text="SELECTED PROJECTS"/>
          <div className="work-header" data-reveal>
            <div>
              <h2>BEHIND EVERY BUILD,<br/><em>A REASON.</em></h2>
              <p>From workflow to architecture to implementation, the decisions matter as much as the finished interface.</p>
            </div>
            <TextLink to="/projects" variant="light">Explore the Work</TextLink>
          </div>
          <Link to="/projects" className="work-feature" aria-label="Explore how Kirjane Labs presents project work" data-reveal>
            <div className="work-system-map" aria-hidden="true">
              <div className="system-grid"/>
              <div className="system-topline"><span>KIRJANE / ENGINEERING</span><span>FRAMEWORK / 001</span></div>
              <div className="system-flow">
                <div className="system-node"><span>01</span><strong>THE PROBLEM</strong><small>UNDERSTAND</small></div>
                <span className="system-connector">↗</span>
                <div className="system-node"><span>02</span><strong>THE DESIGN</strong><small>DECIDE</small></div>
                <span className="system-connector">↗</span>
                <div className="system-node"><span>03</span><strong>THE SYSTEM</strong><small>BUILD</small></div>
                <span className="system-connector">↗</span>
                <div className="system-node"><span>04</span><strong>THE RESULT</strong><small>VALIDATE</small></div>
              </div>
              <div className="system-bottomline"><span>REAL CONTEXT → DELIBERATE ENGINEERING</span><span>ADAPT / AUTOMATE / EVOLVE</span></div>
            </div>
            <div className="work-caption">
              <div><span>THE WORK / HOW WE DOCUMENT IT</span><strong>Good engineering should be explainable.</strong><small>Our project stories will show the decisions behind the build.</small></div>
              <span className="work-open" aria-hidden="true">↗</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="section process-section">
        <div className="shell">
          <SectionLabel number="04" text="OUR APPROACH"/>
          <div className="split-head" data-reveal>
            <h2>BEFORE THE CODE,<br/><em>THERE'S A QUESTION.</em></h2>
            <div><p>What needs to change? Who will use it? What should the system accomplish? Those answers shape the technical direction.</p><TextLink variant="inline" to="/process">How We Work</TextLink></div>
          </div>
          <ol className="process-track" data-reveal>{steps.map((step, i) => <li key={step}><span>0{i + 1}</span><strong>{step}</strong><span className="track-dot" aria-hidden="true"/></li>)}</ol>
        </div>
      </section>

      <section className="about-strip">
        <div className="shell about-strip-inner" data-reveal>
          <div><SectionLabel number="05" text="ABOUT KIRJANE"/><h2>THE PEOPLE<br/><em>DOING THE WORK.</em></h2></div>
          <div><p>Engineering decisions have people behind them. Learn about Kirjane Labs, our technical leadership and the approach that guides our work.</p><TextLink variant="inline" to="/about">About the Studio</TextLink></div>
        </div>
      </section>
      <section className="contact-banner">
        <div className="shell">
          <SectionLabel number="06" text="START A CONVERSATION"/>
          <div className="contact-banner-inner" data-reveal>
            <h2>WHAT NEEDS<br/>TO CHANGE<span>.</span></h2>
            <div><p>A new idea. An outdated process. A system that needs rethinking. Start with the problem, then find the right direction.</p><TextLink variant="light" to="/contact">Get in Touch</TextLink></div>
          </div>
        </div>
      </section>
    </main>
  );
}
