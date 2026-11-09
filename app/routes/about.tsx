import { PageIntro, ArrowLink } from "../components/Editorial";

const points = [
  {
    number: "01",
    title: "Understand before building.",
    description: "A technical solution should begin with the context around the work, not with a preferred tool or framework.",
  },
  {
    number: "02",
    title: "Design for the people using it.",
    description: "Clarity, accessibility and everyday usability matter alongside architecture and functionality.",
  },
  {
    number: "03",
    title: "Make the result accountable.",
    description: "Requirements, validation and a clear handover help keep the work useful beyond its first release.",
  },
];

export function meta() {
  return [
    { title: "About | Kirjane Labs" },
    { name: "description", content: "Learn about the thinking, disciplines and problem-solving approach behind Kirjane Labs." },
  ];
}

export default function About() {
  return (
    <>
      <PageIntro
        number="04"
        eyebrow="ABOUT US"
        lines={["THE THINKING", "BEHIND THE BUILD."]}
        summary="Good technology takes more than good code. Kirjane Labs approaches software, automation, and digital systems by first understanding the real work they need to support."
      />

      <section className="page-shell subpage-content" aria-labelledby="about-story-title">
        <div className="section-marker"><span>OUR PERSPECTIVE</span><span>PEOPLE / PROCESS / TECHNOLOGY</span></div>
        <div className="about-editorial">
          <div>
            <span className="eyebrow">THE WORK COMES FIRST</span>
            <h2 id="about-story-title" className="section-title compact">THE SYSTEM<br />IS ONLY <span className="ink-green">PART.</span></h2>
          </div>
          <div className="about-editorial-copy">
            <p>A useful system has to fit the environment where it operates: the people who use it, the decisions they make, and the information they need.</p>
            <p>That is why the questions come before the architecture. Understanding the task gives every technical decision a clearer purpose.</p>
          </div>
        </div>
      </section>

      <section className="about-principles" aria-labelledby="principles-heading">
        <div className="page-shell">
          <div className="section-marker"><span>HOW WE APPROACH THE WORK</span><span>THREE PRIORITIES</span></div>
          <h2 id="principles-heading" className="section-title compact">THOUGHTFUL.<br /><span className="ink-green">PRACTICAL.</span></h2>
          <ol className="principle-list">
            {points.map((point) => (
              <li key={point.number}>
                <span className="eyebrow">{point.number} / 03</span>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-shell subpage-content" aria-labelledby="team-heading">
        <div className="section-marker"><span>THE PEOPLE</span><span>BEHIND THE WORK</span></div>
        <div className="people-layout">
          <h2 id="team-heading" className="section-title compact">BUILT BY<br /><span className="ink-green">PEOPLE.</span></h2>
          <div>
            <p className="section-copy">Technical disciplines matter. So do communication, listening and the ability to translate complex needs into something people can use.</p>
            <p className="section-copy">Our team profiles and project credits will be introduced as verified information is prepared for the public website.</p>
            <ArrowLink to="/process">Explore Our Process</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
