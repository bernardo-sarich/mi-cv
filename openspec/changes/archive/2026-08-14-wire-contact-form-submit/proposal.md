## Why

The Contact section's form only simulates a submission today: `handleSubmit` clears the fields and shows a "(demo)" confirmation without ever calling the network, even though the backend already implements a working `POST /api/contact` endpoint (validation, rate limiting, and persistence). Visitors filling out the form believe their message was sent when nothing was recorded anywhere.

## What Changes

- Replace the simulated submit in `client/src/components/sections/Contact.jsx` with a real `fetch` to `${VITE_API_BASE_URL || '/api'}/contact` (POST, JSON body `{ name, email, message }`), following the same base-URL pattern already used in `lib/api.js`.
- On `201 Created`: keep today's visible behavior — clear the form and show a temporary confirmation message (~4s) — but drop the "(demo)" wording from `contact.formSent` in both locales, since the send is now real.
- On `400` (validation problem details from the backend): map the returned per-field errors onto the existing `errors.name` / `errors.email` / `errors.message` slots, using the site's own localized messages rather than the backend's raw English text.
- On `429` (rate limited): show a new general (non-field) error near the submit button.
- On network failure, `500`, or any other unexpected status: show a new general error near the submit button.
- While the request is in flight, disable the submit button and show a sending state.
- A general error clears on the next submit attempt.
- Update `openspec/specs/contact-section/spec.md` via delta: retire the "Demo submit feedback" requirement's "no network request" behavior in favor of a "Submit feedback" requirement describing the real POST and its success path, plus new requirements for server-side error handling (400/429/500/network) and the in-flight sending state.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `contact-section`: the submit flow now performs a real network request instead of a simulated demo; adds requirements for validation-error mapping, rate-limit/general error feedback, and an in-flight sending state.

## Impact

- `client/src/components/sections/Contact.jsx` — real submit handler, loading/error state.
- `client/src/locales/es.json`, `client/src/locales/en.json` — updated `contact.formSent`, new error strings.
- `openspec/specs/contact-section/spec.md` — delta updating "Demo submit feedback" and adding server-error/sending-state requirements.
- No backend changes — `api/Api/ContactFunction.cs` and `SubmitContactUseCase.cs` are consumed as-is.
