## 1. Initial language detection

- [x] 1.1 In `client/src/lib/i18n.js`, drop the hardcoded `lng: 'es'` from `i18n.init` (keep `fallbackLng: 'es'`).
- [x] 1.2 In `client/src/context/AppContext.jsx`, replace the `useState(i18n.language?.slice(0, 2) || 'es')` initializer with logic that reads `navigator.language` once and resolves to `'es'` when it's an `es-*` locale, `'en'` otherwise.
- [x] 1.3 Verify the existing `i18n.changeLanguage(lang)` effect still applies the resolved initial language on mount, and that `toggleLang` is untouched.

## 2. Language toggle icon

- [x] 2.1 Add an inline outline globe SVG icon component to `client/src/components/ui/LangToggle.jsx` (~16px, `viewBox="0 0 24 24"`, `stroke="currentColor"`, matching the existing hand-written icon convention used in `Nav.jsx`/`Contact.jsx` — no icon library dependency).
- [x] 2.2 Render the globe icon to the left of the "ES"/"EN" label inside the toggle button, keeping the existing crossfade animation and `aria-label` behavior on the label only.

## 3. Verification

- [x] 3.1 Run `npm run lint` from `client/`.
- [x] 3.2 Run `npm run build` from `client/`.
