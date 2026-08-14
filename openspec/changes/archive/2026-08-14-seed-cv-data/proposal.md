## Why

The EF Core schema and migrations for the CV domain exist (`cv-persistence`), but no database has ever been populated: `GET /api/cv` has nothing to read. The content currently lives only in `client/src/data/cv-data.json`. Until an admin flow exists (if it ever does), a one-time seed script is the only way to get real data into the tables, and it needs a documented, non-hardcoded way to point at a database.

## What Changes

- Add a standalone console project (`api/Seed`) that reads `client/src/data/cv-data.json` and upserts its content into `Profile`, `Stat`, `Experience`, `Project`, and `SkillCategory` rows via `CvDbContext`, for both `es` and `en` locales.
- The seed is idempotent: running it again replaces existing rows for a locale rather than duplicating them.
- The `contact` block (github/linkedin/email) in `cv-data.json` is intentionally **not** migrated — no Domain entity or table exists for it, and adding one is out of scope for this change; those links stay hardcoded in the client as they are today.
- The seed reads its connection string from `ConnectionStrings:CvDatabase`, resolved the same way (`IConfiguration`) as the running Api, never hardcoded.
- Add `api/Api/local.settings.json.example` (tracked in git, unlike `local.settings.json` itself) documenting the settings keys a developer needs locally, including `ConnectionStrings:CvDatabase`.
- Add `api/README.md` documenting: local setup (`local.settings.json` from the example, running the seed), and how the connection string secret is provided in deployed environments (Azure Function App Settings for the running app, a GitHub Actions secret for CI/CD) — no code changes to CI/CD workflows are included since none exist yet in this repo.

## Capabilities

### New Capabilities
- `cv-data-seed`: A console tool that migrates `cv-data.json` content into the EF Core tables, run manually, reading its connection string from configuration rather than the repo.

### Modified Capabilities
(none — `cv-persistence` schema and repositories are unchanged; this only adds a new consumer of `CvDbContext`)

## Impact

- New project `api/Seed` (references `Domain`, `Infrastructure`), added to `api/api.slnx`.
- New tracked file `api/Api/local.settings.json.example`.
- New file `api/README.md`.
- No changes to `Api`, `Application`, `Domain`, or existing `Infrastructure` code/migrations.
- No CI/CD workflow files exist in the repo yet, so none are added or modified — the README documents the GitHub Actions secret convention to follow once a workflow is added.
