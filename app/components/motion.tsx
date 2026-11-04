import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Progressive enhancement only: content is visible by default in prerendered HTML.
 * Elements already onscreen are never hidden. Offscreen reveals opt-in after hydration.
 */
export function MotionDirector() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.classList.remove("reveal-pending");
          target.classList.add("reveal-complete");
          observer.unobserve(target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );

    for (const element of elements) {
      const box = element.getBoundingClientRect();
      if (box.top > window.innerHeight * 0.85) {
        element.classList.add("reveal-pending");
        observer.observe(element);
      }
    }

    return () => {
      observer.disconnect();
      for (const element of elements) element.classList.remove("reveal-pending");
    };
  }, [pathname]);

  return null;
}
