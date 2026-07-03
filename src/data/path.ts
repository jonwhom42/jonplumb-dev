// The Path — build-time GitHub curation.
// Mapping VERIFIED against the GitHub API on 2026-07-03 by inspecting repo
// languages and creation dates. The spec's tier order is CORRECT (no swap):
//   jplum89 (2019, HTML/CSS/JS→Angular) = front-end beginnings
//   jonplumb89 (2020–21, C#/.NET→full-stack) = back-end & full-stack
//   jonwhom42 (2025–26, TS/Python/Shell AI) = building with AI
//
// Curated repos are static — NO runtime GitHub calls.
// NOTE: Nitruz / ResumeAye / Hermes are not public repos on jonwhom42
// (private / hosted elsewhere), so tier 3 links the strongest public AI repos.
// curated 2026-07-03

export interface CuratedRepo {
  name: string;
  href: string;
  /** display label for the chip (repo name + short qualifier) */
  label: string;
  /** short note on why it represents this chapter */
  note: string;
}

export interface PathTier {
  year: string;
  title: string;
  account: string;
  accountUrl: string;
  blurb: string;
  repos: CuratedRepo[];
}

export const pathIntro =
  "I didn't arrive here. Each account below is a chapter — open any of them, sort oldest-first, and you'll watch me figure this out in real time.";

export const pathTiers: PathTier[] = [
  {
    year: "2019",
    title: "Front-end beginnings",
    account: "github.com/jplum89",
    accountUrl: "https://github.com/jplum89",
    blurb:
      "Where it started: HTML, CSS, JavaScript, and learning what version control even was. The Grand Circus front-end era.",
    repos: [
      {
        name: "responsive",
        label: "responsive",
        href: "https://github.com/jplum89/responsive",
        note: "early CSS + responsive layout practice",
      },
      {
        name: "bootleg-reddit-angular",
        label: "bootleg-reddit-angular",
        href: "https://github.com/jplum89/bootleg-reddit-angular",
        note: "the jump from vanilla JS to an Angular app",
      },
    ],
  },
  {
    year: "2021",
    title: "Back-end & full-stack",
    account: "github.com/jonplumb89",
    accountUrl: "https://github.com/jonplumb89",
    blurb:
      "Leveling up: C#/.NET, Node, real project structure — the jump from exercises to software.",
    repos: [
      {
        name: "LibraryProject",
        label: "LibraryProject",
        href: "https://github.com/jonplumb89/LibraryProject",
        note: "structured C#/.NET application",
      },
      {
        name: "study-buddy",
        label: "study-buddy",
        href: "https://github.com/jonplumb89/study-buddy",
        note: "first real full-stack app",
      },
    ],
  },
  {
    year: "2026",
    title: "Building with AI",
    account: "github.com/jonwhom42",
    accountUrl: "https://github.com/jonwhom42",
    blurb:
      "Current work lives in production, not just public repos — Nitruz, ResumeAye, and Hermes are all above. These are two smaller open builds from the same period:",
    repos: [
      {
        name: "newsGenie",
        label: "newsGenie — LangGraph",
        href: "https://github.com/jonwhom42/newsGenie",
        note: "AI news assistant built on LangGraph",
      },
      {
        name: "claude-kit-dev",
        label: "claude-kit-dev — Claude Code tooling",
        href: "https://github.com/jonwhom42/claude-kit-dev",
        note: "Claude Code toolkit for developers",
      },
    ],
  },
];
