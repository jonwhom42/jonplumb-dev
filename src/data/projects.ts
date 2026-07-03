import type { StatusDot } from "../lib/statusColors";
export type { StatusDot };

export interface ProjectLink {
  label: string;
  href: string;
  /** microcopy shown under the link (e.g. cold-start warning) */
  note?: string;
}

export interface Project {
  id: string;
  name: string;
  /** shown next to the name, e.g. "nitruz.com" — omit for no public link */
  url?: string;
  status: { label: string; dot: StatusDot };
  oneLiner: string;
  description: string;
  tags: string[];
  decisions: string[];
  links: ProjectLink[];
  /** muted note rendered under the card (Hermes) */
  footnote?: string;
  /** render the <DemoVideo/> inside this card (Nitruz) */
  hasDemo?: boolean;
}

export const projects: Project[] = [
  {
    id: "nitruz",
    name: "Nitruz",
    url: "nitruz.com",
    status: { label: "Live — pre-launch", dot: "amber" },
    oneLiner: "AI vehicle photography SaaS for auto dealerships.",
    description:
      "A production SaaS that turns raw dealership vehicle photos into studio-quality marketing assets using generative image models. Full stack owned end to end: generation pipeline, credit-based billing with cost reconciliation, submission lifecycle, and a mobile-first before/after experience. Live and production-deployed; go-to-market deliberately begins after trademark clearance.",
    tags: ["React", "TypeScript", "Vite", "Firebase", "Cloud Run", "Stripe", "Gemini"],
    decisions: [
      "Credit-based billing over per-image pricing — generation costs vary per job; credits decouple customer pricing from provider costs and keep worst-case margins predictable.",
      "Static fallback pricing — checkout still renders if the live Stripe fetch fails. A billing page that can't fail-soft is a conversion leak.",
      "Mobile-first before/after slider — dealership users shoot on phones on the lot; the proof moment has to work one-handed in sunlight.",
    ],
    links: [{ label: "Visit nitruz.com ↗", href: "https://nitruz.com" }],
    hasDemo: true,
  },
  {
    id: "resumeaye",
    name: "ResumeAye",
    url: "resume-aye.onrender.com",
    status: { label: "Live", dot: "green" },
    oneLiner: "Freemium AI resume-tailoring SaaS.",
    description:
      "Tailors a resume to a specific job description using the Gemini API, scores ATS-compliance match, and exports a real .docx. Freemium with a $12/mo Pro tier.",
    tags: [
      "React 18",
      "TypeScript",
      "Vite",
      "Tailwind",
      "Firebase Auth",
      "Firestore",
      "docxtemplater",
      "Gemini",
    ],
    decisions: [
      "Security rules as the API contract — freemium means untrusted clients; Firestore rules carry authorization, verified by 22 passing emulator tests.",
      "Template-based .docx over HTML-to-PDF — recruiters and ATS systems want real Word files, not print stylesheets.",
      "Gemini Flash for the tailoring loop — high-volume, low-margin work favors a fast cheap model with tight structured prompts over a premium model.",
    ],
    links: [
      {
        label: "Launch demo ↗",
        href: "https://resume-aye.onrender.com/",
        note: "free-tier host — give it ~30s to wake up ☕",
      },
    ],
  },
  {
    id: "hermes",
    name: "Hermes",
    status: { label: "Running — self-hosted", dot: "blue" },
    oneLiner: "Self-hosted multi-agent platform.",
    description:
      "A containerized multi-agent system routing LLM calls across cloud and local models with tool calling and Model Context Protocol integrations. Default brain runs on Claude, technical and creative execution delegates to Claude Code, and when cloud limits hit, routing falls back to local models on a dedicated Ollama GPU host. Runs on a hardened Ubuntu homelab: Docker with GPU-in-container inference, Tailscale mesh networking, Caddy reverse proxy, automated 3-2-1 backups.",
    tags: [
      "Agents",
      "MCP",
      "Claude",
      "Claude Code",
      "Ollama",
      "Docker",
      "Tailscale",
      "Caddy",
      "Ubuntu Server",
    ],
    decisions: [
      "Local-first fallback — a separate Ollama GPU box means agents degrade gracefully at cloud limits, and spend has a structural cap instead of a monitoring alert.",
      "Routing by task type — one default brain, with technical/creative execution delegated to the tool best at it, beats one model doing everything.",
      "Tailscale-only binding — no public ports anywhere; the mesh is the perimeter.",
      "Boring reliability on purpose — systemd boot ordering, compose dependency edges, and 3-2-1 backups, because agents are only useful if the substrate survives a reboot.",
    ],
    links: [],
    footnote:
      "Self-hosted infrastructure — architecture writeup over repo link. Ask me about it.",
  },
];
