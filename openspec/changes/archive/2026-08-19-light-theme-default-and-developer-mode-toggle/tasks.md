## 1. Theme default

- [x] 1.1 In `client/src/context/AppContext.jsx`, add a `detectInitialTheme()` helper (mirroring the existing `detectInitialLang()`) that returns `'dark'` when `window.matchMedia('(prefers-color-scheme: dark)').matches` is `true`, and `'light'` otherwise (including when `window.matchMedia` is unavailable).
- [x] 1.2 Change `const [theme, setTheme] = useState('dark')` to `useState(detectInitialTheme)`.

## 2. Developer Mode toggle copy

- [x] 2.1 In `client/src/locales/en.json` and `client/src/locales/es.json`, replace the `theme.switchToLight`/`theme.switchToDark` keys with four keys: `theme.developerMode`, `theme.corporateMode` (visible button text) and `theme.switchToDeveloperMode`, `theme.switchToCorporateMode` (aria-label). English: "Developer Mode" / "Corporate Mode" / "Switch to developer mode" / "Switch to corporate mode". Spanish: "Modo Desarrollador" / "Modo Corporativo" / "Cambiar a modo desarrollador" / "Cambiar a modo corporativo".
- [x] 2.2 In `client/src/components/ui/ThemeToggle.jsx`, update the `label` (aria-label) and the rendered `motion.span` text so that when `theme === 'light'` both use the Developer Mode strings (`theme.switchToDeveloperMode` / `theme.developerMode`), and when `theme === 'dark'` both use the Corporate Mode strings (`theme.switchToCorporateMode` / `theme.corporateMode`), replacing the current literal `'Dark'`/`'Light'` text.

## 3. Docs

- [x] 3.1 Update the `CLAUDE.md` line stating theme/language "arrancan en dark/es" to describe the actual detection: language from `navigator.language`, theme from `prefers-color-scheme`, neither persisted between sessions.

## 4. Spec sync

- [x] 4.1 Confirm the delta in `specs/theme-state/spec.md` matches the implemented default and copy before sync/archive.

## 5. Verification

- [x] 5.1 From `client/`, run `npm run lint` and `npm run build`; both must pass before archiving.
