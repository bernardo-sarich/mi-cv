## Why

El bloque terminal del Hero ya usa un efecto de tipeo para la línea `$ who-am-i`, pero el párrafo de bio aparece de golpe. Extender ese mismo efecto al bio refuerza la estética "terminal" del sitio y da más peso visual al texto que presenta al dueño del sitio.

## What Changes

- El párrafo de bio del Hero (`data.bio`) revela sus letras de a una, simulando que alguien lo está tipeando, en vez de aparecer completo de una vez.
- El nombre (`data.name`, heading principal) NO se ve afectado: sigue apareciendo de forma instantánea como hasta ahora.
- El efecto se re-dispara cada vez que cambia el bio (por ejemplo, al cambiar de idioma), mostrando el texto del nuevo idioma tipeado desde cero.
- Con `prefers-reduced-motion: reduce` activo, el bio se muestra completo de inmediato, sin animación de tipeo — igual que el resto de las animaciones del Hero.
- Reutiliza el hook existente `useTypingEffect` (ya usado en el bloque terminal) en vez de introducir un mecanismo de animación nuevo.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `hero-section`: el requirement de "Bio paragraph" pasa a exigir que el texto se revele con efecto de tipeo (carácter por carácter) en vez de aparecer completo, y a especificar el comportamiento con reduced-motion.

## Impact

- `client/src/components/sections/Hero.jsx`: aplicar `useTypingEffect` al bio en vez de renderizar `data.bio` directamente; leer `useReducedMotion` (ya importado en el archivo) para decidir si tipear o mostrar completo.
- Sin cambios de API, datos ni dependencias nuevas.
