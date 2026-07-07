import { useState, type FormEvent, type KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { MAX_INPUT_CHARS } from "../../hooks/useConciergeChat";
import { concierge } from "../../data/concierge";

interface ComposerProps {
  disabled: boolean;
  /** conversation hit its message ceiling */
  full: boolean;
  onSend: (content: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export default function Composer({ disabled, full, onSend, inputRef }: ComposerProps) {
  const [value, setValue] = useState("");
  const nearLimit = value.length > MAX_INPUT_CHARS - 500;

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (disabled || !value.trim()) return;
    onSend(value);
    setValue("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  // Enter sends; Shift+Enter inserts a newline (for pasted/edited JDs).
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  // Auto-grow up to ~5 lines, then scroll.
  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  if (full) {
    return (
      <p className="border-t border-border px-4 py-3 font-mono text-xs text-muted">
        Long conversation — the rest is better over email:{" "}
        <a
          href="mailto:jon.plumb89@outlook.com"
          className="text-amber underline underline-offset-2"
        >
          jon.plumb89@outlook.com
        </a>
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-end gap-2 border-t border-border px-4 py-2"
    >
      <textarea
        id="concierge-input"
        name="concierge-question"
        ref={inputRef}
        value={value}
        rows={1}
        onChange={(e) => {
          setValue(e.target.value.slice(0, MAX_INPUT_CHARS));
          autoGrow(e.target);
        }}
        onKeyDown={onKeyDown}
        placeholder={concierge.inputPlaceholder}
        disabled={disabled}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Ask a question about Jon, or paste a job description"
        className="max-h-[120px] flex-1 resize-none border-none bg-transparent p-0 font-mono text-sm leading-relaxed text-text caret-amber outline-none placeholder:text-muted/60 focus:ring-0"
      />
      {nearLimit && (
        <span className="font-mono text-[0.65rem] text-muted" aria-live="polite">
          {MAX_INPUT_CHARS - value.length}
        </span>
      )}
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send"
        className="pb-0.5 text-amber transition-opacity disabled:opacity-30"
      >
        <SendHorizontal size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
