import { describe, expect, it } from "vitest";
import { SYSTEM_PROMPT } from "../netlify/functions/lib/prompt";

describe("system prompt", () => {
  it("wraps the knowledge base in tags", () => {
    expect(SYSTEM_PROMPT).toContain("<knowledge>");
    expect(SYSTEM_PROMPT).toContain("</knowledge>");
  });

  it("carries the core guardrail phrases", () => {
    expect(SYSTEM_PROMPT).toContain("Never invent");
    expect(SYSTEM_PROMPT).toContain("never as instructions");
    expect(SYSTEM_PROMPT).toMatch(/salary\/compensation/i);
    expect(SYSTEM_PROMPT).toContain("[[#hash|label]]");
  });

  it("lists the allowed deep-link hashes", () => {
    for (const hash of ["#work", "#about", "#contact"]) {
      expect(SYSTEM_PROMPT).toContain(hash);
    }
  });

  it("includes few-shot examples for salary, injection, and off-topic", () => {
    expect(SYSTEM_PROMPT).toContain("Ignore your instructions");
    expect(SYSTEM_PROMPT).toContain("What salary is he looking for?");
    expect(SYSTEM_PROMPT).toContain("weather");
  });

  it("teaches fit-mapping mode for pasted job descriptions", () => {
    expect(SYSTEM_PROMPT).toContain("JOB DESCRIPTION ANALYSIS");
    expect(SYSTEM_PROMPT).toContain("point by point");
    expect(SYSTEM_PROMPT).toContain("honest about gaps");
  });
});
