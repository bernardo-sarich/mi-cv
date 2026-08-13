# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication rules

- **Write to the user in Spanish.** All prose — explanations, summaries, questions, task reports — goes in Spanish. Code, identifiers, commit messages, and the OpenSpec artifacts stay in the repo's own conventions (English for code, Spanish for user-visible site content).
- **The user's background is not frontend.** In `client/` — React, Tailwind, the JS tooling ecosystem, web conventions — do not assume familiarity: name the tool or concept before leaning on it, and prefer plain language over jargon. On backend work (`api/`, .NET, Azure Functions) he is comfortable; keep it brief there and skip the explanations.
- **Never ask the user to decide something without explaining the consequences of each option.** A question like "should I change this config?" is useless on its own — spell out what visibly changes, what breaks or doesn't, and which option you recommend and why. If the answer barely matters, don't ask: pick the sensible default and say what you picked.

## Tooling rules

- **Do not call Playwright / browser tools unless the user explicitly asks for it.** Verifying a change visually is not a reason to open a browser on your own — describe the change and let the user look.

## Repo shape

Azure Static Web Apps project with two independent builds, wired together by `swa-cli.config.json`:

- `client/` — Vite 8 + React 19 SPA (JSX only, no TypeScript). This is where nearly all work happens.
- `api/` — Azure Functions, .NET isolated worker on `net10.0`. Currently a single placeholder HTTP trigger (`ProfileFunction`) that returns a string; the `/api/cv` endpoint the client calls does not exist yet.
- `openspec/` — spec-driven planning artifacts (see below).

## Commands

```bash
# client (run from client/)
npm run dev            # Vite dev server; swa-cli expects it on 5173
npm run build          # production build to client/dist
npm run lint           # oxlint
npm run format         # prettier --write .  (format:check for CI-style check)

# api (run from api/)
dotnet build
dotnet publish -c Release

# full stack, from repo root (requires the SWA CLI)
swa start mi-cv
```

There is no test suite in either project — no test runner is configured, so "run the tests" has no target. `npm run lint` + `npm run build` is the available verification.

## Client architecture

**Composition.** `App.jsx` renders every section in a fixed order inside `AppProvider`. Section DOM ids (`sobre-mi`, `experience`, `stack`, `projects`, `contacto`) are a contract with `Nav.jsx`'s `SECTIONS` list and with `openspec/specs/site-layout` — renaming one means updating both.

**Theme and language** live in `context/AppContext.jsx` and are exposed only through `useTheme()` / `useLang()`. Theme toggles the `dark` class on `<html>`; language calls `i18n.changeLanguage`. Both default to dark/es and are not persisted.

**Colors are explicit token pairs, not Tailwind's palette.** `tailwind.config.js` defines flat tokens (`bg`, `surface`, `border`, `text`, `textDim`, `accent`, `accentDim`, `onAccent`, `navBg`) plus a `dark-` prefixed twin for each. Every themed element must spell out both: `bg-surface dark:bg-dark-surface`. Values are pinned in `openspec/specs/design-system/spec.md`.

**Tailwind v4 config is split**: `src/styles/tailwind.css` does `@import 'tailwindcss'` + `@config '../../tailwind.config.js'`, and also holds the `body` base styles and the keyframes/`animate-*` classes.

**Cascade-layer gotcha in `src/index.css`.** That file is leftover Vite-template CSS, imported *before* tailwind.css in `main.jsx`, and it is unlayered — Tailwind v4 emits everything inside `@layer`, and unlayered rules win over every layer regardless of specificity or order. A bare element selector there (there used to be an `h2` rule) silently overrides utility classes on that element. Do not add element selectors to it; prefer utility classes or a component in `components/ui/`. Its `:root` variables (`--accent: #aa3bff`, etc.) are dead template palette, unrelated to the site's green accent — never read theme colors from them.

**Data is still hardcoded.** `lib/api.js` fetches `${VITE_API_BASE_URL || '/api'}/cv` and silently falls back to `data/mock/cv-data.json`, and `hooks/useCVData.js` wraps it — but no section uses either yet. Each section owns its content as a module-level constant (`JOBS`, `CATEGORIES`, `PROJECTS`); `Nav` and `Footer` import the mock JSON directly for the owner's first name. Content edits go in the section components today.

**i18n is partial.** `locales/{es,en}.json` back `useTranslation()`; `Nav` and the section titles use `t()`, while section bodies are hardcoded Spanish. Adding a translated string means touching both locale files.

**Reusable UI** lives in `components/ui/` (`Button`, `Badge`, `Card`, `SectionLabel`, `SectionTitle`, toggles). They take `className` and spread `...rest`, and hold no business logic — extend a component there rather than re-styling one-off elements. Sections pair `SectionLabel` (the mono `<section id="...">` tag) with `SectionTitle` (the visible heading).

**Animation** is framer-motion plus two IntersectionObserver hooks: `useScrollReveal` (fires once, then disconnects — its first `key` argument is a debugging label only) and `useScrollProgress` (drives the Experience timeline rail height).

**`MatrixRain`** paints two canvases in the viewport gutters flanking the centered app column, and only above 1280px with reduced-motion off. It duplicates two values by design — the `#root` width from `index.css` and the accent hex from `tailwind.config.js` — with comments saying so; change them together.

## OpenSpec workflow

`openspec/specs/<capability>/spec.md` holds the living requirements; proposed work goes to `openspec/changes/<name>/` (proposal, design, specs delta, tasks) and lands in `openspec/changes/archive/` once applied. Use the `/opsx:*` skills for that flow — propose is planning-only and must not touch project code in the same turn. The generated `.claude/skills/openspec-*` and `.claude/commands/opsx/` directories are gitignored, as is `.playwright-mcp/`.

When a change alters behavior the specs describe (section structure, tokens, nav anchors, theme/i18n state), update the matching spec under `openspec/specs/` rather than leaving it stale.
