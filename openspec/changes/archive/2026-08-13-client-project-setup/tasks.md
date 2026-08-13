## 1. Verificación del scaffold base

- [x] 1.1 Confirmar que `client/` corre con `npm run dev` sobre el scaffold actual de Vite + React (baseline antes de tocar nada).
- [x] 1.2 Revisar `package.json` de `client/` y confirmar versiones de `react`, `react-dom`, `vite`, `tailwindcss`, `postcss`, `autoprefixer` ya instaladas.

## 2. Tailwind CSS

- [x] 2.1 Crear `client/tailwind.config.js` con `content` apuntando a `./index.html` y `./src/**/*.{js,jsx}`.
- [x] 2.2 Definir tokens de color dark/light (paleta base) dentro de `tailwind.config.js` (`theme.extend.colors`).
- [x] 2.3 Crear `client/postcss.config.js` con `@tailwindcss/postcss` + `autoprefixer`.
- [x] 2.4 Crear `client/src/styles/tailwind.css` con las directivas de Tailwind e importarlo desde `main.jsx`.

## 3. Dependencias de runtime

- [x] 3.1 Instalar `framer-motion` en `client/`.
- [x] 3.2 Instalar `react-i18next` e `i18next` en `client/`.

## 4. Fuentes

- [x] 4.1 Agregar `<link>` de Google Fonts (Inter + JetBrains Mono) con `preconnect` en `client/index.html`.
- [x] 4.2 Definir tokens de `font-family` (texto = Inter, títulos/código = JetBrains Mono) en `client/src/styles/tailwind.css` o `tailwind.config.js` (`theme.extend.fontFamily`).

## 5. Estructura de carpetas

- [x] 5.1 Crear `client/src/components/layout/` (vacío o con `.gitkeep`).
- [x] 5.2 Crear `client/src/components/sections/` (vacío o con `.gitkeep`).
- [x] 5.3 Crear `client/src/components/ui/` (vacío o con `.gitkeep`).
- [x] 5.4 Crear `client/src/hooks/` con stubs mínimos: `useTypingEffect.js`, `useScrollReveal.js`, `useCounterAnimation.js`, `useCVData.js`.
- [x] 5.5 Crear `client/src/context/` con `AppContext.jsx` (theme + lang combinado, según design.md) exponiendo `useTheme` y `useLang`.
- [x] 5.6 Crear `client/src/data/mock/cv-data.json` con shape bilingüe de ejemplo.
- [x] 5.7 Crear `client/src/locales/es.json` y `client/src/locales/en.json` con textos fijos de UI de ejemplo (nav, footer).
- [x] 5.8 Crear `client/src/lib/api.js` con función de fetch a Azure Functions y fallback a `data/mock/cv-data.json`.
- [x] 5.9 Actualizar `client/src/App.jsx` para envolver la app con `AppContext` provider e inicializar `i18next`.

## 6. Linting y formateo

- [x] 6.1 Confirmar configuración de `oxlint` existente (`.oxlintrc.json` o equivalente) y ajustarla si falta.
- [x] 6.2 Instalar y configurar Prettier (`.prettierrc`, `.prettierignore`) en `client/`.
- [x] 6.3 Agregar scripts `format`/`format:check` a `client/package.json`.

## 7. Verificación final

- [x] 7.1 Correr `npm run dev` y confirmar que la app carga sin errores con Tailwind aplicado y fuentes cargadas.
- [x] 7.2 Correr `npm run lint` y `npm run format:check` sin errores.
- [x] 7.3 Confirmar que `useCVData` puede leer `data/mock/cv-data.json` vía `lib/api.js` (fallback) sin llamar a una API real.
