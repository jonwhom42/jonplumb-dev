import { Suspense, lazy, useEffect } from "react";
import { MessageSquareText } from "lucide-react";
import { useConciergeChat } from "../../hooks/useConciergeChat";

// The panel stays out of the main bundle until first open — the launcher is
// the only eager code. Chat state lives HERE (mounted once for the app's
// lifetime) so it survives open/close and StrictMode's double-mounted panel
// effects can't double-send.
const ConciergePanel = lazy(() => import("./ConciergePanel"));

interface ConciergeWidgetProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  /** question handed over from the terminal's `ask <question>` */
  prefill?: string;
  onPrefillConsumed?: () => void;
}

export default function ConciergeWidget({
  open,
  onOpen,
  onClose,
  prefill,
  onPrefillConsumed,
}: ConciergeWidgetProps) {
  const chat = useConciergeChat();
  const { send } = chat;

  // Terminal handoff: auto-send once when a prefill arrives with the panel
  // open. Consuming the prefill clears the prop in the same render batch, so
  // this can't re-fire for the same question.
  useEffect(() => {
    if (open && prefill && prefill.trim()) {
      send(prefill);
      onPrefillConsumed?.();
    }
    // send changes identity per state update — deliberately not a dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, prefill]);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open Hermes Concierge — ask about Jon"
          aria-expanded={open}
          className="concierge-launcher fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-amberDim/60 bg-surface text-amber shadow-[0_0_24px_-6px_rgba(251,191,36,0.35)] transition-transform hover:scale-105"
        >
          <MessageSquareText size={20} aria-hidden="true" />
        </button>
      )}

      {open && (
        <Suspense fallback={null}>
          <ConciergePanel chat={chat} onClose={onClose} />
        </Suspense>
      )}
    </>
  );
}
