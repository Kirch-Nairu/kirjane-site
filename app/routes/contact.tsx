import type { MetaFunction } from "react-router";
import { PageIntro, SectionLabel } from "../components/ui";
export const meta: MetaFunction = () => [
  { title: "Contact — Kirjane Labs" },
  { name: "description", content: "Start a conversation with Kirjane Labs about an idea, operational challenge, or potential software engineering project." },
];
export default function Contact() {
  return <main id="main-content">
    <PageIntro number="06" category="LET'S TALK" title={<>A PROBLEM. AN IDEA.<br/><em>LET’S TALK.</em></>} description={<>You don’t need a complete technical specification to begin. Tell us about your idea, your current process, or the challenge your organization wants to address. We’ll start with the details that matter.</>}/>
    <section className="section content-section shell">
      <SectionLabel number="01" text="START A CONVERSATION"/>
      <div className="contact-layout"><div><h2>GOOD WORK<br/><em>STARTS WITH A QUESTION.</em></h2><p>A secure inquiry channel is being configured for the company-owned VPS. The public form will only be enabled after the official recipient inbox, privacy notice, processing policy, server-side validation, and real submission tests are approved.</p></div>
      <div className="contact-pending" role="status"><span className="status-dot" aria-hidden="true"/><span className="eyebrow">INQUIRY CHANNEL / PENDING</span><h3>CONTACT DETAILS<br/>IN VERIFICATION</h3><p>No messages are being accepted through this website yet. This preview does not claim that a form or inbox is operational.</p></div></div>
    </section>
  </main>;
}
