import { PageIntro } from "../components/Editorial";
export function meta() { return [{ title: "Contact | Kirjane Labs" }, { name: "description", content: "Start a conversation with Kirjane Labs about software, automation, or digital-system requirements." }]; }
export default function Contact() {
  return <>
    <PageIntro number="06" eyebrow="CONTACT" lines={["A PROBLEM. AN IDEA.", "LET'S TALK."]} summary="You don't need a complete technical specification to begin. Tell us about your idea, your current process, or the challenge your organization wants to address. We'll start with the details that matter." />
    <section className="page-shell subpage-content">
      <div className="section-marker"><span>INQUIRIES</span><span>ACTIVATION PENDING</span></div>
      <div className="contact-placeholder"><div><h2>THE NEXT STEP<br /><span className="ink-green">STARTS HERE.</span></h2><p>Our inquiry form will open after the official company inbox, privacy notice and submission handling have been approved.</p></div><div className="contact-state"><span className="status-light" aria-hidden="true"></span><strong>Contact form not yet active</strong><p>No message can be sent from this preview.</p></div></div>
    </section>
  </>;
}
