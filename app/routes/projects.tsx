import type { MetaFunction } from "react-router";
import { PageIntro, SectionLabel, TextLink } from "../components/ui";
export const meta: MetaFunction = () => [
  { title: "Selected Projects — Kirjane Labs" },
  { name: "description", content: "Look beyond the interface. Explore Kirjane Labs' approach to the problems, decisions, builds, and verified results behind project work." },
];
export default function Projects() {
  return <main id="main-content">
    <PageIntro number="03" category="SELECTED WORK" title={<>LOOK BEYOND<br/><em>THE INTERFACE.</em></>} description={<>A finished screen only tells part of the story. Explore the challenges, requirements, architecture, and implementation decisions behind selected projects.</>}/>
    <section className="section content-section shell"><SectionLabel number="01" text="EVIDENCE BEFORE CLAIMS"/>
      <div className="evidence-panel"><div className="evidence-symbol" aria-hidden="true">K<span>.</span></div><div><span className="eyebrow">CASE STUDIES / IN REVIEW</span><h2>THE REAL WORK<br/><em>DESERVES REAL PROOF.</em></h2><p>Project names, visuals, architecture details, outcomes, and client permissions must be confirmed before publication. No fabricated projects or performance metrics.</p></div></div>
      <div className="evidence-steps">{["The Problem", "The Decisions", "The Build", "The Verified Result"].map((label, i) => <div key={label}><span>0{i + 1}</span><strong>{label}</strong></div>)}</div>
    </section>
    <section className="simple-cta shell"><span>PROJECT INQUIRIES</span><h2>HAVE SOMETHING<br/><em>IN MIND?</em></h2><TextLink to="/contact">Start a Conversation</TextLink></section>
  </main>;
}
