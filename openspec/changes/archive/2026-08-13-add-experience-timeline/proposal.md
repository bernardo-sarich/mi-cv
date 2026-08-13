## Why

The CV site currently reserves an empty `#experiencia` placeholder for the Experience section. Visitors need a scannable work-history timeline with entrance and progress animations consistent with the rest of the site's terminal-inspired aesthetic.

## What Changes

- Add an `Experience` section component (`src/components/sections/Experience.jsx`) rendered inside `<section id="experience">`, with a `SectionLabel` + `h2` heading.
- Add a vertical timeline: a static border line spanning all jobs, overlaid by an accent-colored progress line whose height reflects scroll progress through the section.
- Add `src/hooks/useScrollProgress.js`, a reusable hook returning a 0–100 scroll-progress percentage based on a ref's position relative to the viewport.
- Render 3 hardcoded placeholder jobs, each with: a pulsing accent dot on the timeline, a small accent-colored date range, role/company, and a bullet list of achievements.
- Reveal each job (fade-in + slide-up) via IntersectionObserver as it enters the viewport; bullets within a job cascade in with an incremental ~0.12s delay.
- Extend the existing `src/hooks/useScrollReveal.js` hook to accept a `key` argument (per the requested `(key) => [ref, isVisible]` signature) so multiple call sites in the same section don't share observer state, and reuse it for both job-level and bullet-level reveal.
- **BREAKING**: Rename the Experience section anchor from `experiencia` to `experience` (per explicit request), updating `Nav.jsx`'s section list and `App.jsx`'s placeholder anchor to match.

## Capabilities

### New Capabilities
- `experience-section`: The Experience timeline section — heading, scroll-progress timeline, per-job entries, and scroll-triggered reveal animations.

### Modified Capabilities
- `site-layout`: The Experience section's anchor id changes from `experiencia` to `experience`, updating the nav link target and the page section scaffold requirement.

## Impact

- New files: `client/src/components/sections/Experience.jsx`, `client/src/hooks/useScrollProgress.js`.
- Modified files: `client/src/hooks/useScrollReveal.js` (adds `key` param), `client/src/App.jsx` (mounts `Experience`, updates placeholder anchor id), `client/src/components/layout/Nav.jsx` (updates `experiencia` → `experience` section id).
- No backend/data-layer changes; job data is hardcoded placeholder pending the real CV data layer.
