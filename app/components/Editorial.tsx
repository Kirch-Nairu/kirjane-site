import type { ReactNode } from "react";
import { Link } from "react-router";

export function ArrowLink({ to, children, light = false }: { to: string; children: ReactNode; light?: boolean }) {
  return <Link className={light ? "text-link light" : "text-link"} to={to}>{children}<span aria-hidden="true">↗</span></Link>;
}

export function PageIntro({ number, eyebrow, lines, summary }: { number: string; eyebrow: string; lines: string[]; summary: string }) {
  return (
    <section className="page-shell subpage-intro">
      <div className="section-marker"><span>{number} / KIRJANE LABS</span><span>{eyebrow}</span></div>
      <h1 className="subpage-title">{lines.map((line, i) => <span key={line} className={i === lines.length - 1 ? "ink-green" : undefined}>{line}</span>)}</h1>
      <p className="intro-summary">{summary}</p>
    </section>
  );
}
