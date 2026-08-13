## Context

`client/` uses framer-motion for entrance/scroll-triggered animation (`motion.*` components in Hero, Experience, Skills, Contact), plain CSS `@keyframes` for two always-on effects (`animate-blink`, `animate-pulse-ring` in `src/styles/tailwind.css`), and CSS `scroll-behavior: smooth` (`src/index.css`) for anchor navigation. None of these currently check `prefers-reduced-motion`. `MatrixRain.jsx` already does this correctly via a `matchMedia('(prefers-reduced-motion: reduce)')` listener and is the existing precedent to follow for the media-query pattern (though it fully unmounts rather than adjusting an animation, since it has no "static" fallback state).

Color tokens live in `tailwind.config.js` and are pinned by exact hex value in `openspec/specs/design-system/spec.md`. See proposal.md - Why for the specific contrast failures found.

## Goals / Non-Goals

**Goals:**
- Every entrance/scroll animation and every always-on decorative animation resolves to its final/static state immediately when `prefers-reduced-motion: reduce` is set — not just a shorter transition.
- Every text/background color pairing exercised by the app's components clears WCAG AA (4.5:1 normal text, 3:1 large text) in both themes.
- Icon-adjacent toggle controls have an accessible name that states the action, independent of their momentary visible text.

**Non-Goals:**
- Hover/focus micro-interactions driven by plain Tailwind CSS transitions (card scale/glow on hover, button color transitions) are not touched — they're not entrance or scroll animations, and brief hover-triggered transform changes are not what `prefers-reduced-motion` audits typically flag as harmful.
- No change to the theme/language toggle's existing 150-200ms opacity crossfade — opacity-only transitions are not considered motion-triggering under `prefers-reduced-motion` guidance (framer-motion's own reduced-motion handling preserves opacity animation for this reason), so the crossfade requirement in `theme-state`/`i18n-state` is left as-is.
- No change to `MatrixRain` — it already handles reduced motion correctly.
- No new translation infrastructure — reuses the existing `es.json`/`en.json` + `useTranslation()` pattern.

## Decisions

**Reduced motion via `useReducedMotion()` per component, not just `<MotionConfig reducedMotion="user">`.**
Framer-motion's `MotionConfig reducedMotion="user"` globally strips transform-driven animation (x/y/scale) under the OS preference but deliberately still runs opacity transitions. That's correct for the toggle crossfades, but the user's ask for entrance/scroll animation is stricter: "no deberían ver las animaciones ... o deberían ser instantáneas, sin transición" — a residual opacity fade over 300-500ms doesn't satisfy that literally. So each entrance-animated component (Hero, Experience, Skills, Contact) calls framer-motion's `useReducedMotion()` hook directly and sets its `transition` duration (and any `staggerChildren`) to `0` when it returns `true`, in addition to leaving the `initial`/`animate` target values themselves unchanged (elements still end up in the same final state, just with a zero-duration transition — indistinguishable from "instant, no transition" to the user). This avoids introducing `MotionConfig` at all, keeping the diff localized to the four already-animated section components.

**CSS keyframe animations disabled via a media query, not JS.**
`.animate-blink` and `.animate-pulse-ring` are pure CSS classes with no React state involved. The idiomatic fix is a `@media (prefers-reduced-motion: reduce)` block in `tailwind.css` that sets `animation: none` for both classes — no component code changes needed, and it's consistent with how `MatrixRain` already gates on the same media feature (just expressed in CSS instead of JS since there's no conditional rendering here, only style).

**`scroll-behavior: smooth` gated by `@media (prefers-reduced-motion: no-preference)`.**
Same reasoning: it's a pure CSS mechanism (`src/index.css`), so the fix is CSS-native rather than adding JS scroll-interception logic to every anchor link and the Hero button.

**Light-theme `accent` darkened to `#19804b` (not a separate `accentText` token).**
Two failing pairs both involve the same token: `accent` as text (3.27:1) and `onAccent`-on-`accent` as the primary button fill (3.48:1). Darkening `accent` itself fixes both simultaneously, since a darker green background also raises the white-text-on-it ratio. `#19804b` was chosen as the darkest-possible-smallest-change value along the same hue/saturation as the original `#1f9d5c` that clears 4.5:1 for both pairings (verified: 4.66:1 text-on-bg, 4.96:1 white-on-fill). Introducing a separate `accentText` token was considered and rejected — it would leave the primary button's contrast failure unfixed (button background is `accent`, not `accentText`) and adds a token for no added correctness.
Alternative considered: keep `accent` for backgrounds/borders/icons (non-text uses, no contrast requirement) and only darken text usages via a new token. Rejected because the button case requires the background itself to change, so a text-only token wouldn't fully resolve the failures, and maintaining two near-identical greens per theme adds token surface for marginal benefit.

**`SectionLabel` drops `opacity-60` entirely rather than reducing it to a lighter opacity.**
`textDim` alone already sits at 5.47:1 (light) / 6.63:1 (dark) against `bg` — comfortably above 4.5:1. Any opacity reduction eats into that margin (measured: contrast drops below 4.5:1 in the light theme past ~90% opacity), and the visual "eyebrow label" dimming effect is already fully provided by `textDim` vs. the `text`/heading tokens next to it. Keeping a very slight opacity reduction (e.g. 95%) was considered but rejected as added risk for a visual difference too small to matter.

**Toggle `aria-label`s are localized, computed keys, not static strings.**
Existing controls already source all user-facing copy from `es.json`/`en.json` via `useTranslation()`. Following that pattern (`t('theme.switchToLight')` etc.) rather than hardcoding an English or Spanish-only `aria-label` keeps the accessible name consistent with the rest of the UI's language switching, and re-computes automatically when `i18n.changeLanguage` fires since these components already re-render on language change (they consume `useLang()`/render translated siblings).

## Risks / Trade-offs

- [Darkening `accent` changes the light-theme brand color visibly wherever it's used as a border/icon too, not just text] → Acceptable and intentional per proposal; the shift is a single hue-consistent darkening (`#1f9d5c` → `#19804b`), not a hue change, so it reads as "slightly deeper green," not a rebrand.
- [Per-component `useReducedMotion()` calls duplicate a pattern across four files instead of one central switch] → Accepted: each component already defines its own variants/transitions locally (no shared animation config module exists today), so matching that existing structure is more consistent than introducing a new shared abstraction for four call sites.
- [Zero-duration framer-motion transitions can, in some browsers, still register a single animation-frame flash] → Low risk in practice (framer-motion sets values synchronously at duration 0); not mitigated further, no user-facing reports expected.

## Open Questions

(none — the color and opacity values above are fully determined, and scope was confirmed via the proposal's explicit contrast tables)
