## 1. Data file

- [x] 1.1 Create `client/src/data/cv-data.json` with `{ es: {...}, en: {...} }`, each holding `bio`, `stats`, `experience` (`company`, `role`, `dates`, `bullets`), `skills` (`name`, `items`), `projects` (`name`, `desc`, `stack`, `link`), and `contact` (`github`, `linkedin`, `email`); extend Hero's fields to also include `name` and `title` (role badge). Fill every field with a clearly marked `TODO: ...` placeholder value in both languages.
- [x] 1.2 Delete `client/src/data/mock/cv-data.json` and the now-empty `mock/` directory.

## 2. Data access layer

- [x] 2.1 Rewrite `client/src/lib/api.js`: replace `fetchCVData()` with `getCVData(lang)`, returning a Promise that resolves to `cv-data.json[lang]` with no network fetch attempt.
- [x] 2.2 Update `client/src/hooks/useCVData.js` to call `getCVData(lang)` (reading the current language from `useLang()`/i18next), re-running when the language changes, and to rename its returned `isLoading` field to `loading`.

## 3. Section refactors

- [x] 3.1 Refactor `Hero.jsx`: remove the local `STATS` constant and hardcoded name/badge/bio strings; read `name`, `title`, `bio`, and `stats` from `useCVData()`.
- [x] 3.2 Refactor `Experience.jsx`: remove the local `JOBS` constant; read `experience` from `useCVData()`, updating the `date` field references to `dates`.
- [x] 3.3 Refactor `Skills.jsx`: remove the local `CATEGORIES` constant; read `skills` from `useCVData()`.
- [x] 3.4 Refactor `Projects.jsx`: remove the local `PROJECTS` constant; read `projects` from `useCVData()`, updating `description`/`repoUrl` field references to `desc`/`link`.
- [x] 3.5 Refactor `Contact.jsx`: remove the local `CONTACT_LINKS` constant; read `contact` from `useCVData()`, deriving each entry's displayed text (e.g. stripping `https://` for GitHub/LinkedIn) from the stored value while keeping the existing per-channel labels and icons in the component.

## 4. Verification

- [x] 4.1 Run `npm run build` and `npm run lint` in `client/` and confirm both pass.
- [x] 4.2 Confirm no section component imports `cv-data.json` directly (only `useCVData` does).
- [x] 4.3 Start the dev server, toggle the language switcher, and confirm every section's content (bio, stats, name/role, jobs, skills, projects, contact links) updates to match, including any still-`TODO` placeholders.
