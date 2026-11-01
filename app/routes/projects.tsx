import { PageIntro, ArrowLink } from "../components/Editorial";
export function meta() {
  return [{ title: "Projects | Kirjane Labs" }, { name: "description", content: "An introduction to Kirjane Labs' approach to documenting software and digital-system projects." }];
}
export default function Projects() {
  return <>
    <PageIntro number="03" eyebrow="PROJECTS" lines={["LOOK BEYOND", "THE INTERFACE."]} summary="A finished screen only tells part of the story. Explore the challenges, requirements, architecture, and implementation decisions behind selected projects." />
    <section className="page-shell subpage-content">
      <div className="section-marker"><span>SELECTED WORK</span><span>PUBLICATION REVIEW</span></div>
      <div className="empty-proof"><span className="proof-index">01—04</span><h2>THE EVIDENCE<br />COMES NEXT.</h2><p>Case studies will appear here when project details, screenshots, outcomes and publication permissions are verified and approved.</p></div>
      <div className="process-brief">{["The Problem","The Decisions","The Build","The Verified Result"].map((s,i)=><div key={s}><span>0{i+1}</span><strong>{s}</strong></div>)}</div>
      <ArrowLink to="/contact">Discuss a Project</ArrowLink>
    </section>
  </>;
}
