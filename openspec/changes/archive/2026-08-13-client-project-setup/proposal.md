## Why

El proyecto necesita una base de frontend (Fase 0) antes de poder construir cualquier sección del CV. Sin scaffolding de build tooling, estilos, animaciones, i18n y una estructura de carpetas consistente, cada feature futura (Hero, Experience, Skills, etc.) se implementaría de forma ad-hoc y sin convenciones compartidas.

## What Changes

- Confirmar/completar el scaffold de Vite + React en `client/` (ya existe un scaffold base con Vite 8 y React 19).
- Instalar y configurar Tailwind CSS (`tailwind.config.js`, `postcss.config.js`) — Tailwind ya está en `devDependencies`, falta la configuración de tokens de color (dark/light).
- Instalar dependencias de runtime: `framer-motion`, `react-i18next`, `i18next`.
- Configurar fuentes Inter (texto) y JetBrains Mono (títulos/código) vía Google Fonts o self-hosted con `@font-face`.
- Crear la estructura de carpetas en `client/src/`: `components/{layout,sections,ui}`, `hooks/`, `context/`, `data/`, `locales/`, `styles/`, `lib/`.
- Configurar ESLint/Prettier básico (el scaffold actual usa `oxlint`; se evalúa mantenerlo o migrar a ESLint+Prettier según lo pedido).
- Crear placeholders vacíos/mínimos para los hooks (`useTypingEffect`, `useScrollReveal`, `useCounterAnimation`, `useCVData`), contexts (`ThemeContext`, `LangContext`), datos mock (`data/mock/cv-data.json`) y locales (`locales/es.json`, `locales/en.json`).

## Capabilities

Este cambio es puro tooling/scaffolding: no introduce ni modifica comportamiento observable del sistema (no hay UI renderizada, ni lógica de negocio, ni contratos de API). Por eso no declara capabilities y el change usa `skip_specs: true` en `.openspec.yaml`.

### New Capabilities
_(ninguna — ver nota arriba)_

### Modified Capabilities
_(ninguna)_

## Impact

- **Código afectado**: `client/` completo (config de build, `package.json`, nueva estructura de `src/`).
- **Dependencias nuevas**: `tailwindcss` (config), `framer-motion`, `react-i18next`, `i18next`, fuentes web (Google Fonts o assets self-hosted).
- **Sistemas**: ninguno fuera del frontend; no afecta `api/` ni `swa-cli.config.json`.
- **Riesgo**: bajo — es trabajo de base sin lógica de negocio; el mayor riesgo es desalinear la estructura de carpetas con lo que asuman features futuras.
