import { PageIntro, ArrowLink } from "../components/Editorial";

const caseStudyChapters = [
  { number: "01", title: "The problem", body: "The work that needed attention, the people affected, and the constraints that mattered." },
  { number: "02", title: "The decisions", body: "The trade-offs behind the structure, design, and technical approach." },
  { number: "03", title: "The build", body: "The system, interfaces, and engineering choices that brought the solution together." },
  { number: "04", title: "The result", body: "What can be demonstrated and verified, without overstating the outcome." },
];

export function meta() {
  return [
    { title: "Projects | Kirjane IT Solutions" },
    { name: "description", content: "How Kirjane IT Solutions presents the problems, decisions, systems and verified results behind selected work." },
  ];
}

export default function Projects() {
  return (
    <>
      <PageIntro
        number="03"
        eyebrow="PROJECTS"
        lines={["LOOK BEYOND", "THE INTERFACE."]}
        summary="A finished screen only tells part of the story. The work behind it—the questions, trade-offs, architecture and validation—matters just as much."
      />

      <section className="page-shell subpage-content" aria-labelledby="projects-story-heading">
        <div className="section-marker"><span>SELECTED WORK</span><span>WORK IN CONTEXT</span></div>
        <div className="page-lead">
          <h2 id="projects-story-heading" className="section-title compact">THE STORY IS<br /><span className="ink-green">IN THE DETAILS.</span></h2>
          <p className="section-copy">A useful case study should explain more than what a project looks like. It should show why it exists and how the decisions connect to its purpose.</p>
        </div>

        <div className="case-story" aria-label="How we present a project">
          <div className="case-story-heading">
            <span className="eyebrow">A CLEARER VIEW OF THE WORK</span>
            <span className="case-story-symbol" aria-hidden="true">K.</span>
          </div>
          <div className="case-story-statement">
            <span>NOT JUST</span>
            <strong>WHAT WAS BUILT.</strong>
            <span>ALSO</span>
            <strong>WHY IT MATTERS.</strong>
          </div>
          <div className="case-story-bottom">
            <span>CONTEXT</span><span>DECISIONS</span><span>EXECUTION</span><span>EVIDENCE</span>
          </div>
        </div>

        <div className="case-chapters">
          <div className="section-marker"><span>HOW WE TELL THE STORY</span><span>FOUR PARTS</span></div>
          <ol className="case-chapter-grid">
            {caseStudyChapters.map((chapter) => (
              <li key={chapter.number}>
                <span className="eyebrow">{chapter.number} / 04</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <p className="publication-note">Individual case studies will be added when the relevant project materials and publication permissions are confirmed.</p>
        <ArrowLink to="/process">Explore How We Work</ArrowLink>
      </section>
    </>
  );
}
