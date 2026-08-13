## Why

The CV site currently has a Hero and Experience section but no dedicated place to showcase the technical stack. Recruiters scanning the page need a quick, scannable overview of languages, frameworks, and tools — this closes that gap and follows the same scroll-reveal visual language already established by the Experience section.

## What Changes

- Add a new `Skills` section component (`src/components/sections/Skills.jsx`) rendered under `<section id="stack">`.
- Section header uses the existing `SectionLabel` + `h2` pattern (matching Experience).
- Responsive grid of skill categories (e.g. Languages, Frameworks, Infra, Data) using CSS grid `auto-fit, minmax(~220px, 1fr)`.
- Each category renders as a `Card` containing an uppercase, small, `textDim`-styled category name and its skills as `Badge` items.
- Each category card reveals on scroll via the existing `useScrollReveal` hook (one reveal trigger per category).
- Badges within a revealed category animate in with a pop/bounce effect (scale 0.7 → 1, `cubic-bezier(0.34, 1.56, 0.64, 1)` easing) and a ~0.06s incremental stagger delay per badge.
- Skill data is hardcoded/placeholder for now; no data-fetching or CMS integration in this change.

## Capabilities

### New Capabilities
- `skills-section`: Displays the technical stack as categorized, animated badge groups that reveal on scroll.

### Modified Capabilities
(none)

## Impact

- New file: `client/src/components/sections/Skills.jsx`.
- Likely wiring: `client/src/App.jsx` will need to render `<Skills />` alongside `<Hero />` and `<Experience />` (not in scope of this proposal's spec, but noted for tasks/design).
- Reuses existing UI primitives (`Card`, `Badge`, `SectionLabel`) and hooks (`useScrollReveal`) — no new dependencies expected (animation via `framer-motion`, already in use in `Experience.jsx`).
