/**
 * Knowledge base assembly — serializes the site's data modules (the single
 * source of truth the components and terminal already render) into one
 * deterministic plaintext block for the system prompt.
 *
 * Imports reach into ../../src/data on purpose: Netlify bundles functions with
 * esbuild, which resolves TS imports outside the functions directory. No
 * copying, no drift. Keep this serialization byte-stable per deploy (no
 * timestamps, no randomness) so prompt caching can engage.
 */

import { site, content, navSections } from "../../../src/data/site";
import { projects, alsoBuilt } from "../../../src/data/projects";
import { skillGroups } from "../../../src/data/skills";
import { pathTiers } from "../../../src/data/path";
import { usesRows } from "../../../src/data/uses";
import {
  recruiterFacts,
  resumeFacts,
  compensationPolicy,
  suggestedQuestions,
  warStories,
  depthFacts,
  workingStyle,
  deeperQA,
} from "../../../src/data/concierge";

/** Section hashes the model may deep-link to via [[#hash|label]] tokens. */
export const ALLOWED_HASHES = navSections.map((s) => `#${s.id}`);

function section(title: string, body: string): string {
  return `## ${title}\n${body.trim()}`;
}

function buildKnowledge(): string {
  const identity = [
    `Name: ${site.name}`,
    `Title: ${site.title}`,
    `Location: ${site.location}`,
    `Email: ${site.email}`,
    `GitHub: ${site.github}`,
    `LinkedIn: ${site.linkedin}`,
    `Resume: https://jonplumb.dev${site.resume}`,
    `Currently: ${site.currently}`,
    `Positioning: ${content.hero.lede}`,
  ].join("\n");

  const about = content.about.paragraphs.join("\n") +
    `\nCertification: ${content.about.cert.title} — ${content.about.cert.detail}`;

  const projectText = projects
    .map((p) => {
      const lines = [
        `### ${p.name}${p.url ? ` (${p.url})` : ""} — status: ${p.status.label}`,
        p.oneLiner,
        p.description,
        `Stack: ${p.tags.join(", ")}`,
        `Key decisions: ${p.decisions.join(" | ")}`,
      ];
      if (p.footnote) lines.push(`Note: ${p.footnote}`);
      return lines.join("\n");
    })
    .join("\n\n");

  const also = alsoBuilt.map((r) => `- ${r.name} (${r.href}): ${r.oneLiner}`).join("\n");

  const skills = skillGroups
    .map((g) => `- ${g.label}: ${g.items.join(", ")}`)
    .join("\n");

  const path = pathTiers
    .map((t) => `- ${t.year} — ${t.title} (${t.account}): ${t.blurb}`)
    .join("\n");

  const uses = usesRows.map((r) => `- ${r.label}: ${r.value}`).join("\n");

  const faq = [...recruiterFacts, ...resumeFacts]
    .map((f) => `- ${f.topic}: ${f.fact}`)
    .join("\n");

  const facts = (items: { topic: string; fact: string }[]) =>
    items.map((f) => `- ${f.topic}: ${f.fact}`).join("\n");

  return [
    section("Identity & contact", identity),
    section("About", about),
    section("Projects", `${projectText}\n\nAlso built:\n${also}`),
    section("Skills", skills),
    section("The Path (career timeline)", path),
    section("Hardware & tools (/uses)", uses),
    section("Recruiter FAQ (verified facts)", faq),
    section("Engineering war stories (specific problems Jon solved)", facts(warStories)),
    section("Depth signals & unlisted work", facts(depthFacts)),
    section("Working style (evidence-based)", facts(workingStyle)),
    section("Deeper Q&A (honest answers to hard interviewer questions)", facts(deeperQA)),
    section("Compensation policy", compensationPolicy),
    section(
      "Suggested questions the widget shows",
      suggestedQuestions.map((q) => `- ${q}`).join("\n")
    ),
  ].join("\n\n");
}

/** Computed once per cold start; deterministic across calls. */
export const KNOWLEDGE = buildKnowledge();
