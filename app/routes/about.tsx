import { PageIntro, ArrowLink } from "../components/Editorial";
import { Reveal } from "../components/Motion";
import { teamMembers } from "../data/content";

const points = [
  {
    number: "01",
    title: "Engineering + Accounting DNA.",
    description:
      "Our founding leadership unites systems architecture and DevOps with professional accounting. Every workflow we build respects both technical scale and financial truth.",
  },
  {
    number: "02",
    title: "Contract-First, Invariant-Safe.",
    description:
      "We never guess from surface symptoms. We define clear operational contracts and protect core business invariants before writing implementation code.",
  },
  {
    number: "03",
    title: "Accountable Long After Launch.",
    description:
      "Through CI/CD automation, hardened security boundaries, and managed web/cloud hosting, we keep the systems we build dependable in daily production.",
  },
];

export function meta() {
  return [
    { title: "The People Behind Kirjane | About Kirjane IT Solutions" },
    {
      name: "description",
      content:
        "Meet the founders, engineers, accountants, and operators behind Kirjane IT Solutions and Kirjane Labs.",
    },
  ];
}

export default function About() {
  const founders = teamMembers.filter((m) => m.isFounder);
  const coreTeam = teamMembers.filter((m) => !m.isFounder);

  return (
    <>
      <PageIntro
        number="04"
        eyebrow="ABOUT KIRJANE & KIRJANE LABS"
        badge="FOUNDED BY ENGINEERS & ACCOUNTANTS"
        lines={["THE PEOPLE", "BEHIND THE BUILD."]}
        summary="Enterprise software fails when engineers don't understand business ledgers—or when business tools lack serious backend architecture. Kirjane bridges both worlds under one roof."
      />

      <section className="page-shell subpage-content" aria-labelledby="about-story-title">
        <Reveal direction="up">
          <div className="section-marker">
            <span>OUR COMPOSITION</span>
            <span>SYSTEMS ARCHITECTURE MEETS FINANCIAL RIGOR</span>
          </div>
        </Reveal>

        <Reveal direction="up" delay={60}>
          <div className="about-editorial">
            <div>
              <span className="eyebrow">WHY OUR SOFTWARE ACTUALLY MATTERS</span>
              <h2 id="about-story-title" className="section-title compact">
                CODE THAT
                <br />
                RESPECTS <span className="ink-green">THE LEDGER.</span>
              </h2>
            </div>
            <div className="about-editorial-copy">
              <p>
                Kirjane was built around a rare composition: hardcore backend, security, and
                infrastructure engineers working side-by-side with co-founders who are{" "}
                <strong>accountants</strong>.
              </p>
              <p>
                That is why products like <strong>Salryn</strong> (our multi-flavor Business
                Management Kernel), <strong>Scoryn</strong> (our automated tabulation platform), and
                the <strong>Talibon Intra-Office System</strong> handle complex real-world rules
                without cutting corners.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="about-principles" aria-labelledby="principles-heading">
        <div className="page-shell">
          <Reveal direction="up">
            <div className="section-marker">
              <span>HOW WE OPERATE</span>
              <span>THREE CORE PRIORITIES</span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={60}>
            <h2 id="principles-heading" className="section-title compact">
              DISCIPLINED.
              <br />
              <span className="ink-green">PRACTICAL.</span>
            </h2>
          </Reveal>
          <ol className="principle-list">
            {points.map((point, idx) => (
              <li key={point.number}>
                <Reveal direction="up" delay={idx * 70}>
                  <span className="eyebrow">{point.number} / 03</span>
                  <h3>{point.title}</h3>
                  <p>{point.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-shell subpage-content" aria-labelledby="team-heading">
        <Reveal direction="up">
          <div className="section-marker">
            <span>LEADERSHIP & OPERATIONS ROSTER</span>
            <span>PORTRAIT & BIO PLACEHOLDERS READY FOR FINAL ASSETS</span>
          </div>
        </Reveal>

        <Reveal direction="up" delay={60}>
          <div className="page-lead">
            <h2 id="team-heading" className="section-title compact">
              MEET THE
              <br />
              <span className="ink-green">KIRJANE TEAM.</span>
            </h2>
            <p className="section-copy">
              Structured below are our founding leadership and specialist operations pillars.
              Each profile includes designated placeholder slots for portraits, credentials, and
              extended biographies.
            </p>
          </div>
        </Reveal>

        {/* Founding Leadership */}
        <div className="team-group-block">
          <span className="eyebrow">01 // FOUNDING LEADERSHIP & EXECUTIVE CORE</span>
          <div className="team-preview-grid" style={{ marginTop: "20px" }}>
            {founders.map((member, index) => (
              <Reveal key={member.id} direction="up" delay={index * 60}>
                <article className="team-card">
                  <div className="team-card-top">
                    <div className="team-avatar-placeholder" aria-hidden="true">
                      <span>{member.avatarCode}</span>
                      <small>PORTRAIT SLOT</small>
                    </div>
                    <div className="team-badge-stack">
                      <span className="team-index">
                        {member.index} / 0{teamMembers.length}
                      </span>
                      <span className="founder-badge">FOUNDER / CO-FOUNDER</span>
                    </div>
                  </div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  {member.secondaryRole ? (
                    <p className="team-secondary-role">{member.secondaryRole}</p>
                  ) : null}
                  <p className="team-discipline">{member.discipline}</p>
                  <p className="team-placeholder-copy">{member.summaryPlaceholder}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Core Engineering, DevOps, Market Research & Communications */}
        <div className="team-group-block" style={{ marginTop: "56px" }}>
          <span className="eyebrow">02 // DEVOPS, MARKET RESEARCH & COMMUNICATIONS</span>
          <div className="team-preview-grid" style={{ marginTop: "20px" }}>
            {coreTeam.map((member, index) => (
              <Reveal key={member.id} direction="up" delay={index * 60}>
                <article className="team-card">
                  <div className="team-card-top">
                    <div className="team-avatar-placeholder" aria-hidden="true">
                      <span>{member.avatarCode}</span>
                      <small>PORTRAIT SLOT</small>
                    </div>
                    <div className="team-badge-stack">
                      <span className="team-index">
                        {member.index} / 0{teamMembers.length}
                      </span>
                      <span className="ops-badge">OPERATIONS & GROWTH</span>
                    </div>
                  </div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-discipline">{member.discipline}</p>
                  <p className="team-placeholder-copy">{member.summaryPlaceholder}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal direction="up" delay={120}>
          <div style={{ marginTop: "48px" }}>
            <ArrowLink to="/process">Explore Our Engineering Methodology</ArrowLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
