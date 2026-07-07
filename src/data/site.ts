export const site = {
  name: "Jonathon Plumb",
  title: "AI Solutions Engineer",
  email: "jon.plumb89@outlook.com",
  location: "Detroit, MI",
  github: "https://github.com/jonwhom42",
  linkedin: "https://www.linkedin.com/in/jon-who-62934a39b",
  resume: "/resume.pdf",
  nitruz: "https://nitruz.com",
  resumeaye: "https://resume-aye.onrender.com/",
  currently:
    "Running Hermes, a self-hosted multi-agent platform, and preparing Nitruz for launch.",
} as const;

/**
 * Longer-form section copy. Kept here (not the listed data files) so that
 * components render data and never hardcode content (§0 / spec note).
 */
export const content = {
  hero: {
    eyebrow: "Detroit, MI — AI Solutions / Forward-Deployed Engineering",
    h2: "AI Solutions Engineer",
    lede: "I've been building software with LLMs since the GPT-3 era. Now I design, build, and ship production generative-AI and agentic systems end to end — from LLM application architecture to self-hosted multi-agent infrastructure.",
    currently:
      "Currently: running Hermes, a self-hosted multi-agent platform, and preparing Nitruz for launch.",
    hint: "press ~ for terminal · r resume · g github",
  },
  about: {
    paragraphs: [
      "I split my time between two worlds. By day, I've spent 4+ years at Verint building custom Voice-of-Customer solutions for enterprise clients — scoping requirements directly with customers, implementing against real-world constraints, and owning deployments end to end. By night (and most weekends), I run Particalmist LLC, where I've shipped two live AI SaaS products and a self-hosted multi-agent platform.",
      "That combination is the point. AI solutions work isn't just building — it's sitting across the table from a customer, understanding the actual problem, and shipping something that survives contact with production. I've been doing the customer half for years and building with LLMs since GPT-3 could barely hold one file in context. Watching that boundary move — from single-file autocomplete to agentic systems — is the throughline of everything below.",
    ],
    cert: {
      title: "University of Michigan — Applied Generative AI Specialization (2026)",
      detail:
        "LLM application development · Agentic AI frameworks with Model Context & Tooling Protocols · Model architecture · AI governance · Image generation",
    },
  },
  contact: {
    line: "The fastest way to see if I'm a fit: send a role, I'll send back how I'd approach it.",
  },
  footer: {
    left: "© 2026 Jonathon Plumb · Detroit, MI",
    right:
      "Built with Vite + React + TypeScript + Tailwind · deployed on Netlify · yes, it's fast on purpose",
    hints: "~ terminal · r resume · g github",
  },
} as const;

/**
 * Hero "lab status" readout (≥1024px). A stylized listing of TRUE, static,
 * identity-stable labels — NOT live telemetry. No uptimes, counts, or
 * timestamps (honesty guardrail).
 */
export const labStatus = {
  title: "jon@plumb.dev — lab status",
  services: [
    { name: "hermes.service", dot: "blue", status: "running", desc: "multi-agent platform" },
    { name: "ollama", dot: "blue", status: "local fallback", desc: "dedicated GPU host" },
    { name: "nitruz", dot: "amber", status: "pre-launch", desc: "nitruz.com" },
    { name: "resumeaye", dot: "green", status: "live", desc: "resume-aye.onrender.com" },
    { name: "caddy", dot: "blue", status: "reverse proxy", desc: "tailscale-only ingress" },
  ],
} as const;

/** Anchor sections used by the nav + IntersectionObserver. */
export const navSections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "path", label: "Path" },
  { id: "skills", label: "Skills" },
  { id: "uses", label: "Uses" },
  { id: "contact", label: "Contact" },
] as const;
