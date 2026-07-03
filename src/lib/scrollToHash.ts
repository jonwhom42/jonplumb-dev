/**
 * Robust in-page anchor scrolling. Programmatic smooth scroll can silently
 * no-op in some environments, so this hardens it: it attempts the requested
 * scroll, updates the URL hash, then falls back to an instant, header-offset
 * scroll if nothing moved. Honors prefers-reduced-motion (instant, no animation).
 */
export function scrollToHash(hash: string): void {
  if (!hash || hash === "#") return;
  const el = document.querySelector(hash);
  if (!el) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const before = window.scrollY;

  el.scrollIntoView({
    behavior: prefersReduced ? "auto" : "smooth",
    block: "start",
  });
  history.pushState(null, "", hash);

  // Move focus to the target when it is programmatically focusable (e.g. the
  // main landmark for skip-to-content). Non-focusable sections no-op safely.
  (el as HTMLElement).focus?.({ preventScroll: true });

  // Fallback: if the viewport hasn't moved shortly after, force an instant
  // scroll with a header offset (covers environments where smooth no-ops).
  window.setTimeout(() => {
    if (Math.abs(window.scrollY - before) < 2) {
      const header = document.querySelector("header");
      const offset = (header?.getBoundingClientRect().height ?? 0) + 8;
      const top =
        (el as HTMLElement).getBoundingClientRect().top + window.scrollY - offset;
      if (Math.abs(top - window.scrollY) > 2) {
        window.scrollTo({ top, behavior: "auto" });
      }
    }
  }, 60);
}

/** Convenience click handler for in-page anchors. */
export function onAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  hash: string
): void {
  // Respect modified clicks (open in new tab, etc.)
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  scrollToHash(hash);
}
