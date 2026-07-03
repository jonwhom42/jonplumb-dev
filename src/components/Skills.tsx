import Section from "./Section";
import { skillGroups } from "../data/skills";

export default function Skills() {
  return (
    <Section id="skills" index="04" title="Skills">
      <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {skillGroups.map((group, i) => (
          <div
            key={group.label}
            className={`rounded-lg border border-border bg-surface p-5 ${
              i === 0 ? "md:col-span-2" : ""
            }`}
          >
            <dt className="mb-3 font-mono text-sm text-amber">{group.label}</dt>
            <dd className="flex flex-wrap gap-x-2 gap-y-1 leading-relaxed text-muted">
              {group.items.map((item, i) => (
                <span key={item}>
                  {item}
                  {i < group.items.length - 1 && (
                    <span aria-hidden="true" className="ml-2 text-border">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
