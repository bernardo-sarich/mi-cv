## Why

`GET /api/cv` (backed by the seeded Azure SQL database) already serves `bio`/`stats`/`experience`/`skills`/`projects` correctly — the client's data-fetching pipeline (`lib/api.js`, `useCVData`) was already wired up and works end-to-end, verified by a live call against the running Api. But the Contact section still reads its GitHub/LinkedIn/email links from `data.contact` on the same API/mock response, and the API has no `contact` field at all (confirmed: `CvResponseDto` and `Domain.CvContent` carry no contact data). Today this "works" only because `lib/api.js` silently falls back to the local `cv-data.json` mock on any fetch failure, and that mock still happens to carry a `contact` block — an accidental coupling that breaks the moment the API call succeeds (which it now does).

## What Changes

- Add a new, dedicated client-side data source for contact links (GitHub/LinkedIn/email), keyed by language, independent of `useCVData`/the API/the mock.
- `Contact.jsx` reads its links from this new source (via `useLang()`) instead of `data.contact`, and no longer calls `useCVData()` at all — the section now renders immediately, matching the existing `contact-section` spec's "renders fully offline, no network calls" requirement, which the current `useCVData`-gated implementation does not actually satisfy.
- Remove the now-dead `contact` field from `client/src/data/cv-data.json` (both locales), since nothing reads it anymore and keeping it would be a second, conflicting source of truth for the same data.
- No changes to `lib/api.js`, `useCVData.js`, or any other section — their existing API-fetch-with-mock-fallback behavior for `bio`/`stats`/`experience`/`skills`/`projects` is correct as-is and out of scope.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `contact-section`: the "Placeholder contact targets" requirement changes from "targets come from the CV content data layer" to "targets come from a dedicated, language-keyed, client-side contact info source that requires no CV data hook or network call."
- `cv-data-layer`: the "Bilingual content structure" requirement drops `contact` from the set of fields the CV content source/accessor is responsible for, since contact info is no longer part of that layer.

## Impact

- New file `client/src/data/contact-info.js` (or `.json` — implementation detail for design.md).
- `client/src/components/sections/Contact.jsx` (drop `useCVData`, read from new source via `useLang()`).
- `client/src/data/cv-data.json` (remove `contact` from both `es` and `en`).
- No backend changes — this only touches `client/`.
