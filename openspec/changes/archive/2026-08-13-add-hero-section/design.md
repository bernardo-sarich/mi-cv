## Context

`client/src/App.jsx` already renders an empty `<div id="sobre-mi"></div>` per the `site-layout` spec's section scaffold. `client/src/hooks/useTypingEffect.js` and `client/src/hooks/useCounterAnimation.js` already exist as minimal stubs from earlier scaffolding (interval-based typing, rAF-based count-up) but neither is wired to a viewport trigger, and the typing hook has no built-in cursor. `client/src/hooks/useScrollReveal.js` already provides an `IntersectionObserver`-backed `[ref, isVisible]` pair used elsewhere for reveal-on-scroll behavior. `client/src/components/ui/Button.jsx` and `Badge.jsx` already implement the `primary`/`secondary` and label-badge styling from the `design-system` spec. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Ship a self-contained `Hero.jsx` using only existing design tokens/components plus two small new hooks.
- Keep the typing and counter hooks generic (no Hero-specific logic) so later sections can reuse them.
- Define exactly where the new `blink` and `pulseRing` keyframes live so they're available globally without duplicating CSS per component.

**Non-Goals:**
- Wiring bio/name/role/stats to real CV data (`useCVData`/`cv-data.json`) — stays hardcoded this change.
- Making "Descargar CV" actually download a file.
- Building a generic reusable "stat counter row" component beyond what Hero needs.

## Decisions

- **Reuse and adapt existing hook stubs rather than rewriting from scratch.** `useTypingEffect(text, speedMs)` already matches the proposal's signature; it needs no change for the typing behavior itself — the blinking cursor is a separate, always-on concern and is rendered as a sibling span in `Hero.jsx` driven by a pure-CSS `blink` animation, not by the hook's returned string. This keeps the hook reusable for any typed text regardless of whether a cursor is desired.
- **Viewport-triggered counting via `useScrollReveal` + `useCounterAnimation`, not a new intersection observer.** `useCounterAnimation(target, durationMs)` currently starts counting immediately on mount. Hero will only call it (or only start its animation) once `useScrollReveal`'s `isVisible` flips true for the stats row's own ref, avoiding a second bespoke `IntersectionObserver` implementation. Concretely: `useCounterAnimation` gains a `start` boolean param (default `true`) so it stays a no-op until told to start; Hero passes `isVisible` from `useScrollReveal` as that flag. This is additive to the hook's existing signature and doesn't change current callers (there are none yet).
- **New keyframes (`blink`, `pulseRing`) go in `client/src/styles/tailwind.css`** (the project's existing global stylesheet, loaded once via Tailwind's `@layer` or plain CSS append) rather than as inline `<style>` in `Hero.jsx` or a CSS module, matching how the project centralizes global CSS today (`index.css`, `styles/tailwind.css`). `blink` uses `step-end` timing, 1s duration, infinite. `pulseRing` is an expanding-scale + fading-opacity ring, infinite.
- **Framer Motion `motion.div` + `variants` with `staggerChildren`** on a parent wrapper for the terminal/name/bio/buttons blocks, since the proposal specifies a fixed ~0.08s stagger — `staggerChildren: 0.08` on the parent's `animate` variant is the direct Framer Motion primitive for that, avoiding hand-rolled per-block delays.
- **Section id ownership**: `Hero.jsx` is mounted as the child of the existing `<div id="sobre-mi">` in `App.jsx` (or replaces that div with `<section id="sobre-mi">` rendered by `Hero.jsx` itself — chosen approach: `Hero.jsx` renders its own `<section id="sobre-mi" className="...">` and `App.jsx` renders `<Hero />` directly in place of the placeholder div, since `site-layout`'s scoped requirement only cares that the id exists on an element in the right position, not which component owns it).

## Risks / Trade-offs

- [Changing `useCounterAnimation`'s signature could look like a breaking change] → No existing callers reference it yet (grep confirms only the hook file itself exists pre-change), so adding an optional `start` param with a backward-compatible default is safe.
- [`prefers-reduced-motion` users get the same blink/pulse/count-up/stagger as everyone else] → Out of scope for this change; noted here so a future accessibility pass can address it without re-deriving the animation list.

## Open Questions

- None — remaining details (exact bio copy, stat values, role text) are explicitly hardcoded placeholders per the proposal and don't affect the spec or approach.
