## Purpose

Defines the Azure Static Web Apps hosting configuration for this site: how unmatched client-side routes are served, and which baseline security headers every response carries.

## Requirements

### Requirement: SPA routing fallback
The system SHALL serve `index.html` for any request path that does not match a static asset or an API route, so client-side routing works on direct navigation, refresh, and shared links.

#### Scenario: Direct navigation to a non-root path
- **WHEN** a browser requests a path that is not a static file in `dist/` and not under `/api/*`
- **THEN** Azure Static Web Apps returns `index.html` with a 200 status instead of a 404

#### Scenario: API and static asset requests are not rewritten
- **WHEN** a browser requests a path under `/api/*`, or a path matching a built static asset (JS, CSS, images, fonts) or a public file with an excluded extension (`svg`, `ico`, `png`, `jpg`, `jpeg`, `webp`, `txt`, `json`, `pdf`)
- **THEN** the request is served normally and is NOT rewritten to `index.html`

### Requirement: Baseline security response headers
The system SHALL attach a baseline set of security headers to every response served by Azure Static Web Apps.

#### Scenario: Any response from the deployed site
- **WHEN** a browser requests any path on the deployed site
- **THEN** the response includes `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Content-Security-Policy` permitting only this site's own origin plus the specific external resources the app actually loads
