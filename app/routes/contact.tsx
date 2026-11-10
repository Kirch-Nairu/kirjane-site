import { PageIntro } from "../components/Editorial";
import { ContactInquiryForm } from "../components/ContactInquiryForm";

export function meta() {
  return [
    { title: "Contact | Kirjane IT Solutions" },
    { name: "description", content: "Start a conversation with Kirjane IT Solutions about software, automation, or digital-system requirements." },
  ];
}

export default function Contact() {
  return (
    <>
      <PageIntro
        number="06"
        eyebrow="CONTACT"
        lines={["A PROBLEM. AN IDEA.", "LET'S TALK."]}
        summary="You don't need a complete technical specification to begin. Tell us about your idea, your current process, or the challenge your organization wants to address. We'll start with the details that matter."
      />
      <section className="page-shell subpage-content" aria-labelledby="inquiry-heading">
        <div className="section-marker">
          <span>START A CONVERSATION</span>
          <span>INQUIRY FORM — COMING SOON</span>
        </div>
        <div className="contact-editorial">
          <div className="contact-introduction">
            <h2 id="inquiry-heading" className="section-title compact">THE NEXT STEP<br /><span className="ink-green">STARTS HERE.</span></h2>
            <p className="section-copy">
              A practical project begins with understanding the requirements.
              Our inquiry channel will open once the company contact and privacy details are confirmed.
            </p>
            <div className="contact-note">
              <span className="eyebrow">CURRENT STATUS</span>
              <p>Inquiries are not yet active. No form data can be submitted from this website preview.</p>
            </div>
          </div>
          <ContactInquiryForm />
        </div>
      </section>
      <section className="page-shell contact-prep" aria-labelledby="contact-prep-heading">
        <div className="section-marker"><span>BEFORE YOU REACH OUT</span><span>THREE USEFUL QUESTIONS</span></div>
        <div className="page-lead">
          <h2 id="contact-prep-heading" className="section-title compact">NO LONG BRIEF<br /><span className="ink-green">REQUIRED.</span></h2>
          <p className="section-copy">When the inquiry channel opens, a few practical details will help us understand your situation.</p>
        </div>
        <ol className="contact-prep-list">
          <li><span>01</span><p>What does the current process look like?</p></li>
          <li><span>02</span><p>What do you want to improve or change?</p></li>
          <li><span>03</span><p>Who will use or depend on the result?</p></li>
        </ol>
      </section>
    </>
  );
}
