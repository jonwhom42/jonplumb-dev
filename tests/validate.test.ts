import { describe, expect, it } from "vitest";
import { validateRequest } from "../netlify/functions/lib/validate";
import { LIMITS } from "../netlify/functions/lib/types";

const user = (content: string) => ({ role: "user" as const, content });

describe("validateRequest", () => {
  it("accepts a simple valid request", () => {
    const r = validateRequest({ messages: [user("hi")] });
    expect(r).toEqual({ ok: true, messages: [user("hi")] });
  });

  const invalidBodies: [unknown, string][] = [
    [null, "null body"],
    ["hi", "string body"],
    [{}, "missing messages"],
    [{ messages: [] }, "empty messages"],
    [{ messages: [{ role: "system", content: "x" }] }, "bad role"],
    [{ messages: [{ role: "user", content: "" }] }, "empty content"],
    [{ messages: [{ role: "user", content: 42 }] }, "non-string content"],
    [{ messages: [user("q"), { role: "assistant", content: "a" }] }, "last not user"],
  ];
  it.each(invalidBodies)("rejects %j (%s)", (body, _desc) => {
    expect(validateRequest(body).ok).toBe(false);
  });

  it("rejects oversized content", () => {
    const r = validateRequest({ messages: [user("x".repeat(LIMITS.maxMessageChars + 1))] });
    expect(r.ok).toBe(false);
  });

  it("rejects too many messages", () => {
    const messages = Array.from({ length: LIMITS.maxMessages + 1 }, (_, i) =>
      i % 2 === 0 ? user(`q${i}`) : { role: "assistant" as const, content: `a${i}` }
    );
    // ensure last is user
    messages[messages.length - 1] = user("final");
    expect(validateRequest({ messages }).ok).toBe(false);
  });

  it("forwards only the trailing window to the LLM", () => {
    const messages = Array.from({ length: LIMITS.maxMessages }, (_, i) =>
      i % 2 === 0 ? user(`q${i}`) : { role: "assistant" as const, content: `a${i}` }
    );
    messages[messages.length - 1] = user("final");
    const r = validateRequest({ messages });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.messages).toHaveLength(LIMITS.forwardedMessages);
      expect(r.messages[r.messages.length - 1].content).toBe("final");
    }
  });

  it("strips control characters", () => {
    const esc = String.fromCharCode(27);
    const r = validateRequest({ messages: [user(`hi there${esc}[31m`)] });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.messages[0].content).toBe("hi there [31m");
  });

  it("preserves newlines (pasted job descriptions keep their structure)", () => {
    const jd = "Requirements:\n- 3+ years LLM apps\n- MCP experience";
    const r = validateRequest({ messages: [user(jd)] });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.messages[0].content).toBe(jd);
  });
});
