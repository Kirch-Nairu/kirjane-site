import { PageIntro } from "../components/Editorial";
import { ContactInquiryForm } from "../components/ContactInquiryForm";

export function meta() {
  return [
    { title: "Contact | Kirjane Labs" },
    { name: "description", content: "Start a conversation with Kirjane Labs about software, automation, or digital-system requirements." },
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
    </>
  );
}
