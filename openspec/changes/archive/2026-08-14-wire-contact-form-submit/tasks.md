## 1. Locale strings

- [x] 1.1 In `client/src/locales/es.json`, update `contact.formSent` to drop "(demo)" wording; add `contact.errorRateLimit`, `contact.errorGeneric`, `contact.formSending` (submit-button sending label).
- [x] 1.2 Mirror the same keys/values (in English) in `client/src/locales/en.json`.

## 2. Submit handler

- [x] 2.1 Add `status` state (`'idle' | 'sending'`) and a `generalError` state string to `Contact.jsx`.
- [x] 2.2 Replace the simulated `handleSubmit` body: after client-side validation passes, set `status` to `'sending'`, clear any previous `generalError`, and POST to `` `${import.meta.env.VITE_API_BASE_URL || '/api'}/contact` `` with JSON body `{ name, email, message }`.
- [x] 2.3 On `201`: clear the form, clear field errors, show the confirmation message (existing `sent` timer logic), reset `status` to `'idle'`.
- [x] 2.4 On `400`: parse the `ValidationProblemDetails.errors` body, map each present field key (`name`/`email`/`message`) to the corresponding localized error key per the design's fixed lookup, set them into `errors` state, keep form values, reset `status` to `'idle'`.
- [x] 2.5 On `429`: set `generalError` to `contact.errorRateLimit`, keep form values, reset `status` to `'idle'`.
- [x] 2.6 On any other non-OK response, a JSON-parse failure, or a thrown network error (catch block): set `generalError` to `contact.errorGeneric`, keep form values, reset `status` to `'idle'`.

## 3. Submit control and error UI

- [x] 3.1 Disable the submit `Button` and swap its label to `contact.formSending` while `status === 'sending'`.
- [x] 3.2 Render `generalError` near the submit button with the same red/error visual treatment as field errors (reuse `FieldError` or an equivalent styled element), and ensure it clears at the start of the next submit attempt (task 2.2).

## 4. Verification

- [x] 4.1 Run `npm run lint` from `client/`.
- [x] 4.2 Run `npm run build` from `client/`.
