## Context

`client/` ya tiene un scaffold generado por Vite (React 19, Vite 8) con `tailwindcss`, `postcss` y `autoprefixer` en `devDependencies`, y `oxlint` como linter. No hay `tailwind.config.js`, `postcss.config.js`, ni estructura de carpetas más allá de `src/App.jsx` por defecto. Ver `proposal.md` - Why para la motivación.

## Goals / Non-Goals

**Goals:**
- Dejar `client/` con un pipeline de build, estilos, animación e i18n funcionales y listos para que las features de contenido (Hero, Experience, etc.) se construyan sobre convenciones fijas.
- Fijar la estructura de carpetas y las convenciones de nombres para que no diverjan entre features futuras.
- Dejar un sistema de theming (dark/light) y de idioma (es/en) preparado a nivel de infraestructura (contexts, tokens, locales), sin implementar aún el toggle visual ni el contenido real.

**Non-Goals:**
- No se implementa ninguna sección visual del CV (Hero, Experience, Skills, etc.) — eso son cambios futuros.
- No se conecta a la API real de Azure Functions; `lib/api.js` solo deja el contrato/fallback a mock.
- No se decide el contenido final de `cv-data.json`, solo su shape bilingüe mínimo de ejemplo.

## Decisions

- **Mantener Tailwind CSS v4** (ya instalado) en vez de introducir otra librería de estilos. Tailwind v4 usa configuración CSS-first; se agregará `tailwind.config.js` para tokens de color custom (dark/light) y `postcss.config.js` estándar con `@tailwindcss/postcss` + `autoprefixer`. Alternativa descartada: CSS Modules puro, porque no da utilidades de theming tan rápido para el resto de las fases.
- **Mantener `oxlint`** como linter en vez de migrar a ESLint. Razón: ya está configurado en el scaffold, es más rápido, y el pedido de "ESLint/Prettier básico" se resuelve agregando **Prettier** para formateo (oxlint no formatea) sin sumar el runtime más pesado de ESLint. Se documenta esta decisión porque se aparta levemente del pedido original ("ESLint/Prettier" → "oxlint + Prettier").
- **Fuentes vía Google Fonts `<link>` en `index.html`** (Inter + JetBrains Mono) en vez de self-host con `@font-face`. Razón: menor complejidad en Fase 0, sin gestión de archivos de fuente ni licensing local; se puede migrar a self-hosted más adelante si el rendimiento lo exige. Se define la referencia CSS (`font-family` tokens) en `styles/` para que el cambio a self-hosted no afecte a los consumidores.
- **Un solo `AppContext` combinado** (theme + lang) en vez de dos contexts separados. Razón: ambos son estado global de UI de bajo volumen de cambios; un solo provider reduce anidamiento de providers en `App.jsx`. Alternativa: `ThemeContext` y `LangContext` separados — descartada por simplicidad en esta fase inicial, pero se deja documentado por si el proyecto crece y conviene separarlos.
- **`data/mock/cv-data.json`** define el shape bilingüe (`{ es: {...}, en: {...} }` o campos paralelos `title_es`/`title_en`, a definir en el propio archivo) que después usará `lib/api.js` como fallback cuando la API de Azure Functions no esté disponible o en desarrollo local.

## Risks / Trade-offs

- [Elegir `oxlint` + Prettier en vez de ESLint] → Mitigación: si una feature futura necesita reglas específicas de ESLint (p. ej. plugins de accesibilidad JSX) no soportadas por oxlint, se reevalúa la migración en ese momento; el costo de cambiar más adelante es bajo porque no hay reglas custom todavía.
- [Fuentes vía Google Fonts (no self-hosted)] → Mitigación: agregar `preconnect`/`display=swap` para minimizar impacto de performance; migrar a self-host si Lighthouse lo penaliza en fases posteriores.
- [Un solo `AppContext` combinado] → Mitigación: si el contexto crece demasiado, se puede dividir en `ThemeContext`/`LangContext` sin romper consumidores si se exponen los mismos hooks (`useTheme`, `useLang`) desde el inicio.

## Migration Plan

No aplica migración de datos ni rollback especial: es la creación inicial del scaffold del cliente. Si algo falla, se puede revertir el commit de este change sin efectos secundarios en `api/` u otros sistemas.
