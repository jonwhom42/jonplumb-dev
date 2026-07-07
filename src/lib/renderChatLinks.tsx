import type { ReactNode } from "react";
import { navSections } from "../data/site";

// Parse `[[#hash|label]]` tokens into clickable in-app deep-links.
// Shared by the Terminal and the Hermes Concierge widget.
const LINK_RE = /\[\[(#[^\]|]+)\|([^\]]+)\]\]/g;

// Only the site's real section hashes become links; anything else renders as
// plain text — so even a prompt-injected model reply can't mint arbitrary links.
const ALLOWED_HASHES = new Set(navSections.map((s) => `#${s.id}`));

export function renderChatLinks(
  text: string,
  onNavigate: (hash: string) => void
): ReactNode {
  if (!text.includes("[[")) return text;
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  let key = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const hash = m[1];
    if (ALLOWED_HASHES.has(hash)) {
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
    } else {
      parts.push(m[2]);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
