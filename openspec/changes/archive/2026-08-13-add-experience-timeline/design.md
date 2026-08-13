## Context

See proposal.md - Why. Relevant existing conventions:
- `Hero.jsx` establishes the pattern: `framer-motion` for entrance animation with `staggerChildren`, `useScrollReveal` (IntersectionObserver-based) for viewport-triggered state, and `accent`/`accentDim`/`textDim` Tailwind tokens for theming.
- `useScrollReveal.js` already exists (`client/src/hooks/useScrollReveal.js`) but takes an `options` object and has no `key` param — it returns a stable `[ref, isVisible]` pair per hook call, which already works correctly for multiple call sites since each call creates its own `ref`/state/observer. The user-requested signature `(key) => [ref, isVisible]` is adopted as an additive first parameter for readability/debugging (e.g. future logging, or callers that want a stable identity for the observed element) without changing its actual isolation behavior, which already comes from each call having its own hook instance.
- `SectionLabel` and heading conventions come from `openspec/specs/design-system/spec.md`.
- The Experience anchor is currently `experiencia` in `Nav.jsx`'s `SECTIONS` and `App.jsx`'s placeholder `<div id="experiencia">`; per user decision this change renames it to `experience` (English) to match the literal `<section id="experience">` requested, and updates both call sites so nav scrolling keeps working.

## Goals / Non-Goals

**Goals:**
- Ship a self-contained `Experience.jsx` section using hardcoded placeholder job data.
- Provide two reusable hooks (`useScrollProgress`, extended `useScrollReveal`) usable by future sections (Skills, Projects).
- Keep the scroll-progress line and reveal animations performant (no layout thrash, passive scroll listeners or IntersectionObserver only).

**Non-Goals:**
- Wiring Experience data to `useCVData`/`cv-data.json` — explicitly deferred.
- Changing the `i18n` translation strings beyond what already exists for `nav.experience` (label text is unaffected by the id rename).
- Building a generic timeline component library beyond what this section needs.

## Decisions

- **`useScrollProgress(ref)` implementation**: attach a scroll listener on `window` (passive) plus a `resize` listener, compute progress on each event via `ref.current.getBoundingClientRect()` relative to `window.innerHeight`: progress starts increasing once the section's top crosses the viewport bottom-to-top and reaches 100% once the section's bottom crosses the viewport top, clamped to [0, 100]. Chosen over a per-frame `requestAnimationFrame` loop for simplicity, since scroll events are already reasonably throttled by the browser and this hook has a single caller today. Alternative considered: IntersectionObserver with many thresholds — rejected because IO thresholds are coarse-grained (step arrays) and less precise for a continuously-variable percentage.
- **`useScrollReveal(key, options)`**: add `key` as a leading parameter, defaulting to `undefined`, used only as a React debugging aid (not for any lookup/cache) — the hook keeps creating its own `ref`/`IntersectionObserver` per call, so behavior for existing callers (like `Hero.jsx`) is unchanged as long as they pass `undefined` for `key` and their options as the second argument. Existing call sites are updated to pass a descriptive key.
- **Per-job and per-bullet reveal**: each job entry calls `useScrollReveal` once for its own fade/slide-up, and renders its bullet list with `framer-motion`'s `staggerChildren: 0.12` on a parent `motion.ul` gated by the job's `isVisible` flag, rather than calling `useScrollReveal` per bullet — this avoids N observers per job and matches the existing `staggerChildren` pattern from `Hero.jsx`.
- **Progress line rendering**: the two timeline lines are absolutely positioned inside a `relative` container that wraps the job list; the progress line's `height` is set via inline style (`style={{ height: `${progress}%` }}`) since it's a continuously-computed value, not a small enum of Tailwind classes.
- **Anchor rename**: rename `experiencia` → `experience` in `Nav.jsx`'s `SECTIONS` array (`id` field only — the `key: 'experience'` used for i18n lookup is already correct) and in `App.jsx`'s placeholder `<div id="experiencia">`, which is replaced by mounting `<Experience />`.

## Risks / Trade-offs

- [Scroll-based progress calculation runs on every scroll event] → Mitigated by keeping the handler cheap (single `getBoundingClientRect` call, no state updates beyond the numeric percentage) and marking the listener `passive: true`.
- [Renaming the anchor id is a breaking change for any external deep link to `#experiencia`] → Accepted per explicit user decision; this is a pre-launch site with no known external backlinks.
- [`useScrollReveal`'s new `key` param could be mistaken for an isolation/cache key by future readers] → Mitigated with a short inline comment at the hook noting it's only for debugging identity, not for shared/cached observer state.
