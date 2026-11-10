import { Link } from "react-router";
import { ArrowLink } from "../components/Editorial";
import { services, processSteps } from "../data/content";

const projectChapters = [
  { number: "01", label: "THE PROBLEM" },
  { number: "02", label: "THE DECISIONS" },
  { number: "03", label: "THE RESULT" },
];

const principles = [
  { number: "01", label: "UNDERSTAND", detail: "Start with the people and the work." },
  { number: "02", label: "DESIGN", detail: "Give every interaction a purpose." },
  { number: "03", label: "VALIDATE", detail: "Check what the result actually does." },
];

export function meta() {
  return [
    { title: "Kirjane Labs | The Work Comes First" },
    { name: "description", content: "Kirjane Labs develops software, automation and digital systems with practical organizational needs at the center." },
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

      <section className="home-section page-shell home-services-r4" aria-labelledby="services-heading">
        <div className="section-marker"><span>02 / SERVICES</span><span>WHAT WE DO</span></div>
        <div className="home-services-grid">
          <div className="home-services-intro">
            <h2 id="services-heading" className="section-title">LESS FRICTION.<br /><span className="ink-green">MORE FUNCTION.</span></h2>
            <p className="section-copy">Technology should make operations easier, not introduce unnecessary complexity.</p>
            <p className="section-copy">From tailored applications to automation and integration, the starting point is always the work itself.</p>
            <ArrowLink to="/services">Explore Our Services</ArrowLink>
          </div>
          <ol className="home-capabilities" aria-label="Service areas">
            {services.map((s) => (
              <li key={s.number}>
                <Link to="/services" className="home-capability-link">
                  <span className="home-capability-index">{s.number}</span>
                  <span className="home-capability-content"><strong>{s.title}</strong><small>{s.description}</small></span>
                  <span className="home-capability-arrow" aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="project-section home-projects-r4" aria-labelledby="projects-heading">
        <div className="page-shell">
          <div className="section-marker"><span>03 / SELECTED PROJECTS</span><span>WORK IN CONTEXT</span></div>
          <div className="home-project-heading">
            <h2 id="projects-heading" className="section-title">WHAT WE BUILT.<br /><span className="ink-green">WHY IT EXISTS.</span></h2>
            <p>Good work has a reason behind it. Every decision should connect back to the problem it was meant to solve.</p>
          </div>
          <div className="home-project-showcase">
            <div className="project-r4-panel" aria-label="Editorial graphic about looking beyond the interface">
              <div className="project-r4-top"><span>KIRJANE LABS / PROJECT PERSPECTIVE</span><span aria-hidden="true">↗</span></div>
              <div className="project-r4-type" aria-hidden="true"><span>BEYOND</span><span>THE</span><strong>INTERFACE.</strong></div>
              <div className="project-r4-bottom"><span>THE WHY</span><span>THE HOW</span><span>THE RESULT</span></div>
            </div>
            <div className="project-r4-aside">
              <p className="eyebrow">THE WORK BEHIND THE WORK</p>
              <h3>A SCREEN IS<br />ONLY THE START.</h3>
              <p>Explore the challenges, architecture, and decisions that shape useful digital systems. Individual case studies will follow when their materials are approved for publication.</p>
              <ol className="project-r4-chapters">
                {projectChapters.map((c) => <li key={c.number}><span>{c.number}</span><strong>{c.label}</strong></li>)}
              </ol>
              <ArrowLink to="/projects">Explore Selected Projects</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section page-shell home-approach-r4" aria-labelledby="process-heading">
        <div className="section-marker"><span>04 / OUR APPROACH</span><span>HOW WE THINK</span></div>
        <div className="home-approach-grid">
          <div className="home-approach-intro">
            <h2 id="process-heading" className="section-title">BEFORE THE CODE,<br /><span className="ink-green">THERE'S A QUESTION.</span></h2>
            <p className="section-copy">What needs to change? Who will use it? What should the system accomplish?</p>
            <p className="section-copy">Those answers shape the technical direction.</p>
            <ArrowLink to="/process">How We Work</ArrowLink>
          </div>
          <ol className="home-approach-steps">
            {processSteps.map((step) => (
              <li key={step.number}>
                <span className="home-step-index">{step.number}</span>
                <div><strong>{step.title}</strong><p>{step.detail}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-about-r4" aria-labelledby="about-heading">
        <div className="page-shell">
          <div className="section-marker"><span>05 / ABOUT US</span><span>THE PEOPLE BEHIND THE WORK</span></div>
          <div className="home-about-grid">
            <div>
              <h2 id="about-heading" className="section-title">THE PEOPLE<br /><span className="ink-green">DOING THE WORK.</span></h2>
            </div>
            <div className="home-about-content">
              <p className="home-about-lead">Behind every system are real people, processes, and decisions.</p>
              <p>Kirjane Labs approaches the work by connecting engineering decisions to practical needs, with clarity and usability in mind.</p>
              <ArrowLink to="/about">About Kirjane Labs</ArrowLink>
            </div>
          </div>
          <ol className="home-principles">
            {principles.map((item) => (
              <li key={item.number}>
                <span className="eyebrow">{item.number} / 03</span>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="contact-band home-contact-r4" aria-labelledby="contact-heading">
        <div className="page-shell">
          <div className="section-marker section-marker-light"><span>06 / CONTACT</span><span>START HERE</span></div>
          <div className="contact-band-layout home-contact-layout">
            <div>
              <p className="eyebrow">A CONVERSATION BEGINS WITH CONTEXT</p>
              <h2 id="contact-heading" className="section-title">WHAT NEEDS<br />TO CHANGE?</h2>
              <p>A new idea. An outdated process. A system that needs rethinking.</p>
              <p>Tell us what your organization is working on.</p>
            </div>
            <div className="home-contact-action">
              <Link className="button-light" to="/contact">Explore Contact <span aria-hidden="true">↗</span></Link>
              <small>The inquiry form is being prepared and is not accepting submissions yet.</small>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
