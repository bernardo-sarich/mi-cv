## 1. Spacing de secciones

- [x] 1.1 En `Hero.jsx`, `Experience.jsx`, `Skills.jsx`, `Projects.jsx` y `Contact.jsx`, cambiar la clase de la `<section>` de `px-6 py-8 sm:px-8` a `px-6 py-14 sm:px-8 sm:py-16`.
- [x] 1.2 En `Skills.jsx`, `Experience.jsx`, `Projects.jsx` y `Contact.jsx`, cambiar el `mt-8` del wrapper de contenido bajo `SectionTitle` a `mt-12`.

## 2. Elevación de `Card` y padding interno

- [x] 2.1 En `components/ui/Card.jsx`, cambiar la clase base de `rounded-xl border border-border dark:border-dark-border bg-surface dark:bg-dark-surface` a `rounded-xl border border-transparent dark:border-dark-border bg-surface dark:bg-dark-surface shadow-sm dark:shadow-none`.
- [x] 2.2 En `Skills.jsx` (`SkillCategory`), subir el padding de `Card` de `p-5` a `p-6`.
- [x] 2.3 En `Projects.jsx` (`ProjectCard`), subir el padding de `Card` de `p-5` a `p-6`.
- [x] 2.4 En `Contact.jsx` (`ContactLink`), subir el padding de `Card` de `p-4` a `p-5`.
- [x] 2.5 En `Hero.jsx` (`Stat`), subir el padding de `Card` de `px-5 py-4` a `px-6 py-5`.

## 3. MatrixRain solo en tema oscuro

- [x] 3.1 En `components/ui/MatrixRain.jsx`, eliminar el objeto `ACCENT_BY_THEME`, el `useEffect` que sincroniza `colorRef.current` con `theme`, y el `useRef` inicializado desde `ACCENT_BY_THEME.dark`; reemplazar por una constante fija `RAIN_COLOR = '#3ddc84'` usada directamente en `draw()`.
- [x] 3.2 Cambiar `LAYER_OPACITY` de `0.31` a `0.42`.
- [x] 3.3 Cambiar la condición `enabled` de `isWide && !prefersReducedMotion` a `isWide && !prefersReducedMotion && theme === 'dark'`.

## 4. Specs y verificación

- [x] 4.1 Confirmar que `openspec/changes/corporate-light-theme-polish/specs/design-system/spec.md` y `specs/matrix-rain-background/spec.md` reflejan exactamente el comportamiento implementado (ya redactados en la fase de propuesta; revisar tras implementar por si algún detalle cambió).
- [x] 4.2 Correr `npm run lint` en `client/`.
- [x] 4.3 Correr `npm run build` en `client/`.
