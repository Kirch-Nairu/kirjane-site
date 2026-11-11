import type { ReactNode } from "react";
import { Link } from "react-router";
import { Reveal } from "./Motion";

export function ArrowLink({
  to,
  children,
  light = false,
}: {
  to: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <Link className={light ? "text-link light" : "text-link"} to={to}>
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

export function PageIntro({
  number,
  eyebrow,
  lines,
  summary,
  badge,
}: {
  number: string;
  eyebrow: string;
  lines: string[];
  summary: string;
  badge?: string;
}) {
  return (
    <section className="page-shell subpage-intro">
      <Reveal direction="up" duration={550}>
        <div className="section-marker">
          <span>{number} // KIRJANE LABS · KIRJANE IT SOLUTIONS</span>
          <span>{eyebrow}</span>
        </div>
      </Reveal>
      {badge ? (
        <Reveal direction="up" delay={60}>
          <div className="subpage-badge-row">
            <span className="telemetry-pill">{badge}</span>
          </div>
        </Reveal>
      ) : null}
      <Reveal direction="up" delay={110} duration={700}>
        <h1 className="subpage-title">
          {lines.map((line, i) => (
            <span key={line} className={i === lines.length - 1 ? "ink-green" : undefined}>
              {line}
            </span>
          ))}
        </h1>
      </Reveal>
      <Reveal direction="up" delay={190} duration={700}>
        <p className="intro-summary">{summary}</p>
      </Reveal>
    </section>
  );
}
