import { Link } from "react-router";
import { company, teamMembers } from "../data/content";
import { PageIntro } from "../components/Editorial";
import { Reveal } from "../components/Motion";
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
        summary="Most software teams only understand code, leaving financial and operational rules as an afterthought. Kirjane Labs (registered as Kirjane IT Solutions) was founded in Bohol, Philippines by systems engineers and accountants working side by side."
      />

      <section className="page-shell section-block">
        <Reveal>
          <div className="about-story-grid">
            <div className="about-story-card">
              <div className="about-brand-lockup">
                <img
                  src={company.logos.chameleonColor}
                  alt="Kirjane Labs Chameleon Emblem"
                  className="about-brand-emblem"
                />
                <div>
                  <strong>{company.brandName}</strong>
                  <span>{company.legalName} · {company.location}</span>
                </div>
              </div>
              <h2>Why we started Kirjane Labs</h2>
              <p>
                Businesses and local institutions often face an unfair choice: buy generic software
                that doesn&apos;t match how their staff actually work, or hire software contractors
                who build flashy screens with fragile backends and broken accounting numbers.
              </p>
              <p>
                By uniting <strong>Kirch</strong> (Founder, CTO &amp; Head of Engineering) and{" "}
                <strong>Siris</strong> (Co-Founder &amp; Developer Operations Lead) with co-founder
                accountants <strong>Paul</strong> (CEO) and <strong>James Karl</strong> (Business
                Lead)—alongside <strong>Kurt</strong> (CI/CD &amp; DevOps), <strong>Jesse</strong>{" "}
                (Social Media), and <strong>Ace</strong> (Market Research)—we build software that is
                both technically rock-solid and financially accurate.
              </p>
            </div>

            <div className="about-principles-stack">
              <div className="principle-item">
                <span className="badge-pill">01 · Accuracy First</span>
                <h3>Numbers you can trust</h3>
                <p>
                  Because two of our co-founders are accountants, every sales register, stock trace,
                  and report in our software is designed to balance properly.
                </p>
              </div>
              <div className="principle-item">
                <span className="badge-pill">02 · Built for Daily Use</span>
                <h3>Simple for staff, powerful for owners</h3>
                <p>
                  Frontline staff get fast, uncluttered screens they can learn in minutes, while
                  owners and department heads get clear visibility and control.
                </p>
              </div>
              <div className="principle-item">
                <span className="badge-pill">03 · Long-Term Partnership</span>
                <h3>Hosted, backed up, and supported locally</h3>
                <p>
                  Based right in Bohol, we don&apos;t disappear after launch. We handle cloud
                  operations, web hosting, updates, and ongoing support.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="page-shell section-block">
        <Reveal className="section-header-split">
          <div>
            <span className="section-kicker">Leadership &amp; Specialists</span>
            <h2 className="section-heading">Meet the seven people behind Kirjane Labs.</h2>
          </div>
          <p className="section-subcopy">
            Scroll through our team or select any member on the left to inspect their role and
            focus area.
          </p>
        </Reveal>

        <TeamScrollShowcase members={teamMembers} />
      </section>

      <section className="page-shell section-block">
        <Reveal direction="scale">
          <div className="closing-cta-banner">
            <div className="closing-cta-copy">
              <h2>Want to work with our team in Bohol?</h2>
              <p>
                Reach out directly to discuss Salryn, Scoryn, web hosting, or a custom software
                project for your organization.
              </p>
            </div>
            <div className="closing-cta-actions">
              <Link to="/contact" className="btn-hero-primary">
                Contact Kirjane Labs
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
