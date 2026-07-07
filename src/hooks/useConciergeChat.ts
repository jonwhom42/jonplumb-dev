import { useCallback, useEffect, useReducer, useRef } from "react";

/** Mirrors the function's wire contract (netlify/functions/lib/types.ts). */
export type Provider = "claude" | "gemini" | "mock";

export interface ConciergeMessage {
  /** "system" = local notices (errors, caps) — rendered but never sent */
  role: "user" | "assistant" | "system";
  content: string;
  /** which relay produced an assistant reply */
  provider?: Provider;
}

interface State {
  messages: ConciergeMessage[];
  status: "idle" | "loading" | "capped";
  lastProvider: Provider | null;
}

type Action =
  | { type: "hydrate"; state: State }
  | { type: "send"; content: string }
  | { type: "receive"; reply: string; provider: Provider }
  | { type: "notice"; message: string; capped?: boolean };

/** Client-side conversation ceiling (server enforces the same bound). */
export const MAX_USER_MESSAGES = 10;
export const MAX_INPUT_CHARS = 1000;

const STORAGE_KEY = "hermes-concierge-v1";
const INITIAL: State = { messages: [], status: "idle", lastProvider: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "send":
      return {
        ...state,
        status: "loading",
        messages: [...state.messages, { role: "user", content: action.content }],
      };
    case "receive":
      return {
        status: "idle",
        lastProvider: action.provider,
        messages: [
          ...state.messages,
          { role: "assistant", content: action.reply, provider: action.provider },
        ],
      };
    case "notice":
      return {
        ...state,
        status: action.capped ? "capped" : "idle",
        messages: [...state.messages, { role: "system", content: action.message }],
      };
  }
}

function hydrate(): State {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as State;
    if (!Array.isArray(parsed.messages)) return INITIAL;
    // never resurrect a mid-flight loading state
    return { ...parsed, status: parsed.status === "capped" ? "capped" : "idle" };
  } catch {
    return INITIAL;
  }
}

export function useConciergeChat() {
  const [state, dispatch] = useReducer(reducer, undefined, hydrate);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full/unavailable — persistence is best-effort */
    }
  }, [state]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const userMessageCount = state.messages.filter((m) => m.role === "user").length;
  const conversationFull = userMessageCount >= MAX_USER_MESSAGES;

  const send = useCallback(
    async (raw: string) => {
      const content = raw.trim().slice(0, MAX_INPUT_CHARS);
      if (!content || state.status !== "idle" || conversationFull) return;

      dispatch({ type: "send", content });

      // Wire history: user/assistant only, plus the message just sent.
      const history = state.messages
        .filter((m): m is ConciergeMessage & { role: "user" | "assistant" } =>
          m.role === "user" || m.role === "assistant"
        )
        .map((m) => ({ role: m.role, content: m.content }));

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ messages: [...history, { role: "user", content }] }),
        });

        const body = (await res.json()) as {
          reply?: string;
          provider?: Provider;
          error?: string;
          message?: string;
        };

        if (res.ok && body.reply && body.provider) {
          dispatch({ type: "receive", reply: body.reply, provider: body.provider });
        } else {
          dispatch({
            type: "notice",
            message: body.message ?? "Something glitched in the relay — try again, or just email Jon.",
            capped: body.error === "capped" || body.error === "rate_limited",
          });
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        dispatch({
          type: "notice",
          message: "Couldn't reach the relay — check your connection, or email Jon directly.",
        });
      }
    },
    [state.messages, state.status, conversationFull]
  );

  return {
    messages: state.messages,
    status: state.status,
    lastProvider: state.lastProvider,
    conversationFull,
    send,
  };
}
