import "../styles/leadership.css";
import type { MetaFunction } from "react-router";
import { PageIntro, SectionLabel, TextLink } from "../components/ui";

export const meta: MetaFunction = () => [
  { title: "About Us — Kirjane Labs" },
  {
    name: "description",
    content: "Meet Kirjane Labs and founder Kirch Ivan A. Balite, Chief Technology Officer, Head of Engineering, Main Systems Architect and Backend Engineer.",
  },
];

const principles = [
  { number: "01", title: "Understand the work", text: "Start with people, processes, constraints and intended outcomes." },
  { number: "02", title: "Engineer with purpose", text: "Make architecture and implementation decisions against actual requirements." },
  { number: "03", title: "Validate what matters", text: "Check system behavior, usability and reliability before calling work complete." },
];

export default function About() {
  return (
    <main id="main-content">
      <PageIntro
        number="04"
        category="THE COMPANY / THE PEOPLE"
        title={<>BUILT ON<br/><em>THE WORK.</em></>}
        description={<>Kirjane Labs approaches software, automation and digital systems with a focus on how organizations actually operate. The work comes first; the technical choices follow.</>}
      />

      <section className="section content-section shell founder-section" aria-labelledby="founder-heading">
        <SectionLabel number="01" text="FOUNDER / ENGINEERING LEADERSHIP" />
        <div className="founder-layout">
          <div className="founder-visual" data-reveal>
            <figure className="founder-portrait">
              <div className="founder-image-frame">
                <img
                  src="/people/kirch-ivan-balite.webp"
                  width={400}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  alt="Portrait of Kirch Ivan A. Balite wearing a dark business suit and tie against a dark studio backdrop"
                />
                <span className="founder-portrait-index" aria-hidden="true">K / 01</span>
              </div>
              <figcaption>
                <span>THE PEOPLE BEHIND THE SYSTEMS</span>
                <span>01 — FOUNDER</span>
              </figcaption>
            </figure>
          </div>

          <div className="founder-copy" data-reveal>
            <div className="founder-copy-top">
              <span className="eyebrow">KIRJANE LABS / LEADERSHIP</span>
              <span className="founder-serial">001 — TECHNICAL AUTHORITY</span>
            </div>
            <p className="founder-name">Kirch Ivan A. Balite</p>
            <h2 id="founder-heading">FOUNDER &amp;<br/><em>CHIEF TECHNOLOGY</em><br/>OFFICER<span className="founder-stop">.</span></h2>
            <div className="founder-rule" aria-hidden="true" />
            <p className="founder-statement">Engineering direction shaped by the systems that have to work in the real world.</p>
            <p className="founder-biography">
              Kirch Ivan A. Balite founded Kirjane Labs and leads its engineering direction.
              His responsibilities span systems architecture, backend engineering and technical leadership.
            </p>
            <div className="founder-disciplines" aria-label="Additional engineering responsibilities">
              <span className="founder-disciplines-label">AREAS OF RESPONSIBILITY</span>
              <ul>
                <li><span>01</span>Head of Engineering</li>
                <li><span>02</span>Main Systems Architect</li>
                <li><span>03</span>Backend Engineer</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section content-section shell about-principles" aria-labelledby="principles-title">
        <SectionLabel number="02" text="THE APPROACH" />
        <div className="split-head" data-reveal>
          <h2 id="principles-title">UNDERSTAND FIRST.<br/><em>ENGINEER SECOND.</em></h2>
          <div>
            <p>Good technology takes more than good code. The right solution starts by understanding the work it is supposed to support.</p>
            <TextLink to="/process" variant="inline">Explore Our Process</TextLink>
          </div>
        </div>
        <div className="about-principle-list">
          {principles.map((item) => (
            <article className="about-principle" key={item.number} data-reveal>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="simple-cta shell" data-reveal>
        <span>WHAT COMES NEXT</span>
        <h2>LET'S TALK ABOUT<br/><em>THE WORK.</em></h2>
        <TextLink to="/contact">Start a Conversation</TextLink>
      </section>
    </main>
  );
}
