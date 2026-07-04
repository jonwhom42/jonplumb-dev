import Section from "./Section";
import ProjectCard from "./ProjectCard";
import { projects, alsoBuilt } from "../data/projects";

export default function SelectedWork() {
  return (
    <Section
      id="work"
      index="01"
      title="Selected Work"
      lede="Systems I own end to end — two live SaaS products, and the lab that powers everything else."
    >
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="mt-10">
        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
          Also built
        </p>
        <ul className="flex flex-col gap-2">
          {alsoBuilt.map((repo) => (
            <li key={repo.name}>
              <a
                href={repo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md border border-border/60 bg-surface/50 px-4 py-3 transition-colors hover:border-amberDim/60"
              >
                <span className="font-mono text-sm text-text transition-colors group-hover:text-amber">
                  {repo.name}
                </span>
                <span className="min-w-0 flex-1 basis-60 text-sm leading-relaxed text-muted">
                  {repo.oneLiner}
                </span>
                <span
                  aria-hidden="true"
                  className="font-mono text-sm text-muted transition-colors group-hover:text-amber"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
