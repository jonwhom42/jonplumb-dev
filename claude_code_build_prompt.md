# CLAUDE CODE BUILD PROMPT — jonplumb.dev (Portfolio v1)

You are building a production portfolio site for Jonathon (Jon) Plumb, an AI Solutions Engineer. Follow this spec exactly. Where judgment is required, optimize for: fast, honest, distinctive-but-restrained. The repo will be PUBLIC and read by hiring managers — code quality is itself a portfolio piece.

---

## 0. MISSION

Single-page portfolio whose job is to convert a recruiter/hiring-manager visit into "let's talk." The site should FEEL like a demo from a solutions engineer: fast, polished, a little clever, zero bloat. It is also the canonical link for the resume, LinkedIn, and GitHub.

**Positioning (use consistently):** builds software with LLMs since the GPT-3 era (~5 years); ships production generative-AI and agentic systems end to end; 4+ years customer-facing enterprise implementation experience.

**HARD RULES:**
- Do NOT invent metrics, user counts, testimonials, or claims not in this spec.
- v1 only. Do not build v1.5 features (§10) — leave clean seams.
- No UI kits (no shadcn/MUI/DaisyUI). No animation libraries. No WebGL/particles/scroll-jacking.
- One easter egg (the terminal). Not more.

---

## 1. STACK & SETUP

- Vite + React 18 + TypeScript (strict) + Tailwind CSS v3
- Single page, anchor-section navigation. No router.
- Fonts self-hosted via @fontsource: `@fontsource-variable/inter` (body/UI) and `@fontsource/jetbrains-mono` (400, 500) for accents/code. `font-display: swap`.
- Icons: lucide-react ONLY (tree-shaken imports).
- Deploy target: Netlify (config in §9). Node 20.
- Repo name: `jonplumb-dev`. Init git; conventional commits at each milestone (§11).

```
jonplumb-dev/
├── public/
│   ├── resume.pdf              # JON TODO — do not fabricate
│   ├── nitruz-demo.mp4         # JON TODO — component must handle absence gracefully
│   ├── og-image.png            # generate (§8.5)
│   └── favicon.svg             # simple "JP" monogram, amber on dark
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css               # tailwind + tokens + base styles
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── SelectedWork.tsx
│   │   ├── ProjectCard.tsx     # incl. expandable Decisions & Tradeoffs
│   │   ├── DemoVideo.tsx
│   │   ├── About.tsx
│   │   ├── ThePath.tsx
│   │   ├── Skills.tsx
│   │   ├── Uses.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   └── Terminal.tsx        # easter egg overlay
│   ├── data/
│   │   ├── site.ts             # links, email, currently-line
│   │   ├── projects.ts
│   │   ├── path.ts             # GitHub tiers + curated repos
│   │   ├── skills.ts
│   │   └── uses.ts
│   ├── hooks/
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useCopyToClipboard.ts
│   └── lib/terminalCommands.ts
├── index.html                  # full meta/OG block (§8.5)
├── netlify.toml
├── tailwind.config.ts
└── vite.config.ts
```

All copy/links live in `src/data/*` — components render data, never hardcode content.

---

## 2. DESIGN SYSTEM

Dark-only. Confident, technical, restrained. Amber accent is a quiet nod to Jon's product brand (Nitruz = amber-on-midnight) without merging identities.

**Tokens (Tailwind `theme.extend.colors`):**
```
bg:        #0A0C10   // page background
surface:   #12151C   // cards, terminal
surface2:  #171B24   // hover/raised
border:    #232936
text:      #E7EAF0   // primary
muted:     #98A2B3   // secondary
amber:     #FBBF24   // accent (amber-400)
amberDim:  #B45309   // accent borders/subtle
```

**Type:** Inter Variable body; JetBrains Mono for: eyebrow labels, section numbers, stack tags, terminal, keyboard hints. Scale: hero name `clamp(2.5rem,6vw,4.5rem)` bold tight; section titles ~1.5rem semibold with mono amber index prefix (`01 /`, `02 /`); body 1rem/1.7 muted; tags 0.75rem mono.

**Layout:** max-w-[72rem] centered, px-6 mobile / px-8 desktop. Section vertical padding py-24 desktop / py-16 mobile. Generous whitespace — do not compress.

**Motion:** CSS-only. 150–250ms opacity/transform transitions; single IntersectionObserver for fade-up-on-first-view (8px translate). `prefers-reduced-motion: reduce` disables ALL transitions/smooth-scroll (media query + conditional observer).

**Focus:** visible 2px amber outline w/ offset on all interactives. Never `outline: none` without replacement.

---

## 3. NAV

Sticky top, backdrop-blur over bg/80, bottom hairline border. Left: `jp` mono monogram (scrolls to top). Right: anchor links Work · About · Path · Skills · Uses · Contact + amber-outlined "Resume" button → `/resume.pdf` (new tab). Mobile: links collapse into a minimal disclosure menu (no lib). Active section highlighted via the shared IntersectionObserver.

---

## 4. SECTIONS & COPY (verbatim unless noted)

### 4.1 HERO (`#top`)
- Eyebrow (mono, muted): `Detroit, MI — AI Solutions / Forward-Deployed Engineering`
- H1: `Jonathon Plumb`
- H2 (amber): `AI Solutions Engineer`
- Lede: `I've been building software with LLMs since the GPT-3 era. Now I design, build, and ship production generative-AI and agentic systems end to end — from LLM application architecture to self-hosted multi-agent infrastructure.`
- CTAs: [Resume ↗] primary amber · [GitHub] · [LinkedIn] ghost buttons · [Copy email] (§8.3)
- Currently line (mono, small, amber `▸` prefix): `Currently: running Hermes, a self-hosted multi-agent platform, and preparing Nitruz for launch.`
- Footer hint (subtle, mono): `press ~ for terminal · r resume · g github`

### 4.2 SELECTED WORK (`#work`) — `01 / Selected Work`
Three stacked full-width project cards (surface bg, border, hover raise). Card: name + status chip · one-liner · description · mono stack tags · links · expandable **Decisions & Tradeoffs** (`<details>` styled, amber marker) · Nitruz card also renders `<DemoVideo/>`.

**Status chips (exact):** Nitruz `● Live — pre-launch` (amber dot) · ResumeAye `● Live` (green dot #4ADE80) · Hermes `● Running — self-hosted` (blue dot #60A5FA).

**NITRUZ** — nitruz.com
One-liner: `AI vehicle photography SaaS for auto dealerships.`
Desc: `A production SaaS that turns raw dealership vehicle photos into studio-quality marketing assets using generative image models. Full stack owned end to end: generation pipeline, credit-based billing with cost reconciliation, submission lifecycle, and a mobile-first before/after experience. Live and production-deployed; go-to-market deliberately begins after trademark clearance.`
Tags: `React · TypeScript · Vite · Firebase · Cloud Run · Stripe · Gemini`
Decisions & Tradeoffs:
- `Credit-based billing over per-image pricing — generation costs vary per job; credits decouple customer pricing from provider costs and keep worst-case margins predictable.`
- `Static fallback pricing — checkout still renders if the live Stripe fetch fails. A billing page that can't fail-soft is a conversion leak.`
- `Mobile-first before/after slider — dealership users shoot on phones on the lot; the proof moment has to work one-handed in sunlight.`

**RESUMEAYE** — resume-aye.onrender.com
One-liner: `Freemium AI resume-tailoring SaaS.`
Desc: `Tailors a resume to a specific job description using the Gemini API, scores ATS-compliance match, and exports a real .docx. Freemium with a $12/mo Pro tier.`
Tags: `React 18 · TypeScript · Vite · Tailwind · Firebase Auth · Firestore · docxtemplater · Gemini`
Decisions & Tradeoffs:
- `Security rules as the API contract — freemium means untrusted clients; Firestore rules carry authorization, verified by 22 passing emulator tests.`
- `Template-based .docx over HTML-to-PDF — recruiters and ATS systems want real Word files, not print stylesheets.`
- `Gemini Flash for the tailoring loop — high-volume, low-margin work favors a fast cheap model with tight structured prompts over a premium model.`
Link button: `Launch demo ↗` + microcopy: `free-tier host — give it ~30s to wake up ☕`

**HERMES** — no public link
One-liner: `Self-hosted multi-agent platform.`
Desc: `A containerized multi-agent system routing LLM calls across cloud and local models with tool calling and Model Context Protocol integrations. Default brain runs on Claude, technical and creative execution delegates to Claude Code, and when cloud limits hit, routing falls back to local models on a dedicated Ollama GPU host. Runs on a hardened Ubuntu homelab: Docker with GPU-in-container inference, Tailscale mesh networking, Caddy reverse proxy, automated 3-2-1 backups.`
Tags: `Agents · MCP · Claude · Claude Code · Ollama · Docker · Tailscale · Caddy · Ubuntu Server`
Decisions & Tradeoffs:
- `Local-first fallback — a separate Ollama GPU box means agents degrade gracefully at cloud limits, and spend has a structural cap instead of a monitoring alert.`
- `Routing by task type — one default brain, with technical/creative execution delegated to the tool best at it, beats one model doing everything.`
- `Tailscale-only binding — no public ports anywhere; the mesh is the perimeter.`
- `Boring reliability on purpose — systemd boot ordering, compose dependency edges, and 3-2-1 backups, because agents are only useful if the substrate survives a reboot.`
Footer note (muted): `Self-hosted infrastructure — architecture writeup over repo link. Ask me about it.`

### 4.3 ABOUT (`#about`) — `02 / About`
Two short paragraphs + cert card:
P1: `I split my time between two worlds. By day, I've spent 4+ years at Verint building custom Voice-of-Customer solutions for enterprise clients — scoping requirements directly with customers, implementing against real-world constraints, and owning deployments end to end. By night (and most weekends), I run Particalmist LLC, where I've shipped two live AI SaaS products and a self-hosted multi-agent platform.`
P2: `That combination is the point. AI solutions work isn't just building — it's sitting across the table from a customer, understanding the actual problem, and shipping something that survives contact with production. I've been doing the customer half for years and building with LLMs since GPT-3 could barely hold one file in context. Watching that boundary move — from single-file autocomplete to agentic systems — is the throughline of everything below.`
Cert card (surface, amber left-border): `University of Michigan — Applied Generative AI Specialization (2026)` / muted: `LLM application development · Agentic AI frameworks with Model Context & Tooling Protocols · Model architecture · AI governance · Image generation`

### 4.4 THE PATH (`#path`) — `03 / The Path`
Intro: `I didn't arrive here. Each account below is a chapter — open any of them, sort oldest-first, and you'll watch me figure this out in real time.`
Vertical timeline (amber line, mono year markers), three tiers → GitHub profile links + 1–2 curated repo links each:
1. **Front-end beginnings** — github.com/jplum89 — `Where it started: HTML, CSS, JavaScript, and learning what version control even was. The Grand Circus front-end era.`
2. **Back-end & full-stack** — github.com/jonplumb89 — `Leveling up: C#/.NET, Node, real project structure — the jump from exercises to software.`
3. **Building with AI** — github.com/jonwhom42 — `Current work: Nitruz, ResumeAye, Hermes. Production AI and agentic systems.`

**BUILD-TIME TASK:** Fetch public repos for all three accounts (`https://api.github.com/users/<user>/repos?sort=created&direction=asc&per_page=100`, unauthenticated is fine at build time). (a) VERIFY the front-end/back-end mapping above by inspecting repo languages — if jplum89/jonplumb89 are swapped, swap the tiers and note it in the summary. (b) Curate 1–2 representative repos per tier (earliest meaningful ones for tiers 1–2; strongest for tier 3), hardcode into `data/path.ts` with `// curated <date>` comment. Static data — NO runtime GitHub calls. (c) If an account 404s or is empty, render that tier without repo links and flag it in the summary.

### 4.5 SKILLS (`#skills`) — `04 / Skills`
Grouped rows: amber mono label + comma-separated muted values (subtle tag pills ok; no proficiency bars ever).
- `AI & LLM` — LLM application development · agentic & multi-agent orchestration · Model Context Protocol (MCP) & tool calling · Claude Code & agentic coding · RAG · prompt engineering & context management · local inference (Ollama, quantized models) · Gemini API · Anthropic / Claude API
- `Languages` — TypeScript · JavaScript · Python · C# · SQL · Bash
- `Frontend` — React · Angular · Vite · Tailwind CSS · Streamlit · Gradio · Chrome extensions
- `Backend & Data` — Node.js · Express · REST APIs · Firebase / Firestore · Stripe · MongoDB · Supabase / PostgreSQL · pandas / NumPy
- `Cloud & Infra` — Docker & Compose · GCP (Firebase) · Linux server hardening · Tailscale · Caddy · systemd · NVIDIA / CUDA · Git

### 4.6 USES (`#uses`) — `05 / Uses`
Intro: `The dev-tools-and-hardware rundown, /uses-style. The lab is real and it's load-bearing.`
- `Daily driver` — Windows 11 laptop · RTX 4050 · 64GB DDR5 · WSL2
- `Model host` — dedicated RTX 4070 box running Ollama for local inference
- `The garage lab` — Ubuntu Server 24.04 on an RTX 2080 Super: Docker stack (Postgres, Redis, MinIO, MongoDB, ChromaDB, n8n), Tailscale mesh, Caddy, Kopia 3-2-1 backups
- `Tools` — VS Code · Claude Code · Wispr Flow (voice-to-text) · GitHub

### 4.7 CONTACT (`#contact`) — `06 / Contact`
Line: `The fastest way to see if I'm a fit: send a role, I'll send back how I'd approach it.`
Buttons: [Email me] mailto primary · [Copy email] · [LinkedIn ↗] · [Resume ↗]

### 4.8 FOOTER
Left: `© 2026 Jonathon Plumb · Detroit, MI`. Right (mono, muted): `Built with Vite + React + TypeScript + Tailwind · deployed on Netlify · yes, it's fast on purpose` + keyboard hints `~ terminal · r resume · g github`.

---

## 5. DATA (`src/data/site.ts`)
```ts
export const site = {
  name: "Jonathon Plumb",
  title: "AI Solutions Engineer",
  email: "jon.plumb89@outlook.com",
  location: "Detroit, MI",
  github: "https://github.com/jonwhom42",
  linkedin: "https://linkedin.com/in/jonathon-plumb-892229188",
  resume: "/resume.pdf",
  nitruz: "https://nitruz.com",
  resumeaye: "https://resume-aye.onrender.com/",
  currently: "Running Hermes, a self-hosted multi-agent platform, and preparing Nitruz for launch.",
};
```

---

## 6. TERMINAL EASTER EGG (`Terminal.tsx`)
- Open on `~` (when no input/textarea focused and terminal closed). Close: `Esc`, `exit`, or backdrop click.
- Fixed overlay, centered surface panel (max-w-2xl), mono, amber prompt `jon@plumb.dev:~$`, subtle scanline/border glow — restrained.
- Focus trap while open; restore focus on close; `role="dialog"` `aria-label="terminal"`. History with ↑/↓.
- Commands (`lib/terminalCommands.ts`): `help` (list) · `about` (2-line bio) · `projects` (three one-liners + urls) · `stack` (skills summary) · `path` (3 accounts chronological) · `resume` (opens /resume.pdf: `opening resume.pdf…`) · `hire` (`good instinct. → jon.plumb89@outlook.com — or just ask me how I'd approach your problem.`) · `cats` (`chuck, larry, and fluffy are asleep on the servers. uptime is their doing. 🐈🐈🐈`) · `whoami` (`recruiter, probably. hi. type 'projects'.`) · `clear` · `exit` · unknown → `command not found: <x> — try 'help'`.

## 7. KEYBOARD SHORTCUTS (`useKeyboardShortcuts.ts`)
Global keydown, ONLY when no input/textarea/contenteditable focused and terminal closed: `r` → open /resume.pdf (new tab) · `g` → open GitHub · `e` → copy email (§8.3 toast) · `~` → terminal. No preventDefault on unhandled keys; no modifier-key hijacking.

## 8. MICRO-FEATURES
**8.1 DemoVideo.tsx** — `<video>` `/nitruz-demo.mp4`, preload="none", controls, muted, playsInline, poster (dark frame w/ amber play affordance). onError/absence → collapse to: `▸ Live demo available on request — or just try nitruz.com`. Never a broken player.
**8.2 Smooth scroll** — CSS `scroll-behavior: smooth` + `scroll-margin-top` on sections; disabled under reduced-motion.
**8.3 Copy email** — clipboard API; button flips to `copied ✓` (amber) 2s; `aria-live="polite"` announce; fallback selects a hidden input on API failure.
**8.4 A11y** — semantic landmarks (`header/main/section/footer`), skip-to-content link, single h1, ordered headings, alt text, AA contrast (verify amber-on-dark for small text; use text color not amber for small muted copy), full keyboard operability.
**8.5 SEO/OG (index.html)** — `<title>Jonathon Plumb — AI Solutions Engineer</title>`; description: `AI Solutions Engineer in Detroit. Building production generative-AI and agentic systems — LLM apps, multi-agent infrastructure, and live SaaS products.`; canonical `https://jonplumb.dev/`; full OG + twitter summary_large_image tags; theme-color `#0A0C10`. Generate `og-image.png` 1200×630 (script or manual): bg #0A0C10, `JONATHON PLUMB` in Inter bold white, `AI Solutions Engineer` in amber, `jonplumb.dev` mono muted bottom-left, thin amber rule. JSON-LD `Person` schema (name, jobTitle, url, sameAs: github + linkedin).

---

## 9. NETLIFY (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```
No redirects needed (no router). Domain jonplumb.dev connected manually by Jon after deploy.

---

## 10. v1.5 SEAMS — DO NOT BUILD
Note in README under "Roadmap"; leave architecture compatible:
1. **Ask My Portfolio** — chat widget grounded in resume/site content via Netlify Function + Gemini Flash; hard daily request cap (structural, not monitored); prompt-injection guardrails; scoped strictly to "questions about Jon." (Key would live in Netlify env — never client.)
2. **Hermes interactive architecture diagram** — hover/click-annotated routing diagram replacing/augmenting the Hermes card.
Keep `netlify/functions/` path convention in mind; no code now.

---

## 11. PROCESS (for you, Claude Code)
1. Scaffold (Vite react-ts, Tailwind, fonts, tokens) → commit `chore: scaffold`
2. Data files with all §4/§5 content → commit `feat: content data`
3. Layout + Nav + Hero → commit
4. Sections (Work incl. details + video, About, Path w/ build-time GitHub curation, Skills, Uses, Contact, Footer) → commits per logical unit
5. Terminal + shortcuts + copy-email → commit `feat: terminal & shortcuts`
6. Meta/OG/JSON-LD/favicon/og-image → commit `feat: seo`
7. QA pass (§12), fix, `npm run build` clean, `tsc --noEmit` clean → commit `chore: qa`
8. README: what this is, stack, `npm i && npm run dev`, deploy notes, Roadmap (v1.5), JON TODO list (§13)
9. Final summary to Jon: what was built, GitHub-mapping verification result, curated repo list, anything flagged.

## 12. DEFINITION OF DONE
- [ ] `npm run build` + `tsc --noEmit` pass clean; zero console errors/warnings
- [ ] Lighthouse (mobile, prod build): Performance ≥95 · A11y ≥95 · Best Practices ≥95 · SEO ≥95
- [ ] JS bundle < 150KB gzipped; fonts self-hosted; video preload none
- [ ] Responsive 360px–1440px, no horizontal scroll, nav collapse works
- [ ] Full keyboard operability; visible focus everywhere; reduced-motion respected
- [ ] Terminal: all commands, history, focus trap, Esc; shortcuts don't fire while typing
- [ ] All external links correct + `rel="noopener noreferrer"`; resume/video absence handled gracefully
- [ ] The Path renders curated repos; mapping verified or flagged
- [ ] OG tags complete; og-image generated; JSON-LD valid

## 13. JON TODO (put in README)
- [ ] Export resume PDF → `public/resume.pdf`
- [ ] Record 45–60s Nitruz demo (raw photo → generated → before/after) → `public/nitruz-demo.mp4`
- [ ] Verify The Path account mapping + curated repos look right; tidy/pin repos on jonwhom42
- [ ] Push to GitHub (jonwhom42), connect Netlify, buy/point jonplumb.dev DNS
- [ ] After launch: add jonplumb.dev to resume header + LinkedIn, re-export resume PDF
