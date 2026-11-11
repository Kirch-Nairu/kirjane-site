import { company } from "../data/content";
import { PageIntro } from "../components/Editorial";
import { ContactInquiryForm } from "../components/ContactInquiryForm";
import { Reveal } from "../components/Motion";

export function meta() {
  return [
    {
      title: "Contact Kirjane Labs — Bohol, Philippines | kirjanelabs@gmail.com",
    },
    {
      name: "description",
      content:
        "Get in touch with Kirjane Labs (Kirjane IT Solutions) in Bohol, Philippines for Salryn demos, Scoryn event tabulation, web hosting, or custom software development.",
    },
  ];
}

export default function Contact() {
  return (
    <>
      <PageIntro
        eyebrow="Contact Us"
        badge={company.location}
        lines={["Tell us what your business or organization needs."]}
        summary="Whether you want to try Salryn for your store or cafe, book Scoryn for a live event, host your company website, or build a custom internal system, reach out to our team directly."
      />

      <section className="page-shell section-block">
        <Reveal>
          <div className="contact-channels-bar">
            <a href={`mailto:${company.email}`} className="contact-channel-card">
              <span className="contact-channel-label">Direct Email</span>
              <strong>{company.email}</strong>
              <span className="contact-channel-Action">Open email client ↗</span>
            </a>

            <a
              href={company.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-channel-card"
            >
              <span className="contact-channel-label">Official Facebook</span>
              <strong>{company.facebook}</strong>
              <span className="contact-channel-Action">Message on Facebook ↗</span>
            </a>

            <div className="contact-channel-card">
              <span className="contact-channel-label">Office &amp; Operations</span>
              <strong>{company.location}</strong>
              <span className="contact-channel-Action">{company.legalName}</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <ContactInquiryForm />
        </Reveal>
      </section>
    </>
  );
}
