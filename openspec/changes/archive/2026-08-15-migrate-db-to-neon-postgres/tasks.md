## 1. Provider swap

- [x] 1.1 In `api/Infrastructure/Infrastructure.csproj`, remove the `Microsoft.EntityFrameworkCore.SqlServer` package reference and add `Npgsql.EntityFrameworkCore.PostgreSQL` (version matching EF Core 9).
- [x] 1.2 In `api/Infrastructure/ServiceCollectionExtensions.cs`, replace `SqlConnectionStringBuilder`/`ConnectTimeout` and `UseSqlServer(...)` with `NpgsqlConnectionStringBuilder` and `UseNpgsql(connectionString, npgsql => npgsql.EnableRetryOnFailure())`.
- [x] 1.3 Delete `api/Infrastructure/Persistence/FastRetryExecutionStrategy.cs`.
- [x] 1.4 In `api/Infrastructure/Persistence/CvDbContextFactory.cs`, replace the hardcoded SQL Server connection string and `UseSqlServer` call with a Postgres key-value connection string and `UseNpgsql`.
- [x] 1.5 In `api/Seed/Program.cs`, replace `optionsBuilder.UseSqlServer(connectionString)` with `optionsBuilder.UseNpgsql(connectionString)`.

## 2. Migrations

- [x] 2.1 Delete `api/Infrastructure/Migrations/20260813225829_InitialCreate.cs`, `20260813225829_InitialCreate.Designer.cs`, `20260814135704_AddContactAttempts.cs`, `20260814135704_AddContactAttempts.Designer.cs`, and `CvDbContextModelSnapshot.cs`.
- [x] 2.2 Run `dotnet ef migrations add InitialCreate --project Infrastructure --startup-project Infrastructure` to regenerate the base schema against the Postgres provider.
- [x] 2.3 Attempted `dotnet ef migrations add AddContactAttempts` as a second migration; it came back empty (`InitialCreate` already captured every table from the current model, so there was no diff to split out). Removed the empty migration and kept a single `InitialCreate` — see design.md's updated Migrations decision.
- [x] 2.4 Inspect the generated migration files to confirm all 7 tables (`Profiles`, `Experiences`, `Projects`, `SkillCategories`, `Stats`, `ContactMessages`, `ContactAttempts`) and the `Stats`→`Profiles` foreign key and `ContactAttempts` IP/timestamp index are present.

## 3. Concurrent reads in EfCvRepository

- [x] 3.1 Register `IDbContextFactory<CvDbContext>` in `api/Infrastructure/ServiceCollectionExtensions.cs` (via `AddDbContextFactory`), alongside the existing `AddDbContext` registration.
- [x] 3.2 Update `api/Infrastructure/Persistence/EfCvRepository.cs` to inject `IDbContextFactory<CvDbContext>` and issue the profile+stats, experience, projects, and skills reads concurrently via `Task.WhenAll`, each against a `DbContext` created from the factory.

## 4. Local config and docs

- [x] 4.1 Update `api/Api/local.settings.json.example`'s `ConnectionStrings:CvDatabase` placeholder to a non-real Postgres key-value format.
- [x] 4.2 Update `api/README.md`'s "Serverless cold start" section to describe Npgsql's `EnableRetryOnFailure()` instead of `ConnectTimeout`/`FastRetryExecutionStrategy`, and update the "Local setup" step that mentions SQL Server/Docker/Azure SQL free-tier options to mention Postgres/Neon instead.

## 5. Validation against the real Neon database

- [x] 5.1 Set `ConnectionStrings__CvDatabase` (or `Api/local.settings.json`, gitignored) to the Neon direct-host connection string, sourced from the scratchpad file — never written into a versioned file.
- [x] 5.2 Run `dotnet ef database update --project Infrastructure --startup-project Infrastructure` against Neon and confirm it completes without error.
- [x] 5.3 Run `dotnet run --project Seed` and confirm both `es` and `en` locales populate without error. (Discovered pre-existing, out-of-scope issue: Seed's plain `AddJsonFile` read of `Api/local.settings.json` resolves the connection string key as `Values:ConnectionStrings:CvDatabase` because of the file's `Values` wrapper, so `GetConnectionString` doesn't find it from the file alone — only the `ConnectionStrings__CvDatabase` environment variable path actually works. Not introduced by this change; used the env var to run Seed.)
- [x] 5.4 Run `dotnet run --project Api` locally and confirm `GET /api/cv?lang=es` and `GET /api/cv?lang=en` return the same shape/content as today's Azure SQL-backed responses. (Discovered and fixed a real DI bug along the way: registering both `AddDbContext` and `AddDbContextFactory` independently for `CvDbContext` fails service validation at startup — see design.md's updated concurrency decision. Api runs on port 7071, not the 7016 in `Api/Properties/launchSettings.json` — that launch profile isn't picked up by a bare `dotnet run` from the `Api/` project directory.)
- [x] 5.5 Let the Neon compute sit idle for 5+ minutes (past its auto-suspend threshold), then measure the first `GET /api/cv` request's latency versus a subsequent warm request, and record both numbers for the change's final report. **Result: first request after 5.5 min idle = 1.86s (HTTP 200); warm requests immediately after = ~0.41s each.** Compares to Azure SQL's measured ~45s + HTTP 500 for the equivalent first-visit-after-idle scenario in production.

## 6. Spec sync

- [x] 6.1 Confirm `openspec/changes/migrate-db-to-neon-postgres/specs/cv-persistence/spec.md`'s MODIFIED requirement matches the retry behavior actually implemented in task 1.2 before this change is synced into the main spec. Confirmed: the delta's provider-neutral wording ("transient connection error", "short delay", "bounded number of attempts") accurately describes `EnableRetryOnFailure()` as configured — no wording changes needed.
