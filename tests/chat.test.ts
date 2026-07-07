/**
 * Handler smoke tests — exercised in mock mode (no API keys, no Blobs),
 * which is exactly how the endpoint behaves in keyless local dev/CI.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import handler from "../netlify/functions/chat.mts";
import type { Context } from "@netlify/functions";

const ctx = { ip: "127.0.0.1" } as Context;

const post = (body: unknown) =>
  handler(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
    ctx
  );

describe("chat handler (mock mode)", () => {
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const k of ["CONCIERGE_MOCK", "ANTHROPIC_API_KEY", "GEMINI_API_KEY", "CONTEXT"]) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
    process.env.CONCIERGE_MOCK = "1";
  });

  afterEach(() => {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });

  it("rejects non-POST", async () => {
    const res = await handler(new Request("http://localhost/api/chat"), ctx);
    expect(res.status).toBe(405);
  });

  it("rejects invalid JSON", async () => {
    const res = await handler(
      new Request("http://localhost/api/chat", { method: "POST", body: "{nope" }),
      ctx
    );
    expect(res.status).toBe(400);
  });

  it("rejects an invalid payload with an in-character error body", async () => {
    const res = await post({ messages: [] });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("bad_request");
  });

  it("answers a valid request with a mock reply", async () => {
    const res = await post({ messages: [{ role: "user", content: "What's Hermes?" }] });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.provider).toBe("mock");
    expect(body.reply).toContain("mock mode");
  });
});
