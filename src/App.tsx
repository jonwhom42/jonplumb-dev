import { useCallback, useEffect, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import SelectedWork from "./components/SelectedWork";
import About from "./components/About";
import ThePath from "./components/ThePath";
import Skills from "./components/Skills";
import Uses from "./components/Uses";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Terminal from "./components/Terminal";
import { site, navSections } from "./data/site";
import { useActiveSection } from "./hooks/useActiveSection";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useCopyToClipboard } from "./hooks/useCopyToClipboard";
import { onAnchorClick } from "./lib/scrollToHash";

const sectionIds = navSections.map((s) => s.id);

export default function App() {
  const active = useActiveSection(sectionIds);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const { copy } = useCopyToClipboard();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const openInNewTab = (url: string) =>
    window.open(url, "_blank", "noopener,noreferrer");

  const handleCopyEmail = useCallback(async () => {
    const ok = await copy(site.email);
    setToast(ok ? "copied email ✓" : "couldn't copy — email in Contact");
  }, [copy]);

  useKeyboardShortcuts({
    enabled: !terminalOpen,
    onTerminal: () => setTerminalOpen((v) => !v),
    onResume: () => openInNewTab(site.resume),
    onGithub: () => openInNewTab(site.github),
    onCopyEmail: handleCopyEmail,
  });

  return (
    <>
      <a
        href="#main"
        onClick={(e) => onAnchorClick(e, "#main")}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-amber focus:px-4 focus:py-2 focus:font-medium focus:text-bg"
      >
        Skip to content
      </a>

      <Nav active={active} />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <SelectedWork />
        <About />
        <ThePath />
        <Skills />
        <Uses />
        <Contact />
      </main>

      <Footer />

      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />

      {/* Shortcut toast (e = copy email) */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      >
        {toast && (
          <span className="rounded-md border border-amberDim/60 bg-surface px-4 py-2 font-mono text-sm text-amber shadow-lg">
            {toast}
          </span>
        )}
      </div>
    </>
  );
}
