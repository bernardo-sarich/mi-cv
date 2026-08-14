## Why

The site has no way for a recruiter to download Bernardo's CV as a PDF. Two localized PDFs (English and Spanish) already exist and need to be added to the project, with a download entry point that serves the file matching the language the visitor currently has selected.

## What Changes

- Add `Bernardo_Sarich_CV_EN.pdf` and `Bernardo_Sarich_CV_ES.pdf` as static assets served by the client build.
- Wire up the existing (currently non-functional) "Download CV" primary button in `Hero.jsx` — it already renders `t('hero.downloadCv')` but has no `onClick`/`href`.
- Clicking the button downloads the PDF matching the current `lang` value from `AppContext` (`es` → Spanish PDF, `en` → English PDF), without a page navigation.
- No new translation strings needed — `hero.downloadCv` already exists in both locale files.

## Capabilities

### New Capabilities
- `cv-download`: static CV PDF assets and the language-aware download behavior wired to the existing Hero button.

### Modified Capabilities
- none (no existing capability's requirements change; the Hero button already exists in `hero-section` as a non-functional element — giving it behavior does not change any documented requirement)

## Impact

- `client/public/cv/` (new directory): two PDF assets.
- `client/src/components/sections/Hero.jsx`: download button gains `onClick`/`href` behavior.
- No backend/API impact — served as static files by the Vite/SWA build, no `/api/cv` involvement.
- No locale file changes — `hero.downloadCv` already exists in both.
