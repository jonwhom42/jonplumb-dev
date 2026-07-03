import { site } from "../data/site";
import { projects } from "../data/projects";
import { skillGroups } from "../data/skills";
import { pathTiers } from "../data/path";

export interface CommandResult {
  lines: string[];
  /** side effect for the Terminal component to perform */
  action?: "clear" | "exit" | "open-resume";
}

const COMMANDS = [
  "help",
  "about",
  "projects",
  "approach",
  "stack",
  "path",
  "resume",
  "hire",
  "cats",
  "whoami",
  "clear",
  "exit",
] as const;

const handlers: Record<string, () => CommandResult> = {
  help: () => ({
    lines: [
      "available commands:",
      "  about      who I am, briefly",
      "  projects   what I've shipped",
      "  approach   how I scope an AI solution",
      "  stack      the tools I reach for",
      "  path       how I got here",
      "  resume     open the resume",
      "  hire       let's talk",
      "  whoami     you, probably",
      "  clear      clear the screen",
      "  exit       close the terminal",
    ],
  }),

  about: () => ({
    lines: [
      "Jonathon Plumb — AI Solutions Engineer, Detroit.",
      "Building with LLMs since GPT-3; ships production generative-AI and agentic systems end to end.",
    ],
  }),

  projects: () => ({
    lines: [
      ...projects.flatMap((p) => [
        `${p.name} — ${p.oneLiner}`,
        `  ${p.url ? "https://" + p.url : "self-hosted — ask me about it"}`,
      ]),
      "",
      "→ full writeups in [[#work|Selected Work]]",
    ],
  }),

  approach: () => ({
    lines: [
      "how I scope an AI solution:",
      "  1. clarify the actual problem — not the requested feature",
      "  2. find the cheapest model that survives production",
      "  3. make it fail-soft — billing, fallbacks, degraded modes",
      "  4. own the deploy — it isn't shipped until it runs in their world",
      "→ send a role, I'll send back this, applied.  (see: [[#contact|contact]])",
    ],
  }),

  stack: () => ({
    lines: skillGroups.map((g) => `${g.label}: ${g.items.slice(0, 5).join(", ")}`),
  }),

  path: () => ({
    lines: pathTiers.map((t) => `${t.year}  ${t.title} — ${t.account}`),
  }),

  resume: () => ({
    lines: ["opening resume.pdf…"],
    action: "open-resume",
  }),

  hire: () => ({
    lines: [
      "good instinct.",
      `→ ${site.email} — or just ask me how I'd approach your problem.`,
      "[[#contact|→ jump to the contact section]]",
    ],
  }),

  cats: () => ({
    lines: [
      "chuck, larry, and fluffy are asleep on the servers. uptime is their doing. 🐈🐈🐈",
    ],
  }),

  whoami: () => ({
    lines: ["recruiter, probably. hi. type 'projects'."],
  }),

  clear: () => ({ lines: [], action: "clear" }),

  exit: () => ({ lines: [], action: "exit" }),
};

export function runCommand(raw: string): CommandResult {
  const cmd = raw.trim().toLowerCase();
  if (cmd === "") return { lines: [] };
  const handler = handlers[cmd];
  if (handler) return handler();
  return { lines: [`command not found: ${cmd} — try 'help'`] };
}

export const commandNames = COMMANDS;
