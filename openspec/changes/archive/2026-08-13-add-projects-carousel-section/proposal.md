## Why

The CV site currently has Hero, Skills, and Experience sections but no place to showcase concrete projects. A horizontally scrollable Projects carousel lets visitors quickly browse example work (name, description, tech stack, repo link) without consuming excessive vertical space, matching the site's existing dark/light design system.

## What Changes

- Add a new `Projects` section component (`src/components/sections/Projects.jsx`) rendered inside `<section id="projects">`, with a `SectionLabel` + `h2` heading and two prev/next arrow buttons that scroll the carousel.
- Add a horizontally scrollable card carousel with native scroll-snap (`overflow-x: auto`, `scroll-snap-type: x mandatory`, `scroll-behavior: smooth`), where each card is a fixed-width (~300px) `scroll-snap-align: start` item.
- Arrow buttons call `scrollBy({ left: ±320, behavior: 'smooth' })` on a ref to the scroll container.
- Each project card shows: project name (mono font, bold, accent color), a short description, small `Badge` components for stack tags, and a GitHub repo link (icon, opens in a new tab via `target="_blank" rel="noopener noreferrer"`).
- Cards get a hover effect: slight scale-up (~1.02), an accent-colored glow (box-shadow), and a highlighted border, animated with a smooth transition.
- Project data is local placeholder/hardcoded data (4 example projects) for now; no external data fetching.

## Capabilities

### New Capabilities
- `projects-section`: Displays a horizontally scrollable carousel of project cards (name, description, stack badges, repo link) with prev/next scroll controls, using placeholder data.

### Modified Capabilities
(none)

## Impact

- Affected code: `client/src/components/sections/Projects.jsx` (new), likely wired into `client/src/App.jsx` and nav/anchor links.
- Affected data: new placeholder projects data (e.g. `client/src/data/mock` or inline in the component).
- Reuses existing `SectionLabel` and `Badge` components from the design system; no new shared UI components required.
- No backend/API changes; no new dependencies (framer-motion already present if used for hover/reveal animation).
