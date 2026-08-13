## Why

The design-system tokens, theme toggle, and language toggle exist but are only wired up in a temporary preview block in `App.jsx`. The site has no persistent navigation, no page skeleton, and no footer, so none of the upcoming section work (Hero, Experience, Skills, Projects, Contact) has anywhere to land. This change builds that structural shell.

## What Changes

- Add a sticky/fixed `Nav` component with a semi-transparent, blurred background using the existing `navBg` / `dark-navBg` tokens.
- Nav shows a `~/[name]` brand mark in JetBrains Mono (the `~/` at reduced opacity), section anchor links (sobre-mi, experiencia, proyectos, contacto) with smooth scrolling, and the existing `LangToggle` / `ThemeToggle` on the right.
- Nav collapses its links into a simple hamburger menu on mobile viewports.
- Replace the Vite starter markup in `App.jsx` with the real page shell: `Nav`, five empty placeholder sections with stable ids (`sobre-mi`, `experiencia`, `skills`, `proyectos`, `contacto`), and a `Footer`.
- Add a `Footer` component: centered, `</[name]>` text in JetBrains Mono, subtle top border.
- Remove the temporary `DesignSystemPreview` block from `App.jsx` now that real structure replaces it.
- Add a `nav.skills` i18n key (es/en) since the nav/sections list now includes a Skills anchor that didn't previously exist in locale files.

## Capabilities

### New Capabilities
- `site-layout`: persistent page shell — sticky/blurred nav with anchor navigation and responsive menu, section scaffold with anchor ids, and site footer.

### Modified Capabilities
(none — `theme-state` and `i18n-state` are consumed as-is, not changed)

## Impact

- Affected files: `client/src/App.jsx`, new `client/src/components/layout/Nav.jsx`, new `client/src/components/layout/Footer.jsx`, `client/src/locales/es.json`, `client/src/locales/en.json`.
- Depends on existing `design-system` tokens (`navBg`, `dark-navBg`, `border`, `text`, `accent`, `font-mono`) and existing `theme-state` / `i18n-state` hooks (`useTheme`, `useLang`) plus `LangToggle` / `ThemeToggle` components — none of these are modified.
- No backend/API impact. No new dependencies required (smooth scroll via native CSS `scroll-behavior: smooth` + anchor links).
