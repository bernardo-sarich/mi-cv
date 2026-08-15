## Why

The site always boots in Spanish (`AppProvider` seeds `lang` from `i18n.language`, which `lib/i18n.js` hardcodes to `es` on init), regardless of the visitor's browser language. A non-Spanish-speaking visitor — most notably a foreign recruiter — lands on a page full of Spanish UI chrome and may leave before noticing the small manual language toggle in the nav. Detecting the browser's language on first load and defaulting to English for non-Spanish visitors removes that friction, without touching the manual toggle they can already use to switch.

## What Changes

- Initial `lang` state is derived from the browser's language preference (`navigator.language`) instead of being hardcoded to `es`: start in `es` when the browser's primary language is an `es-*` locale, start in `en` otherwise.
- `lib/i18n.js`'s `i18next.init` no longer forces `lng: 'es'`; the initial language is resolved once in `AppProvider` and applied via the existing `i18n.changeLanguage(lang)` effect. `fallbackLng` stays `es`.
- Language still does not persist across sessions — every fresh load re-runs browser-language detection, matching the existing no-persistence behavior for both `lang` and `theme`.
- The manual toggle (`LangToggle.jsx`) keeps working exactly as before (`toggleLang` still flips between `es`/`en`); only the starting value changes.
- `LangToggle.jsx` gets a small outline globe icon (~16px, inline SVG, no icon library) placed to the left of the "ES"/"EN" text inside the same button, so the control is recognizable as a language switcher at a glance.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `i18n-state`: the "Spanish default language" requirement changes to a browser-detected default (`es` for `es-*` browser locales, `en` otherwise); the "Language toggle control" requirement is extended to require a globe icon alongside the language label.

## Impact

- `client/src/context/AppContext.jsx` — initial `lang` state computation.
- `client/src/lib/i18n.js` — remove hardcoded `lng: 'es'` from init.
- `client/src/components/ui/LangToggle.jsx` — add globe icon.
- `openspec/specs/i18n-state/spec.md` — default-language and toggle-control requirements.
- No backend, data, or routing impact. No new dependencies (icon is hand-written inline SVG, consistent with the rest of the codebase).
