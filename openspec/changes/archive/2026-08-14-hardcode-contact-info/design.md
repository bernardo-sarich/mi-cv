## Context

See proposal.md - Why. `Contact.jsx` currently does `const { data } = useCVData(); if (!data) return null; const contactLinks = buildContactLinks(data.contact)`. `useCVData` fetches `GET /api/cv?lang=...` via `lib/api.js`, which on any failure falls back to `client/src/data/cv-data.json`. The API has no `contact` field; the mock JSON does (leftover from before the API existed). `buildContactLinks(contact)` expects `{ github, linkedin, email }` and is otherwise unaffected by this change.

## Goals / Non-Goals

**Goals:**
- Contact links come from a source with no dependency on the CV API/mock/hook.
- The source is keyed by language, so per-language contact copy is possible later even though today's values are identical across `es`/`en`.
- `cv-data.json` stops carrying data nothing reads.

**Non-Goals:**
- No change to `lib/api.js` / `useCVData.js` behavior for the rest of the CV content — already correct.
- No change to the contact *form* (validation, demo-submit behavior) — untouched, unrelated to this change.
- No loading/error UI for CV data — out of scope, not requested.

## Decisions

**New source is a plain JS module (`client/src/data/contact-info.js`), not a JSON file.**
Every other section already gets typed access to its content through JS (via `useCVData`); a `.js` module exporting a plain object keyed by language matches that shape and needs no import-assertion/JSON-loader ceremony beyond a normal ES import. Alternative considered: a `.json` file (matching `cv-data.json`) — rejected only because it invites confusion with the API-backed content file it's explicitly meant to be independent from; a `.js` module under the same `data/` directory reads unambiguously as "static, not API-backed."

**`Contact.jsx` drops `useCVData()` entirely and the `if (!data) return null` guard.**
Nothing else in the component depends on CV data. Keeping the guard would mean the form and contact links stay invisible while `/api/cv` is in flight, for no reason — the `contact-section` spec already requires the section to render fully offline; removing the dependency makes the implementation actually satisfy that requirement instead of only satisfying it by accident (mock fallback happening to include `contact`).

**Language selection uses `useLang()` from `AppContext`, matching every other section.**
Consistent with how `Nav`/`Footer`/section titles already resolve the current language; no new pattern introduced.

## Risks / Trade-offs

- **Two files now define "CV-adjacent" data** (`cv-data.json` for API-fallback content, `contact-info.js` for contact) → mitigated by the file naming and the spec change making the split an explicit, documented boundary rather than an implicit one.
- **Removing `contact` from `cv-data.json` is a breaking shape change for that file** → no consumer other than `lib/api.js`'s fallback path reads it (confirmed: no component imports the JSON directly per the `cv-data-layer` "No component reads the data file directly" requirement, which this change does not touch), so nothing else needs updating.
