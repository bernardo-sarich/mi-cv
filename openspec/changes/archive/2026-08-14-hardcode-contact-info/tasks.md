## 1. New contact data source

- [x] 1.1 Create `client/src/data/contact-info.js` exporting an object keyed by language (`es`, `en`), each with `github`, `linkedin`, `email` — same values as the current `cv-data.json` `contact` blocks

## 2. Wire Contact section to the new source

- [x] 2.1 In `client/src/components/sections/Contact.jsx`, remove the `useCVData` import/usage and the `if (!data) return null` guard
- [x] 2.2 Import `useLang` from `../../context/AppContext.jsx` and the new `contact-info.js` source; build `contactLinks` via `buildContactLinks(CONTACT_INFO[lang])`

## 3. Remove dead data

- [x] 3.1 Remove the `contact` field from both the `es` and `en` entries in `client/src/data/cv-data.json`

## 4. Verification

- [x] 4.1 Run `npm run lint` from `client/` and confirm it passes
- [x] 4.2 Run `npm run build` from `client/` and confirm it succeeds
