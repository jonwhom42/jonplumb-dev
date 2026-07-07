/** Wire types for POST /api/chat. */

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export type Provider = "claude" | "gemini" | "mock";

export interface ChatResponse {
  reply: string;
  provider: Provider;
}

export type ChatErrorCode = "bad_request" | "rate_limited" | "capped" | "upstream";

export interface ChatError {
  error: ChatErrorCode;
  /** In-character message the widget renders directly. */
  message: string;
}

/** Server-side bounds — enforced on every request, never trusted from the client. */
export const LIMITS = {
  /** hard cap on messages accepted in one conversation payload */
  maxMessages: 20,
  /** hard cap on a single message's length (chars) — sized so a full pasted
   *  job description (typically 3–6K chars) fits for fit-mapping mode */
  maxMessageChars: 6000,
  /** only this many trailing messages are forwarded to the LLM */
  forwardedMessages: 12,
  /** output token ceiling per reply — headroom for point-by-point JD analysis */
  maxOutputTokens: 1024,
} as const;
