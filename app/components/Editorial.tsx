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
    </Link>
  );
}

export function PageIntro({
  eyebrow,
  lines,
  summary,
  badge,
}: {
  number?: string;
  eyebrow: string;
  lines: string[];
  summary: string;
  badge?: string;
}) {
  return (
    <section className="page-shell subpage-intro">
      <Reveal direction="up" duration={550}>
        <div className="subpage-kicker-row">
          <span className="section-kicker">{eyebrow}</span>
          {badge ? <span className="telemetry-pill">{badge}</span> : null}
        </div>
      </Reveal>
      <Reveal direction="up" delay={80} duration={650}>
        <h1 className="subpage-title">
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
      </Reveal>
      <Reveal direction="up" delay={140} duration={650}>
        <p className="intro-summary">{summary}</p>
      </Reveal>
    </section>
  );
}
