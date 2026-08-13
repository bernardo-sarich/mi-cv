## Why

The site shell (nav, footer, section anchors) exists, but the `sobre-mi` section — the visitor's first impression — is an empty placeholder. The CV needs a Hero section that introduces the site owner with a distinctive "developer terminal" identity and establishes the page's motion/animation language for later sections.

## What Changes

- Add a `Hero` component mounted into the existing `sobre-mi` section anchor, containing:
  - A terminal-style block: a static `$ who-am-i` line, then a typed-out `who-am-i` line (via a new reusable `useTypingEffect` hook) followed by an infinitely blinking block cursor.
  - A name heading (`h1`, mono font) next to an animated "online" status indicator (pulsing accent dot + "online" label).
  - A role badge (e.g. "Backend Developer") using the `accentDim`/`accent` tokens.
  - A placeholder bio paragraph.
  - A primary "Descargar CV" button (non-functional for now) and a secondary "Ver proyectos →" button that smooth-scrolls to the `proyectos` section.
  - A stats row (e.g. "7+ años de experiencia") whose numbers count up from 0 when the section scrolls into view, via a new reusable `useCounterAnimation` hook.
  - Staggered fade-in + slide-up entrance animation (Framer Motion) across the terminal, name, bio, and buttons blocks.
- Add reusable hooks `src/hooks/useTypingEffect.js` and `src/hooks/useCounterAnimation.js` (note: stub versions of both already exist in the repo from earlier scaffolding and will be reviewed/adjusted to meet this change's behavior, not recreated from scratch).
- All copy is hardcoded placeholder text; wiring to real CV data is out of scope for this change.

## Capabilities

### New Capabilities
- `hero-section`: The Hero/introduction section shown at the top of the page — terminal identity block, name/status/role, bio, CTAs, and animated stats.

### Modified Capabilities
(none — `site-layout`'s section scaffold requirement already reserves the `sobre-mi` mount point; this change fills it without altering that requirement)

## Impact

- New file: `client/src/components/sections/Hero.jsx`
- New/updated files: `client/src/hooks/useTypingEffect.js`, `client/src/hooks/useCounterAnimation.js`
- Updated: `client/src/App.jsx` (mount `Hero` inside the `sobre-mi` anchor)
- Updated: global stylesheet (`client/src/styles/tailwind.css` or equivalent) to add `blink` and `pulseRing` `@keyframes`
- No backend, data-layer, or API changes
