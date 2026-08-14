## Why

`SubmitContactUseCase` currently only checks that `name`/`email`/`message` are non-blank and that `email` matches a syntactically-valid pattern — there are no length bounds, and the endpoint has no anti-abuse protection at all. `POST /api/contact` is a public, unauthenticated write endpoint; without length limits and basic anti-spam it is open to junk/oversized submissions and automated bot spam that would either bloat the database or need manual cleanup.

## What Changes

- Add length validation to `SubmitContactUseCase`: `name` max 200 chars, `email` max 320 chars (RFC 5321 practical limit), `message` min 10 / max 5000 chars — all on top of the existing non-blank + email-format checks.
- Add a honeypot field (`website`) to the contact request DTO. It is never rendered in the real form; if present with any content, the submission is silently accepted (`201 Created`) but **not** persisted, so bots that fill every field don't learn the honeypot exists.
- Add IP-based rate limiting for `POST /api/contact`, backed by a new database table (not in-memory — the Consumption plan is stateless/multi-instance, so per-instance memory doesn't give a correct global count). Configurable max attempts per IP within a sliding time window; requests over the limit get `429 Too Many Requests` as a Problem Details response.
- Document the honeypot vs. CAPTCHA vs. rate-limiting trade-off in `design.md`, explaining why CAPTCHA is rejected for now.
- Extend `openspec/specs/cv-api/spec.md`'s existing `POST /api/contact` requirement with the new length bounds, honeypot behavior, and the `429` rate-limit response.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `cv-api`: `POST /api/contact` requirement gains field length bounds, honeypot handling, and IP rate limiting with a `429` response.

## Impact

- `api/Application/UseCases/SubmitContactUseCase.cs`: length validation, honeypot short-circuit, rate-limit check before persisting.
- `api/Application/Ports/`: new `IContactAttemptStore` (or similar) port for recording/checking submission attempts per IP.
- `api/Infrastructure/`: EF Core implementation of the new port, new `ContactAttempt` entity/table + migration.
- `api/Api/ContactFunction.cs`: pass client IP to the use case; map a new rate-limit exception to `429`.
- `api/Api/Dtos/` (or wherever `SubmitContactRequest` lives): add honeypot field to the request DTO.
- `openspec/specs/cv-api/spec.md`: updated `POST /api/contact` requirement.
- Out of scope: wiring the client's contact form to the new honeypot field, CAPTCHA, authentication/authorization.
