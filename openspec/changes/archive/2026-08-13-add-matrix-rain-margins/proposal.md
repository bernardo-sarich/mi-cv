## Why

The site already leans on a terminal/developer visual language (`~/nombre` brand mark, `</nombre>` footer, `<section id="...">` labels, JetBrains Mono everywhere), but on wide desktop viewports the page is a narrow centered column with large, completely empty gutters on either side. Those gutters are dead space. Filling them with a low-opacity "matrix rain" reinforces the existing aesthetic and makes the page feel intentional at full-width, without adding anything the reader has to look at or read around.

## What Changes

- Add a new decorative `MatrixRain` UI component (`client/src/components/ui/MatrixRain.jsx`) that draws falling characters into a `<canvas>`.
- Mount two fixed, full-height instances in the app shell — one in the left gutter, one in the right — rendered **behind** all page content.
- The strips occupy only the empty gutter outside the app column. Per decision, the gutter is measured against `#root`'s hard width of **1126px** (set in `client/src/index.css`), not against the sections' `max-w-5xl` content width, so the effect never paints over `#root`'s visible `border-inline`.
- The effect is **conditionally mounted**, not just hidden:
  - Viewport narrower than **1280px** → not rendered at all (below that there is no meaningful gutter).
  - `prefers-reduced-motion: reduce` → not rendered at all.
- Colors follow the active theme, read from the existing `AppContext` (`useTheme()`), not hardcoded to a single value: the `accent` token for the current theme (`#3ddc84` dark / `#1f9d5c` light).
- Deliberately restrained rendering: low opacity (~0.15–0.25), slow and even fall speed, no aggressive flicker.
- Performance is a first-class requirement of this change, not an afterthought:
  - `requestAnimationFrame` only — no `setInterval`.
  - The animation loop is throttled to roughly 15–20fps rather than running at display refresh rate.
  - The loop is fully stopped (not merely skipped) while the tab is hidden, via `visibilitychange`.
  - The `useEffect` cleanup cancels the pending frame and releases listeners so nothing survives unmount or a theme/resize re-run.
- Accessibility: the canvas is `aria-hidden="true"` and carries no text alternative — it is purely ornamental and must not reach assistive tech.
- Supporting layout change in `App.jsx`: page content is placed in a wrapper that establishes a higher stacking level than the ambient layer. This is required because `body` currently has an opaque background (`@apply bg-bg ...` in `styles/tailwind.css`), which rules out simply pushing the canvas to a negative `z-index`, and because the page sections are statically positioned today (they do **not** currently set `position: relative; z-index: 1`).

Not in scope: changing the existing `#root { width: 1126px }` rule or the leftover template palette in `index.css`; animating anything inside the content column; any mobile/tablet variant of the effect.

## Capabilities

### New Capabilities
- `matrix-rain-background`: An ambient, decorative falling-character canvas rendered in the empty side gutters on wide viewports, themed by the active theme, motion- and visibility-aware, and never overlapping or announcing itself to page content.

### Modified Capabilities
(none) — the page shell keeps rendering the same nav, sections, anchors, and footer described by `site-layout`; the ambient layer is additive and sits behind all of it.

## Impact

- New file: `client/src/components/ui/MatrixRain.jsx`.
- Modified: `client/src/App.jsx` — mounts the two instances and wraps the existing content in a stacking wrapper.
- Reads from: `client/src/context/AppContext.jsx` (`useTheme()`), already exported and in use by `ThemeToggle`.
- Geometry coupling worth flagging: the strip width derives from `#root`'s `1126px` in `client/src/index.css`. If that rule ever changes, the strips must be updated with it — the design pins this to a single named constant so there is one place to edit.
- No new dependencies. The effect is raw canvas 2D; `framer-motion` (already present) is not involved.
- Adds a continuously running (throttled) animation to the desktop page; the mount gates and the visibility pause exist specifically to bound that cost.
