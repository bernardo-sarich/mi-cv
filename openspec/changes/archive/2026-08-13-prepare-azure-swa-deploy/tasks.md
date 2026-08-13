## 1. Build & code audit

- [x] 1.1 Run `npm run build` in `client/` and confirm it completes with no errors or critical warnings
- [x] 1.2 Search `client/src` for leftover `console.log`/`console.debug`/`console.warn` debug statements and remove any found
- [x] 1.3 Search for hardcoded config values (API base URLs, keys) that should instead come from a `VITE_*` env var; confirm current state (none needed today) or fix any found

## 2. Azure Static Web Apps config

- [x] 2.1 Create `client/staticwebapp.config.json` with `navigationFallback` rewriting unmatched routes to `/index.html`, excluding `/api/*` and static asset paths
- [x] 2.2 Add baseline security response headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Content-Security-Policy`) scoped to the site's actual external resources (Google Fonts)

## 3. Verification

- [x] 3.1 Re-run `npm run build` after all changes and confirm it still completes cleanly
- [x] 3.2 Validate `client/staticwebapp.config.json` is well-formed JSON
