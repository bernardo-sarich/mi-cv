## 1. Audit existing usage

- [x] 1.1 Grep `client/src/**` for usages of the old token names (`bg-light`, `bg-dark`, `surface-light`, `surface-dark`, `text-light`, `text-dark`, `muted-light`, `muted-dark`, `accent-light`, `accent-dark`, `border-light`, `border-dark`) and note every call site to update or remove — found one: `client/src/styles/tailwind.css` body rule uses `bg-bg-light text-text-light dark:bg-bg-dark dark:text-text-dark`
- [x] 1.2 Check `client/index.html` and `client/src/index.css`/`App.css` for existing Inter / JetBrains Mono font loading; note whether fonts need to be added — already loaded via Google Fonts `<link>` in `client/index.html`; no changes needed

## 2. Tailwind theme configuration

- [x] 2.1 Replace `theme.extend.colors` in `client/tailwind.config.js` with the flat light-value tokens (`bg`, `navBg`, `surface`, `border`, `text`, `textDim`, `accent`, `accentDim`, `onAccent`) using the exact light values from proposal.md
- [x] 2.2 Add matching `dark-<token>` color entries with the exact dark values from proposal.md, for use via the `dark:` variant
- [x] 2.3 Confirm `darkMode: 'class'` is set (already present) and confirm `fontFamily.sans`/`fontFamily.mono` map to Inter / JetBrains Mono with sane fallback stacks
- [x] 2.4 Add Inter / JetBrains Mono font loading to `client/index.html` or `client/src/index.css` if step 1.2 found it missing — not needed, already present
- [x] 2.5 Update or remove the call sites found in 1.1 that referenced the old token names

## 3. UI components

- [x] 3.1 Create `client/src/components/ui/Button.jsx` with `primary` (accent background, onAccent text) and `secondary` (border outline, no fill) variants, spreading extra props onto the underlying `<button>`
- [x] 3.2 Create `client/src/components/ui/Badge.jsx` rendering small bordered text for stack tags
- [x] 3.3 Create `client/src/components/ui/Card.jsx` rendering a `surface` + `border` + rounded container
- [x] 3.4 Create `client/src/components/ui/SectionLabel.jsx` rendering small, reduced-opacity `font-mono` decorative label text
- [x] 3.5 Ensure all four components apply `dark:` variants for every themed color so they render correctly in both themes

## 4. Visual verification in App.jsx

- [x] 4.1 Add a temporary, clearly-labeled preview section/component in `client/src/App.jsx` that renders each of the 4 new components with representative props (e.g. Button primary/secondary, a few Badges, a Card with text, a SectionLabel)
- [x] 4.2 Add a minimal manual dark/light toggle (e.g. a button that toggles the `dark` class on `document.documentElement`) scoped to this preview so both themes can be checked without devtools
- [x] 4.3 Run the dev server and visually confirm colors, contrast, and fonts match the spec in both themes; capture a screenshot or note any discrepancy — browser automation unavailable this session (chromium-cli not installed, claude-in-chrome declined); verified at the build level instead: `curl`'d the dev-server-transformed `tailwind.css` and confirmed generated utilities match the spec exactly (`.bg-accent{background-color:#1f9d5c}`, `.text-onAccent{color:#ffffff}`, `.text-textDim{color:#5b6863}`, `dark-accent:is(.dark *){background-color:#3ddc84}`, `dark-bg:is(.dark *){background-color:#0a0d0c}`, `.font-mono{font-family:var(--font-mono)}` resolving to JetBrains Mono), and confirmed `App.jsx` compiles cleanly via Vite (200, no error overlay). Manual visual confirmation in an actual browser is still recommended — dev server running at http://localhost:5184

## 5. Validation

- [x] 5.1 Run `npm run lint` and `npm run format:check` in `client/` — lint passes (only 2 pre-existing warnings in `AppContext.jsx`, unrelated to this change); format check passes
- [x] 5.2 Run `openspec validate add-design-system-base --strict` and fix any reported issues — valid, no issues
