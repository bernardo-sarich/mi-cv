## Why

The site is about to be connected to Azure Static Web Apps for the first time. Without a `staticwebapp.config.json`, direct navigation or a refresh on any client-side route (e.g. `/#stack` deep links aside, any future non-root path) returns a 404 from Azure's static host instead of the SPA shell, and the response carries none of the baseline security headers a production site should send. The project also needs a final audit pass — clean production build, no leftover debug code, no hardcoded config that should be an env var — before the user points Azure at the repo.

## What Changes

- Add `staticwebapp.config.json` at the repo root: SPA fallback (`navigationFallback` to `index.html`, excluding static assets and the future `/api/*` routes) and a baseline set of security response headers.
- Audit pass (no behavior change expected, verification only):
  - Confirm `npm run build` (from `client/`) completes with no errors or critical warnings.
  - Confirm there is no leftover `console.log`/debug code in `client/src`.
  - Confirm there are no hardcoded values that should instead come from an env var (`VITE_*` + `.env`), or that none are currently needed.

## Capabilities

### New Capabilities
- `deployment-config`: Azure Static Web Apps hosting configuration — SPA routing fallback and baseline security headers, defined in `staticwebapp.config.json`.

### Modified Capabilities
<!-- none: the audit pass (build/lint/console.log/env var review) is verification, not a behavior change -->

## Impact

- New file: `staticwebapp.config.json` (repo root).
- No application code changes are expected from the audit pass; `client/src` will only be touched if the audit actually finds a leftover `console.log` or a hardcoded value that should be an env var.
- No impact on `api/` — the placeholder Azure Function is unaffected; the SPA fallback config explicitly excludes `/api/*`.
