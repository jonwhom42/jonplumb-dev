/**
 * Hermes Concierge — shared data for the recruiter-facing chat widget.
 *
 * Used by BOTH sides:
 *  - the widget (suggested-question chips, branding strings)
 *  - the Netlify Function (recruiter FAQ facts serialized into the system prompt)
 *
 * Facts below were confirmed by Jon on 2026-07-06. The assistant treats them
 * as verified and must never embellish beyond them (honesty guardrail, §0).
 */

export const concierge = {
  name: "Hermes Concierge",
  prompt: "hermes@concierge:~$",
  intro:
    "Hi — I'm Jon's portfolio assistant, running on the same cloud-with-fallback pattern as Hermes. Ask me anything about his work or stack — or paste a job description and I'll map his fit against it, point by point.",
  inputPlaceholder: "ask about jon — or paste a job description…",
} as const;

/** First-touch suggested questions. Rendered as chips; echoed in the prompt. */
export const suggestedQuestions = [
  "What's Hermes?",
  "Is Jon open to remote roles?",
  "What has he shipped?",
  "How does he scope AI work?",
] as const;

/**
 * Recruiter FAQ — the logistics questions recruiters actually ask, which the
 * public site copy doesn't cover. Serialized into the function's knowledge base.
 */
export interface FaqFact {
  topic: string;
  fact: string;
}

export const recruiterFacts: FaqFact[] = [
  {
    topic: "Work authorization",
    fact: "US citizen — authorized to work for any US employer. No sponsorship needed, now or ever.",
  },
  {
    topic: "Location & work style",
    fact: "Based in Detroit, MI. Open to remote (US) roles — proven remote track record: fully remote at Verint since Oct 2021.",
  },
  {
    topic: "Target roles",
    fact: "AI Solutions Engineer, Forward-Deployed Engineer, AI Implementation/Integration Engineer, Solutions Architect (AI) — plus general Software Engineer / Full-Stack Engineer roles.",
  },
  {
    topic: "Availability",
    fact: "Currently employed at Verint; open to the right opportunity with a standard two-week notice.",
  },
  {
    topic: "Contract / consulting",
    fact: "Available for contract or consulting engagements through Particalmist LLC (his Michigan LLC) — a good fit for companies not hiring full-time yet.",
  },
  {
    topic: "Live demos",
    fact: "Jon can walk you through Nitruz, ResumeAye, or the Hermes lab live on a screen-share — just email him to set it up.",
  },
  {
    topic: "Best next step",
    fact: "Send Jon a role (job description) and he'll send back how he'd approach it — the fastest way to see if he's a fit.",
  },
  {
    topic: "Speaking & teaching",
    fact: "Teaching Assistant & tutor at Grand Circus (Detroit bootcamp) since Apr 2023 — taught full-stack JavaScript, supported 50+ students to a 95% pass rate. Comfortable presenting to technical and non-technical audiences.",
  },
];

/**
 * Resume facts not already present in the site data files
 * (verified against public/resume.pdf).
 */
export const resumeFacts: FaqFact[] = [
  {
    topic: "Verint (day job)",
    fact: "Implementation Engineer at Verint since Oct 2021 (remote). Designs and delivers custom Voice-of-Customer implementations for 60+ enterprise clients using the Verint WebSDK; technical owner of client deployments; diagnosed and resolved 100+ complex third-party integration issues, improving implementation reliability by ~35%.",
  },
  {
    topic: "Particalmist LLC",
    fact: "Founder & solo engineer (2025–present), a Michigan LLC / independent AI product studio. Shipped Nitruz and ResumeAye (both live) and Hermes, a self-hosted multi-agent platform.",
  },
  {
    topic: "Education & certification",
    fact: "University of Michigan — Applied Generative AI Specialization (2026). Grand Circus front-end program (2018–19: HTML/CSS/JS/TypeScript/Angular/SQL) and back-end program (2021: C#, OOP, .NET Core, ASP.NET MVC).",
  },
  {
    topic: "Testing practice",
    fact: "ResumeAye's Firestore security rules are the API contract, verified by 22 passing Firebase-emulator tests. Also uses Vitest and unit/integration testing.",
  },
];

/** Salary/compensation policy — deflect gracefully, never anchor. */
export const compensationPolicy =
  "Jon discusses compensation once there's mutual fit. Email him with the role and range: he responds quickly.";
