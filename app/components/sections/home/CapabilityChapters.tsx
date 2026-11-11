import { Link } from "react-router";
import styles from "./CapabilityChapters.module.css";

const chapters = [
  {
    number: "01",
    tag: "Commercial Software & Workflows",
    title: "Business Management Systems & Accounting Engines",
    headline: "Unifying retail, hospitality, inventory, and automated double-entry bookkeeping.",
    description:
      "We build integrated systems that bridge front-counter point-of-sale registers directly with general ledger accounts. No manual end-of-month reconciliations, zero data drift, and real-time branch visibility.",
    capabilities: [
      "Point-of-sale registers for retail, dining, and pharmacies",
      "Automatic double-entry bookkeeping behind every transaction",
      "Multi-branch inventory syncing and supplier purchase orders",
      "Cash drawer audits, shift reports, and manager approvals",
    ],
    route: "/services#backend-architecture",
  },
  {
    number: "02",
    tag: "Institutional & Event Platforms",
    title: "Institutional Intra-Office & Competition Software",
    headline: "Transparent paperless routing for public bodies and live event scoring suites.",
    description:
      "We replace lost paper trails, manual messenger runs, and delay-prone calculator scoring with tamper-evident digital platforms tailored for municipal departments and high-stakes competitions.",
    capabilities: [
      "Inter-departmental document routing with verified digital receiving",
      "Department-level permission boundaries and activity audit trails",
      "Live competition scoring with real-time judge tablet sync",
      "Instantaneous weighted tabulations and print-ready audit sheets",
    ],
    route: "/services#security-permissions",
  },
  {
    number: "03",
    tag: "Infrastructure & Security",
    title: "Backend Architecture, Cloud Operations & Web Hosting",
    headline: "High-throughput APIs, server hardening, CI/CD automation, and corporate web platforms.",
    description:
      "We engineer the reliable backbone your software depends on: database schemas built for transactional accuracy, containerized deployment pipelines, and high-performance company websites.",
    capabilities: [
      "High-speed REST and GraphQL APIs with strict data validation",
      "Containerized server setups, reverse proxies, and automated CI/CD",
      "Automated database snapshots, off-site backups, and uptime checks",
      "High-craft corporate web experiences optimized for performance and SEO",
    ],
    route: "/services#cloud-hosting",
  },
];

export function CapabilityChapters() {
  return (
    <section className={styles.section} aria-label="Capabilities in Three Chapters">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.kicker}>02 / SYSTEM CAPABILITIES</span>
          <h2 className={styles.title}>Three Core Disciplines of Engineering</h2>
          <p className={styles.lead}>
            Kirjane Labs approaches software not as isolated features, but as coherent systems
            designed for continuous operational stability.
          </p>
        </div>

        <div className={styles.chaptersList}>
          {chapters.map((chapter) => (
            <article key={chapter.number} className={styles.chapterCard}>
              <div className={styles.chapterMeta}>
                <span className={styles.chapterNumber}>{chapter.number}</span>
                <span className={styles.chapterTag}>{chapter.tag}</span>
              </div>

              <div className={styles.chapterContent}>
                <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                <p className={styles.chapterHeadline}>{chapter.headline}</p>
                <p className={styles.chapterDesc}>{chapter.description}</p>

                <ul className={styles.capabilitiesList}>
                  {chapter.capabilities.map((cap, idx) => (
                    <li key={idx} className={styles.capabilityItem}>
                      <span className={styles.itemDot} aria-hidden="true" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>

                <Link to={chapter.route} className={styles.chapterLink}>
                  <span>Explore Architecture & Specifications</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
