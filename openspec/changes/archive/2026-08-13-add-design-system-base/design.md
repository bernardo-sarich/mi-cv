## Context

The `client` app uses Tailwind v4 via `@tailwindcss/postcss`, configured through a plain `tailwind.config.js` (CommonJS-style `theme.extend`, not the CSS-first `@theme` syntax). `darkMode: 'class'` is already set. `src/App.jsx` currently renders the Vite/React starter boilerplate, not real CV content. There is no TypeScript in this project (`.jsx` only, with `@types/react` present only for editor tooling), so components will be plain JSX. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Replace the current placeholder color tokens with the exact dark/light values supplied by the user, addressable as flat Tailwind color names (`bg-bg`, `text-text`, `border-border`, `bg-accent`, etc.).
- Keep font family config (`sans` → Inter, `mono` → JetBrains Mono) working as Tailwind utilities.
- Ship four small, dependency-free presentational components under `src/components/ui/`.
- Add a temporary, clearly-marked visual check block in `App.jsx` for manual verification in both themes; this is scaffolding, not permanent product UI.

**Non-Goals:**
- Rebuilding the actual CV page sections/content (hero, nav, etc.) — out of scope for this change.
- Adding a theme toggle UI/persistence system beyond a minimal manual switch used for verification.
- Introducing TypeScript to the project.
- Sourcing/hosting the Inter and JetBrains Mono font files if they are not already available — implementation will check `index.html`/`index.css` for existing font loading and only add a link/`@font-face` if genuinely missing, without pulling in a new font-loading dependency.

## Decisions

1. **Flat token names, no nested `light`/`dark` keys.** The current config nests `light`/`dark` under each color name (e.g. `bg.light`, `bg.dark`) and expects call sites to pick manually. The new tokens instead define a single flat name per token (`bg`, `surface`, `border`, `text`, `textDim`, `accent`, `accentDim`, `onAccent`, `navBg`) whose value is the **light** value, with dark values applied through Tailwind's `dark:` variant on a matching `dark-<token>` set (e.g. `bg-bg dark:bg-dark-bg`). This matches how the user specified the palette (one flat list per theme) and lets each component just add `dark:` variants instead of re-deriving `light`/`dark` per usage.
   - Alternative considered: CSS custom properties (`--color-bg`) swapped by the `dark` class, referenced via `theme.extend.colors.bg: 'var(--color-bg)'`. Rejected for this change to keep the diff small and stay inside the existing `tailwind.config.js` pattern already in place; can be revisited later if token usage grows.
2. **Token names shadow Tailwind's built-in `text-*`/`border-*` utilities are avoided by namespacing.** Tailwind already defines core utilities like `border` (width) and `text` (color/size ambiguity risk). Using `border` and `text` as *color* names under `theme.extend.colors` is safe in Tailwind v4 (color extensions merge into `bg-*`, `text-*`, `border-*`, `fill-*`, etc. namespaces without clobbering non-color utilities), matching the exact key names the user requested (`border`, `text`, `textDim`). This is called out explicitly here since it's a common source of confusion, not because it needs a workaround.
3. **`rgba(...)` values (`navBg`, `accentDim`) are stored as literal color strings in the Tailwind theme**, not built from a base hex + opacity modifier, since the user supplied exact `rgba()` strings and Tailwind v4 accepts arbitrary CSS color strings as theme values directly.
4. **Components are presentation-only function components with a small, explicit prop surface** (e.g. `Button({ variant = 'primary', children, ...rest })`), spreading `...rest` onto the underlying element so callers can still pass `onClick`, `type`, `className`, `disabled`, etc., without the component needing to know about them individually.
5. **App.jsx demo block is temporary and isolated** in a clearly named section (e.g. a `DesignSystemPreview` component rendered above/below the existing boilerplate) so it can be deleted in one step once real sections replace the starter content; it is not treated as permanent product code.

## Risks / Trade-offs

- [Introducing a `dark-<token>` naming convention (decision 1) adds a second family of color keys instead of Tailwind's more common CSS-variable-per-token pattern] → Documented here and kept consistent across all 9 tokens so it's mechanical to extend later; can be migrated to CSS variables in a follow-up change without touching component code (only `tailwind.config.js`) since components only ever reference token utility classes.
- [Fonts may not actually be loaded anywhere yet, causing `font-mono`/`font-sans` to silently fall back] → Implementation step will explicitly check `index.html` and CSS files for existing `@font-face`/`<link>` font loading and add it if missing, and the demo block in App.jsx is the manual check for this.
- [Replacing the existing color tokens is a breaking change for any current usage of the old names (`bg-light`, etc.)] → `grep` for old token usage (`muted-`, `accent-light`, `accent-dark`, etc.) across `src/` before removing them from the config, and update/remove any hits as part of this change.

## Open Questions

None — the palette, font mapping, and component list are fully specified by the user's request.
