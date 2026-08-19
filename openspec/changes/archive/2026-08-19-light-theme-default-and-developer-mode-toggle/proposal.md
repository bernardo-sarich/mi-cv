## Why

El tema inicial del sitio está hoy hardcodeado a `dark` sin importar la preferencia del sistema operativo del visitante, y el control de toggle muestra literalmente el nombre del tema activo ("Dark"/"Light"). Se quiere que el sitio arranque en un tema claro "corporativo" por defecto — salvo que el sistema operativo/navegador ya esté en modo oscuro, en cuyo caso debe respetarlo — y que el toggle adopte un copy más distintivo ("Developer Mode" / "Corporate Mode") que invite a explorar el tema oscuro como una especie de easter egg, en vez de limitarse a nombrar el tema actual.

## What Changes

- El estado inicial de `theme` en `AppContext.jsx` deja de ser siempre `'dark'`: se calcula una vez al montar con `window.matchMedia('(prefers-color-scheme: dark)').matches` — `true` inicializa en `'dark'`, cualquier otro caso (incluida la ausencia de `matchMedia`) inicializa en `'light'`. El theme sigue sin persistir entre sesiones (se recalcula en cada carga) y el toggle manual no cambia.
- El texto visible y el `aria-label` de `ThemeToggle` dejan de nombrar el tema activo ("Dark"/"Light") y pasan a nombrar la acción/destino con la narrativa Developer/Corporate Mode: en tema claro el control muestra "Developer Mode" (invita a pasar a oscuro); en tema oscuro muestra "Corporate Mode" (invita a volver al claro). Se mantiene el patrón existente de que el `aria-label` describe el tema de destino, y se traduce a `es`/`en` siguiendo la convención i18n ya usada para este control.
- Se actualiza la nota de `CLAUDE.md` que describe el theme arrancando siempre en `dark`.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `theme-state`: el requirement "Global theme context" cambia el escenario de default fijo (`dark`) por un default que depende de `prefers-color-scheme` (`dark` si el SO lo pide, `light` en cualquier otro caso). El requirement "Theme toggle accessible name" cambia el copy que describe el tema de destino, de "switch to light/dark mode" al vocabulario Developer/Corporate Mode.

## Impact

- `client/src/context/AppContext.jsx`: inicialización de `theme` (nueva función `detectInitialTheme`, análoga a `detectInitialLang`).
- `client/src/components/ui/ThemeToggle.jsx`: texto visible y `aria-label`.
- `client/src/locales/es.json`, `client/src/locales/en.json`: keys de `theme.*` usadas por el toggle.
- `openspec/specs/theme-state/spec.md`: requirements de default y de accessible name.
- `CLAUDE.md`: nota sobre theme/lang arrancando en dark/es.
- Sin impacto en `matrix-rain-background` ni en `MatrixRain.jsx` — el color por tema de esa capability ya fue actualizado en un change previo y archivado, independiente de este.
