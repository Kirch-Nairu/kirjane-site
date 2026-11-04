import type { MetaFunction } from "react-router";
import { PageIntro, SectionLabel, TextLink } from "../components/ui";

export const meta: MetaFunction = () => [
  { title: "Contact — Kirjane Labs" },
  { name: "description", content: "Learn how to prepare a project conversation with Kirjane Labs. Website inquiries are not yet enabled." },
];

const prompts = [
  { no: "01", title: "What's happening now?", detail: "A workflow, challenge or new idea." },
  { no: "02", title: "Who is it for?", detail: "The people who use or depend on it." },
  { no: "03", title: "What should change?", detail: "The outcome you're working toward." },
];

export default function Contact() {
  return (
    <main id="main-content">
      <PageIntro
        number="06"
        category="CONTACT / COLLABORATION"
        title={<>A PROBLEM.<br/>AN IDEA.<br/><em>LET'S TALK.</em></>}
        description={<>You don't need a finished technical specification to begin. A useful discussion starts with the problem, the people involved and what needs to change.</>}
      />
      <section className="section content-section shell">
        <SectionLabel number="01" text="START WITH THE WORK" />
        <div className="contact-editorial-grid">
          <div data-reveal>
            <h2>THE FIRST STEP<br/><em>IS CLARITY.</em></h2>
            <p>When the inquiry channel opens, these three questions will help establish the direction before discussing specific technology.</p>
            <div className="contact-prompts">
              {prompts.map((item) => (
                <div key={item.no} className="contact-prompt">
                  <span>{item.no}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div>
                </div>
              ))}
            </div>
          </div>
          <aside className="contact-status" aria-label="Website inquiry availability" data-reveal>
            <div className="contact-status-top"><span>CHANNEL STATUS</span><span>01 / PREPARATION</span></div>
            <div className="contact-status-mark" aria-hidden="true">↗</div>
            <h3>WEBSITE<br/>INQUIRIES<br/><em>COMING SOON.</em></h3>
            <p>The secure inquiry channel is not active yet. This website currently does not collect or deliver contact messages.</p>
            <div className="contact-status-bottom"><span>NO FORM / NO SUBMISSION</span><span>KIRJANE LABS</span></div>
          </aside>
        </div>
      </section>
      <section className="simple-cta shell" data-reveal>
        <span>EXPLORE FURTHER</span>
        <h2>SEE WHAT<br/><em>WE WORK ON.</em></h2>
        <TextLink to="/services">Explore Our Services</TextLink>
      </section>
    </main>
  );
}
