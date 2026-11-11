import { PageIntro, ArrowLink } from "../components/Editorial";
import { Reveal } from "../components/Motion";
import { TeamScrollShowcase } from "../components/TeamScrollShowcase";

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
    { title: "The People Behind Kirjane Labs | Kirjane IT Solutions" },
    {
      name: "description",
      content:
        "Meet the 7 people behind Kirjane Labs (Kirjane IT Solutions): Kirch, Paul, James Karl, Siris, Kurt, Jesse, and Ace.",
    },
  ];
}

export default function About() {
  return (
    <>
      <PageIntro
        number="04"
        eyebrow="ABOUT KIRJANE LABS · KIRJANE IT SOLUTIONS"
        badge="FOUNDED BY ENGINEERS & ACCOUNTANTS"
        lines={["THE PEOPLE", "BEHIND THE BUILD."]}
        summary="Enterprise software fails when engineers don't understand business ledgers—or when business tools lack serious backend architecture. Kirjane Labs (registered as Kirjane IT Solutions) bridges both worlds under one roof."
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
                Kirjane Labs was built around a rare composition: hardcore backend, security, and
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
            <span>INDIVIDUAL SCROLL SPOTLIGHTS // 01 — 07</span>
            <span>PORTRAIT & BIO PLACEHOLDERS READY FOR FINAL ASSETS</span>
          </div>
        </Reveal>

        <Reveal direction="up" delay={60}>
          <div className="page-lead">
            <h2 id="team-heading" className="section-title compact">
              SEVEN PEOPLE.
              <br />
              <span className="ink-green">ONE STANDARD.</span>
            </h2>
            <p className="section-copy">
              Scroll through each member's individual spotlight stage below—starting with{" "}
              <strong>Kirch</strong> (Founder, CTO & Head of Engineering · Kirjane Labs Tech Lead)
              followed by our co-founders and operations specialists.
            </p>
          </div>
        </Reveal>

        <TeamScrollShowcase />

        <Reveal direction="up" delay={120}>
          <div style={{ marginTop: "48px" }}>
            <ArrowLink to="/process">Explore Our Engineering Methodology</ArrowLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
