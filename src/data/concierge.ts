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
  privacyNote:
    "Messages are processed by AI providers and logged (no identifiers) to improve answers — please don't paste confidential info.",
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

/**
 * Engineering war stories — specific problems Jon actually solved, with the
 * mechanics. Mined from his work logs on 2026-07-06. The assistant should
 * prefer telling one of these over reciting a skills list when a question
 * touches the same territory.
 */
export const warStories: FaqFact[] = [
  {
    topic: "Silent context truncation root-cause",
    fact: "Hermes runs against local models started failing with no final response — even a trivial probe died. Jon traced it to Ollama silently serving a 4,096-token context while Hermes sent ~20–30K-token requests (system prompt plus 17 tool schemas); Hermes trusted the model's advertised 262K training context, so its guardrail never fired. He fixed it by setting a 65,536-token served context machine-wide and verified with a ~9K-token probe — and rejected a proposed 252K value on VRAM math, because Ollama allocates the full KV cache at load and that setting would have OOM'd the 12GB card.",
  },
  {
    topic: "Boot-race outage, permanent hardening",
    fact: "After an unplanned reboot, his reverse proxy exited (Docker started it before Tailscale had assigned the IP it binds to) and a monitoring container crash-looped on a dependency race. Jon fixed it permanently with an ip_nonlocal_bind sysctl, compose dependency edges, and per-stack systemd units ordered after Docker and tailscaled — because Docker's restart-on-boot ignores compose depends_on — then proved it with a mandatory reboot test. He refused the easy fix of binding 0.0.0.0 because Docker's published ports bypass the firewall.",
  },
  {
    topic: "Billing preview reconciliation bug",
    fact: "A scripted prospect walkthrough of Nitruz (run via Chrome DevTools MCP) surfaced a cost preview that underestimated the actual credit charge by ~25%. Jon shipped a worst-case-ceiling invariant: the preview always shows the maximum possible charge, so a customer can never be charged more than they approved.",
  },
  {
    topic: "Ops database loss and recovery",
    fact: "Nitruz's ops database vanished overnight, likely from a double-run during a password rotation. Jon rebuilt it from workflow definitions on disk, then built nightly gzipped, timestamped pg_dumpall backups with 7-day retention — and verified the dumps actually contained every database and table before trusting them.",
  },
  {
    topic: "Runaway API spend, structural fix",
    fact: "An accidental ~$80 Gemini API bill from autonomous agent traffic prompted a structural response rather than a monitoring one: Jon moved Hermes to a local-first model policy on his own GPU host and adopted hard cost caps so autonomous jobs physically cannot overspend. The same philosophy runs this assistant: its daily caps are structural, not monitored.",
  },
  {
    topic: "Killed his own trading signal",
    fact: "In a personal quantitative research project, a momentum signal tested statistically real (p=0.0016 over 5.1 years, surviving multiple-testing correction) — and Jon still ruled it untradeable because it carried a −81.8% max drawdown and 83% annualized volatility. He documented the negative result rather than shipping a flattering backtest; three other hypothesis classes were honestly reported as no-edge.",
  },
  {
    topic: "Audited his own system's weak spot",
    fact: "While auditing Hermes, Jon discovered its model fallback chain was actually empty — a single point of failure behind an architecture that implied redundancy — and recorded the finding in his versioned system doc rather than letting the documentation overstate the system.",
  },
];

/** Depth signals & unlisted work — detail behind what the site name-drops. */
export const depthFacts: FaqFact[] = [
  {
    topic: "Local inference tuning",
    fact: "On his dedicated Ollama host (RTX 4070, 12GB), Jon runs a quantization-aware-trained resident model tuned with flash attention and q8_0 KV-cache quantization — cutting VRAM from ~7.7GB to ~6.9GB with a re-verified no-regression probe. He chose one multimodal resident model over per-task specialists after measuring a ~98-second model-swap tax.",
  },
  {
    topic: "Model selection by A/B eval",
    fact: "Hermes's local default model was selected via a structured A/B evaluation across tool-calling, ambiguous-instruction, and multi-step tasks — not benchmark reputation. All 10 of Hermes's routable auxiliary slots were then rewired to the winner.",
  },
  {
    topic: "Context management discipline",
    fact: "Jon maintains a versioned master context document as canonical system state, with per-claim confidence markers and a defined session protocol, so the AI he works with never operates on stale state. From direct debugging he can articulate the difference between a model's trained context window and what a runtime actually serves — and why context length is a VRAM budget, not a free setting.",
  },
  {
    topic: "MCP in real workflows",
    fact: "Beyond name-dropping: Jon scripts full prospect walkthroughs and pre-ship verification passes of Nitruz via Chrome DevTools MCP across six seeded account tiers (with a production-safety guard and emulator support), and his Hermes deployment routes tool-calling requests carrying 17 tool schemas per turn. His agents are also reachable as Telegram and Discord bots, not just terminals.",
  },
  {
    topic: "Ops metrics pipeline",
    fact: "Nitruz has an internal business-metrics loop Jon built: an n8n workflow runs Firestore aggregations (daily generations, inspections, credits burned) into Postgres, surfaced in a custom Streamlit/Plotly dashboard. Debugging it involved collapsing a multi-node race into one sequential code node and creating three missing Firestore composite indexes.",
  },
  {
    topic: "Quant research infrastructure",
    fact: "He built an end-to-end quantitative research system on his homelab: Postgres 17 (localhost-only, secrets locked down), exchange-agnostic OHLCV ingestion, bulk historical data sourcing, a 30-asset universe, and a statistical harness enforcing multiple-testing correction, after-fee expectancy, and chronological out-of-sample splits. Research-only by design — built to answer a question honestly, and it did.",
  },
  {
    topic: "Resume as code",
    fact: "Jon's resume is generated by a Node.js script using the docx library, exported to PDF, and iterated under version control like software — the same document pipeline domain as his ResumeAye product.",
  },
  {
    topic: "This assistant is his build",
    fact: "The widget you're talking to is one of Jon's builds: a Netlify serverless function with a verified-facts-only knowledge base, layered prompt-injection guardrails, structural daily cost caps, and provider fallback routing — shipped with a test suite. The portfolio site itself launched July 4, 2026 and shipped multiple releases within days.",
  },
];

/** Working style — evidence-based patterns, not adjectives. */
export const workingStyle: FaqFact[] = [
  {
    topic: "Gated automation, verified claims",
    fact: "Jon's standing pattern for agentic infrastructure work: read-only discovery, a hard confirmation gate, phased execution with manual diff approval, then a required proof step — up to and including a reboot test. Fixes get verified before they're called done: probe-verified context fixes, regression-checked tuning, backup dumps inspected before being trusted.",
  },
  {
    topic: "Structural guardrails over monitoring",
    fact: "A recurring preference across his projects: make the bad outcome impossible rather than detect it afterward — hard spend caps, a worst-case-ceiling billing invariant, mesh-network-only binds with no public ports.",
  },
  {
    topic: "AI-native, human-accountable",
    fact: "Jon runs a consistent plan → vet → implement pipeline: an AI plans, an agentic coder executes, and he operates the gates — vetting plans and diffs, making the architecture calls, and verifying outcomes himself. He also mentors a colleague into AI and agentic coding, beyond his bootcamp teaching.",
  },
  {
    topic: "Docs as source of truth",
    fact: "Configs live as files on disk per stack, every infrastructure build ends with a written record, and system state lives in versioned master docs with confidence markers — including honest records of his own system's weaknesses.",
  },
];

/** Deeper Q&A — honest answers to questions technical interviewers actually ask. */
export const deeperQA: FaqFact[] = [
  {
    topic: "Did he build these alone?",
    fact: "Engineering is Jon end-to-end. Jase is co-founder on Nitruz and owns design and brand — a deliberate complementary split. ResumeAye's document templates are likewise designer-owned.",
  },
  {
    topic: "Is Hermes his from scratch?",
    fact: "No — and the honest answer is stronger: Hermes is Nous Research's open-source hermes-agent framework. Jon's layer is everything that makes it production: the containerized architecture, profile system, model routing and fallback, context and config management, GPU-host tuning, security hardening, and ops.",
  },
  {
    topic: "How much of this did AI write?",
    fact: "Jon works AI-native and says so: a planning model plus an agentic coder, with him operating the gates — vetting plans and diffs, making the architecture decisions, and verifying outcomes. He treats fluency in that pipeline as part of the skill set he's selling.",
  },
  {
    topic: "Enterprise AI initiative at his day job",
    fact: "At Verint, Jon prototyped a documentation-grounded AI configuration assistant for the WebSDK configurator — a chat widget with MCP tool integrations that turns plain-language requirements into complete feedback configurations, custom code, and styling, compressing ~30-minute expert builds to under a minute. He deliberately built it as a zero-modification client-side prototype before seeking buy-in, then demoed it to a VP, his org's head of product, a lead sales rep, and the lead TAM.",
  },
];
