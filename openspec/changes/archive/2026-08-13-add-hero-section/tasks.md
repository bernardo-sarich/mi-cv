## 1. Hooks

- [x] 1.1 Update `client/src/hooks/useCounterAnimation.js` to accept an optional `start` boolean param (default `true`) so the count-up only begins once `start` is truthy, without changing behavior for a caller that omits it
- [x] 1.2 Verify `client/src/hooks/useTypingEffect.js` matches the required `(text, speedMs)` signature and progressively reveals `text`; adjust only if it deviates
- [x] 1.3 Add `blink` (`step-end`, 1s, infinite) and `pulseRing` (expanding scale + fading opacity, infinite) `@keyframes` to `client/src/styles/tailwind.css`

## 2. Hero component

- [x] 2.1 Create `client/src/components/sections/Hero.jsx` rendering `<section id="sobre-mi">`
- [x] 2.2 Build the terminal block: static `$ who-am-i` line in `textDim`, typed `who-am-i` line via `useTypingEffect` (~70ms/char), and a `▍` cursor span using the `blink` animation
- [x] 2.3 Build the name/status/role row: `h1` name in `font-mono`, large/bold; online indicator (accent dot + `pulseRing` animation + "online" label); role badge using `Badge`/`accentDim`+`accent` styling
- [x] 2.4 Add placeholder bio paragraph
- [x] 2.5 Add CTA buttons: primary "Descargar CV" (`Button` `variant="primary"`, no handler) and secondary "Ver proyectos →" (`Button` `variant="secondary"`, `onClick` scrolls `#proyectos` into view via `scrollIntoView({ behavior: 'smooth' })`)
- [x] 2.6 Add stats row: use `useScrollReveal` for a ref/`isVisible` on the stats row, pass `isVisible` as `start` to `useCounterAnimation` per stat, render each animated value plus its label (e.g. "7+ años de experiencia")
- [x] 2.7 Wrap the terminal, name/status/role, bio, and buttons blocks in Framer Motion `motion.div`s with fade-in + slide-up variants and `staggerChildren: 0.08` on the parent

## 3. Integration

- [x] 3.1 Update `client/src/App.jsx` to render `<Hero />` in place of the placeholder `<div id="sobre-mi"></div>`
- [x] 3.2 Manually verify in the browser: typing effect plays once on mount, cursor blinks continuously, online dot pulses continuously, "Ver proyectos →" smooth-scrolls to `#proyectos`, stats count up only after scrolling the Hero into view, and entrance animations stagger correctly in both light and dark theme
