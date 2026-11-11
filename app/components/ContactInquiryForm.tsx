import { company } from "../data/content";

const inquiryTypes = [
  { value: "salryn-bms", label: "Salryn BMS (Cafe, Retail, Hardware, or Custom Setup)" },
  { value: "scoryn-tabulation", label: "Scoryn Automated Tabulation (Pageants & Live Events)" },
  { value: "enterprise-software", label: "Custom Business or Municipal Software" },
  { value: "backend-security-cloud", label: "Backend Systems, Security & Cloud Setup" },
  { value: "web-hosting-websites", label: "Web Hosting or Custom Website" },
  { value: "general", label: "General Question or Partnership" },
];

export function ContactInquiryForm() {
  return (
    <div className="inquiry-card">
      <div className="inquiry-card-heading">
        <span className="section-kicker">Project & Product Inquiry</span>
      </div>
      <h3>Tell us what you need</h3>
      <p id="contact-form-status" className="inquiry-status" role="status">
        Reach us directly at{" "}
        <a href={`mailto:${company.email}`} style={{ textDecoration: "underline", fontWeight: 700 }}>
          {company.email}
        </a>{" "}
        or message <strong>{company.facebook}</strong> on Facebook while online form routing is
        being finalized.
      </p>
      <form
        className="inquiry-form"
        name="contact"
        method="POST"
        aria-describedby="contact-form-status"
      >
        <fieldset disabled className="inquiry-fields">
          <legend className="visually-hidden">Contact information and project details</legend>
          <div className="inquiry-pair">
            <div className="inquiry-field">
              <label htmlFor="contact-name">
                Your name <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-name"
                name="full-name"
                type="text"
                placeholder="Full name"
                autoComplete="name"
                required
              />
            </div>
            <div className="inquiry-field">
              <label htmlFor="contact-email">
                Email address <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>
          </div>
          <div className="inquiry-field">
            <label htmlFor="contact-organization">
              Business, school, or office name <span className="optional">(optional)</span>
            </label>
            <input
              id="contact-organization"
              name="organization"
              type="text"
              placeholder="Name of your business or organization"
              autoComplete="organization"
            />
          </div>
          <div className="inquiry-field">
            <label htmlFor="contact-type">
              What can we help you with? <span aria-hidden="true">*</span>
            </label>
            <select id="contact-type" name="inquiry-type" defaultValue="" required>
              <option value="" disabled>
                Choose a product or service
              </option>
              {inquiryTypes.map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="inquiry-field">
            <label htmlFor="contact-details">
              Tell us a bit about your project <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="contact-details"
              name="details"
              rows={5}
              placeholder="Share what your business does, which Salryn setup you need, your event date for Scoryn, or what workflow you want to improve..."
              required
              maxLength={4000}
            />
          </div>
          <button className="button-primary inquiry-submit" type="submit" disabled>
            Send Message
          </button>
        </fieldset>
      </form>
    </div>
  );
}
