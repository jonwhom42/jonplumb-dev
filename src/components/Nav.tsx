import { useState } from "react";
import { Menu, X } from "lucide-react";
import { site, navSections } from "../data/site";

interface NavProps {
  active: string;
}

export default function Nav({ active }: NavProps) {
  const [open, setOpen] = useState(false);

  const linkClass = (id: string) =>
    `transition-colors hover:text-text ${
      active === id ? "text-text" : "text-muted"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-8"
      >
        <a
          href="#top"
          className="font-mono text-lg font-medium text-text"
          aria-label="jp — back to top"
        >
          jp
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 text-sm md:flex">
          {navSections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={linkClass(s.id)}
                aria-current={active === s.id ? "true" : undefined}
              >
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-amber px-3 py-1.5 font-mono text-xs text-amber transition-colors hover:bg-amber hover:text-bg"
            >
              Resume ↗
            </a>
          </li>
        </ul>

        {/* Mobile disclosure toggle */}
        <button
          type="button"
          className="text-muted md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-bg/95 md:hidden"
        >
          <ul className="mx-auto flex max-w-content flex-col px-6 py-2">
            {navSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className={`block py-3 ${linkClass(s.id)}`}
                  aria-current={active === s.id ? "true" : undefined}
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={site.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block py-3 font-mono text-sm text-amber"
              >
                Resume ↗
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
