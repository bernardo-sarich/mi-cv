## 1. Locale strings

- [x] 1.1 In `client/src/locales/es.json`, reword `contact.formSent` to the demo confirmation `// mensaje enviado (demo)` and add `contact.linksTitle` (e.g. "Links")
- [x] 1.2 Mirror the same two keys in `client/src/locales/en.json` (`// message sent (demo)`, "Links"), keeping the `contact` block's key set identical across both files

## 2. Contact section scaffold

- [x] 2.1 Create `client/src/components/sections/Contact.jsx` with the standard section skeleton: `<section id="contacto" className="px-4 py-8">` → `<div className="mx-auto max-w-5xl">` → `SectionLabel` reading `<section id="contacto">` + `SectionTitle` with `t('contact.title')`
- [x] 2.2 Add the two-column body wrapper (`grid gap-8 md:grid-cols-2`), form column first, links column second

## 3. Contact form

- [x] 3.1 Add the `form` state object (`{ name, email, message }`) and a shared change handler keyed by input `name`
- [x] 3.2 Render the three labelled controls — text input, `type="email"` input, textarea — all `required`, all full-width, using the border/surface token pairs with an accent focus border in both themes
- [x] 3.3 Add the submit `Button` (`type="submit"`) inside the `<form>`, with `onSubmit` calling `e.preventDefault()`
- [x] 3.4 In the submit handler, place the `// TODO(api): … fetch('/api/contact', …)` seam comment immediately before the field reset, then clear the form state

## 4. Demo confirmation

- [x] 4.1 Add `sent` boolean state plus a `useRef` holding the pending timeout id; on submit clear any existing timer, set `sent` true, and schedule `setSent(false)` after 4000ms
- [x] 4.2 Add a `useEffect` cleanup that clears the pending timer on unmount
- [x] 4.3 Render the confirmation under the submit button in mono accent type, wrapped in framer-motion `AnimatePresence` so it fades in and out, sourcing its text from `t('contact.formSent')`

## 5. Contact links column

- [x] 5.1 Declare the `CONTACT_LINKS` module constant with three placeholder entries (GitHub `github.com/tu-usuario`, LinkedIn `linkedin.com/in/tu-usuario`, email `mailto:` address), each carrying `label`, `value`, `href` and an `Icon`
- [x] 5.2 Add the three inline SVG icon components in the same file (GitHub path can be copied from `Projects.jsx`)
- [x] 5.3 Render each entry as an `<a>` wrapping a `Card` with icon + label + value; profile links get `target="_blank" rel="noopener noreferrer"`, the email entry gets neither
- [x] 5.4 Apply the hover treatment to each block — accent border plus the `shadow-[0_0_20px_rgba(31,157,92,0.35)]` / `dark:…rgba(61,220,132,0.35)` glow used by `ProjectCard` — with a smooth transition
- [x] 5.5 Head the column with `t('contact.linksTitle')`

## 6. Wire up and verify

- [x] 6.1 In `client/src/App.jsx`, import `Contact` and replace `<div id="contacto"></div>` with `<Contact />`
- [x] 6.2 Run `npm run lint` and `npm run format` in `client/` and fix anything reported
- [x] 6.3 Run `npm run build` in `client/` and confirm it succeeds
- [x] 6.4 Manually confirm the behaviors the spec calls out: empty and malformed-email submissions are blocked, a valid submit clears the fields and shows the demo line which vanishes after ~4s, link blocks glow on hover, and the layout collapses to one column below `md`
