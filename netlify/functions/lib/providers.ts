/**
 * LLM provider adapters: raw-fetch Gemini (primary — free tier) + Anthropic
 * SDK (optional fallback, used only when ANTHROPIC_API_KEY is configured).
 *
 * The primary→fallback routing deliberately mirrors Hermes' cloud→local
 * story — the widget's provider footer surfaces it as a talking point.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessage } from "./types";
import { LIMITS } from "./types";

/** Gemini gets the wall-clock budget; leave room for the Claude fallback within Netlify's 10s. */
const GEMINI_TIMEOUT_MS = 6_000;
const CLAUDE_TIMEOUT_MS = 3_500;

const CLAUDE_MODEL = "claude-haiku-4-5";
const GEMINI_MODEL = "gemini-2.5-flash";

let anthropic: Anthropic | null = null;
function client(): Anthropic {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      timeout: CLAUDE_TIMEOUT_MS, // milliseconds in the TS SDK
      maxRetries: 0, // this IS the fallback — fail fast, don't retry
    });
  }
  return anthropic;
}

export async function askClaude(
  system: string,
  messages: ChatMessage[]
): Promise<string> {
  const response = await client().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: LIMITS.maxOutputTokens,
    // Content-block form so the stable prompt can carry a cache marker.
    // (Haiku 4.5's minimum cacheable prefix is 4096 tokens — the marker is
    // harmless if the KB is under that, and engages as the KB grows.)
    system: [
      { type: "text", text: system, cache_control: { type: "ephemeral" } },
    ],
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  if (!text) throw new Error(`claude: empty reply (stop_reason=${response.stop_reason})`);
  return text;
}

export async function askGemini(
  system: string,
  messages: ChatMessage[]
): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("gemini: GEMINI_API_KEY not set");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": key,
        },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: {
            maxOutputTokens: LIMITS.maxOutputTokens,
            // 2.5 Flash thinks by default and thinking tokens count against
            // maxOutputTokens — disable it so short caps don't truncate replies.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`gemini: HTTP ${res.status} ${await res.text().catch(() => "")}`);
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("")
      .trim();

    if (!text) throw new Error("gemini: empty reply");
    return text;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Whether a Gemini failure should trigger the Claude fallback.
 * Everything transient or upstream falls back; only a clearly-bad request
 * from our own code should not (it would fail on Claude too).
 */
export function shouldFallback(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : "";
  if (/^gemini: HTTP 400\b/.test(msg)) return false; // our bug — Claude won't fix it
  return true; // 401/403/429/5xx, timeouts, network, empty replies
}
