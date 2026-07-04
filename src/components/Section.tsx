import type { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

interface SectionProps {
  id: string;
  index: string;
  title: string;
  /** muted one-line intro rendered under the heading */
  lede?: string;
  children: ReactNode;
}

/** A numbered content section: `01 / Selected Work` heading + reveal wrapper. */
export default function Section({ id, index, title, lede, children }: SectionProps) {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={`${id}-title`}
      className="mx-auto max-w-content px-6 py-16 md:px-8 md:py-24"
    >
      <h2
        id={`${id}-title`}
        className={`${lede ? "mb-3" : "mb-10"} flex items-baseline gap-3 text-2xl font-semibold tracking-tight`}
      >
        <span className="font-mono text-sm text-amber" aria-hidden="true">
          {index} /
        </span>
        {title}
      </h2>
      {lede && <p className="mb-10 max-w-prose text-muted">{lede}</p>}
      {children}
    </section>
  );
}
