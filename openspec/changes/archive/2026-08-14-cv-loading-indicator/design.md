## Context

See proposal.md - Why. Relevant existing pieces:
- `client/src/styles/tailwind.css` already defines `.animate-blink` (the Hero's `▍` cursor) and `.animate-pulse-ring`, both already guarded by `prefers-reduced-motion: reduce` in CSS.
- `client/src/hooks/useTypingEffect.js` does character-by-character reveal via `setInterval`; it has no built-in reduced-motion awareness.
- `client/src/context/AppContext.jsx` exposes `useCVData()` → `{ data, loading, error }`; `loading` starts `true` and is reset to `true` on every `lang` change (re-fetch), then flips to `false` once `getCVData` resolves (success or its own internal mock fallback — it never rejects, per the existing `cv-data-layer` spec).
- `App.jsx` renders, inside `AppProvider`: `MatrixRain(left)`, `MatrixRain(right)`, then a `relative z-10` wrapper containing `Nav → Hero → Experience → Skills → Projects → Contact → Footer`.
- Design tokens (`openspec/specs/design-system/spec.md`, `client/tailwind.config.js`): every themed element pairs a light token with its `dark:dark-*` twin (e.g. `text-textDim dark:text-dark-textDim`).

## Goals / Non-Goals

**Goals:**
- Fill the blank gap between Nav and Footer while `loading` is `true`, using the existing terminal visual language rather than introducing a new generic spinner style.
- No layout-shift surprises: the placeholder occupies roughly the space the section stack will occupy once rendered (best-effort — exact heights vary by content, so this is approximate, not pixel-perfect).

**Non-Goals:**
- No skeleton screens mimicking each section's exact layout — that's significantly more component surface for a case that's already usually sub-second (see `FastRetryExecutionStrategy` from the prior change) and mostly matters on a cold DB/function start.
- No changes to `useCVData`/`AppContext`'s data-fetching behavior — this only changes what renders while `loading` is `true`.
- No `aria-live` announcement — the placeholder is decorative feedback for a normally-brief wait, consistent with the site not doing screen-reader-specific loading announcements elsewhere.

## Decisions

**`LoadingScreen` is a single new component in `components/ui/`, not per-section skeletons.**
The section stack currently has no `min-height`/reserved space, so a per-section skeleton would need to fabricate layout dimensions with no real content to base them on. A single centered terminal-style block (prompt line + cursor) inside a `flex-1` container matches the site's minimalist aesthetic and is far less code to maintain than five bespoke skeletons.

**Reuses `.animate-blink` for the cursor; wraps `useTypingEffect` with a `useReducedMotion()` (framer-motion) guard.**
`.animate-blink` already no-ops under reduced motion via its own CSS media query, so the cursor itself needs no JS-side handling. `useTypingEffect`, however, always reveals character-by-character regardless of motion preference — `LoadingScreen` SHALL check `useReducedMotion()` and render the full string immediately when it's `true`, rather than passing the reduced-motion decision into the shared hook (keeping `useTypingEffect` itself simple and matching how `Contact.jsx`'s `FieldError` already takes a `reduced` prop rather than baking the check into a shared primitive).

**Text is a static, translated string (`t('loading.cv')` or similar), not tied to which language's data is loading.**
Keeps the loading copy itself part of the existing i18n system (`locales/es.json`/`en.json`), consistent with the rest of the site's approach to user-facing text, rather than hardcoding Spanish/English strings in the component.

## Risks / Trade-offs

- **Approximate height match** → if the placeholder's height differs meaningfully from the real section stack's height, replacing it causes a layout jump. Mitigated by giving the placeholder a generous `min-h-screen`-ish sizing so the jump, if any, is upward (content growing) rather than the page visibly collapsing.
- **Reusing `useTypingEffect` couples this component to a hook designed for the Hero's one-time headline reveal** → acceptable since the hook is generic (`text`, `speedMs`) and has no Hero-specific state; if it needs to diverge later that's a small, isolated change.
