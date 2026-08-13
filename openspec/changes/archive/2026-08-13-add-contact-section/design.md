## Context

See `proposal.md` — Why. Design-relevant state of the client:

- Sections follow a fixed shape: `<section id="…" className="px-4 py-8">` → `<div className="mx-auto max-w-5xl">` → `SectionLabel` + `SectionTitle` → body. `Projects.jsx` is the closest reference.
- Colors are explicit token pairs (`bg-surface dark:bg-dark-surface`); Tailwind's own palette is not used. Accent glow already has a precedent in `ProjectCard`: `hover:shadow-[0_0_20px_rgba(31,157,92,0.35)] dark:hover:shadow-[0_0_20px_rgba(61,220,132,0.35)]`.
- `ui/` primitives available: `Card` (rounded border + surface bg, forwards ref), `Button` (primary/secondary variants), `SectionLabel`, `SectionTitle`, `Badge`.
- `locales/{es,en}.json` already carry a `contact` block with `title`, `formName`, `formEmail`, `formMessage`, `formSubmit`, `formSent` — written ahead of this phase and currently unused.
- `App.jsx` renders `<div id="contacto"></div>` between `<Projects />` and `<Footer />`.
- No test runner exists; verification is `npm run lint` + `npm run build`.

## Goals / Non-Goals

**Goals:**
- Reuse the existing section skeleton and `ui/` primitives instead of inventing new styling for Contact.
- Keep the submit path a single, clearly marked seam so wiring the real API later is a one-function edit.
- Use only native form validation — no validation library, no per-field error state.

**Non-Goals:**
- The `/api/contact` Azure Function, request shape, or anti-spam handling.
- Persisting, emailing, or echoing submitted content anywhere.
- Submit-in-flight UI (spinner, disabled button) — there is nothing to wait on yet.
- Making the form data-driven from `useCVData` / `lib/api.js`; like every other section, content stays a module-level constant.

## Decisions

**Section id stays `contacto`.** The Phase 8 brief says `id="contact"`, but `Nav.jsx`'s `SECTIONS` list and `openspec/specs/site-layout` both contract `contacto`, and `App.jsx` already reserves that anchor. Renaming would silently break the nav link for the one section whose whole job is being reachable. Alternative considered — rename the anchor everywhere (nav, site-layout spec) to `contact`: rejected as churn outside this phase's scope, and inconsistent with the Spanish-first `sobre-mi` anchor. The `SectionLabel` text mirrors the real id, as it does in every other section.

**Controlled inputs with a single `form` state object.** One `useState({ name, email, message })` plus a shared `onChange` keyed by input `name`, rather than three separate states or an uncontrolled form read via `FormData`. Reason: clearing the fields after a demo submit is the required behavior, and a controlled object makes that a one-line reset. `FormData` + `form.reset()` would also work but leaves the values invisible to React, which the real API call will need.

**Native validation only.** `required` on all three fields and `type="email"` on the email field. The submit handler runs `e.preventDefault()` and does its work; the browser blocks the handler entirely for an invalid form, so the handler needs no guard of its own. Alternative — manual validation with per-field error text — rejected: more state and more strings to translate for behavior the browser already provides, and the spec asks only that invalid submissions be blocked.

**Confirmation as a timed boolean, with the timeout tracked in a ref.** `const [sent, setSent] = useState(false)`; on submit set it true and `setTimeout(() => setSent(false), 4000)`. The pending timer id is held in a `useRef` so a second submit clears the previous timer before starting a new one (otherwise the older timer would hide the newer confirmation early), and a `useEffect` cleanup clears it on unmount so no state update fires after teardown. Rendered as a mono, accent-colored line under the submit button, animated in/out with framer-motion's `AnimatePresence` (already a dependency, and the codebase reaches for it elsewhere) so the message fades rather than popping. It reserves no layout height when hidden — acceptable, the button sits above it and nothing below shifts meaningfully.

**API seam.** The submit handler body reads:

```js
// TODO(api): replace the demo feedback below with the real call once the
// /api/contact Azure Function exists:
//   await fetch('/api/contact', { method: 'POST', headers: {...}, body: JSON.stringify(form) })
```

placed immediately before the reset + `setSent(true)`, so the seam is where the network call would go rather than in a header comment.

**Contact links as a `CONTACT_LINKS` module constant.** Each entry `{ label, value, href, Icon }`, matching how `PROJECTS` / `CATEGORIES` are declared in sibling sections. Icons are inline SVG components in the same file, following the existing `GitHubIcon` in `Projects.jsx` — no icon package is added. The GitHub path can be lifted verbatim from `Projects.jsx`; duplicating it is cheaper than promoting a shared icon module for two call sites, and the alternative (a new `ui/icons.jsx`) can wait until a third consumer appears.

**Link blocks built on `Card`, not a new primitive.** `Card` already supplies the border + surface background; the hover treatment is added via `className`, reusing `ProjectCard`'s exact glow values so the two sections' hover states match. Each block is an `<a>` wrapping the card content — anchor-outside so the whole block is one hit target and keyboard-focusable for free. Profile entries get `target="_blank" rel="noopener noreferrer"`; the email entry uses `mailto:` with no target.

**Layout.** `grid gap-8 md:grid-cols-2` on the body — form in the first cell, links in the second. Below `md` the grid collapses to one column with the form first, satisfying the responsive requirement without a separate mobile branch. Inputs are full-width with the shared border/surface tokens and an `focus:border-accent dark:focus:border-dark-accent` focus treatment so focus is visible in both themes.

**Locale keys.** Reuse the existing `contact.*` keys as-is. `formSent` currently reads "¡Mensaje enviado!" / "Message sent!" — repurpose it for the demo confirmation with the mono comment framing (`// mensaje enviado (demo)` / `// message sent (demo)`) so the string carries its own demo disclaimer. Add `contact.linksTitle` for the right column's heading. Both files get the same key set; missing a key in one file is the standard i18n hazard here.

## Risks / Trade-offs

- **A form that visibly does nothing could mislead a visitor into thinking they've made contact.** → The confirmation text is explicitly marked `(demo)` in both locales, and the contact links beside it are the working path. Revisit as soon as `/api/contact` lands.
- **Section id diverges from the written brief.** → Called out in the proposal's Impact and above; the brief's intent (a reachable Contact section) is preserved, only the literal string differs.
- **Duplicated GitHub icon path across `Projects.jsx` and `Contact.jsx`.** → Accepted for two call sites; extract to `ui/` on the third.
- **Repurposing `contact.formSent` changes the meaning of an existing key** from a real confirmation to a demo one. → It has no current consumers, and the wording will need to change back when the API lands regardless.
- **Glow values are literal rgba hexes, duplicating the accent token** (same as `ProjectCard` today). → Copy the existing values verbatim so a future accent change updates both places by the same search.
