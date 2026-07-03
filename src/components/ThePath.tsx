import { ArrowUpRight } from "lucide-react";
import Section from "./Section";
import { pathIntro, pathTiers } from "../data/path";

export default function ThePath() {
  return (
    <Section id="path" index="03" title="The Path">
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-muted">
        {pathIntro}
      </p>

      <ol className="relative ml-3 border-l border-amberDim">
        {pathTiers.map((tier) => (
          <li key={tier.account} className="relative pb-10 pl-8 last:pb-0">
            {/* Timeline node */}
            <span
              aria-hidden="true"
              className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-amber bg-bg"
            />

            <p className="font-mono text-sm text-amber">{tier.year}</p>
            <h3 className="mt-1 text-lg font-semibold text-text">{tier.title}</h3>

            <a
              href={tier.accountUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 font-mono text-sm text-muted transition-colors hover:text-amber"
            >
              {tier.account}
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>

            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              {tier.blurb}
            </p>

            {tier.repos.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {tier.repos.map((repo) => (
                  <li key={repo.href}>
                    <a
                      href={repo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={repo.note}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text transition-colors hover:border-amber hover:text-amber"
                    >
                      {repo.name}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
