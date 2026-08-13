## Context

See `proposal.md` - Why. Azure Static Web Apps reads a single `staticwebapp.config.json` at the app root (per `swa-cli.config.json`, `appLocation` is `client`, so Azure looks for it at `client/staticwebapp.config.json` — not the repo root) to configure routing and response headers for the built `dist/` output. The site is a pure client-side SPA (React Router is not in use; sections are anchor-scrolled, not routed) plus a separate `api/` Azure Functions app mounted at `/api`.

## Goals / Non-Goals

**Goals:**
- Any path Azure's static host would otherwise 404 on falls back to `index.html`.
- Baseline security headers on every response, scoped to what this site actually loads (Google Fonts, self-hosted everything else).

**Non-Goals:**
- No auth/roles config (`staticwebapp.config.json` `routes`/`roles`) — the site has no protected routes.
- No changes to `api/` routing or the placeholder `ProfileFunction`.

## Decisions

- **Config file location: `client/staticwebapp.config.json`, not the repo root.** Azure SWA resolves this file relative to `appLocation`, which `swa-cli.config.json` sets to `client`. A copy at the repo root would silently be ignored by both the SWA CLI and the Azure build. (The original request said "raíz del repo" — corrected here to match how `appLocation` actually resolves; noted in the final summary rather than as an open question, since this is a factual correction, not a scope choice.)
- **`navigationFallback.exclude`: exclude `/api/*` and static asset extensions, not just a hardcoded asset list.** Use `navigationFallback.rewrite: "/index.html"` with `exclude: ["/api/*", "/assets/*", "/*.{svg,ico,png,jpg,jpeg,webp,txt,json}"]` so any current or future static file under `dist/` (including the Vite-hashed `assets/` bundle and `favicon.svg`) is served as-is instead of being rewritten.
- **CSP scoped to actual external resources, not a wildcard.** `index.html` loads Google Fonts stylesheet from `fonts.googleapis.com` and the font files from `fonts.gstatic.com`; nothing else is external (no analytics, no CDN scripts, no third-party embeds). `connect-src 'self'` is safe because `lib/api.js` currently reads bundled JSON directly — no `fetch` calls exist yet. Framer Motion sets styles via the CSSOM (`element.style.x = ...`), which CSP's `style-src` does not gate, so `'unsafe-inline'` is not needed for style-src.
- **`X-Frame-Options: DENY` kept alongside `frame-ancestors 'none'`** for defense in depth on browsers that ignore CSP but honor the legacy header.

## Risks / Trade-offs

- [CSP is scoped tightly to today's external resources] → If a future change adds a new external resource (an analytics script, a font CDN, an image host), it will be silently blocked until `staticwebapp.config.json` is updated. Mitigation: this is caught immediately in the browser console during local `swa start` / preview, not a silent production failure.
- [`connect-src 'self'`] → The moment `lib/api.js` starts calling `/api/cv` for real (per the existing TODO in CLAUDE.md), same-origin `/api/*` calls still work under `'self'`; no header change needed for that specific case.
