import { PageIntro, ArrowLink } from "../components/Editorial";
import { services } from "../data/content";

export function meta() {
  return [
    { title: "Services | Kirjane Labs" },
    { name: "description", content: "Explore software development, process automation, systems integration and technical infrastructure at Kirjane Labs." },
  ];
}

export default function Services() {
  return (
    <>
      <PageIntro
        number="02"
        eyebrow="SERVICES"
        lines={["TECHNOLOGY SHOULD FIT", "THE WORK."]}
        summary="Not the other way around. Every organization has its own requirements, challenges, and ways of operating. Our focus is on understanding those needs before deciding how technology should respond."
      />

      <section className="page-shell subpage-content" aria-labelledby="capabilities-title">
        <div className="section-marker"><span>01—04 / AREAS OF WORK</span><span>BUILT AROUND REQUIREMENTS</span></div>
        <div className="page-lead">
          <h2 id="capabilities-title" className="section-title compact">LESS COMPLEXITY.<br /><span className="ink-green">MORE CLARITY.</span></h2>
          <p className="section-copy">The right approach depends on the process, the people using it, and the systems already in place. These four areas frame the conversations we start with.</p>
        </div>

        <ol className="capability-list">
          {services.map((service) => (
            <li className="capability-item" key={service.number}>
              <div className="capability-number">{service.number} / 04</div>
              <div className="capability-main">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <div className="capability-aside">
                <span className="eyebrow">WHERE TO START</span>
                <p className="capability-question">{service.question}</p>
                <ul className="capability-tags">
                  {service.focus.map((topic) => <li key={topic}>{topic}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="subpage-contrast" aria-labelledby="services-approach-title">
        <div className="page-shell contrast-grid">
          <div><span className="eyebrow">OUR STARTING POINT</span><h2 id="services-approach-title">START WITH<br />THE ACTUAL WORK.</h2></div>
          <div><p>Tell us what the process looks like today, where it slows down, and what needs to improve. From there, the technical direction becomes clearer.</p><ArrowLink to="/process">See Our Process</ArrowLink></div>
        </div>
      </section>
    </>
  );
}
