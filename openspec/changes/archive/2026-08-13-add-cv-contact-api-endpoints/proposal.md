## Why

The `Application`, `Domain`, and `Infrastructure` layers already implement CV retrieval and contact-message persistence, but nothing exposes them over HTTP: `Api` still only contains the placeholder `ProfileFunction`, and the client (`client/src/lib/api.js`) reads the local mock JSON directly. The backend and the client are built but not connected — this change closes that gap by adding the real use cases and HTTP endpoints, and pointing the client at them (with a safe fallback).

## What Changes

- Add `GetCvUseCase` and `SubmitContactUseCase` to `Application`, sitting between the Functions and the existing repository ports.
- Add an HTTP Function `GET /api/cv?lang=es|en` that invokes `GetCvUseCase` and returns the CV as JSON, defaulting to `es` when `lang` is missing or unrecognized.
- Add an HTTP Function `POST /api/contact` that deserializes the request body, invokes `SubmitContactUseCase` (name/email/message required, email format validated), and returns 201 on success.
- Remove the placeholder `ProfileFunction`.
- Add consistent `ProblemDetails` (RFC 7807) error responses across both Functions: 400 for validation failures, 500 for unexpected errors, with internal details logged via `ILogger` but never included in the response body.
- Restrict CORS on the Function app to a configurable allowed-origin setting (default: the site's `azurestaticapps.net` domain plus `localhost:5173` for local dev), instead of allowing all origins.
- Update `client/src/lib/api.js`'s `getCVData` to fetch `${VITE_API_BASE_URL || '/api'}/cv?lang=...` and fall back to the local mock JSON if the request fails, matching the fallback behavior already documented in `CLAUDE.md`.

Out of scope: wiring the client's contact form to `POST /api/contact` (the form is currently a client-only demo per `contact-section` spec, and reworking that is a separate, larger change), authentication/authorization, rate limiting, automated tests (no test runner is configured in this repo).

## Capabilities

### New Capabilities
- `cv-api`: The HTTP surface exposed by the `Api` project — `GET /api/cv`, `POST /api/contact`, their request/response contracts, RFC 7807 error handling, and CORS restriction.

### Modified Capabilities
- `cv-data-layer`: The content accessor (`getCVData`) changes from reading the local mock file directly to fetching the real API, falling back to the mock file only when the fetch fails.

## Impact

- **New code**: `api/Application/UseCases/GetCvUseCase.cs`, `api/Application/UseCases/SubmitContactUseCase.cs`, `api/Api/CvFunction.cs`, `api/Api/ContactFunction.cs`, error-handling middleware/helper in `api/Api`, CORS configuration in `api/Api/Program.cs` (and/or `api/Api/local.settings.json` for local dev).
- **Removed code**: `api/Api/ProfileFunction.cs`.
- **Modified code**: `client/src/lib/api.js` (real fetch + fallback), `api/Api/Program.cs` (CORS + error-handling registration).
- **No database migrations, no client contact-form changes, no new dependencies beyond what's already referenced.**
