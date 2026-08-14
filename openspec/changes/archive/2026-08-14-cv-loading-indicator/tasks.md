## 1. i18n strings

- [x] 1.1 Add a `loading` key to `client/src/locales/es.json` and `en.json` (e.g. `loading.cv`: `"conectando con la API..."` / `"connecting to the API..."`)

## 2. LoadingScreen component

- [x] 2.1 Create `client/src/components/ui/LoadingScreen.jsx`: a `flex-1` centered block using `SectionLabel`-style monospace text (`t('loading.cv')`) fed through `useTypingEffect`, followed by a `▍` cursor using the existing `.animate-blink` class, all styled with the site's `text`/`textDim`/`bg` design tokens (light + `dark:` pair)
- [x] 2.2 Guard the typing animation with `useReducedMotion()` (framer-motion): when reduced motion is preferred, render the full string immediately instead of feeding it through `useTypingEffect`, and omit the blinking cursor

## 3. Wire into App

- [x] 3.1 In `client/src/App.jsx`, call `useCVData()` for `loading` and conditionally render `<LoadingScreen />` in place of the `Hero/Experience/Skills/Projects/Contact` stack while `loading` is `true`, leaving `Nav`, `Footer`, and both `MatrixRain` instances unaffected

## 4. Verification

- [x] 4.1 Run `npm run lint` from `client/` and confirm it passes
- [x] 4.2 Run `npm run build` from `client/` and confirm it succeeds
- [x] 4.3 Verify locally with `swa start`: on first load, the loading placeholder appears in place of the section stack, then is replaced once `/api/cv` resolves; switching language re-triggers it briefly
