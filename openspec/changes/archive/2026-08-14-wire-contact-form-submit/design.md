## Context

`Contact.jsx` already has field-level `errors` state (`{name, email, message}`) driven by client-side `validateField`. The backend (`SubmitContactUseCase` + `ContactFunction`) validates independently and returns RFC7807 `application/problem+json`:
- `201` on success, empty body.
- `400` with `ValidationProblemDetails.errors: { [field: string]: string[] }` — keys are lowercase `name`/`email`/`message`.
- `429` with a generic `ProblemDetails` (no per-field info).
- `500` with a generic `ProblemDetails`.
- Network failure (fetch throws) has no response at all.

`lib/api.js` already establishes the base-URL pattern (`import.meta.env.VITE_API_BASE_URL || '/api'`) for calling the same-origin Functions API; the contact submit reuses it directly rather than introducing a second convention.

## Goals / Non-Goals

**Goals:**
- Make the submit button trigger a real request and reflect its three outcomes (success, field validation, general error) using the existing visual language (accent for success, red for errors).
- Keep the change local to `Contact.jsx` plus locale strings — no shared HTTP helper needed for a single call site.

**Non-Goals:**
- No retry/backoff logic.
- No new shared fetch wrapper in `lib/` — only `lib/api.js`'s `getCVData` exists there today and it's a GET with a silent-fallback shape that doesn't fit a POST-with-error-surfacing use case; duplicating the one-line base-URL pattern inline is simpler than generalizing prematurely.
- No changes to backend validation rules, rate-limit thresholds, or the honeypot (`Website`) field.

## Decisions

**Field-error mapping is a fixed lookup, not a pass-through of backend text.** The backend's messages ("Name is required.", "Email is not a valid email address.", etc.) are English and written for API consumers, not the site's bilingual visitors. `Contact.jsx` already owns `contact.errorRequired` / `contact.errorEmail` for client-side validation; server-mapped errors reuse those same keys when the backend key is present in the response (any error under `errors.name` → `errorRequired`, any error under `errors.email` → `errorEmail` unless empty in which case `errorRequired`, same for `message`). This keeps one error vocabulary regardless of whether client or server caught the problem. Since client-side validation already blocks empty/malformed submissions before a request is ever sent, hitting a 400 in practice means the two validators disagree at the margin (e.g. message-length minimums) — the mapping degrades gracefully to the closest existing string rather than needing a full 1:1 message catalog.

**429 and network/500 share one general-error slot**, not two. Both are non-actionable-by-field, transient, "try later" conditions from the visitor's perspective; splitting them into separate UI slots would add state without changing what the visitor should do. Rendered as a `contact.errorRateLimit` vs `contact.errorGeneric` string in the same position, selected by which case occurred.

**Sending state is local `status` state (`'idle' | 'sending'`)**, not a disabled-derived-from-promise pattern, so the submit button's label/disabled state is simple to reason about and reset on every new attempt.

**Field values are preserved on any error path** (validation, rate-limit, general) — only a successful `201` clears the form. This matches the existing client-side-invalid behavior (the form is never cleared on a blocked submission) and avoids visitors retyping a message after a transient failure.

## Risks / Trade-offs

- [Backend adds/renames a validation field key] → Low risk: only three fields exist server-side and client-side already enforces the same required/format rules first, so a backend-only mismatch would be rare and would fall back to the generic error via the "unrecognized key" path rather than silently dropping the error.
- [`fetch` throwing on network failure vs. a non-2xx response requires two different code paths] → Handled with a single try/catch around the fetch + response.ok check, both funneled into the same general-error branch.
