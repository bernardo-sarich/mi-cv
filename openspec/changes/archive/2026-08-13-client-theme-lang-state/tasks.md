## 1. Theme context

- [x] 1.1 Create `client/src/context/ThemeContext.jsx` exporting a `ThemeContext`, a `ThemeProvider` (default theme `'dark'`, `useState`-backed), and a `useTheme()` hook returning `{ theme, toggle }`.
- [x] 1.2 In `ThemeProvider`, add a `useEffect` keyed on `theme` that adds the `dark` class to `document.documentElement` when `theme === 'dark'` and removes it otherwise.

## 2. Locale files and i18next

- [x] 2.1 Create `client/src/locales/es.json` with the keys: `nav.about`, `nav.experience`, `nav.projects`, `nav.contact`, `hero.downloadCv`, `hero.viewProjects`, `experience.title`, `skills.title`, `projects.title`, `projects.viewRepo`, `contact.title`, `contact.formName`, `contact.formEmail`, `contact.formMessage`, `contact.formSubmit`, `contact.formSent` — fixed UI-chrome text only, in Spanish.
- [x] 2.2 Create `client/src/locales/en.json` with the exact same key set, in English.
- [x] 2.3 Confirm `client/src/lib/i18n.js` resolves cleanly now that both locale files exist (`lng: 'es'`, `fallbackLng: 'es'` already configured — no code change expected, verify only).

## 3. Toggle components

- [x] 3.1 Create `client/src/components/ui/ThemeToggle.jsx`: consumes `useTheme()`, renders a button that calls `toggle()` on click, and crossfades its label/icon (Framer Motion `AnimatePresence` + `motion.span` keyed on `theme`, ~150-200ms opacity transition) when the theme changes.
- [x] 3.2 Create `client/src/components/ui/LangToggle.jsx`: consumes `useTranslation()` from `react-i18next`, renders a button that calls `i18n.changeLanguage(...)` to switch between `es`/`en` on click, and crossfades its label (same Framer Motion pattern keyed on the active language) when the language changes.

## 4. Manual verification

- [x] 4.1 Temporarily mount `ThemeProvider` around `App` in `client/src/main.jsx` (or `App.jsx`) and render `ThemeToggle` + `LangToggle` somewhere visible (e.g. alongside the existing `DesignSystemPreview` block). *(Note: consolidated into existing `AppProvider`/`AppContext.jsx` per user decision — see design note below.)*
- [x] 4.2 Run the dev server (`npm run dev` in `client/`) and confirm in the browser: app starts with the `dark` class present and `es` as the active language.
- [x] 4.3 Click `ThemeToggle` and confirm the `dark` class is removed/re-added on `<html>`, design-system tokens (bg/surface/text colors) flip accordingly, and the toggle's own content crossfades rather than snapping.
- [x] 4.4 Click `LangToggle` and confirm any text bound to the locale keys switches between Spanish and English immediately, and the toggle's own content crossfades. *(Verified button label/state switch; no page copy is bound to i18n keys yet since real page sections don't exist.)*
- [x] 4.5 Remove the temporary verification wiring from step 4.1 that isn't meant to remain (keep only what the change's scope calls for; do not leave ad hoc debug markup in `App.jsx`/`main.jsx`).
