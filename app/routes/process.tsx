import { Link } from "react-router";
import { company } from "../data/content";
import { PageIntro } from "../components/Editorial";
import { ProcessStoryScroll } from "../components/ProcessStoryScroll";

export function meta() {
  return [
    {
      title: "How We Work — Progressive 5-Stage Engineering Process | Kirjane Labs",
    },
    {
      name: "description",
      content:
        "Explore Kirjane Labs' 5-stage engineering and accounting delivery workflow—from operational discovery to cloud deployment and managed web hosting.",
    },
  ];
}

export default function Process() {
  return (
    <>
      <PageIntro
        eyebrow="How We Work"
        badge="5-Stage Delivery"
        lines={["Disciplined engineering from workflow discovery to managed hosting."]}
        summary="Scroll, click, or swipe through our five delivery stages below to see how our engineers and accountants take your project from operational mapping to production deployment."
      />

      <section className="arch-process-section" aria-label="Five-stage delivery process">
        <ProcessStoryScroll />
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
            <span className="section-kicker light">Begin Stage 01</span>
            <h2>Have an operational workflow you want to modernize?</h2>
            <p>Start with a straightforward discovery conversation with our team in Bohol.</p>
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
