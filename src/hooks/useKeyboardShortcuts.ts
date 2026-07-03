import { useEffect } from "react";

interface Shortcuts {
  onResume: () => void;
  onGithub: () => void;
  onCopyEmail: () => void;
  onTerminal: () => void;
  /** disable single-key shortcuts while the terminal is open */
  enabled: boolean;
}

function isTypingContext(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}

/**
 * Global single-key shortcuts (§7). Fire only when nothing editable is focused
 * and the terminal is closed. Never preventDefault on unhandled keys and never
 * hijack modifier combos.
 */
export function useKeyboardShortcuts({
  onResume,
  onGithub,
  onCopyEmail,
  onTerminal,
  enabled,
}: Shortcuts) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingContext(document.activeElement)) return;

      // `~` opens the terminal even while disabled would be closed; but if the
      // terminal is already open it manages its own keys, so guard on enabled.
      if (e.key === "~" || e.key === "`") {
        e.preventDefault();
        onTerminal();
        return;
      }

      if (!enabled) return;

      switch (e.key) {
        case "r":
          onResume();
          break;
        case "g":
          onGithub();
          break;
        case "e":
          onCopyEmail();
          break;
        default:
          // no preventDefault — leave unhandled keys alone
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onResume, onGithub, onCopyEmail, onTerminal, enabled]);
}
