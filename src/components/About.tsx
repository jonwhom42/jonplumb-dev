import Section from "./Section";
import { content } from "../data/site";

export default function About() {
  const { paragraphs, cert } = content.about;

  return (
    <Section id="about" index="02" title="About">
      <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-8 max-w-3xl rounded-lg border border-border border-l-2 border-l-amber bg-surface p-6">
        <p className="font-medium text-text">{cert.title}</p>
        <p className="mt-2 font-mono text-sm leading-relaxed text-muted">
          {cert.detail}
        </p>
      </div>
    </Section>
  );
}
