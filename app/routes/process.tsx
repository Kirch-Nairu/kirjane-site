import { Link } from "react-router";
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
        "Explore Kirjane Labs' 5-stage engineering and accounting delivery workflow—from operational discovery to managed cloud hosting.",
    },
  ];
}

export default function Process() {
  return (
    <>
      <PageIntro
        eyebrow="04 / HOW WE WORK"
        badge="5-Stage Delivery"
        lines={["DISCIPLINED ENGINEERING FROM DISCOVERY TO CLOUD HOSTING."]}
        summary="Scroll or swipe through our five delivery stages below to see how our engineers and accountants take your project from initial blueprint to 24/7 production hosting."
      />

      <section className="arch-process-section">
        <ProcessStoryScroll />
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
            <span className="arch-eyebrow light">START STAGE 01</span>
            <h2>HAVE A WORKFLOW YOU WANT TO AUTOMATE?</h2>
            <p>Start with an operational conversation with our team in Bohol.</p>
          </div>
          <div className="arch-closing-actions">
            <Link to="/contact" className="btn-arch-primary">
              <span>Talk to Our Team</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
