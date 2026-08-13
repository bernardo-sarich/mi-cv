## Why

The `client` React app currently has an ad-hoc Tailwind color palette (`tailwind.config.js`) and no reusable UI primitives — buttons, badges, cards, and section labels are styled inline per usage. Before building out the CV site's real sections, the project needs a single source of truth for its dark/light color tokens and a small set of unstyled-logic UI components so every future section reuses the same look instead of re-deriving colors and spacing by hand.

## What Changes

- **BREAKING**: Replace the existing Tailwind color tokens (`bg`, `surface`, `text`, `muted`, `accent`, `border` with `light`/`dark` sub-keys) with a new flat token set matching the exact dark/light values supplied by the user (`bg`, `navBg`, `surface`, `border`, `text`, `textDim`, `accent`, `accentDim`, `onAccent`), applied via the `dark:` variant under `darkMode: 'class'`.
- Configure `fontFamily.sans` → Inter and `fontFamily.mono` → JetBrains Mono in `tailwind.config.js` (already close to this; confirmed/kept as-is).
- Add four reusable UI components under `client/src/components/ui/`: `Button.jsx` (primary/secondary variants), `Badge.jsx`, `Card.jsx`, `SectionLabel.jsx` — plain JSX (project has no TypeScript setup), styling-only, no business logic.
- Add a temporary visual verification block in `App.jsx` rendering each new component so colors/fonts can be checked in both themes, with a toggle to switch `dark` class on `<html>`/`<body>` for manual testing.

## Capabilities

### New Capabilities
- `design-system`: Tailwind color tokens (dark/light theme values) and font family configuration, plus a set of reusable presentational UI components (Button, Badge, Card, SectionLabel) built on those tokens.

### Modified Capabilities
- (none — no other existing capability specs exist in this repo yet)

## Impact

- `client/tailwind.config.js`: color palette replaced, `darkMode: 'class'` confirmed, font families set.
- `client/src/components/ui/`: new directory with 4 new component files.
- `client/src/App.jsx`: temporary example/demo markup added to visually verify the new components and theme values.
- No new dependencies required (Tailwind v4 + `@tailwindcss/postcss` already installed); Inter and JetBrains Mono are assumed to be loaded already or added via existing font-loading mechanism (e.g. `index.html` or `index.css` `@font-face`/link tags) — verified during implementation.
