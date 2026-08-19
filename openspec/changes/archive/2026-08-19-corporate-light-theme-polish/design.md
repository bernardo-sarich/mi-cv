## Context

Ver proposal.md para la motivación. Este documento cubre solo las decisiones técnicas puntuales que no son obvias a partir de las specs.

## Goals / Non-Goals

**Goals:**
- Ajustar valores de spacing/elevación existentes (Tailwind utilities) sin introducir nuevos tokens de color ni nuevos componentes.
- Que `MatrixRain` deje de montar en tema claro reusando el mecanismo de gating que ya existe para viewport angosto y reduced-motion (el `enabled` booleano), en vez de introducir una rama de renderizado nueva.

**Non-Goals:**
- No se rediseña la paleta de `design-system` (`accent`, `bg`, `border`, etc.) — se mantiene intacta.
- No se toca ningún componente con borde propio fuera de `Card` (`Nav`, `Button`, `Badge`, inputs de `Contact`, el bloque `$ who-am-i` de `Hero`).
- No se re-tunean `FADE_ALPHA`, `FRAME_MS`, el resize, el `visibilitychange` ni el gate de `prefers-reduced-motion` de `MatrixRain` — siguen intactos.

## Decisions

**`Card`: sombra en claro vía `shadow-sm`, sin inventar un valor custom.** La consigna era no introducir tokens nuevos — `shadow-sm` es la utility de elevación más chica que ofrece Tailwind por defecto y alcanza para separar la card del fondo `bg`/`surface` (que en claro son `#f7f8f7`/`#ffffff`, muy cercanos entre sí) sin leer como una card "flotante". En dark se deja `shadow-none` explícito para que quede claro en el código que la ausencia de sombra ahí es intencional, no un olvido.

**`Card`: borde transparente en vez de `border-none` en claro.** Se mantiene `border border-transparent` (en lugar de quitar la clase `border` directamente) porque los consumidores (`ProjectCard`, `ContactLink`) ya aplican `hover:border-accent` por encima — necesitan que la propiedad `border-width` siga presente en el elemento para que el borde de accent aparezca en hover sin un salto de layout (cambiar de "sin borde" a "con borde de 1px" en hover desplazaría el contenido 1px). `border-transparent` mantiene el ancho reservado y solo cambia de color.

**`MatrixRain`: gating por tema reutiliza el `enabled` existente.** El componente ya condiciona su montaje completo (`if (!enabled) return null`) a `isWide && !prefersReducedMotion`; agregar `&& theme === 'dark'` a esa misma expresión hace que todo el mecanismo de mount/unmount, cleanup de listeners y cancelación de `requestAnimationFrame` que ya existe para los otros dos casos (viewport angosto, reduced motion) se aplique gratis al caso de tema claro, sin lógica nueva de limpieza.

**`MatrixRain`: opacidad fija más alta en vez de un segundo eje de intensidad.** Para que el efecto "se note más" en dark se sube `LAYER_OPACITY` de 0.31 a 0.42 (dentro del nuevo rango de spec 0.15–0.45) en lugar de tocar velocidad de caída o densidad de columnas — es el cambio de menor superficie que logra el efecto pedido, y no interactúa con ningún otro requirement de la spec (throttling, fade, gutter width) que si se dejan sin tocar.

## Risks / Trade-offs

- [Con `shadow-sm` fijo (no ajustable por variante), todas las `Card` del sitio en claro comparten la misma intensidad de sombra] → Aceptable: es el mismo comportamiento que ya tenían con el borde uniforme, no se pierde consistencia.
- [Subir `LAYER_OPACITY` a 0.42 hace que MatrixRain sea más prominente en dark, acercándose al techo del rango 0.15–0.45] → Aceptable: el pedido explícito es que "se note un poco más"; el requirement de "Restrained ambient visual treatment" sigue acotando el rango para que no se convierta en un elemento focal.
