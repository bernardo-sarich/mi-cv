## Why

All CV content is hardcoded as module-level constants inside five section components, duplicated in two languages nowhere but inline JSX. There is no single place to edit content, and no seam through which a future real `/api` backend can supply it. An unused data-layer skeleton (`fetchCVData`, `useCVData`, a mock JSON) already exists but nothing consumes it and its shape doesn't match what the sections need. This change centralizes all person-specific bilingual content into one JSON file and one hook, so every section renders from data instead of inline constants, and swapping in a real API later requires no change to component code.

## What Changes

- Replace `client/src/data/mock/cv-data.json` with `client/src/data/cv-data.json`, holding a single `{ es: {...}, en: {...} }` object with `bio`, `stats`, `experience`, `skills`, `projects`, and `contact`, extended to also cover the Hero fields the current mock omits (`name`, `title`/role badge, CV download link).
- **BREAKING**: Replace `fetchCVData()` in `client/src/lib/api.js` with `getCVData(lang)`, which reads the local JSON and returns only that language's slice — no network fetch attempt for now, written so a `fetch('/api/cv')` call can be dropped in later without changing the function's signature or return shape.
- **BREAKING**: Rename `useCVData()`'s returned `isLoading` field to `loading`, matching `{ data, loading, error }`.
- Refactor `Hero`, `Experience`, `Skills`, `Projects`, and `Contact` to read all person-specific content through `useCVData()` instead of local constants (`STATS`, `JOBS`, `CATEGORIES`, `PROJECTS`, `CONTACT_LINKS`). None of these components may import `cv-data.json` directly.
- Content field names align to `dates` (job date range), `desc` (project description), `link` (project repo URL) — renamed from the current components' `date`, `description`, `repoUrl`.
- Contact link entries store only the raw value (URL or email address) per channel; the visible label text is derived in `Contact.jsx`, not stored in data.
- UI chrome that doesn't vary by person — CTA button labels, the "online" status text, form placeholders — stays hardcoded/in `i18next` and is explicitly out of scope for this change.

## Capabilities

### New Capabilities
- `cv-data-layer`: the JSON content file, the `getCVData(lang)` accessor, and the `useCVData()` hook that section components consume for bilingual CV content.

### Modified Capabilities
- `hero-section`: bio, stats, name, role badge, and CV download link now come from the data layer instead of hardcoded/placeholder values.
- `experience-section`: job entries now come from the data layer instead of hardcoded placeholder data.
- `skills-section`: skill categories now come from the data layer instead of hardcoded placeholder data.
- `projects-section`: project entries now come from the data layer instead of hardcoded placeholder data.
- `contact-section`: contact link targets now come from the data layer instead of hardcoded placeholder values.

## Impact

- `client/src/data/mock/cv-data.json` removed; `client/src/data/cv-data.json` added.
- `client/src/lib/api.js`, `client/src/hooks/useCVData.js` rewritten.
- `client/src/components/sections/{Hero,Experience,Skills,Projects,Contact}.jsx` refactored to consume `useCVData()`.
- No API/backend changes — `api/` project untouched, `/api/cv` still doesn't exist.
