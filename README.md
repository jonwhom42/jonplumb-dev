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

- **Terminal easter egg** — press `` ~ `` anywhere. `help` lists commands (`about`, `projects`, `stack`, `path`, `resume`, `hire`, `whoami`, …). Focus-trapped, `↑`/`↓` history, `Esc`/`exit`/backdrop to close.
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

## Deploy (Netlify)

[`netlify.toml`](netlify.toml) sets `npm run build` → `dist`, Node 20, security headers, and immutable caching for hashed assets. No redirects (single page, no router).

1. Push to GitHub (`jonwhom42`).
2. Netlify → New site from Git → pick the repo (config is auto-detected).
3. Add the `jonplumb.dev` custom domain and point DNS.

## Roadmap (v1.5 — not built)

Architecture leaves clean seams for these; none are implemented in v1:

1. **Hermes Concierge** — scoped, serverless recruiter-facing chat widget (Netlify Function + Gemini, markdown context library, hard daily cap). Next phase.
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

---

Built with Vite + React + TypeScript + Tailwind. Yes, it's fast on purpose.
