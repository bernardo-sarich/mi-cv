## Why

An accessibility/performance pass over `client/` found real WCAG AA gaps that ship today: entrance and scroll animations ignore `prefers-reduced-motion`, the light-theme accent color fails 4.5:1 text contrast in several places (including the primary CTA button), and `SectionLabel`'s dimming opacity pushes an already-borderline color below AA in both themes. Icon-only toggle controls (theme, language) rely on ambiguous visible text as their accessible name. Keyboard operability and font-loading (`font-display: swap`) were also audited and found already compliant — no changes needed there.

## What Changes

- Wrap the app's `motion.*` entrance/scroll animations (Hero blocks, Experience job/bullet reveal, Skills badge pop-in, Contact's confirmation message) so they render instantly, with no transition, when `prefers-reduced-motion: reduce` is set — using framer-motion's `useReducedMotion()` hook rather than relying on partial defaults.
- Make the two always-on CSS keyframe animations (`animate-blink` cursor, `animate-pulse-ring` status/timeline dots) resolve to their static end state under `prefers-reduced-motion: reduce`.
- Make `html { scroll-behavior: smooth }` (nav links, the Hero "Ver proyectos" button) conditional on `prefers-reduced-motion: no-preference`, so reduced-motion users get an instant jump instead of an animated scroll.
- **BREAKING** (visual, not API): darken the light-theme `accent` token from `#1f9d5c` to `#19804b` so accent-colored text and the primary button's white-on-accent label both clear 4.5:1 against `bg`/`surface`. Dark-theme `accent` is unchanged (already 10.9:1).
- Remove `SectionLabel`'s opacity reduction (`opacity-60`) — `textDim` alone already provides the intended dimmed look and clears 4.5:1 in both themes; the extra opacity does not.
- Add a descriptive, theme/language-aware `aria-label` to `ThemeToggle` and `LangToggle` (e.g. "Cambiar a modo claro" / "Switch to English") so their accessible name doesn't depend on ambiguous visible text ("Dark", "ES").

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `design-system`: light-theme `accent` token value changes; `SectionLabel` no longer applies reduced opacity.
- `hero-section`: staggered entrance animation and the "Ver proyectos" smooth-scroll button must resolve instantly under reduced motion.
- `experience-section`: job reveal, bullet cascade, and timeline-dot pulse must resolve instantly/statically under reduced motion.
- `skills-section`: badge pop-in reveal must resolve instantly under reduced motion.
- `contact-section`: the confirmation-message fade-in must resolve instantly under reduced motion.
- `site-layout`: nav-link and anchor navigation must jump instantly instead of smooth-scrolling under reduced motion.
- `theme-state`: theme toggle control must expose a descriptive, theme-aware `aria-label`.
- `i18n-state`: language toggle control must expose a descriptive, language-aware `aria-label`, backed by new translation keys.
- `matrix-rain-background`: light-theme rain color updates from `#1f9d5c` to `#19804b` to stay in sync with the `design-system` accent token, per the existing code comment requiring the two to change together. (Discovered during implementation, not in the original audit — the rain's accent hex is duplicated outside Tailwind config on purpose.)

## Impact

- Code: `client/tailwind.config.js` (accent token), `client/src/components/ui/SectionTitle.jsx`'s sibling `SectionLabel.jsx`, `client/src/styles/tailwind.css` (keyframes), `client/src/index.css` (`scroll-behavior`), `client/src/components/sections/{Hero,Experience,Skills,Contact}.jsx`, `client/src/components/ui/{ThemeToggle,LangToggle}.jsx`, `client/src/locales/{es,en}.json`.
- No API, data-layer, or routing impact. No new dependencies — framer-motion's `useReducedMotion()` is already available from the installed package.
- Visual impact: light-theme accent green is visibly darker wherever used as text or as the primary button's fill; `SectionLabel` eyebrow text is slightly more opaque (still visually subordinate to headings via the `textDim` token itself).
