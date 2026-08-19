## 1. Dictionary and filter

- [x] 1.1 Add `naughty-words` as a `client` dependency.
- [x] 1.2 Create `client/src/lib/contentFilter.js`: import `naughty-words/en.json` and `naughty-words/es.json` directly (not the package's `index.js`), merge them with a hand-maintained `EXTRA_WORDS` list of Rioplatense Spanish insults not covered by the dictionary.
- [x] 1.3 Build a whole-word match pattern (`\bword\b`) over the full merged dictionary, and a separate prefix-match pattern (`\bword\w*`) over a short curated `SLUR_ROOTS` list (slur roots with no legitimate-word collision risk), and export `containsOffensiveContent(text)` combining both.

## 2. Form wiring

- [x] 2.1 In `client/src/components/sections/Contact.jsx`, call `containsOffensiveContent` from `validateField` for `name`, `email`, and `message`, after their existing required/format/length checks.
- [x] 2.2 Add the `contact.errorOffensive` key to `client/src/locales/es.json` and `client/src/locales/en.json`.

## 3. Verification

- [x] 3.1 Manually verify the filter against the reported evasions ("niggerman", "rapist") and against phrases sharing substrings with blocked words ("Hello, ...", "job title", "Pakistan", "spice", "therapist", "cumulative") to confirm no false positives.
- [x] 3.2 `npm run build` and `npm run lint` from `client/` run clean.
