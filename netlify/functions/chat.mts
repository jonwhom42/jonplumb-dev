/**
 * Hermes Concierge — POST /api/chat
 *
 * validate → rate-limit (Netlify Blobs) → Gemini Flash (free tier) →
 * Claude Haiku fallback (only when ANTHROPIC_API_KEY is configured).
 * Stateless: the client holds conversation history and sends it each turn.
 * The primary→fallback routing mirrors Hermes' cloud→local story on purpose.
 */

import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import type { CounterStore } from "./lib/limits";
import { SYSTEM_PROMPT } from "./lib/prompt";
import { validateRequest } from "./lib/validate";
import { capsFromEnv, checkAndCount, countClaudeCall, dayKey } from "./lib/limits";
import { askClaude, askGemini, shouldFallback } from "./lib/providers";
import type { ChatError, ChatMessage, ChatResponse, Provider } from "./lib/types";

export const config = { path: "/api/chat" };

const EMAIL = "jon.plumb89@outlook.com";

const json = (body: ChatResponse | ChatError, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

function isMockMode(): boolean {
  if (process.env.CONCIERGE_MOCK === "1") return true;
  const noKeys = !process.env.ANTHROPIC_API_KEY && !process.env.GEMINI_API_KEY;
  return noKeys && process.env.CONTEXT !== "production";
}

/**
 * Log Q&A pairs (no IPs, truncated) to Netlify Blobs — one JSON-lines blob per
 * UTC day. Read with: netlify blobs:get concierge-logs log:YYYY-MM-DD
 * Best-effort: a lost line under concurrency or a Blobs outage never fails the
 * request.
 */
async function logConversation(entry: {
  q: string;
  a: string;
  p: Provider;
  ms: number;
}): Promise<void> {
  try {
    const store = getStore("concierge-logs");
    const key = `log:${dayKey()}`;
    const line = JSON.stringify({
      t: new Date().toISOString(),
      q: entry.q.slice(0, 500),
      a: entry.a.slice(0, 500),
      p: entry.p,
      ms: entry.ms,
    });
    const existing = (await store.get(key, { type: "text" })) ?? "";
    await store.set(key, existing + line + "\n");
  } catch (err) {
    console.error("log: failed (non-fatal)", err);
  }
}

async function mockReply(messages: ChatMessage[]): Promise<ChatResponse> {
  await new Promise((r) => setTimeout(r, 600));
  const q = messages[messages.length - 1].content;
  return {
    reply:
      `[mock mode — no API keys configured] You asked: "${q.slice(0, 80)}". ` +
      `In production I'd answer from Jon's verified knowledge base. ` +
      `Try [[#work|Selected Work]] meanwhile.`,
    provider: "mock",
  };
}

export default async function handler(req: Request, context: Context) {
  // Health probe — no LLM call, no budget spend. Used by the scheduled
  // GitHub Actions check; safe to expose (reveals config presence, no values).
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({
        ok: true,
        gemini: Boolean(process.env.GEMINI_API_KEY),
        claudeFallback: Boolean(process.env.ANTHROPIC_API_KEY),
        mock: isMockMode(),
      }),
      { headers: { "content-type": "application/json" } }
    );
  }
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request", message: "invalid JSON" }, 400);
  }

  const validated = validateRequest(body);
  if (!validated.ok) {
    return json({ error: "bad_request", message: validated.error }, 400);
  }

  if (isMockMode()) {
    return json(await mockReply(validated.messages));
  }

  // --- rate limits / daily budget fences (fail-open if Blobs is unavailable,
  // e.g. `netlify dev --offline` — availability beats strictness here) ---
  const caps = capsFromEnv(process.env);
  let store: CounterStore | null = null;
  try {
    store = getStore("concierge-limits");
  } catch (err) {
    console.error("limits: blobs store unavailable, failing open", err);
  }
  const decision = store
    ? await checkAndCount(store, context.ip ?? "unknown", caps)
    : { allowed: true as const, claudeBudgetAvailable: true };

  if (!decision.allowed) {
    const message =
      decision.reason === "ip"
        ? `You've been chatty — I like it. My per-visitor budget is spent for today, but Jon answers email fast: ${EMAIL}`
        : `Today's routing budget is spent — structural cost cap, same pattern as Hermes. Back tomorrow, or email Jon directly: ${EMAIL}`;
    return json({ error: decision.reason === "ip" ? "rate_limited" : "capped", message }, 429);
  }

  // --- provider routing: Gemini primary (free tier), Claude fallback ---
  const start = Date.now();
  let reply: string | null = null;
  let provider: Provider = "gemini";

  if (process.env.GEMINI_API_KEY) {
    try {
      reply = await askGemini(SYSTEM_PROMPT, validated.messages);
    } catch (err) {
      console.error("gemini failed", err);
      if (!shouldFallback(err)) {
        return json(
          { error: "upstream", message: `Relay hiccup on my end — email Jon directly: ${EMAIL}` },
          502
        );
      }
    }
  }

  if (reply === null) {
    // Gemini failed or isn't configured → Claude, if a key exists, the daily
    // fallback budget has room, and wall clock allows (~10s function limit).
    const claudeAvailable =
      Boolean(process.env.ANTHROPIC_API_KEY) &&
      decision.claudeBudgetAvailable &&
      Date.now() - start <= 6_000;

    if (!claudeAvailable) {
      return json(
        { error: "upstream", message: `The relay is down — the human is more reliable: ${EMAIL}` },
        502
      );
    }
    try {
      reply = await askClaude(SYSTEM_PROMPT, validated.messages);
      provider = "claude";
      if (store) await countClaudeCall(store);
    } catch (err) {
      console.error("claude fallback failed", err);
      return json(
        { error: "upstream", message: `Both relays are down — the human is more reliable: ${EMAIL}` },
        502
      );
    }
  }

  await logConversation({
    q: validated.messages[validated.messages.length - 1].content,
    a: reply,
    p: provider,
    ms: Date.now() - start,
  });

  return json({ reply, provider });
}
