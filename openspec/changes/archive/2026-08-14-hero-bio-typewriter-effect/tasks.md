## 1. Implementación

- [x] 1.1 En `client/src/components/sections/Hero.jsx`, agregar `const typedBio = useTypingEffect(data.bio, 20)` y renderizar `reduced ? data.bio : typedBio` en el `motion.p` del bio, en vez de `data.bio` directamente.
- [ ] 1.2 Verificar manualmente (`npm run dev`) que el bio tipea de a un carácter en la carga inicial, que cambiar de idioma reinicia el tipeo con el bio del nuevo idioma, y que con `prefers-reduced-motion: reduce` el bio aparece completo sin animación.

## 2. Verificación

- [x] 2.1 Correr `npm run lint` y `npm run build` desde `client/` y confirmar que pasan.
