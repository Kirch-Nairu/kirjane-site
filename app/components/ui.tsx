import type { ReactNode } from "react";
import { Link } from "react-router";

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <span className={light ? "eyebrow eyebrow-light" : "eyebrow"}>{children}</span>;
}

export function TextLink({ to, children, variant = "dark" }: { to: string; children: ReactNode; variant?: "dark" | "light" | "inline" }) {
  return <Link className={variant === "inline" ? "text-action" : "action action-" + variant} to={to}>
    <span>{children}</span><span className="action-arrow" aria-hidden="true">↗</span>
  </Link>;
}

export function SectionLabel({ number, text }: { number: string; text: string }) {
  return <div className="section-label"><span>{number}</span><span>{text}</span></div>;
}

export function PageIntro({ number, category, title, description }: { number: string; category: string; title: ReactNode; description: ReactNode }) {
  return <section className="page-intro shell">
    <div className="page-intro-meta"><Eyebrow>{category}</Eyebrow><span className="page-index">{number} / KIRJANE LABS</span></div>
    <h1 className="page-title">{title}</h1>
    <p className="page-description">{description}</p>
  </section>;
}
