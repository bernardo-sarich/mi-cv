## Context

See proposal.md - Why. `Contact.jsx#validateField` already runs required/format/length checks per field before allowing submit (see `openspec/specs/contact-section/spec.md`, "Contact form fields and styled validation"). This change adds one more check to that same function, so it inherits the existing error-display and error-clearing behavior for free.

## Goals / Non-Goals

**Goals:**
- Catch offensive content in `name`, `email`, and `message` using dictionaries broad enough to cover common English and Spanish profanity/slurs, not just a hand-picked list.
- Avoid false positives on ordinary words that happen to contain a blocked substring (e.g. "title", "Pakistan", "spice", "therapist").
- Catch the simplest evasion (appending a suffix to a slur, e.g. "niggerman") without reopening the false-positive problem above.

**Non-Goals:**
- Server-side enforcement. This is explicitly a client-only UX filter (see proposal.md - Impact); a request sent directly to the API bypasses it entirely. That gap is known and accepted for this change.
- Evasion-proofing beyond simple suffixes (leetspeak, character insertion, homoglyphs, etc.). A determined abuser can bypass the frontend outright, so investing in a heavier evasion-resistant matching engine (e.g. the `obscenity` package's transformer pipeline) isn't proportionate here.

## Decisions

**Dictionary source: `naughty-words` (npm) over a live moderation API.** A live API (e.g. PurgoMalum) would add a network round-trip to every field blur/submit, a hard external dependency for a client-side form check, and would send the visitor's not-yet-submitted draft text to a third party. `naughty-words` bundles the maintained LDNOOBW word lists per language as plain JSON, so it's a build-time dependency with no runtime network call. Only `naughty-words/en.json` and `naughty-words/es.json` are imported directly (not the package's `index.js`, which eagerly requires all 28 language files) to keep the bundle from pulling in unrelated languages.

**Extra Rioplatense word list on top of the dictionary.** `naughty-words`'s `es.json` targets Spain Spanish and is missing common Argentine insults (`boludo`, `pelotudo`, `conchetumadre`, etc.). A short hand-maintained list fills that gap; it's exact-matched like the rest of the dictionary.

**Two matching strategies, chosen per word:**
- Default: whole-word match (`\bword\b`) across the full merged dictionary. This is what keeps common words safe — e.g. `\bass\b` matches standalone "ass" but not "assist"/"class"/"assassin", `\bhell\b` doesn't match "hello", `\btitle\b` in the dictionary sense doesn't apply because "title" isn't in the list and "tit" is only whole-word matched, so it doesn't match "title" either.
- Prefix match (`\bword\w*`) for a short, explicitly curated list of slur roots (e.g. `nigger`, `kike`, `faggot`, `rape`, `rapist`) chosen specifically because they have no legitimate English/Spanish word that starts with them. This catches suffix evasions like "niggerman" or "rapists". Words that fail this no-collision bar (`paki` → "Pakistan", `spic` → "spice") are deliberately excluded from prefix matching and stay whole-word-only.
- Both patterns tested against `text.normalize('NFC')` before matching.

Verified against a manual test set covering both the reported evasions ("niggerman", "rapist") and a set of legitimate phrases that share substrings with blocked words ("Hello, ...", "job title", "assistant feature", "Pakistan is...", "more spice", "a therapist recommended...", "cumulative results") — all passed as expected before wiring the filter into the form.

## Risks / Trade-offs

- **Not a security control** → Documented in proposal.md and communicated to the site owner; anyone can call `POST /api/contact` directly and skip this filter entirely. Accepted as out of scope for this change.
- **Dictionary can go stale or still miss new slang/evasions** → No word list is ever complete. Accepted; this is a UX deterrent, not a guarantee. Extending `EXTRA_WORDS` or `SLUR_ROOTS` in `contentFilter.js` is a small, low-risk change if new gaps surface.
- **Prefix matching, if applied carelessly, causes false positives** → Mitigated by keeping prefix matching to a short, manually reviewed list instead of applying it to the whole dictionary (see Decisions above).
