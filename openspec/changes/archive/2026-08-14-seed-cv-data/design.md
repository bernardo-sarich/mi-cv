## Context

See proposal.md - Why. Relevant existing pieces this design builds on:
- `api/api.slnx` currently lists `Api`, `Application`, `Domain`, `Infrastructure`. `Infrastructure.csproj` targets `net9.0`, references `Application`+`Domain`, pulls in `Microsoft.EntityFrameworkCore.SqlServer`.
- `CvDbContext` (Infrastructure) exposes `Profiles`, `Stats`, `Experiences`, `Projects`, `SkillCategories` (plus `ContactMessages`/`ContactAttempts`, untouched here). `Profile.Stats` is a real FK relationship; `Bullets`/`Stack`/`Items` are JSON-column string lists.
- `CvDbContextFactory` (`IDesignTimeDbContextFactory`) shows the established pattern for building a `CvDbContext` outside the Functions host, using `UseSqlServer` with an explicit connection string — the seed's `Program.cs` follows the same shape but reads the string from configuration instead of hardcoding it.
- Runtime configuration key is `ConnectionStrings:CvDatabase`, read via `IConfiguration.GetConnectionString("CvDatabase")` in `Infrastructure/ServiceCollectionExtensions.cs`.
- `client/src/data/cv-data.json` is `{ es: {...}, en: {...} }`; each locale has `name/title/bio/stats[]/experience[]/skills[]/projects[]/contact`. `contact` is out of scope (per proposal).

## Goals / Non-Goals

**Goals:**
- A `dotnet run` console tool, isolated from the Functions host, that seeds all locales found in `cv-data.json` into the existing tables.
- Idempotent: safe to run repeatedly, and safe to re-run after `cv-data.json` is edited.
- Zero secrets in source control; same configuration key as the Api.

**Non-Goals:**
- No admin UI or write API — this is a manual, developer/operator-run tool.
- No CI/CD workflow changes — the repo has none yet; the README documents the convention to follow when one is added.
- No handling of `contact` (github/linkedin/email) — no table exists for it.
- No new Application-layer port — the seed talks to `CvDbContext` directly (consistent with `ICvRepository` being deliberately read-only, per the existing `cv-persistence` spec).

## Decisions

**New standalone console project `api/Seed`, not an `IHostedService` or `dotnet run -- seed` verb on `Api`.**
`Api`'s `Program.cs` is an Azure Functions isolated-worker host (`FunctionsApplication.CreateBuilder`) with no argument-parsing or one-shot-task concept; bolting a seed verb onto it would tie a one-time developer operation to the Functions host lifecycle and package it into the deployed Function App. A separate console project referencing only `Domain` and `Infrastructure` mirrors the existing per-layer project split, runs with plain `dotnet run --project api/Seed`, and is never deployed.
Alternative considered: `IHostedService` that seeds on startup and exits — rejected because it would run (or need to be guarded against running) every time the real Api starts, conflating "populate initial data" with "serve requests."

**Seed reads configuration the same way Infrastructure does, via `IConfigurationBuilder` + `local.settings.json` (Functions' JSON settings format) + environment variables, not `appsettings.json`.**
Reusing the same file developers already have for the Api (`api/Api/local.settings.json`, gitignored) means one connection string, one place to set it, matching the "single source of local config" the proposal's README documents. The Seed project reads `api/Api/local.settings.json` directly by relative path plus environment variable override, so no separate settings file needs to be kept in sync.

**Idempotency via delete-then-insert per locale, inside a transaction, keyed on `Language`.**
Every persisted entity except `ContactMessage`/`ContactAttempt` carries a `Language` column. For each locale in `cv-data.json`, the seed deletes existing `Profile` (cascading to `Stat`), `Experience`, `Project`, and `SkillCategory` rows for that `Language`, then inserts fresh rows from the current JSON, all inside one `CvDbContext` transaction per locale. This is simpler and more predictable than field-by-field upsert/diff logic, and correct because `cv-data.json` is the sole source of truth for this data (per proposal) — nothing else ever writes to these tables.
Alternative considered: upsert matching on a natural key (e.g. `Company`+`Role` for `Experience`) — rejected as unnecessary complexity; there's no concurrent writer to preserve identity against, and delete/reinsert keeps the tool simple to reason about.

**Seed project uses the same `TargetFramework` (`net9.0`) and `Nullable`/`ImplicitUsings` settings as the other four projects, and is added to `api/api.slnx`.**
Keeps `dotnet build`/`dotnet publish` at the solution level working unchanged and matches existing project conventions.

## Risks / Trade-offs

- **Delete-then-insert briefly empties tables mid-run** → mitigated by wrapping each locale's delete+insert in a single database transaction, so a concurrent read (unlikely for a manual dev-run tool, but possible if pointed at a shared dev DB) sees either the old or new state, never a gap.
- **Running the seed against the wrong `ConnectionStrings:CvDatabase` (e.g. a shared/staging DB) silently overwrites its data** → mitigated by the fail-fast behavior on missing configuration (spec requirement) and by documenting in `api/README.md` that the seed is destructive per-locale and should be pointed at a local/dev database.
- **`api/Api/local.settings.json.example` could drift from the real settings the Api needs** (e.g. if `CorsOptions`/`RateLimitOptions` sections gain new keys later) → out of scope to prevent structurally; the README instructs developers to diff against `ServiceCollectionExtensions.cs`/`Program.cs` if `local.settings.json` seems incomplete.

## Migration Plan

No database migration changes. Deployment/rollback is: run the seed tool manually against a target database's connection string; there is no automated pipeline step. Rolling back means re-running the seed after reverting `cv-data.json`, or manually clearing the affected tables — no destructive step runs automatically.
