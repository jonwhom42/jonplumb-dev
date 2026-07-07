/** Request validation — server-side bounds, never trusting the client. */

import type { ChatMessage, ChatRequest } from "./types";
import { LIMITS } from "./types";

// Strip control characters but preserve \n and \t — pasted job descriptions
// carry structure in their line breaks.
const CONTROL_CHARS = /(?![\n\t])\p{Cc}/gu;

export type ValidationResult =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; error: string };

export function validateRequest(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "body must be a JSON object" };
  }
  const { messages } = body as Partial<ChatRequest>;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: "messages must be a non-empty array" };
  }
  if (messages.length > LIMITS.maxMessages) {
    return { ok: false, error: `too many messages (max ${LIMITS.maxMessages})` };
  }

  const clean: ChatMessage[] = [];
  for (const m of messages) {
    if (typeof m !== "object" || m === null) {
      return { ok: false, error: "each message must be an object" };
    }
    const { role, content } = m as Partial<ChatMessage>;
    if (role !== "user" && role !== "assistant") {
      return { ok: false, error: "invalid role" };
    }
    if (typeof content !== "string" || content.trim().length === 0) {
      return { ok: false, error: "message content must be a non-empty string" };
    }
    if (content.length > LIMITS.maxMessageChars) {
      return {
        ok: false,
        error: `message too long (max ${LIMITS.maxMessageChars} chars)`,
      };
    }
    clean.push({ role, content: content.replace(CONTROL_CHARS, " ").trim() });
  }

  if (clean[clean.length - 1].role !== "user") {
    return { ok: false, error: "last message must be from the user" };
  }

  // Bound token cost regardless of what the client sends.
  return { ok: true, messages: clean.slice(-LIMITS.forwardedMessages) };
}
