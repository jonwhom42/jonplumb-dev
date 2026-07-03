import { ArrowUpRight } from "lucide-react";
import type { Project, StatusDot } from "../data/projects";
import DemoVideo from "./DemoVideo";

const DOT_COLOR: Record<StatusDot, string> = {
  amber: "#FBBF24",
  green: "#4ADE80",
  blue: "#60A5FA",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-6 transition-colors hover:border-muted/50 hover:bg-surface2 md:p-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h3 className="text-xl font-semibold text-text">
          {project.name}
          {project.url && (
            <span className="ml-3 font-mono text-sm font-normal text-muted">
              {project.url}
            </span>
          )}
        </h3>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/50 px-3 py-1 font-mono text-xs text-muted">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: DOT_COLOR[project.status.dot] }}
          />
          {project.status.label}
        </span>
      </div>

      <p className="mt-3 text-text">{project.oneLiner}</p>
      <p className="mt-3 leading-relaxed text-muted">{project.description}</p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded border border-border bg-bg/40 px-2 py-1 font-mono text-xs text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>

      {project.links.length > 0 && (
        <div className="mt-5 flex flex-wrap items-start gap-4">
          {project.links.map((link) => (
            <div key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm text-text transition-colors hover:border-amber hover:text-amber"
              >
                {link.label}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              {link.note && (
                <p className="mt-1.5 font-mono text-xs text-muted">{link.note}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {project.hasDemo && <DemoVideo />}

      <details className="decisions mt-5 border-t border-border pt-4">
        <summary>Decisions &amp; Tradeoffs</summary>
        <ul className="mt-3 space-y-3 border-l border-amberDim pl-4">
          {project.decisions.map((d) => (
            <li key={d} className="text-sm leading-relaxed text-muted">
              {d}
            </li>
          ))}
        </ul>
      </details>

      {project.footnote && (
        <p className="mt-4 text-sm text-muted">{project.footnote}</p>
      )}
    </article>
  );
}
