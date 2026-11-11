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
        eyebrow="03 / ABOUT KIRJANE LABS"
        badge={company.location}
        lines={["WHERE SYSTEMS ENGINEERING MEETS REAL-WORLD ACCOUNTING."]}
        summary="Kirjane Labs (registered as Kirjane IT Solutions) was founded in Bohol, Philippines by systems engineers and accountants working side by side to build dependable business software."
      />

      {/* Full-Bleed 50/50 Split Screen Team Showcase */}
      <section className="arch-fullbleed-section">
        <TeamScrollShowcase members={teamMembers} />
      </section>

      <section className="arch-closing-band">
        <img
          src="/brand/chameleon-white.png"
          alt=""
          aria-hidden="true"
          className="closing-watermark-logo"
        />
        <div className="page-shell arch-closing-grid">
          <div>
            <span className="arch-eyebrow light">WORK WITH US</span>
            <h2>READY TO PARTNER WITH OUR BOHOL ENGINEERING TEAM?</h2>
            <p>Reach out directly for Salryn BMS, Scoryn tabulation, or custom development.</p>
          </div>
          <div className="arch-closing-actions">
            <Link to="/contact" className="btn-arch-primary">
              <span>Start a Project</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
