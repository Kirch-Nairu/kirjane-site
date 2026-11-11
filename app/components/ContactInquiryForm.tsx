const inquiryTypes = [
  { value: "salryn-bms", label: "Salryn BMS (Cafe, Gen Merch, Retail, or Custom Flavor)" },
  { value: "scoryn-tabulation", label: "Scoryn Automated Tabulation System (Events & Pageants)" },
  { value: "enterprise-software", label: "Tailored Enterprise / Intra-Office Software" },
  { value: "backend-security-cloud", label: "Backend Architecture, Security & Cloud Ops" },
  { value: "web-hosting-websites", label: "Managed Web Hosting & Custom Website Development" },
  { value: "general", label: "General Partnership or Technical Consultation" },
];

export function ContactInquiryForm() {
  return (
    <div className="inquiry-card">
      <div className="inquiry-card-heading">
        <span className="eyebrow">PROJECT & PRODUCT INQUIRIES</span>
        <span className="inquiry-card-index" aria-hidden="true">
          01—06
        </span>
      </div>
      <h3>
        Tell us what your
        <br />
        organization needs.
      </h3>
      <p id="contact-form-status" className="inquiry-status" role="status">
        [PLACEHOLDER: Direct inquiry routing endpoint pending final configuration — form fields are in preview mode.]
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
                Full name <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-name"
                name="full-name"
                type="text"
                placeholder="Your full name"
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
                placeholder="you@organization.com"
                autoComplete="email"
                required
              />
            </div>
          </div>
          <div className="inquiry-field">
            <label htmlFor="contact-organization">
              Organization / company / LGU <span className="optional">(optional)</span>
            </label>
            <input
              id="contact-organization"
              name="organization"
              type="text"
              placeholder="Business, institution, or event organization"
              autoComplete="organization"
            />
          </div>
          <div className="inquiry-field">
            <label htmlFor="contact-type">
              Solution or service needed <span aria-hidden="true">*</span>
            </label>
            <select id="contact-type" name="inquiry-type" defaultValue="" required>
              <option value="" disabled>
                Select product or engineering service
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
              Operational context & requirements <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="contact-details"
              name="details"
              rows={5}
              placeholder="Tell us about your current workflow, desired Salryn flavor, event date for Scoryn, or custom system requirements..."
              required
              maxLength={4000}
            />
          </div>
          <p className="privacy-pending">
            [PLACEHOLDER: Official inquiry email, contact numbers, and privacy notice will be linked here prior to live activation.]
          </p>
          <button className="button-primary inquiry-submit" type="submit" disabled>
            Submit Inquiry <span aria-hidden="true">↗</span>
          </button>
        </fieldset>
      </form>
    </div>
  );
}
