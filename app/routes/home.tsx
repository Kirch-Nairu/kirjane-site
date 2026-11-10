import { Link } from "react-router";
import { ArrowLink } from "../components/Editorial";
import { services, processSteps } from "../data/content";

export function meta() {
  return [
    { title: "Kirjane Labs | The Work Comes First" },
    { name: "description", content: "Explore Kirjane Labs' approach to software engineering, automation, and digital systems built around real organizational work." },
  ];
}

export default function Home() {
  return (
    <>
      <section className="hero page-shell" aria-labelledby="hero-title">
        <div className="hero-rail"><span>01 / INTRODUCTION</span><span>ADAPT. AUTOMATE. EVOLVE.</span></div>
        <div className="hero-core">
          <span className="hero-diagonal-mark" aria-hidden="true" />
          <p className="eyebrow">SOFTWARE ENGINEERING / AUTOMATION / DIGITAL SYSTEMS</p>
          <h1 id="hero-title" className="hero-title">
            <span>THE WORK.</span><span className="hero-title-second"><span>COMES</span><em>FIRST.</em></span>
          </h1>
          <div className="hero-details">
            <p>Every organization has its own way of getting things done. We start there — then build technology around what the work actually needs.</p>
            <div className="hero-actions">
              <Link to="/projects" className="button-primary">Explore Our Work <span aria-hidden="true">↗</span></Link>
              <ArrowLink to="/contact">Discuss a Project</ArrowLink>
            </div>
          </div>
        </div>
        <div className="hero-bottom"><span>DESIGN THAT SERVES A PURPOSE.</span><a className="hero-scroll" href="#services-heading">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
      </section>

      <section className="home-section page-shell" aria-labelledby="services-heading">
        <div className="section-marker"><span>02 / SERVICES</span><span>WHAT WE DO</span></div>
        <div className="section-split">
          <div><h2 id="services-heading" className="section-title">LESS FRICTION.<br /><span className="ink-green">MORE FUNCTION.</span></h2><p className="section-copy">Technology should make operations easier, not introduce unnecessary complexity.</p><p className="section-copy">Explore how software, automation, and systems engineering can support the way your organization operates.</p><ArrowLink to="/services">Explore Our Services</ArrowLink></div>
          <ol className="service-list">{services.slice(0,3).map(s => <li key={s.number}><Link to="/services" className="service-list-link"><span className="list-index">{s.number}</span><span>{s.title}</span><span aria-hidden="true">↗</span></Link></li>)}</ol>
        </div>
      </section>

      <section className="project-section" aria-labelledby="projects-heading">
        <div className="page-shell">
          <div className="section-marker"><span>03 / SELECTED PROJECTS</span><span>PROOF, NOT PROMISES</span></div>
          <h2 id="projects-heading" className="section-title">WHAT WE BUILT.<br /><span className="ink-green">WHY IT EXISTS.</span></h2>
          <div className="projects-layout">
            <div className="project-editorial-panel" aria-label="A project is more than its interface">
              <div className="panel-topline"><span>KIRJANE / WORK IN CONTEXT</span><span>01—04</span></div>
              <div className="panel-statement"><span>THE</span><strong>WHY.</strong><span>BEHIND THE</span><strong>BUILD.</strong></div>
              <div className="panel-bottomline"><span>THE PROBLEM</span><span>THE DECISIONS</span><span>THE RESULT</span></div>
            </div>
            <div className="projects-description"><p>Every project begins with a reason.</p><p>Take a closer look at the problems, decisions, and technical work behind a system—not just the finished interface.</p><p className="project-publishing-note">Individual case studies will be published once their details can be shared.</p><ArrowLink to="/projects">Explore Our Approach to Projects</ArrowLink></div>
          </div>
        </div>
      </section>

      <section className="home-section page-shell" aria-labelledby="process-heading">
        <div className="section-marker"><span>04 / OUR APPROACH</span><span>HOW WE THINK</span></div>
        <div className="section-split">
          <div><h2 id="process-heading" className="section-title">BEFORE THE CODE,<br /><span className="ink-green">THERE'S A QUESTION.</span></h2><p className="section-copy">What needs to change? Who will use it? What should the system accomplish?</p><p className="section-copy">Those answers shape the technical direction.</p><ArrowLink to="/process">How We Work</ArrowLink></div>
          <ol className="process-timeline">{processSteps.slice(0,4).map(s => <li key={s.number}><span>{s.number}</span><strong>{s.title}</strong></li>)}</ol>
        </div>
      </section>

      <section className="about-section page-shell" aria-labelledby="about-heading">
        <div className="section-marker"><span>05 / ABOUT US</span><span>THE TEAM</span></div>
        <div className="about-layout"><h2 id="about-heading" className="section-title">THE PEOPLE<br /><span className="ink-green">DOING THE WORK.</span></h2><div><p className="section-copy">Meet the team, discover our disciplines, and understand the thinking behind Kirjane Labs.</p><ArrowLink to="/about">Meet the Team</ArrowLink></div></div>
      </section>

      <section className="contact-band" aria-labelledby="contact-heading">
        <div className="page-shell">
          <div className="section-marker section-marker-light"><span>06 / CONTACT</span><span>START HERE</span></div>
          <div className="contact-band-layout"><div><h2 id="contact-heading" className="section-title">WHAT NEEDS<br />TO CHANGE?</h2><p>A new idea. An outdated process. A system that needs rethinking.</p><p>Tell us what your organization is working on.</p></div><Link className="button-light" to="/contact">Start a Conversation <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>
    </>
  );
}
