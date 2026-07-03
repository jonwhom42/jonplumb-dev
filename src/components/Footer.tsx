import { content } from "../data/site";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-mono text-sm text-muted">{content.footer.left}</p>
        <div className="flex flex-col gap-1 md:items-end">
          <p className="font-mono text-xs text-muted">{content.footer.right}</p>
          <p className="font-mono text-xs text-muted">{content.footer.hints}</p>
        </div>
      </div>
    </footer>
  );
}
