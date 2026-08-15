## Why

Azure SQL serverless (`mi-cv-db`, tier `GP_S_Gen5`, `autoPauseDelay=60`) takes ~45s to resume from an auto-paused state, which exceeds the hard 45s timeout of the Function App on the Static Web Apps Free plan. Confirmed in production: a request that arrived while the database was paused was cut off by SWA in the same second the database finished resuming, returning a `500 Backend call failure` instead of data. Raising `autoPauseDelay` or adding a keep-alive would exhaust Azure SQL's free-tier compute budget (100,000 vCore-seconds/month, ≈55h uptime) in a couple of days. Neon Postgres's serverless free tier auto-suspends after 5 minutes of inactivity but resumes in under a second (measured 300ms–1.8s), which sits well under the 45s ceiling and removes the failure mode without giving up the free tier or moving reads off the database at request time.

## What Changes

- Swap the EF Core provider for the Api's `CvDbContext` from SQL Server (`Microsoft.EntityFrameworkCore.SqlServer`) to PostgreSQL (`Npgsql.EntityFrameworkCore.PostgreSQL`), targeting a Neon Postgres project (AWS `us-east-2`, free tier).
- Replace the SQL Server-specific `FastRetryExecutionStrategy` (40 retries at a fixed 500ms delay, built to ride out Azure SQL's ~45s resume) with Npgsql's standard `EnableRetryOnFailure()` — Neon's sub-second resume no longer needs a custom long-window retry strategy. **BREAKING** (internal): removes the `FastRetryExecutionStrategy` class entirely.
- Regenerate both EF Core migrations (`InitialCreate`, `AddContactAttempts`) from scratch against PostgreSQL — the existing migrations use SQL Server-only column types (`nvarchar(max)`, `SqlServer:Identity`) and are not portable.
- Update the `Seed` console tool and the EF design-time factory (`CvDbContextFactory`) to use the Postgres provider.
- Update `local.settings.json.example` and `api/README.md` to describe Postgres/Neon local setup instead of SQL Server, without introducing any real credential into a versioned file.
- Parallelize the four sequential round-trips in `EfCvRepository.GetCvAsync` (profile+stats, experience, projects, skills), each on its own `DbContext` instance via `IDbContextFactory<CvDbContext>`, since added network latency to a database outside Azure makes serialized round-trips more costly.
- This is a validation spike on branch `spike/neon`: `main` and the deployed Azure SQL database are untouched. No CI/CD, deployment config, or Function App application settings change as part of this proposal — promoting this to production is a separate, later decision.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `cv-persistence`: the DbContext and repositories are now backed by PostgreSQL instead of Azure SQL Database; the transient-failure retry behavior changes from a SQL Server-specific long-window strategy (tuned for a ~45s auto-resume) to Npgsql's standard bounded retry (tuned for a sub-second auto-resume); `ICvRepository`'s read implementation issues its underlying queries concurrently instead of sequentially.

## Impact

- **Affected code**: `api/Infrastructure/Infrastructure.csproj`, `api/Infrastructure/ServiceCollectionExtensions.cs`, `api/Infrastructure/Persistence/FastRetryExecutionStrategy.cs` (deleted), `api/Infrastructure/Persistence/CvDbContextFactory.cs`, `api/Infrastructure/Persistence/EfCvRepository.cs`, `api/Infrastructure/Migrations/*` (regenerated), `api/Seed/Program.cs`, `api/Api/local.settings.json.example`, `api/README.md`.
- **Not affected**: `Domain/`, `Application/` (use cases and ports), the 7 EF entity classes, `EfContactRepository`, `EfContactAttemptStore`, `client/` (no change to `lib/api.js`'s fallback-to-local-JSON behavior).
- **Dependencies**: adds `Npgsql.EntityFrameworkCore.PostgreSQL`, removes `Microsoft.EntityFrameworkCore.SqlServer`.
- **External systems**: introduces a dependency on Neon (a non-Azure provider) for this branch only. Production continues running against Azure SQL until a separate decision is made to promote this change.
- **Secrets**: the Neon connection string is never written to a versioned file; it is supplied locally via `Api/local.settings.json` (gitignored) or an environment variable, same convention already used for `ConnectionStrings:CvDatabase`.
