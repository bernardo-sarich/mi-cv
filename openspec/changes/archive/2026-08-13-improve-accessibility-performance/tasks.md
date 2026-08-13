## 1. Color contrast (design-system)

- [x] 1.1 Update `accent` in `client/tailwind.config.js` from `#1f9d5c` to `#19804b` (light theme only; dark theme unchanged)
- [x] 1.2 Remove the `opacity-60` class from `client/src/components/ui/SectionLabel.jsx`
- [x] 1.3 Visually confirm in both themes: Hero role badge, Hero terminal typed line, Experience date labels, Contact "sent" message, Projects card title/hover link, primary `Button` — all remain legible and on-brand at the new accent value (confirmed by user)

## 2. Reduced motion — framer-motion entrance animations

- [x] 2.1 In `client/src/components/sections/Hero.jsx`, use `useReducedMotion()` and zero out the container/block transition durations (and `staggerChildren`) when it returns `true`
- [x] 2.2 In `client/src/components/sections/Hero.jsx`, make the "online" status dot's `animate-pulse-ring` class conditional so it's omitted when reduced motion is preferred (or rely on the CSS fix in 3.1 if that alone covers it — verify before adding component-level logic) — covered by the CSS media query in 3.1, no component change needed
- [x] 2.3 In `client/src/components/sections/Hero.jsx`, make `scrollToProjects` scroll instantly (`behavior: 'auto'`) instead of `'smooth'` when reduced motion is preferred
- [x] 2.4 In `client/src/components/sections/Experience.jsx`, use `useReducedMotion()` and zero out the job-entry reveal transition and the bullet `staggerChildren` delay when it returns `true`
- [x] 2.5 In `client/src/components/sections/Skills.jsx`, use `useReducedMotion()` and zero out the badge-reveal transition and `staggerChildren` when it returns `true`
- [x] 2.6 In `client/src/components/sections/Contact.jsx`, use `useReducedMotion()` and zero out the confirmation message's fade transition when it returns `true`

## 3. Reduced motion — CSS-driven animation

- [x] 3.1 In `client/src/styles/tailwind.css`, add a `@media (prefers-reduced-motion: reduce)` block setting `animation: none` for `.animate-blink` and `.animate-pulse-ring`
- [x] 3.2 In `client/src/index.css`, wrap `html { scroll-behavior: smooth }` in `@media (prefers-reduced-motion: no-preference)`
- [x] 3.3 Manually verify with OS/browser reduced-motion enabled: cursor stops blinking (or is simply static), timeline/status dots stop pulsing, and every anchor link (nav links, Hero's "Ver proyectos") jumps instantly (confirmed by user)

## 4. Accessible names for icon-adjacent toggles

- [x] 4.1 Add `theme.switchToLight` / `theme.switchToDark` keys to `client/src/locales/es.json` and `en.json`
- [x] 4.2 Add `lang.switchToEn` / `lang.switchToEs` keys to `client/src/locales/es.json` and `en.json`
- [x] 4.3 In `client/src/components/ui/ThemeToggle.jsx`, add an `aria-label` computed from the target theme via the new translation keys
- [x] 4.4 In `client/src/components/ui/LangToggle.jsx`, add an `aria-label` computed from the target language via the new translation keys
- [x] 4.5 Verify with a screen reader (or the browser accessibility tree inspector) that each control's announced name changes correctly after toggling (confirmed by user)

## 5. Verification

- [x] 5.1 Run `npm run lint` and `npm run build` in `client/`
- [x] 5.2 Re-run the contrast check against the final rendered colors for every pair listed in proposal.md - Why (accent-as-text, primary button, SectionLabel in both themes) and confirm each is ≥ 4.5:1
- [x] 5.3 `openspec/specs/design-system/spec.md`, `hero-section/spec.md`, `experience-section/spec.md`, `skills-section/spec.md`, `contact-section/spec.md`, `site-layout/spec.md`, `theme-state/spec.md`, and `i18n-state/spec.md` deltas are ready to sync/archive; also added a `matrix-rain-background/spec.md` delta during implementation (see note below) — not part of the original plan
