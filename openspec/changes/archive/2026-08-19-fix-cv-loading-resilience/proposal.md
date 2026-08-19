## Why

Rapid language switching can leave the site stuck on the loading indicator indefinitely: `getCVData` has no timeout, and `AppContext`'s fetch effect only ignores stale results instead of cancelling the underlying request. Combined with Neon Postgres auto-suspend (cold starts up to ~1 minute) and `GetCvUseCase` opening up to 4 DB connections per `/api/cv` request, repeated language toggles can pile up concurrent in-flight requests with no request ever timing out or being cancelled, leaving the visitor with no working fallback. Separately, `openspec/specs/hero-section/spec.md` still documents the "Descargar CV" button as inert, which no longer matches the implemented, functional download behavior already correctly documented in `openspec/specs/cv-download/spec.md` — this drift should be corrected.

## What Changes

- `client/src/lib/api.js` (`getCVData`): add a ~15-20s timeout via `AbortController`; on timeout, fall back to the local mock content for the requested language, same as the existing network/non-2xx failure path.
- `client/src/context/AppContext.jsx`: the CV-fetch `useEffect` cancels the in-flight request (via `AbortController`) when `lang` changes before it resolves, instead of only ignoring the stale result with the `cancelled` flag.
- `openspec/specs/hero-section/spec.md`: correct the "Primary call-to-action buttons" requirement so the "Descargar CV" button is documented as functional (triggers a real download), consistent with `cv-download`. Doc-only — `Hero.jsx` already implements this correctly, no code change involved.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `cv-data-layer`: the language-scoped content accessor gains a request timeout with mock fallback, and the section content hook cancels a superseded in-flight request when the language changes before it resolves.
- `hero-section`: the stale "Primary call-to-action buttons" requirement (button described as inert) is replaced by a "Hero call-to-action buttons" requirement describing the "Descargar CV" button as functional (downloads the CV), aligning with `cv-download`.

## Impact

- Affected code: `client/src/lib/api.js`, `client/src/context/AppContext.jsx`.
- Affected specs: `openspec/specs/cv-data-layer/spec.md`, `openspec/specs/hero-section/spec.md`.
- No backend, database, or API contract changes. No new dependencies.
- Verification: `npm run lint` and `npm run build` from `client/` (no test runner configured in this repo).
