import { useEffect, useRef } from "react";
import type { ConciergeMessage, Provider } from "../../hooks/useConciergeChat";
import { renderChatLinks } from "../../lib/renderChatLinks";
import { concierge } from "../../data/concierge";

interface MessageListProps {
  messages: ConciergeMessage[];
  loading: boolean;
  lastProvider: Provider | null;
  onNavigate: (hash: string) => void;
}

const PROVIDER_LINE: Record<Provider, string> = {
  gemini: "routed via gemini-flash",
  claude: "routed via claude-haiku — fallback relay, same pattern as Hermes",
  mock: "routed via mock relay — dev mode",
};

export default function MessageList({
  messages,
  loading,
  lastProvider,
  onNavigate,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the view pinned to the newest message.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const lastAssistantIndex = messages.reduce(
    (acc, m, i) => (m.role === "assistant" ? i : acc),
    -1
  );

  return (
    <div
      ref={scrollRef}
      className="terminal-scan flex-1 overflow-y-auto px-4 py-3 font-mono text-sm leading-relaxed"
    >
      <p className="mb-3 whitespace-pre-wrap text-muted">
        <span className="text-amber">▸ </span>
        {concierge.intro}
      </p>

      <div aria-live="polite">
        {messages.map((m, i) => {
          if (m.role === "user") {
            return (
              <p key={i} className="mb-2 text-text">
                <span className="text-amber">you:</span>{" "}
                <span className="text-muted">{m.content}</span>
              </p>
            );
          }
          if (m.role === "system") {
            return (
              <p
                key={i}
                className="mb-2 whitespace-pre-wrap border-l-2 border-amberDim/60 pl-2 text-muted"
              >
                {m.content}
              </p>
            );
          }
          return (
            <div key={i} className="mb-2">
              <p className="whitespace-pre-wrap text-muted">
                <span className="text-amber">▸ </span>
                {renderChatLinks(m.content, onNavigate)}
              </p>
              {i === lastAssistantIndex && m.provider && lastProvider && (
                <p className="mt-1 text-[0.65rem] text-muted/60">
                  {PROVIDER_LINE[m.provider]}
                </p>
              )}
            </div>
          );
        })}

        {loading && (
          <p className="mb-2 text-muted" aria-label="Hermes is thinking">
            <span className="text-amber">▸ </span>
            <span className="concierge-dots" aria-hidden="true">
              <span>·</span>
              <span>·</span>
              <span>·</span>
            </span>
            <span className="sr-only">Hermes is thinking</span>
          </p>
        )}
      </div>
    </div>
  );
}
