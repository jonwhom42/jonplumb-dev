import { useEffect, useRef } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Fade-up-on-first-view. A single shared IntersectionObserver toggles
 * `.is-visible` on each registered element the first time it enters view,
 * then stops observing it. Under reduced-motion the observer is never created
 * and elements are shown immediately (the CSS also fails safe).
 */
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || prefersReducedMotion()) return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
  }
  return observer;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = getObserver();
    if (!obs) {
      el.classList.add("is-visible");
      return;
    }
    el.classList.add("reveal");
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);

  return ref;
}
