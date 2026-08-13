## 1. Locale prep

- [x] 1.1 Add `nav.skills` key to `client/src/locales/es.json` and `client/src/locales/en.json`

## 2. Global smooth scroll

- [x] 2.1 Add `scroll-behavior: smooth` (and a `scroll-margin-top` on section targets equal to the nav height, so anchored sections aren't hidden under the sticky nav) to the global stylesheet

## 3. Nav component

- [x] 3.1 Create `client/src/components/layout/Nav.jsx`: sticky top bar using `navBg`/`dark-navBg` + `backdrop-blur`
- [x] 3.2 Brand mark: `~/` (reduced opacity) + first name from `cv-data.json` (via `useLang()`), in `font-mono`
- [x] 3.3 Inline anchor links (`#sobre-mi`, `#experiencia`, `#skills`, `#proyectos`, `#contacto`) using `nav.*` i18n labels, visible `md:flex`, hidden below `md`
- [x] 3.4 Mount `LangToggle` and `ThemeToggle` on the right side of the nav
- [x] 3.5 Add hamburger button (visible only below `md`) toggling local open/close state; render the same anchor links in a collapsible mobile panel when open
- [x] 3.6 Closing the mobile menu on link click (so navigating collapses the panel)

## 4. Footer component

- [x] 4.1 Create `client/src/components/layout/Footer.jsx`: centered `</[firstName]>` in `font-mono`, subtle `border-t`

## 5. App shell

- [x] 5.1 In `client/src/App.jsx`, remove `DesignSystemPreview` and the Vite starter `AppShell` markup (and now-unused imports: `useState`, `reactLogo`, `viteLogo`, `heroImg`, `Button`, `Badge`, `Card`, `SectionLabel`, `./App.css` if no longer referenced)
- [x] 5.2 Render `Nav`, five placeholder `<div>` sections with ids `sobre-mi`, `experiencia`, `skills`, `proyectos`, `contacto` (in that order), and `Footer`, all inside `AppProvider`

## 6. Verification

- [x] 6.1 Run the app locally; confirm nav stays fixed/sticky with visible blur while scrolling over placeholder sections in both light and dark theme
- [x] 6.2 Click each nav link and confirm smooth scroll to the matching section id, unobscured by the sticky nav
- [x] 6.3 Resize to a mobile viewport; confirm links collapse behind the hamburger and the menu opens/closes correctly
- [x] 6.4 Confirm `LangToggle`/`ThemeToggle` still function correctly from within the nav
