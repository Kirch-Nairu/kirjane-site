import {
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

interface RevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 480,
  className = "",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const fromVars: gsap.TweenVars = {};
        if (direction === "up") fromVars.y = 10;
        else if (direction === "down") fromVars.y = -10;
        else if (direction === "left") fromVars.x = 10;
        else if (direction === "right") fromVars.x = -10;
        else if (direction === "scale") fromVars.scale = 0.992;

        gsap.fromTo(el, fromVars, {
          x: 0,
          y: 0,
          scale: 1,
          duration: duration / 1000,
          delay: delay / 1000,
          ease: "power2.out",
          immediateRender: false,
          overwrite: "auto",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [direction, delay, duration, once] },
  );

  return (
    <div ref={ref} className={`gsap-reveal ${className}`.trim()}>
      {children}
    </div>
  );
}

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-surface ${className}`.trim()}
    >
      {children}
    </div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  baseDelay?: number;
  step?: number;
}

export function Stagger({ children, className = "", baseDelay = 0, step = 55 }: StaggerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;
      const items = Array.from(container.children);
      if (!items.length) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          items,
          { y: 10 },
          {
            y: 0,
            duration: 0.45,
            delay: baseDelay / 1000,
            stagger: step / 1000,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: container,
              start: "top 95%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(items, { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [baseDelay, step] },
  );

  return (
    <div ref={containerRef} className={`gsap-stagger ${className}`.trim()}>
      {children}
    </div>
  );
}
