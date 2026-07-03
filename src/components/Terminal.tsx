import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { site } from "../data/site";
import { runCommand } from "../lib/terminalCommands";
import { scrollToHash } from "../lib/scrollToHash";

// Parse `[[#hash|label]]` tokens into clickable in-terminal deep-links.
const LINK_RE = /\[\[(#[^\]|]+)\|([^\]]+)\]\]/g;

function renderLine(text: string, onNavigate: (hash: string) => void): ReactNode {
  if (!text.includes("[[")) return text;
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  let key = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const hash = m[1];
    parts.push(
      <button
        key={key++}
        type="button"
        onClick={() => onNavigate(hash)}
        className="text-amber underline underline-offset-2 hover:opacity-80"
      >
        {m[2]}
      </button>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

interface TerminalProps {
  open: boolean;
  onClose: () => void;
}

interface Line {
  kind: "input" | "output";
  text: string;
}

const PROMPT = "jon@plumb.dev:~$";

const WELCOME: Line[] = [
  { kind: "output", text: "jon@plumb.dev — interactive shell" },
  { kind: "output", text: "type 'help' for commands, 'exit' or Esc to close." },
];

export default function Terminal({ open, onClose }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // Focus management: capture opener, focus input, restore on close.
  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      // focus after paint
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      // preventScroll so restoring focus doesn't fight a deep-link navigation
      restoreRef.current?.focus?.({ preventScroll: true });
    }
  }, [open]);

  // Close the terminal, then deep-link to a section (Fix 1 scroll handler).
  const navigateTo = (hash: string) => {
    onClose();
    scrollToHash(hash);
  };

  // Keep the view scrolled to the newest output.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, open]);

  if (!open) return null;

  const submit = () => {
    const value = input;
    const result = runCommand(value);

    if (value.trim()) {
      setHistory((h) => [...h, value]);
    }
    setHistoryIndex(-1);

    if (result.action === "clear") {
      setLines([]);
      setInput("");
      return;
    }
    if (result.action === "exit") {
      setInput("");
      onClose();
      return;
    }
    if (result.action === "open-resume") {
      window.open(site.resume, "_blank", "noopener,noreferrer");
    }

    setLines((prev) => [
      ...prev,
      { kind: "input", text: value },
      ...result.lines.map((text) => ({ kind: "output" as const, text })),
    ]);
    setInput("");
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    }
  };

  // Dialog-level: Esc closes; Tab is trapped within the panel.
  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "Tab") {
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, input, [href], [tabindex]:not([tabindex="-1"])'
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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="terminal"
        onKeyDown={onPanelKeyDown}
        className="w-full max-w-2xl overflow-hidden rounded-lg border border-amberDim/60 bg-surface shadow-[0_0_40px_-8px_rgba(251,191,36,0.25)]"
      >
        {/* title bar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="font-mono text-xs text-muted">{PROMPT}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terminal"
            className="text-muted transition-colors hover:text-text"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* output */}
        <div
          ref={scrollRef}
          className="terminal-scan max-h-[50vh] overflow-y-auto px-4 py-3 font-mono text-sm leading-relaxed"
        >
          {lines.map((line, i) =>
            line.kind === "input" ? (
              <p key={i} className="text-text">
                <span className="text-amber">{PROMPT}</span>{" "}
                <span className="text-muted">{line.text}</span>
              </p>
            ) : (
              <p key={i} className="whitespace-pre-wrap text-muted">
                {renderLine(line.text, navigateTo)}
              </p>
            )
          )}

          {/* live input line */}
          <div className="flex items-center gap-2 text-text">
            <label htmlFor="terminal-input" className="text-amber">
              {PROMPT}
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="terminal input"
              className="flex-1 border-none bg-transparent p-0 text-text caret-amber outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
