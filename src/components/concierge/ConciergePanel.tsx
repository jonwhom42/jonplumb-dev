import { useEffect, useRef, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import type { useConciergeChat } from "../../hooks/useConciergeChat";
import { scrollToHash } from "../../lib/scrollToHash";
import { concierge, suggestedQuestions } from "../../data/concierge";
import MessageList from "./MessageList";
import Composer from "./Composer";

interface ConciergePanelProps {
  /** chat state owned by ConciergeWidget so it survives open/close */
  chat: ReturnType<typeof useConciergeChat>;
  onClose: () => void;
}

export default function ConciergePanel({ chat, onClose }: ConciergePanelProps) {
  const { messages, status, lastProvider, conversationFull, send } = chat;

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // Focus management: capture opener, focus composer, restore on unmount.
  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => restoreRef.current?.focus?.({ preventScroll: true });
  }, []);

  const navigateTo = (hash: string) => {
    onClose();
    scrollToHash(hash);
  };

  // Esc closes; Tab is trapped within the panel (same shape as Terminal.tsx).
  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "Tab") {
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <>
      {/* mobile backdrop (panel is a bottom sheet under sm) */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
        onMouseDown={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Hermes Concierge chat"
        onKeyDown={onPanelKeyDown}
        className="concierge-panel fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-lg border border-amberDim/60 bg-surface shadow-[0_0_40px_-8px_rgba(251,191,36,0.25)] sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:max-h-[min(560px,calc(100dvh-8rem))] sm:rounded-lg"
      >
        {/* title bar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="font-mono text-xs text-muted">
            <span className="text-amber">●</span> {concierge.prompt}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="text-muted transition-colors hover:text-text"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <MessageList
          messages={messages}
          loading={status === "loading"}
          lastProvider={lastProvider}
          onNavigate={navigateTo}
        />

        {/* first-touch suggested questions */}
        {messages.length === 0 && status === "idle" && (
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="rounded-md border border-border bg-surface2 px-2 py-1 font-mono text-xs text-muted transition-colors hover:border-amberDim/60 hover:text-text"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <Composer
          disabled={status !== "idle"}
          full={conversationFull}
          onSend={send}
          inputRef={inputRef}
        />
      </div>
    </>
  );
}
