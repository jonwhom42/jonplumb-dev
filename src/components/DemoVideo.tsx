import { useState } from "react";
import { site } from "../data/site";

// Dark poster frame with an amber play affordance (inline SVG data URI —
// no extra asset needed; shown until the real mp4 exists / plays).
const POSTER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720' viewBox='0 0 1280 720'>
      <rect width='1280' height='720' fill='#12151C'/>
      <circle cx='640' cy='360' r='56' fill='none' stroke='#FBBF24' stroke-width='3'/>
      <path d='M624 332 L672 360 L624 388 Z' fill='#FBBF24'/>
    </svg>`
  );

const FALLBACK = "▸ Live demo available on request — or just try nitruz.com";

export default function DemoVideo() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <p className="mt-4 rounded-md border border-border bg-bg/40 px-4 py-3 font-mono text-sm text-muted">
        <span className="text-amber">▸</span> Live demo available on request — or
        just try{" "}
        <a
          href={site.nitruz}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber underline underline-offset-2"
        >
          nitruz.com
        </a>
      </p>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-md border border-border">
      <video
        className="block aspect-video w-full bg-surface"
        src="/nitruz-demo.mp4"
        poster={POSTER}
        preload="none"
        controls
        muted
        playsInline
        aria-label="Nitruz product demo"
        onError={() => setFailed(true)}
      >
        {/* Text fallback for browsers without <video> support */}
        {FALLBACK}
      </video>
    </div>
  );
}
