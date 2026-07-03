import Section from "./Section";
import { skillGroups } from "../data/skills";

export default function Skills() {
  return (
    <Section id="skills" index="04" title="Skills">
      <dl className="space-y-6">
        {skillGroups.map((group) => (
          <div
            key={group.label}
            className="grid gap-2 md:grid-cols-[10rem_1fr] md:gap-6"
          >
            <dt className="font-mono text-sm text-amber">{group.label}</dt>
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
