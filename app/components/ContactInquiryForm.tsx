import { useState } from "react";
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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [inquiryType, setInquiryType] = useState("salryn-bms");
  const [details, setDetails] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const formatInquiryBody = () => {
    const selectedType = inquiryTypes.find((t) => t.value === inquiryType)?.label ?? inquiryType;
    return `KIRJANE LABS PROJECT INQUIRY
---------------------------------
Name: ${fullName || "[Not specified]"}
Email: ${email || "[Not specified]"}
Organization: ${organization || "[None specified]"}
Topic: ${selectedType}

Project Details / Requirements:
${details || "[No details provided]"}

---------------------------------
Sent to: ${company.email}
Kirjane IT Solutions · Bohol, Philippines`;
  };

  const handleSendViaEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedType = inquiryTypes.find((t) => t.value === inquiryType)?.label ?? "Inquiry";
    const subject = encodeURIComponent(`Inquiry: ${selectedType} — ${fullName || "Website Visitor"}`);
    const body = encodeURIComponent(formatInquiryBody());
    window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatInquiryBody());
      setCopyFeedback("✓ Inquiry text copied to clipboard!");
      setTimeout(() => setCopyFeedback(null), 3500);
    } catch {
      setCopyFeedback("Please select and copy the text manually.");
      setTimeout(() => setCopyFeedback(null), 3500);
    }
  };

  return (
    <div className="inquiry-card">
      <div className="inquiry-card-heading">
        <span className="section-kicker">Project &amp; Product Inquiry</span>
        <span className="badge-pill" style={{ background: "rgba(36, 104, 68, 0.12)", color: "var(--forest-emerald, #246844)" }}>
          Active Direct Channel
        </span>
      </div>
      <h3>Send an Inquiry to Our Engineering &amp; Accounting Leads</h3>
      <p id="contact-form-status" className="inquiry-status" role="status">
        Draft your project requirements below. You can launch your mail client directly or copy
        the formatted draft to send to{" "}
        <a href={`mailto:${company.email}`} style={{ textDecoration: "underline", fontWeight: 700 }}>
          {company.email}
        </a>{" "}
        or via{" "}
        <a
          href={company.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "underline", fontWeight: 700 }}
        >
          Facebook Messenger
        </a>
        .
      </p>

      <form
        className="inquiry-form"
        name="contact"
        onSubmit={handleSendViaEmail}
        aria-describedby="contact-form-status"
      >
        <div className="inquiry-fields">
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>

          <div className="inquiry-field">
            <label htmlFor="contact-type">
              What can we help you with? <span aria-hidden="true">*</span>
            </label>
            <select
              id="contact-type"
              name="inquiry-type"
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              required
            >
              {inquiryTypes.map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="inquiry-field">
            <label htmlFor="contact-details">
              Tell us about your project or operational requirements <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="contact-details"
              name="details"
              rows={5}
              placeholder="Share what your business does, which Salryn setup you need, your event date for Scoryn, or what workflow you want to improve..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              maxLength={4000}
            />
          </div>

          {copyFeedback && (
            <div
              style={{
                padding: "0.6rem 0.85rem",
                background: "rgba(36, 104, 68, 0.12)",
                color: "var(--forest-emerald, #246844)",
                borderRadius: "4px",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
              role="alert"
            >
              {copyFeedback}
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "center",
              marginTop: "0.5rem",
            }}
          >
            <button className="button-primary inquiry-submit" type="submit">
              Launch Email Client ↗
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCopyToClipboard}
              style={{ padding: "0.75rem 1.25rem", cursor: "pointer" }}
            >
              Copy Formatted Draft 📋
            </button>
            <a
              href={`mailto:${company.email}`}
              className="text-subtle-link"
              style={{ fontSize: "0.85rem", textDecoration: "underline", marginLeft: "auto" }}
            >
              Or open blank email to {company.email}
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}