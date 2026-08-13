## 1. Data

- [x] 1.1 Define placeholder skill category data (Languages, Frameworks, Infra, Data) with category name + list of skill items, colocated in `Skills.jsx` or a small local constant.

## 2. Skills section component

- [x] 2.1 Create `client/src/components/sections/Skills.jsx` with `<section id="stack">`, `SectionLabel`, and `h2` heading matching the Experience section's pattern.
- [x] 2.2 Render a responsive grid of category `Card`s (`grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`).
- [x] 2.3 Inside each `Card`, render the category name (uppercase, small, `textDim`) and its skills as `Badge` components.

## 3. Scroll reveal and badge animation

- [x] 3.1 Wire each category to its own `useScrollReveal` call so categories reveal independently as they enter the viewport.
- [x] 3.2 Animate each category's badges with `framer-motion`: scale from 0.7 to 1 using easing `cubic-bezier(0.34, 1.56, 0.64, 1)`, staggered ~0.06s per badge, triggered only once the category is visible.

## 4. Integration

- [x] 4.1 Render `<Skills />` in `App.jsx` alongside `<Hero />` and `<Experience />`.
- [x] 4.2 Verify in the browser: grid reflows responsively, categories reveal on scroll, badges pop in with stagger, light/dark theme styling matches existing sections.
