## Context

See proposal.md - Why. Relevant existing state:
- `client/tailwind.config.js` already sets `darkMode: 'class'` and defines the light/dark token pairs (`design-system` capability) — theme state only needs to toggle a class, not define colors.
- `client/src/lib/i18n.js` already calls `i18n.use(initReactI18next).init(...)` importing `../locales/es.json` and `../locales/en.json` with `lng: 'es'`, `fallbackLng: 'es'` — it is dead code today because those two files don't exist. This change only needs to add the two JSON files with matching keys; the i18next wiring itself does not need to change.
- `client/src/main.jsx` already imports `./lib/i18n.js` before rendering `<App />`, so i18next initializes before any component mounts.
- `client/src/App.jsx` imports `AppProvider` from `./context/AppContext.jsx`. **Correction discovered during implementation**: unlike originally assumed, `AppContext.jsx` already existed and already implemented combined theme+language state (`useTheme() → { theme, toggleTheme }`, `useLang() → { lang, toggleLang }`, a `prefers-color-scheme`-based default, and its own `dark`-class `useEffect`). Building a separate `ThemeContext.jsx` would have created two competing sources of truth. Per explicit user decision, this change consolidates into `AppContext.jsx` instead of adding a new file — see the updated Decisions below.
- `framer-motion` (`^13.1.0`) is already a dependency, used for the crossfade transitions.

## Goals / Non-Goals

**Goals:**
- Global theme state (`dark`/`light`) that drives the `dark` class on `<html>`, with a default of `dark`.
- A working `es`/`en` i18next setup for fixed UI-chrome strings, defaulting to `es`.
- Toggle controls for both, each with a short opacity crossfade.
- Manually verified in the dev server before considering the change done.

**Non-Goals:**
- No persistence (localStorage/cookies) of theme or language choice across page reloads — pure in-memory state via React context/i18next default behavior for this change.
- No bilingual CV content (bio, experience, projects) — that lives in a separate data file added by a future change.
- No wiring of `ThemeToggle`/`LangToggle` into a real nav bar/header — this change only creates the locale files and standalone toggle components. Integration into page layout happens when the layout is built.

## Decisions

- **Theme state consolidated into the existing `AppContext.jsx`, not a separate `ThemeContext.jsx`**: implementation discovered `AppContext.jsx` already provided combined theme+language state and was already mounted via `AppProvider` in `App.jsx`. Per explicit user decision, `ThemeContext.jsx` (initially created) was deleted and its behavior folded into `AppContext.jsx` instead of running two competing providers.
- **`AppContext.jsx` keeps its existing hook names**: `useTheme() → { theme, toggleTheme }` and `useLang() → { lang, toggleLang }`, per explicit user preference — these are more descriptive than a generic `toggle()` and were already the established convention in this file.
- **Default theme `'dark'`**: `AppContext.jsx`'s `useState(() => prefers-color-scheme ? 'dark' : 'light')` initializer was changed to a flat `useState('dark')`, per explicit product decision from the request (`valor por defecto 'dark'`), independent of the user's OS preference.
- **Single `useEffect` for the root `dark` class**: `AppContext.jsx` already had exactly one `useEffect` toggling `document.documentElement`'s `dark` class keyed on `theme`; no duplicate was introduced (the deleted `ThemeContext.jsx` would have added a second, competing one).
- **`useLang().toggleLang` keeps calling `i18n.changeLanguage` internally**: unchanged from `AppContext.jsx`'s existing behavior — a `useEffect` keyed on `lang` calls `i18n.changeLanguage(lang)`, so `toggleLang` only needs to flip the `lang` state value.
- **i18next stays library-default (no custom detection plugin)**: `lng: 'es'` in the existing `i18n.js` already fixes the startup language; no `i18next-browser-languagedetector` is added since the requirement is "start in Spanish by default," not "detect the user's browser language."
- **Locale JSON shape is flat-nested by feature (`nav`, `hero`, `experience`, ...)**: matches the dot-path keys given in the request (e.g. `nav.about`) and how `react-i18next`'s default keySeparator (`.`) resolves nested JSON objects — no i18next config changes needed.
- **Crossfade lives in the toggle components, not in `AppContext.jsx`**: `ThemeToggle`/`LangToggle` each wrap their visible label in Framer Motion `AnimatePresence`/`motion.span`, keyed on the current value (`theme` or `lang`), animating `opacity` only over ~175ms — `AppContext.jsx` itself stays presentation-free.
- **Two separate toggle components, each self-contained**: `ThemeToggle` reads `useTheme()` from `AppContext`; `LangToggle` reads `useLang()` from `AppContext`. Keeping them independent (rather than one combined settings widget) matches the proposal's file list and keeps each one trivially reusable/testable in isolation.

## Risks / Trade-offs

- [No persistence means theme/language reset on every reload] → Acceptable for this change per Non-Goals; a follow-up change can add `localStorage` sync if desired without altering `AppContext`'s public shape.
- [Divergence between `es.json` and `en.json` keys going undetected] → Both files are created together in this change from the exact key list in the proposal; verified programmatically (16/16 matching keys) during manual verification.
- [Changing `AppContext.jsx`'s theme default from `prefers-color-scheme` to fixed `'dark'` changes existing behavior for any future consumer relying on OS-preference detection] → Accepted per explicit user decision; documented here so a future change reintroducing OS-preference detection knows this was intentional, not an oversight.

## Open Questions

None — the `ThemeContext.jsx` vs `AppContext.jsx` conflict discovered mid-implementation was resolved directly with the user (consolidate into `AppContext.jsx`); persistence and full nav/header wiring remain explicitly deferred (see Non-Goals).
