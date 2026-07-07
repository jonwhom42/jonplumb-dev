# jonplumb.dev

Personal portfolio for **Jonathon Plumb — AI Solutions Engineer** ([jonplumb.dev](https://jonplumb.dev)).

A single-page site whose job is to turn a recruiter/hiring-manager visit into "let's talk." Fast, dark, restrained, and honest — the repo is public on purpose, so the code is part of the pitch.

## Stack

- **Vite 6 + React 18 + TypeScript** (strict)
- **Tailwind CSS v3** — design tokens only, no UI kit
- **Self-hosted fonts** via `@fontsource` (Inter Variable + JetBrains Mono), `font-display: swap`
- **lucide-react** icons (tree-shaken)
- No router (anchor-section navigation), no animation library, no WebGL
- Deployed on **Netlify**

All copy and links live in [`src/data/`](src/data/) — components render data, never hardcode content.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # tsc --noEmit + vite build -> dist/
npm run preview    # serve the production build locally
npm run typecheck  # tsc --noEmit
```

Requires **Node 20+** (`.nvmrc` pins 20; Netlify build uses it).

## Highlights

- **Hermes Concierge** — a recruiter-facing chat widget (amber launcher, bottom-right) that answers questions about Jon from a verified knowledge base — and **paste a job description and it maps Jon's experience against the requirements point by point**. It's a live demo of the skill set: a Netlify Function routes to **Gemini Flash** (free tier) with an optional **Claude Haiku fallback** relay — the same primary-with-fallback pattern as Hermes, surfaced in the UI's provider footer. Structural cost fences (Netlify Blobs daily counters: global / per-IP / fallback budget), layered prompt-injection defenses, whitelisted deep-link rendering, lazy-loaded panel (~3KB gz, main bundle untouched). Also reachable via `ask <question>` in the terminal. See [Concierge setup](#hermes-concierge-setup).
- **Terminal easter egg** — press `` ~ `` anywhere. `help` lists commands (`about`, `projects`, `stack`, `path`, `ask`, `resume`, `hire`, `whoami`, …). Focus-trapped, `↑`/`↓` history, `Esc`/`exit`/backdrop to close.
- **Keyboard shortcuts** — `r` resume · `g` GitHub · `e` copy email · `` ~ `` terminal (only when not typing).
- **The Path** — a chronological timeline across three GitHub accounts with build-time-curated repos (see below).
- **Accessibility & performance** — semantic landmarks, skip link, visible focus, `prefers-reduced-motion` honored, single shared IntersectionObserver for reveals + active-nav. Lighthouse (mobile, prod): A11y / Best Practices / SEO **100**; LCP ~250ms, CLS 0. JS bundle **~57KB gzipped**.

## The Path — GitHub curation

The three accounts and their curated repos are static data in [`src/data/path.ts`](src/data/path.ts) (no runtime GitHub calls). The account→tier mapping was **verified against the GitHub API** by inspecting repo languages and dates:

| Tier | Account | Verified as |
|------|---------|-------------|
| 2019 · Front-end beginnings | [jplum89](https://github.com/jplum89) | HTML/CSS/JS → Angular ✓ |
| 2021 · Back-end & full-stack | [jonplumb89](https://github.com/jonplumb89) | C#/.NET → full-stack ✓ |
| 2026 · Building with AI | [jonwhom42](https://github.com/jonwhom42) | TS/Python/Shell AI work ✓ |

> Note: the flagship projects (Nitruz, ResumeAye, The Lab) are **not** public repos on `jonwhom42` — they're private or self-hosted, and each has a full card in **Selected Work**. Tier 3 therefore links the strongest *public* AI repos instead. See the JON TODO below.

## Hermes Concierge setup

The widget's backend is one Netlify Function (`netlify/functions/chat.mts`, served at `/api/chat`):

| Env var | Required? | Where to get it |
|---|---|---|
| `GEMINI_API_KEY` | **Yes** — primary provider | [Google AI Studio](https://aistudio.google.com/apikey) (free tier) |
| `ANTHROPIC_API_KEY` | Optional — Claude Haiku fallback relay | [console.anthropic.com](https://console.anthropic.com) — set a low spend limit as a second fence |

Set them in **Netlify → Site settings → Environment variables** (never `VITE_`-prefixed — they must stay server-side). Without the Anthropic key the widget runs Gemini-only and degrades gracefully on Gemini outages. Optional cap overrides and mock mode are documented in [`.env.example`](.env.example).

**Cost ceiling is structural, not monitored**: 300 messages/day global, 40/day per hashed IP (corporate NATs share IPs), at most 200 Claude fallback calls/day, 1,024-token replies, 6,000-char inputs (full job descriptions fit), last-12-messages context window. On the Gemini free tier the normal path is **$0/day**; the Claude fallback worst case is a few dollars/day at the absolute ceiling — and $0 if no key is configured.

**Observability**: Q&A pairs are logged (truncated, no IPs) to Netlify Blobs, one blob per UTC day — read with `netlify blobs:get concierge-logs log:YYYY-MM-DD`. `GET /api/chat` is a zero-cost health endpoint; a scheduled GitHub Action probes it every 6 hours and GitHub emails on failure. The Gemini model is env-selectable via `GEMINI_MODEL` (default `gemini-flash-latest`); rate-limit (429) responses get one automatic retry.

Local dev: `npm run dev:netlify` (wraps Vite + serves the function; runs `--offline` so env comes from your local `.env`, sidestepping the Netlify CLI substituting a session JWT for site-stored keys). With no keys in `.env`, the function answers in **mock mode** — full UI development with zero spend. Rate-limit counters fail open when Blobs isn't available locally; they're covered by unit tests. Tests: `npm test` (vitest — knowledge serialization, prompt guardrails, request validation, rate-limit logic, handler smoke tests).

## Deploy (Netlify)

[`netlify.toml`](netlify.toml) sets `npm run build` → `dist`, Node 20, security headers, and immutable caching for hashed assets. No redirects (single page, no router).

1. Push to GitHub (`jonwhom42`).
2. Netlify → New site from Git → pick the repo (config is auto-detected).
3. Add the `jonplumb.dev` custom domain and point DNS.

## Roadmap

1. ~~**Hermes Concierge** — scoped, serverless recruiter-facing chat widget~~ ✅ **Shipped** — Gemini primary + optional Claude fallback, structural daily caps, injection guardrails. See [Hermes Concierge setup](#hermes-concierge-setup).
2. **Lab interactive architecture diagram** — a hover/click-annotated routing diagram augmenting The Lab card.
3. **Product demo video (Nitruz before/after)** — future.

## JON TODO

> ⚠ **Before sharing the live URL:** `public/resume.pdf` must exist. ✅ It is now in place (verified: serves as `application/pdf` and its header carries the `jonplumb.dev` link). The `prebuild` step (`npm run check-assets`) still warns loudly if it goes missing.
>
> **Domain note:** if the final domain ever differs from `jonplumb.dev`, the resume header must be regenerated to match.

- [x] Export resume PDF → `public/resume.pdf` *(in place; components still handle its absence gracefully)*
- [ ] Verify The Path account mapping + curated repos look right; tidy/pin repos on `jonwhom42`
- [x] Push to GitHub → [jonwhom42/jonplumb-dev](https://github.com/jonwhom42/jonplumb-dev); connected to Netlify with continuous deploys — live at [jonplumb-dev.netlify.app](https://jonplumb-dev.netlify.app)
- [ ] Buy/point `jonplumb.dev` DNS (Netlify → Domain management); site meta/OG/sitemap already assume it
- [ ] After launch: add `jonplumb.dev` to resume header + LinkedIn, re-export resume PDF
- [ ] **Concierge key**: create a free Gemini API key (AI Studio) and add `GEMINI_API_KEY` in Netlify env vars — until then the widget answers in mock mode on non-production deploys and degrades gracefully in production. Optionally add `ANTHROPIC_API_KEY` later for the Claude fallback relay.

---

Built with Vite + React + TypeScript + Tailwind. Yes, it's fast on purpose.
