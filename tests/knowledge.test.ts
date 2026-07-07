import { describe, expect, it } from "vitest";
import { KNOWLEDGE, ALLOWED_HASHES } from "../netlify/functions/lib/knowledge";

describe("knowledge base", () => {
  it("contains the flagship projects and identity", () => {
    for (const needle of [
      "Jonathon Plumb",
      "jon.plumb89@outlook.com",
      "Nitruz",
      "ResumeAye",
      "Hermes",
      "Verint",
      "Particalmist",
    ]) {
      expect(KNOWLEDGE).toContain(needle);
    }
  });

  it("contains the recruiter FAQ facts", () => {
    expect(KNOWLEDGE).toContain("US citizen");
    expect(KNOWLEDGE).toContain("two-week notice");
    expect(KNOWLEDGE).toContain("Work authorization");
  });

  it("never serializes undefined", () => {
    expect(KNOWLEDGE).not.toContain("undefined");
  });

  it("is byte-stable per deploy (no timestamps that would break prompt caching)", () => {
    expect(KNOWLEDGE).not.toMatch(/\d{4}-\d{2}-\d{2}T/); // no ISO timestamps
  });

  it("carries the war stories and deeper Q&A", () => {
    expect(KNOWLEDGE).toContain("Engineering war stories");
    expect(KNOWLEDGE).toContain("65,536"); // context truncation story
    expect(KNOWLEDGE).toContain("worst-case-ceiling"); // billing invariant
    expect(KNOWLEDGE).toContain("Nous Research"); // honest Hermes attribution
    expect(KNOWLEDGE).toContain("Deeper Q&A");
  });

  it("stays within a sane prompt size", () => {
    expect(KNOWLEDGE.length).toBeGreaterThan(2000);
    expect(KNOWLEDGE.length).toBeLessThan(30000);
  });

  it("whitelists exactly the site's nav sections", () => {
    expect(ALLOWED_HASHES).toEqual([
      "#work",
      "#about",
      "#path",
      "#skills",
      "#uses",
      "#contact",
    ]);
  });
});
