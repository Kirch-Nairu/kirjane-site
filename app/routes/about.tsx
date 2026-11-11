import { Link } from "react-router";
import { company, teamMembers } from "../data/content";
import { PageIntro } from "../components/Editorial";
import { TeamScrollShowcase } from "../components/TeamScrollShowcase";

export function meta() {
  return [
    {
      title: "Team & Company — Engineers & Accountants in Bohol | Kirjane Labs",
    },
    {
      name: "description",
      content:
        "Meet the seven-person team behind Kirjane Labs (Kirjane IT Solutions) in Bohol, Philippines: Founder & CTO Kirch, Co-Founders Paul, James Karl, and Siris, and specialists Kurt, Jesse, and Ace.",
    },
  ];
}

export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="About Kirjane Labs"
        badge={company.location}
        lines={["Where systems engineering meets real-world accounting."]}
        summary="Kirjane Labs (registered as Kirjane IT Solutions) was founded in Bohol, Philippines by systems engineers and accountants working side by side to build dependable business software, cloud infrastructure, and institutional platforms."
      />

      {/* Full-Bleed 50/50 Split Screen Team Showcase */}
      <section className="arch-fullbleed-section" aria-label="Kirjane Labs Leadership and Team">
        <TeamScrollShowcase members={teamMembers} />
      </section>

      <section className="arch-closing-band">
        <img
          src={company.logos.chameleonWhite}
          alt=""
          aria-hidden="true"
          className="closing-watermark-logo"
        />
        <div className="page-shell arch-closing-grid">
          <div>
            <span className="section-kicker light">Work With Us</span>
            <h2>Ready to partner with our Bohol engineering and accounting team?</h2>
            <p>Reach out directly for Salryn BMS, Scoryn tabulation, web hosting, or custom builds.</p>
          </div>
          <div className="arch-closing-actions">
            <Link to="/contact" className="btn-arch-primary">
              <span>{company.hero.primaryCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
