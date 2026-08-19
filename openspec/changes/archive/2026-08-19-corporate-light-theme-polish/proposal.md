## Why

El modo claro comparte hoy exactamente el mismo layout, densidad y elementos visuales que el modo oscuro — solo cambian los colores de los tokens. Un análisis de diseño/UX identificó que eso le hace faltar "aire corporativo" al tema claro (que la propia app ya llama "Corporate Mode"): las secciones están apretadas, las `Card` son solo un borde plano sin elevación, y el efecto MatrixRain (pensado como marca de agua "hacker") se sigue viendo en el tema que se supone que es el sobrio.

## What Changes

- Más padding vertical en las 5 secciones de página (`Hero`, `Experience`, `Skills`, `Projects`, `Contact`): de `py-8` a `py-14 sm:py-16`. Aplica a ambos temas por igual.
- Más separación entre el título de cada sección y su contenido: `mt-8` → `mt-12` en `Skills`, `Experience`, `Projects` y `Contact`. Aplica a ambos temas.
- `Card` (`components/ui/Card.jsx`) gana una sombra suave y pierde el borde visible en tema claro; en tema oscuro se mantiene el borde actual, sin sombra. Los tres usos de `Card` con padding propio (`Skills`, `Projects`, `Contact`) y el `Stat` de `Hero` suben un escalón de padding interno.
- `MatrixRain` (`components/ui/MatrixRain.jsx`) deja de renderizarse por completo en tema claro (antes mostraba un gris decorativo); en tema oscuro se sube la opacidad para que se note un poco más. Se elimina la lógica de color-por-tema al quedar un solo color fijo.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `design-system`: el requirement "Card component" cambia de "borde token en todo tema" a un tratamiento de elevación distinto por tema — sombra suave sin borde en claro, borde token sin sombra en oscuro.
- `matrix-rain-background`: el requirement "Rain color follows the active theme" se reemplaza por un color fijo único (ya no hay variación por tema, porque el efecto deja de existir en claro). Se agrega un nuevo requirement "Effect is limited to dark theme" paralelo al ya existente "Effect is limited to wide viewports". El requirement "Restrained ambient visual treatment" sube el techo de su rango de opacidad efectiva de 0.35 a 0.45 para reflejar el nuevo valor, más notorio, en oscuro.

## Impact

- `client/src/components/sections/Hero.jsx`, `Experience.jsx`, `Skills.jsx`, `Projects.jsx`, `Contact.jsx`: padding de `<section>`, `mt-*` de contenido, padding de `Card`/`Stat`.
- `client/src/components/ui/Card.jsx`: clases base de borde/sombra.
- `client/src/components/ui/MatrixRain.jsx`: condición `enabled`, color fijo, `LAYER_OPACITY`.
- `openspec/specs/design-system/spec.md`, `openspec/specs/matrix-rain-background/spec.md`: requirements afectados.
- Sin impacto en `api/`, en `theme-state` (no tiene requirements sobre MatrixRain), ni en `Nav`, `Button`, `Badge` o los inputs de `Contact` (siguen con su borde tal cual).
