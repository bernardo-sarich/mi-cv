## Why

The site owner received a harassing/abusive message through the public, unauthenticated contact form. They asked for offensive-content filtering, specifically implemented client-side so an offensive submission never leaves the browser and never reaches the backend.

## What Changes

- Add a client-side offensive-content filter (`client/src/lib/contentFilter.js`) combining the `naughty-words` npm package's `en.json`/`es.json` dictionaries with a small extra list of Rioplatense Spanish insults that dictionary doesn't cover. Matching is whole-word by default (avoids false positives like "title", "Pakistan", "therapist"), plus prefix matching for a short, explicitly curated list of slur roots with no legitimate-word collision risk (catches suffix evasions like "niggerman").
- Wire the filter into the Contact section's field validation (`Contact.jsx`): `name`, `email`, and `message` are all checked, after their existing required/format/length checks. A match blocks submission with a new localized error and the request is never sent to `POST /api/contact`.
- Add the `contact.errorOffensive` translation key to `es.json` and `en.json`.
- Extend `openspec/specs/contact-section/spec.md` with a new requirement documenting this filtering behavior and its client-side-only scope.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `contact-section`: adds a requirement that the contact form rejects offensive content in `name`, `email`, or `message` before submission, with a localized error and no network request.

## Impact

- `client/src/lib/contentFilter.js` (new): offensive-content dictionary and `containsOffensiveContent(text)`.
- `client/src/components/sections/Contact.jsx`: `validateField` now also runs the content filter.
- `client/src/locales/es.json`, `client/src/locales/en.json`: new `contact.errorOffensive` key.
- `client/package.json`: new dependency on `naughty-words`.
- `openspec/specs/contact-section/spec.md`: new requirement for offensive-content filtering.
- Out of scope: any server-side filtering or blocking (email/IP blocklist, backend content checks). This is a UX-level filter only — a request sent directly to the API (bypassing the browser) is not affected. That server-side gap was discussed with the site owner and deliberately left for a possible future change.
