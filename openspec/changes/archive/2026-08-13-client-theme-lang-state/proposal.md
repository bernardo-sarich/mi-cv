## Why

The `client` app has Tailwind dark-mode tokens (`design-system` capability) and `react-i18next` dependencies already installed, but nothing currently drives the `dark` class on the document or the active i18n language — there is no shared theme/language state, no persistence, and no UI to switch either. `src/lib/i18n.js` already imports `../locales/es.json` and `../locales/en.json`, which do not exist yet, so the app cannot start i18n correctly until these are added.

## What Changes

- Update `src/context/AppContext.jsx` (existing combined theme+language context, already mounted via `AppProvider` in `App.jsx`): change its theme default from `prefers-color-scheme` detection to a fixed `'dark'`. Its existing `useTheme() → { theme, toggleTheme }` hook and single `useEffect` applying/removing the `dark` class on `<html>` are kept as-is, so Tailwind's `darkMode: 'class'` tokens (from `design-system`) take effect. *(A separate `src/context/ThemeContext.jsx` was initially built per the original request but was superseded by this consolidation once `AppContext.jsx`'s existing implementation was discovered — see design.md.)*
- Add `src/locales/es.json` and `src/locales/en.json` with the fixed UI-chrome keys listed in the proposal scope (`nav.*`, `hero.*`, `experience.title`, `skills.title`, `projects.*`, `contact.*`). These files hold only interface chrome text, not bilingual CV content (bio/experience/projects data is out of scope here and will live in a separate data file added in a later change).
- Wire `i18next`/`react-i18next` to start with Spanish (`es`) as the default/fallback language, consuming the new locale files (the existing `src/lib/i18n.js` already expects this shape).
- Add `src/components/ui/ThemeToggle.jsx` and `src/components/ui/LangToggle.jsx`: small UI controls that consume `ThemeContext` / `i18next` respectively, each performing a ~150-200ms opacity crossfade (Framer Motion) when their value changes.
- Manually verify in the running dev app that toggling theme flips the `dark` class/tokens and toggling language swaps rendered UI strings between `es` and `en`.

## Capabilities

### New Capabilities
- `theme-state`: Global dark/light theme context, default value, root-element class application, and the `ThemeToggle` control.
- `i18n-state`: react-i18next configuration, `es`/`en` locale files for fixed UI chrome, Spanish-default startup, and the `LangToggle` control.

### Modified Capabilities
(none — `design-system` tokens are consumed as-is, not changed)

## Impact

- Affected code: `client/src/context/AppContext.jsx` (modified: fixed `'dark'` default instead of `prefers-color-scheme`), `client/src/locales/es.json` + `en.json` (new), `client/src/components/ui/ThemeToggle.jsx` (new, consumes `AppContext`'s `useTheme()`), `client/src/components/ui/LangToggle.jsx` (new, consumes `AppContext`'s `useLang()`).
- `client/src/lib/i18n.js` becomes functional (its imports currently point at files that don't exist).
- Dependencies already present in `client/package.json`: `framer-motion`, `i18next`, `react-i18next` — no new installs required.
