import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copy text to the clipboard with a `copied` flag that resets after `timeout`.
 * Uses the async Clipboard API and falls back to a hidden-textarea + execCommand
 * when it is unavailable or rejected (e.g. non-secure context, §8.3).
 */
export function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      const flag = () => {
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), timeout);
      };

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          flag();
          return true;
        }
        throw new Error("clipboard API unavailable");
      } catch {
        // Fallback: hidden textarea + execCommand.
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.top = "-1000px";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(ta);
          if (ok) flag();
          return ok;
        } catch {
          return false;
        }
      }
    },
    [timeout]
  );

  return { copied, copy };
}
