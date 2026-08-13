## Context

An unused data-layer skeleton already exists (`client/src/lib/api.js`'s `fetchCVData()`, `client/src/hooks/useCVData.js`, `client/src/data/mock/cv-data.json`). Its shape (`{name, title, summary, experience, skills, projects}` per language) doesn't cover Hero's stats/role-badge/bio split or Contact's link data, and no component consumes it — every section still reads its own module-level constant. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- One JSON file is the single source of truth for all person-specific bilingual content.
- `getCVData(lang)` and `useCVData()` are the only way section components read that content.
- The accessor's return shape is stable enough that swapping its internals for a real `fetch('/api/cv')` later requires no caller changes.

**Non-Goals:**
- Building the real `/api/cv` Azure Function — out of scope, tracked separately per CLAUDE.md.
- Moving UI chrome (button labels, "online" text, form placeholders) into the data file — those stay in `i18next` per the dato-vs-UI rule agreed with the user (changes per person → data; fixed UI copy → i18next).
- Persisting or editing content at runtime — the file is static and checked into the repo.

## Decisions

**Single `cv-data.json`, no separate mock file.** The existing `data/mock/cv-data.json` is deleted rather than kept alongside the new file. Two files with overlapping shape would drift; the same file serves as both real content (once filled in) and the safe fallback while fields are still `TODO`.

**`getCVData(lang)` does not attempt a network fetch.** The current `fetchCVData()` already tries `fetch('/api/cv')` before falling back to mock data; this change drops that attempt and reads the local JSON directly and synchronously (wrapped in a resolved Promise so the hook's async contract doesn't change). Rationale: `/api/cv` doesn't exist yet (confirmed in CLAUDE.md), so every real page load would pay for a guaranteed-failing request. When the endpoint exists, the fetch is added back inside `getCVData` — the function signature (`getCVData(lang) -> Promise<LangContent>`) and `useCVData()`'s `{ data, loading, error }` contract stay the same, so this is an internal-only change at that point.

**Content field renames: `dates`, `desc`, `link`.** `Experience.jsx`'s `date` and `Projects.jsx`'s `description`/`repoUrl` are renamed to match the shape given in the original request, rather than keeping the current component-local names. Alternative considered: keep the old names to minimize diff — rejected because it leaves the JSON and the request's own spec permanently out of sync for no technical reason.

**Contact stores raw values only; label/display text is derived in the component.** `contact: { github, linkedin, email }` holds the real URL/address per channel. `Contact.jsx` derives the displayed text (e.g. strips `https://` for the GitHub/LinkedIn display string) and keeps the per-channel label ("GitHub", "LinkedIn", "Email") as it is today. Alternative considered: store `{ value, href }` pairs per channel — rejected per the user's explicit choice to keep the flat shape and push the minor parsing into the component.

**Hero's CV-download link and CTA button behavior are unchanged.** The existing hero-section spec requires the "Descargar CV" button to have no attached download behavior. This change does not add a real download URL or wire up the button — only `name`, the role badge, `bio`, and `stats` move to the data layer for Hero. Revisit CV-download wiring in a future change once a real file/URL exists.

## Risks / Trade-offs

[Real content still unknown at proposal time] → `cv-data.json` is seeded with the same example/placeholder content that was previously hardcoded in the section components (e.g. "Acme Corp", the "task-flow-api" project), translated to English for the `en` entry since no English content existed before. This is still not the user's real CV — it moves the existing placeholder content into the data layer rather than inventing new content, and leaves it to be replaced with real values later.

[Dropping the fetch attempt is a silent behavior change from the existing unused skeleton] → Not user-visible today since no component calls `fetchCVData()` yet; documented here and in proposal.md so it isn't rediscovered as a surprise later.

[Renamed fields touch every section component] → Mechanical, one file each; covered by the task list and easy to verify by running the build (`npm run build`) since a wrong field name in JSX renders `undefined` visibly.
