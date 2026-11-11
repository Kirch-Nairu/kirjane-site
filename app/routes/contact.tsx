import { useState } from "react";
import { company } from "../content/company";
import styles from "./contact.module.css";

export function meta() {
  return [
    {
      title: "Contact & Project Inquiries — Kirjane Labs",
    },
    {
      name: "description",
      content:
        "Initiate a project consultation with Kirjane Labs. Connect directly with our software and business engineering leads in Bohol, Philippines.",
    },
  ];
}

export default function Contact() {
  const [subject, setSubject] = useState("Kirjane Labs Project Inquiry");
  const [organization, setOrganization] = useState("");
  const [systemType, setSystemType] = useState("Business Management (Salryn)");
  const [details, setDetails] = useState("");
  const [copied, setCopied] = useState(false);

  const emailBody = `Organization: ${organization || "Not specified"}
System Type: ${systemType}
Details:
${details || "We would like to consult on an engineering engagement."}`;

  const mailtoUrl = `mailto:${company.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(emailBody)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(company.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Editorial Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <span className={styles.kicker}>DIRECT CHANNELS</span>
          <h1 className={styles.headline}>Begin a Direct Project Discussion</h1>
          <p className={styles.lead}>
            Kirjane Labs handles incoming inquiries directly with our engineering and business
            leads. No third-party sales desks or automated marketing queues.
          </p>

          <div className={styles.directPills}>
            <div className={styles.pill}>
              <span className={styles.pillLabel}>PRIMARY INBOX</span>
              <a href={`mailto:${company.email}`} className={styles.pillEmail}>
                {company.email}
              </a>
            </div>
            <div className={styles.pill}>
              <span className={styles.pillLabel}>STUDIO LOCATION</span>
              <span className={styles.pillText}>{company.location}</span>
            </div>
            <div className={styles.pill}>
              <span className={styles.pillLabel}>OFFICIAL SOCIAL</span>
              <a
                href={company.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pillLink}
              >
                {company.facebook} ↗
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Content & Email Draft Composer */}
      <section className={styles.composerSection} aria-label="Email Draft Composer">
        <div className={styles.container}>
          <div className={styles.layoutGrid}>
            {/* Left: Email Draft Composer */}
            <div className={styles.composerCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardKicker}>STRUCTURED MAILTO COMPOSER</span>
                <h2 className={styles.cardTitle}>Draft an Inquiry Email</h2>
                <p className={styles.cardNotice}>
                  This tool prepares a pre-filled draft in your device's native email client. We
                  do not store your information on external web servers.
                </p>
              </div>

              <form
                className={styles.form}
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = mailtoUrl;
                }}
              >
                <div className={styles.safetyGateNotice}>
                  <span className={styles.gateIcon} aria-hidden="true">🔒</span>
                  <span>
                    Direct web form submission to external servers is disabled for security. Use
                    the button below to generate a pre-addressed email draft in your local email app.
                  </span>
                </div>

                <fieldset disabled className={styles.fieldset}>
                  <legend className={styles.legend}>Draft Consultation Details</legend>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="full-name" className={styles.label}>
                      Your Full Name
                    </label>
                    <input
                      id="full-name"
                      name="full-name"
                      type="text"
                      placeholder="e.g. Maria Santos"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Your Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="e.g. maria@organization.ph"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="organization" className={styles.label}>
                      Organization / Business Name
                    </label>
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Bohol Retail Corp / Municipal Office"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="inquiry-type" className={styles.label}>
                      Primary System Requirement
                    </label>
                    <select
                      id="inquiry-type"
                      name="inquiry-type"
                      value={systemType}
                      onChange={(e) => setSystemType(e.target.value)}
                      className={styles.select}
                    >
                      <option value="Business Management (Salryn)">
                        Business Management & POS (Salryn BMS)
                      </option>
                      <option value="Live Event Scoring (Scoryn)">
                        Live Competition Scoring (Scoryn)
                      </option>
                      <option value="Institutional Workflow / Inter-Office">
                        Institutional & Intra-Office Workflow Platform
                      </option>
                      <option value="Backend APIs & Database Architecture">
                        Backend APIs, Security & Database Engineering
                      </option>
                      <option value="Cloud Operations & Managed Hosting">
                        Cloud Operations, CI/CD & Managed Web Hosting
                      </option>
                      <option value="Custom Software Development">
                        Other Custom Enterprise Software
                      </option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="subject" className={styles.label}>
                      Email Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="details" className={styles.label}>
                      Project Context & Operational Challenges
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Describe your current bottleneck, transaction volume, or office hierarchy..."
                      className={styles.textarea}
                    />
                  </div>
                </fieldset>

                <div className={styles.actionRow}>
                  <button type="submit" className={styles.submitBtn}>
                    <span>Open Email Draft in Native Client</span>
                    <span aria-hidden="true">↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className={styles.copyBtn}
                    aria-label="Copy Kirjane Labs email address to clipboard"
                  >
                    <span>{copied ? "Address Copied!" : "Copy Email Address"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Direct Information & Expectations */}
            <div className={styles.infoCol}>
              <div className={styles.infoCard}>
                <span className={styles.infoKicker}>WHAT TO EXPECT</span>
                <h3 className={styles.infoTitle}>Engineering Review Process</h3>
                <ul className={styles.stepsList}>
                  <li className={styles.stepItem}>
                    <span className={styles.stepNum}>1</span>
                    <div>
                      <strong className={styles.stepHead}>Direct Technical Review:</strong>
                      <p className={styles.stepText}>
                        Your inquiry is reviewed by our engineering and accounting leads to evaluate
                        feasibility.
                      </p>
                    </div>
                  </li>
                  <li className={styles.stepItem}>
                    <span className={styles.stepNum}>2</span>
                    <div>
                      <strong className={styles.stepHead}>Workflow Scoping Session:</strong>
                      <p className={styles.stepText}>
                        We arrange a direct technical call or in-person session in Bohol to review
                        specific forms and transaction flows.
                      </p>
                    </div>
                  </li>
                  <li className={styles.stepItem}>
                    <span className={styles.stepNum}>3</span>
                    <div>
                      <strong className={styles.stepHead}>Concrete Specification:</strong>
                      <p className={styles.stepText}>
                        We deliver an architectural blueprint, data model outline, and milestone
                        timeline before any contractual commitment.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className={styles.fallbackCard}>
                <span className={styles.infoKicker}>MANUAL EMAIL FALLBACK</span>
                <p className={styles.fallbackText}>
                  If you prefer not to use the automated draft opener, send your message directly to:
                </p>
                <div className={styles.emailBox}>
                  <code>{company.email}</code>
                </div>
                <span className={styles.fallbackSub}>
                  Official Legal Entity: {company.legalName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
