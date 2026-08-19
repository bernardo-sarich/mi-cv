## Why

En light mode, `MatrixRain` dibuja sus caracteres con `#19804b`, el mismo valor que el token `accent` del design system. Ese token está calibrado para uso como texto/botón (contraste 4.5:1 contra `bg`/`surface`), no para una decoración ambiental de fondo — el resultado es una lluvia de caracteres demasiado saturada y "gritona" para una marca de agua, y que además queda acoplada a un token pensado para otro propósito. Se quiere una estética corporativa premium: un gris suave que lea como textura de fondo, sin competir visualmente con el contenido.

## What Changes

- El color de `MatrixRain` en light mode pasa de `#19804b` (token `accent`) a `#E2E8F0` (slate-200 de Tailwind), un gris neutro decorativo desacoplado del design system.
- El modo dark no cambia: sigue usando `#3ddc84`.
- Se documenta en el código, con un comentario breve, que el fade por `destination-out` borra por canal alfa (no por color), por lo que ya es agnóstico al tema y no requiere cambios de lógica al variar el color de light mode.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `matrix-rain-background`: el requirement "Rain color follows the active theme" fija hoy el valor light en `#19804b`; pasa a `#E2E8F0` y su redacción deja de describirlo como "el accent del tema" para describirlo como un tono decorativo propio, independiente del token `accent` del design system.

## Impact

- `client/src/components/ui/MatrixRain.jsx`: constante `ACCENT_BY_THEME` y su comentario explicativo.
- `openspec/specs/matrix-rain-background/spec.md`: requirement de color, valor y redacción.
- Sin impacto en `design-system` (el token `accent` no cambia) ni en ningún otro requirement de `matrix-rain-background` (framerate, resize, visibilitychange, accesibilidad, opacidad efectiva).
