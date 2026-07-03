import Section from "./Section";
import { usesIntro, usesRows } from "../data/uses";

export default function Uses() {
  return (
    <Section id="uses" index="05" title="Uses">
      <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted">
        {usesIntro}
      </p>

      <dl className="space-y-6">
        {usesRows.map((row) => (
          <div
            key={row.label}
            className="grid gap-2 md:grid-cols-[10rem_1fr] md:gap-6"
          >
            <dt className="font-mono text-sm text-amber">{row.label}</dt>
            <dd className="leading-relaxed text-muted">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
