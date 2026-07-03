import Nav from "./components/Nav";
import Hero from "./components/Hero";
import { navSections } from "./data/site";
import { useActiveSection } from "./hooks/useActiveSection";

const sectionIds = navSections.map((s) => s.id);

export default function App() {
  const active = useActiveSection(sectionIds);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-amber focus:px-4 focus:py-2 focus:font-medium focus:text-bg"
      >
        Skip to content
      </a>

      <Nav active={active} />

      <main id="main">
        <Hero />
      </main>
    </>
  );
}
