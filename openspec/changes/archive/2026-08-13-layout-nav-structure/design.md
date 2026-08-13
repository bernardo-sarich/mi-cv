## Context

See proposal.md - Why. Relevant existing state:
- `tailwind.config.js` already defines `navBg` / `dark-navBg` (translucent) tokens and a `mono` font family (`"JetBrains Mono"`), plus `border`, `text`, `accent` tokens for light/dark.
- `AppContext.jsx` exposes `useTheme()` and `useLang()`; `<html>` gets a `dark` class toggled by theme.
- `ui/LangToggle.jsx` and `ui/ThemeToggle.jsx` already exist and are ready to drop into the nav as-is.
- `locales/{es,en}.json` has a `nav` block with `about/experience/projects/contact` but no `skills` key, even though the proposal's section scaffold includes a Skills section.
- `data/mock/cv-data.json` has `es.name` / `en.name` = "Bernardo Sarich" — the display name source for the brand mark and footer.
- No routing library, no scroll library, no `sections/` components exist yet (that directory is empty) — this change only builds the shell that later phases will fill in.

## Goals / Non-Goals

**Goals:**
- Sticky/blurred `Nav`, five id'd placeholder sections, and `Footer`, wired into `App.jsx` in place of the current Vite starter markup.
- Smooth in-page scrolling to anchors with no new runtime dependency.
- A working, accessible mobile hamburger toggle built with local component state (no new dependency).

**Non-Goals:**
- Building out real Hero/Experience/Skills/Projects/Contact content — sections stay empty placeholder `<div>`s (later phases).
- Scroll-spy (highlighting the active nav link based on scroll position) — not requested, can be a later enhancement.
- Any change to `theme-state` / `i18n-state` behavior beyond adding the missing `nav.skills` locale key.

## Decisions

- **Smooth scroll via CSS, not a library**: set `scroll-behavior: smooth` globally (e.g. on `html` in `index.css`) and use plain `<a href="#id">` anchors in the nav. Simpler than pulling in `react-scroll` or similar, and sufficient since sections live on one page. Nav links use `href="#sobre-mi"` etc. rather than `scrollIntoView` calls, so the browser's native anchor/hash behavior and smooth-scroll both apply for free.
- **`position: sticky` over `fixed`**: sticky keeps the nav in normal document flow (no manual top-offset/padding needed on the first section) while still pinning it once it reaches the top. Fixed would require compensating padding on `<body>`/first section to avoid content jumping under the nav on load.
- **Name source**: read the display name from `data/mock/cv-data.json` (`{lang}.name`) via the existing `useLang()` hook, rather than hardcoding "Bernardo" in the component, so `Nav`/`Footer` stay in sync with the CV data already used elsewhere. Brand mark uses the first name only (lowercased) — `~/bernardo` — for a terminal-path feel; footer uses the same first name in `</bernardo>`.
- **Hamburger menu**: implement with local `useState` open/closed toggle and a Tailwind responsive class split (`hidden md:flex` for inline links, a toggle button shown only `md:hidden`), rather than a headless-UI dependency. Matches the project's current pattern of small hand-rolled components (see `LangToggle`/`ThemeToggle`).
- **Mobile breakpoint**: use Tailwind's default `md` (768px) breakpoint to match the rest of the (still-minimal) codebase's convention rather than introducing a custom breakpoint.
- **`App.jsx` cleanup**: remove `DesignSystemPreview` and the Vite starter `AppShell` entirely rather than keeping them behind a flag — the design-system tokens they exercised are already proven out and the real sections will replace this content in the next phase anyway.

## Risks / Trade-offs

- [Removing `DesignSystemPreview` loses the ad-hoc visual check of design-system tokens] → Tokens are simple Tailwind class names; any regression will be immediately visible once real sections use them in the next phase. Low risk given the tokens don't change in this phase.
- [Native anchor `href="#id"` scrolling exposes the section id in the URL hash] → Acceptable/expected for an anchor-nav single-page site; no routing requirements were stated.
- [`position: sticky` can fail silently if any ancestor has `overflow: hidden` or a clipping transform] → Keep `Nav` a direct child of the app root with no clipping wrapper; verify visually per the command's own acceptance check ("Nav se ve bien con blur sobre el contenido").
