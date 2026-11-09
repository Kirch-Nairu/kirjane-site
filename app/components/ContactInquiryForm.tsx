/**
 * Pre-launch presentation of the approved Section 10 inquiry fields.
 * Fieldset stays disabled until Kirjane authorizes the inbox, privacy notice,
 * retention/access handling, Netlify configuration and an end-to-end test.
 * No mocked success state, no accidental form submissions.
 */
const inquiryTypes = [
  { value: "project-development", label: "Project Development" },
  { value: "partnership", label: "Business Partnership" },
  { value: "technical-consultation", label: "Technical Consultation" },
  { value: "general", label: "General Inquiry" },
];

export function ContactInquiryForm() {
  return (
    <div className="inquiry-card">
      <div className="inquiry-card-heading">
        <span className="eyebrow">PROJECT INQUIRIES</span>
        <span className="inquiry-card-index" aria-hidden="true">01—05</span>
      </div>
      <h3>Tell us about<br />your project.</h3>
      <p id="contact-form-status" className="inquiry-status" role="status">
        This inquiry form is being prepared and is not accepting messages yet.
      </p>
      <form
        className="inquiry-form"
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        aria-describedby="contact-form-status"
      >
        <input type="hidden" name="form-name" value="contact" />
        <div hidden>
          <label htmlFor="contact-bot">Leave this field empty</label>
          <input id="contact-bot" name="bot-field" tabIndex={-1} autoComplete="off" />
        </div>
        <fieldset disabled className="inquiry-fields">
          <legend className="visually-hidden">Contact information and project details</legend>
          <div className="inquiry-pair">
            <div className="inquiry-field">
              <label htmlFor="contact-name">Full name <span aria-hidden="true">*</span></label>
              <input id="contact-name" name="full-name" type="text" placeholder="Your full name" autoComplete="name" required />
            </div>
            <div className="inquiry-field">
              <label htmlFor="contact-email">Email address <span aria-hidden="true">*</span></label>
              <input id="contact-email" name="email" type="email" placeholder="you@organization.com" autoComplete="email" required />
            </div>
          </div>
          <div className="inquiry-field">
            <label htmlFor="contact-organization">Organization / company <span className="optional">(optional)</span></label>
            <input id="contact-organization" name="organization" type="text" placeholder="Company or organization" autoComplete="organization" />
          </div>
          <div className="inquiry-field">
            <label htmlFor="contact-type">Type of inquiry <span aria-hidden="true">*</span></label>
            <select id="contact-type" name="inquiry-type" defaultValue="" required>
              <option value="" disabled>Select inquiry type</option>
              {inquiryTypes.map(({ value, label }) => <option value={value} key={value}>{label}</option>)}
            </select>
          </div>
          <div className="inquiry-field">
            <label htmlFor="contact-details">Project details <span aria-hidden="true">*</span></label>
            <textarea id="contact-details" name="details" rows={5} placeholder="Tell us about the problem or project..." required maxLength={4000} />
          </div>
          <p className="privacy-pending">The company Privacy Notice will be available before inquiries open.</p>
          <button className="button-primary inquiry-submit" type="submit" disabled>
            Send Inquiry <span aria-hidden="true">↗</span>
          </button>
        </fieldset>
      </form>
    </div>
  );
}
