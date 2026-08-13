## Why

The page ends on an empty `<div id="contacto">` placeholder in `App.jsx`: the nav's "Contacto" link scrolls to nothing and a visitor who wants to reach the site owner has nowhere to go. Phase 8 fills that anchor with a real Contact section, closing the last gap in the section scaffold described by `site-layout`.

## What Changes

- Add `client/src/components/sections/Contact.jsx` and mount it in `App.jsx` in place of the empty `<div id="contacto">` placeholder.
- The section renders the usual `SectionLabel` + `SectionTitle` header pair, then a two-column body that collapses to a single column on narrow viewports.
- Left column: a contact form with name, email and message fields, all `required` (HTML5 native validation), plus a submit button.
- Right column: a list of contact links (GitHub, LinkedIn, email) rendered as bordered blocks with an inline SVG icon; hovering a block highlights its border and adds a subtle accent-colored glow.
- Submitting the form is a **demo placeholder — no backend call**. It suppresses the native navigation, clears the fields, and shows a temporary confirmation line (`// mensaje enviado (demo)`) that disappears after 4 seconds. A code comment marks the exact spot where the real `fetch('/api/contact', …)` will go once the API exists.
- Contact link targets are placeholders (`github.com/tu-usuario`, etc.), consistent with the placeholder data already used by Projects and Skills.
- Wire the section's user-visible strings through the existing `contact.*` keys already present in `locales/{es,en}.json`, adding any missing keys (confirmation text, contact-links heading, link labels) to both files.

Not in scope: the `/api/contact` Azure Function, real contact URLs, and persisting or emailing submissions.

## Capabilities

### New Capabilities
- `contact-section`: the Contact section's structure, form fields and validation, demo submit feedback, and the contact-link blocks with their hover emphasis.

### Modified Capabilities
<!-- None. `site-layout` already requires a Contact section at id `contacto`; this
     change satisfies that existing requirement rather than altering it. -->

## Impact

- **New file**: `client/src/components/sections/Contact.jsx`.
- **Modified**: `client/src/App.jsx` (replace the placeholder div with `<Contact />`), `client/src/locales/es.json` and `client/src/locales/en.json` (extend the existing `contact` block).
- **Section id stays `contacto`, not `contact`.** The Phase 8 request wrote `<section id="contact">`, but `contacto` is the id contracted by `Nav.jsx`'s `SECTIONS` list and by `openspec/specs/site-layout`; renaming it would break the nav anchor. The section keeps `id="contacto"` and its `SectionLabel` displays `<section id="contacto">` to match.
- No new dependencies: framer-motion, react-i18next and the `ui/` primitives (`Card`, `Button`, `SectionLabel`, `SectionTitle`) are already in the project.
- No API or backend impact yet — the submit handler is deliberately local-only.
