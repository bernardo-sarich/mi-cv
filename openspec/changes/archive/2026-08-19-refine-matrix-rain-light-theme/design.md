## Context

`MatrixRain.jsx` picks its fill color from `ACCENT_BY_THEME[theme]` (a ref updated on theme change, read each frame by the draw loop). See proposal.md for why the light-theme value needs to change.

## Goals / Non-Goals

**Goals:**
- Replace the light-theme fill color with a decorative gray, without touching dark-theme behavior, the fade/erase logic, or any of the framerate/resize/visibility/accessibility mechanics already in place.

**Non-Goals:**
- Not touching the `accent` design-system token or any component that consumes it (`Button`, links, etc.) — the token stays exactly as defined in `tailwind.config.js` and `design-system` spec.
- Not re-tuning `LAYER_OPACITY` or `FADE_ALPHA` — the effective-opacity requirement (0.15–0.35) is a property of the canvas's CSS `opacity`, independent of which color is drawn underneath it, so it stays satisfied without changes.

## Decisions

**Color value: `#E2E8F0` (Tailwind slate-200).** The request's own examples were `#E2E8F0` (slate-200) or `#E5E7EB` (gray-200) — both close in lightness. Chose slate-200 because its cool undertone matches the site's existing light-theme grays (`border: #dbe2de`, `textDim: #5b6863`) better than gray-200's neutral undertone. Against the page's light-theme `bg` (`#f7f8f7`) at the existing `LAYER_OPACITY` (0.31), this reads as a faint texture rather than disappearing — consistent with the "sutil marca de agua" intent.

**No change to the fade/erase step.** `draw()` clears trailing frames via `ctx.globalCompositeOperation = 'destination-out'` with `fillStyle = rgba(0, 0, 0, FADE_ALPHA)`. `destination-out` erases using only the source's alpha channel — the `0, 0, 0` RGB triplet is never actually painted, so this step has always been colorless and theme-agnostic. There is no dark-trail artifact to fix; a short code comment is added so this invariant doesn't get re-litigated later.

**Update the spec's requirement text, not just its example values.** The current requirement describes the light color as "the site's `accent` color for the currently active theme," which stops being true once light mode uses its own decorative tone. The delta rewrites the requirement to describe fixed per-theme colors instead of a shared design-system token, so the spec doesn't imply a coupling that no longer exists.

## Risks / Trade-offs

- [Slate-200 at 0.31 opacity may read as very faint on some monitors] → Acceptable: the request explicitly asks for a subtle, low-contrast watermark, and the spec's 0.15–0.35 effective-opacity requirement is unchanged and still met.
