import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  kicker?: string;
  title: string | ReactNode;
  lead?: string | ReactNode;
  theme?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  kicker,
  title,
  lead,
  theme = "light",
  align = "left",
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`${styles.wrapper} ${styles[theme]} ${styles[align]} ${className}`}
    >
      {kicker && <span className={styles.kicker}>{kicker}</span>}
      <h2 className={styles.title}>{title}</h2>
      {lead && <p className={styles.lead}>{lead}</p>}
    </div>
  );
}
