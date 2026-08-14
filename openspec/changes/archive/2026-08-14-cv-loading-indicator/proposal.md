## Why

Hero, Experience, Skills, Projects, and Contact all render nothing (`null`) while `useCVData()`'s `loading` is `true` — so on first paint (and on every language switch, since the fetch re-runs) the page shows only the nav, the footer, and the Matrix rain background, with a blank gap in between until `GET /api/cv` resolves. There's no visual feedback that anything is happening, which reads as a broken or empty page rather than a loading one.

## What Changes

- Add a new `client/src/components/ui/LoadingScreen.jsx` component: a terminal-styled loading treatment (monospace prompt line + blinking cursor, consistent with the site's existing "who-am-i" typed-line and `▍` cursor motif) shown in place of the section stack while CV content is loading.
- Wire it into `App.jsx`: render `LoadingScreen` instead of the Hero/Experience/Skills/Projects/Contact stack while `useCVData().loading` is `true`; render the real sections once it's `false`. Nav, footer, and the Matrix rain background stay mounted and unaffected throughout.
- Respect `prefers-reduced-motion`: the blinking-cursor/typing animation is skipped in favor of static text, matching how the rest of the site already handles reduced motion.

## Capabilities

### New Capabilities
- `cv-loading-indicator`: a loading placeholder shown between first paint and CV content becoming available, styled to match the site's existing terminal aesthetic.

### Modified Capabilities
(none — this doesn't change the `cv-data-layer` hook's contract or `site-layout`'s section scaffold; it only changes what's rendered in that scaffold's place while `loading` is `true`, which today is nothing)

## Impact

- New file `client/src/components/ui/LoadingScreen.jsx`.
- `client/src/App.jsx` (conditional render based on `useCVData().loading`).
- No backend changes.
