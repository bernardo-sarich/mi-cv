## 1. Hooks

- [x] 1.1 Create `src/hooks/useScrollProgress.js`: accepts a ref, returns a 0-100 percentage of the referenced element's scroll progress through the viewport, updated via passive `scroll`/`resize` listeners on `window`.
- [x] 1.2 Extend `src/hooks/useScrollReveal.js` to accept a leading `key` parameter (before `options`), documented via a short comment as a debugging identity only (no isolation/caching behavior change).
- [x] 1.3 Update `Hero.jsx`'s existing `useScrollReveal({ threshold: 0.3 })` call to pass a `key` as the first argument (e.g. `useScrollReveal('hero-stats', { threshold: 0.3 })`).

## 2. Experience section component

- [x] 2.1 Create `src/components/sections/Experience.jsx` with `<section id="experience">`, a `SectionLabel`, and an `h2` heading.
- [x] 2.2 Define a hardcoded placeholder array of 3 jobs (date range, role, company, achievement bullets).
- [x] 2.3 Build the vertical timeline container: a static `border-left` line spanning all jobs, plus an absolutely-positioned accent-colored overlay line sized via `useScrollProgress`.
- [x] 2.4 Render each job entry: timeline dot (accent color, subtle pulse animation), date range (small, accent text), role/company, and achievement bullet list.
- [x] 2.5 Wire each job entry to `useScrollReveal` (with a per-job key) for fade-in + slide-up on entering the viewport.
- [x] 2.6 Animate the bullet list within each job with `framer-motion` `staggerChildren: 0.12`, gated by the job's `isVisible` flag.

## 3. Anchor rename (experiencia → experience)

- [x] 3.1 Update `Nav.jsx`'s `SECTIONS` array: change the Experience entry's `id` from `experiencia` to `experience` (keep `key: 'experience'` unchanged).
- [x] 3.2 Update `App.jsx`: replace the `<div id="experiencia"></div>` placeholder by mounting `<Experience />`.

## 4. Verification

- [x] 4.1 Run the app locally and confirm the "experience" nav link scrolls to the new section.
- [x] 4.2 Manually verify: progress line fills while scrolling through the section, jobs fade/slide in on entering the viewport, and bullets cascade with a visible stagger.
- [x] 4.3 Confirm `Hero.jsx`'s stats reveal still works after the `useScrollReveal` signature change.
