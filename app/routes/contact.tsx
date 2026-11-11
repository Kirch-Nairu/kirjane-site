import { PageIntro } from "../components/Editorial";
import { ContactInquiryForm } from "../components/ContactInquiryForm";
import { Reveal } from "../components/Motion";

export function meta() {
  return [
    { title: "Contact | Kirjane IT Solutions" },
    {
      name: "description",
      content:
        "Start a conversation with Kirjane IT Solutions about Salryn BMS, Scoryn Automated Tabulation, custom enterprise software, backend systems, or managed web hosting.",
    },
  ];
}

export default function Contact() {
  return (
    <>
      <PageIntro
        number="06"
        eyebrow="CONTACT & SCOPING"
        badge="SALRYN · SCORYN · CUSTOM SYSTEMS · CLOUD & WEB HOSTING"
        lines={["A PROBLEM. A SYSTEM.", "LET'S TALK."]}
        summary="You don't need a 50-page technical specification to begin. Tell us about your business workflow, the Salryn flavor you want to deploy, an upcoming event for Scoryn, or the custom platform your organization needs."
      />

      <section className="page-shell subpage-content" aria-labelledby="inquiry-heading">
        <Reveal direction="up">
          <div className="section-marker">
            <span>START A CONVERSATION</span>
            <span>DIRECT SCOPING & PRODUCT INQUIRIES</span>
          </div>
        </Reveal>

        <div className="contact-editorial">
          <Reveal direction="up" delay={60} className="contact-introduction">
            <h2 id="inquiry-heading" className="section-title compact">
              THE NEXT STEP
              <br />
              <span className="ink-green">STARTS HERE.</span>
            </h2>
            <p className="section-copy">
              Every project begins with reconciling what your operation actually needs—from backend
              architecture and financial controls to hosting and user experience.
            </p>
            <div className="contact-note">
              <span className="eyebrow">DIRECT CHANNELS (PLACEHOLDER)</span>
              <p>
                <strong>Email:</strong> [PLACEHOLDER: inquiries@kirjane.com]
                <br />
                <strong>Location:</strong> [PLACEHOLDER: Bohol / Philippines — Regional & Remote
                Operations]
                <br />
                <strong>Form Status:</strong> Pre-launch preview mode while backend routing endpoint
                is finalized.
              </p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={120}>
            <ContactInquiryForm />
          </Reveal>
        </div>
      </section>

      <section className="page-shell contact-prep" aria-labelledby="contact-prep-heading">
        <Reveal direction="up">
          <div className="section-marker">
            <span>BEFORE YOU REACH OUT</span>
            <span>THREE USEFUL QUESTIONS</span>
          </div>
        </Reveal>

        <Reveal direction="up" delay={60}>
          <div className="page-lead">
            <h2 id="contact-prep-heading" className="section-title compact">
              NO LONG BRIEF
              <br />
              <span className="ink-green">REQUIRED.</span>
            </h2>
            <p className="section-copy">
              A few practical details help our engineering and business leads frame the right
              approach immediately.
            </p>
          </div>
        </Reveal>

        <ol className="contact-prep-list">
          <li>
            <Reveal direction="up" delay={50}>
              <span>01 // WORKFLOW OR PRODUCT</span>
              <p>
                Are you looking for a Salryn BMS flavor, Scoryn event tabulation, managed hosting,
                or a fully custom system?
              </p>
            </Reveal>
          </li>
          <li>
            <Reveal direction="up" delay={110}>
              <span>02 // BOTTLENECK OR GOAL</span>
              <p>
                Where does time get lost, or what critical process needs stronger accuracy and
                control?
              </p>
            </Reveal>
          </li>
          <li>
            <Reveal direction="up" delay={170}>
              <span>03 // OPERATORS & TIMELINE</span>
              <p>
                Who will use the system day-to-day, and what target window or event date are you
                working toward?
              </p>
            </Reveal>
          </li>
        </ol>
      </section>
    </>
  );
}
