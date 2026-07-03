import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { site, content } from "../data/site";
import { useReveal } from "../hooks/useReveal";
import CopyEmailButton from "./CopyEmailButton";

export default function Hero() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      id="top"
      className="mx-auto max-w-content px-6 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28"
    >
      <div ref={ref}>
        <p className="font-mono text-sm text-muted">{content.hero.eyebrow}</p>

        <h1 className="mt-5 text-hero font-bold text-text">{site.name}</h1>
        <p className="mt-2 text-2xl font-semibold text-amber md:text-3xl">
          {content.hero.h2}
        </p>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {content.hero.lede}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-amber px-5 py-2.5 font-medium text-bg transition-opacity hover:opacity-90"
          >
            Resume <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm text-text transition-colors hover:border-amberDim hover:bg-surface2"
          >
            <Github size={16} aria-hidden="true" /> GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm text-text transition-colors hover:border-amberDim hover:bg-surface2"
          >
            <Linkedin size={16} aria-hidden="true" /> LinkedIn
          </a>
          <CopyEmailButton className="py-2.5" />
        </div>

        <p className="mt-8 font-mono text-sm text-amber">
          <span aria-hidden="true">▸ </span>
          {content.hero.currently}
        </p>

        <p className="mt-10 font-mono text-xs text-muted">{content.hero.hint}</p>
      </div>
    </section>
  );
}
