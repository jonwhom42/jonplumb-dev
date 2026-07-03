import { Check, Copy } from "lucide-react";
import { site } from "../data/site";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

interface CopyEmailButtonProps {
  className?: string;
}

/** Copy-email button that flips to `copied ✓` for 2s and announces politely. */
export default function CopyEmailButton({ className = "" }: CopyEmailButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(site.email)}
      aria-label={`Copy email address ${site.email}`}
      className={`inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 font-mono text-sm transition-colors hover:border-amberDim hover:bg-surface2 ${
        copied ? "text-amber" : "text-muted"
      } ${className}`}
    >
      {copied ? (
        <Check size={15} aria-hidden="true" />
      ) : (
        <Copy size={15} aria-hidden="true" />
      )}
      {copied ? "copied ✓" : "Copy email"}
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}
