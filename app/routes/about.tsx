import { PageIntro, ArrowLink } from "../components/Editorial";
export function meta() { return [{ title: "About | Kirjane Labs" }, { name: "description", content: "The people, disciplines, and technical approach behind Kirjane Labs." }]; }
export default function About() {
  return <>
    <PageIntro number="04" eyebrow="ABOUT US" lines={["THE THINKING", "BEHIND THE BUILD."]} summary="Good technology takes more than good code. Kirjane Labs brings together technical disciplines to approach software, automation, and systems development through practical problem-solving." />
    <section className="page-shell subpage-content">
      <div className="section-marker"><span>PEOPLE / PRINCIPLES</span><span>COMPANY DETAILS PENDING</span></div>
      <div className="about-layout"><h2 className="section-title compact">PEOPLE MAKE<br /><span className="ink-green">IT POSSIBLE.</span></h2><div><p className="section-copy">Meet the people and learn about the principles that guide our work.</p><p className="disclosure">Official company history, professional biographies and photographs require approval before publication.</p><ArrowLink to="/contact">Meet Kirjane Labs</ArrowLink></div></div>
    </section>
  </>;
}
