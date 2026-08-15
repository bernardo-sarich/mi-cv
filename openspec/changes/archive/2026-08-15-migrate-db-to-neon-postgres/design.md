## Context

See `proposal.md` - Why. Relevant constraints for this design:

- The Clean/Hexagonal split means `Domain`, `Application`, the 7 EF entity classes, and `EfContactRepository`/`EfContactAttemptStore` have no provider-specific code today (no SQL Server data annotations, no `HasColumnType`/`nvarchar` calls in `OnModelCreating`, timestamps are already `DateTimeOffset` with `UtcNow`, i.e. offset zero). They are expected to need zero changes.
- `FastRetryExecutionStrategy` inherits from `SqlServerRetryingExecutionStrategy` and is reachable only through the SQL Server provider's execution-strategy hook — it cannot be reused as-is with Npgsql.
- The two existing migrations use SQL Server-only column types (`nvarchar(max)`, `SqlServer:Identity`) baked into the generated `Up`/`Down` methods, so they must be regenerated rather than edited.
- This is a validation spike on `spike/neon`. No production Function App configuration, GitHub Actions workflow, or Azure resource is touched by this design.

## Goals / Non-Goals

**Goals:**
- Get `GET /api/cv` and `POST /api/contact` working end-to-end against a real Neon Postgres database, with the same observable API responses as today.
- Remove the SQL Server-specific retry machinery that exists only to survive Azure SQL's ~45s resume, replacing it with Npgsql's standard retry.
- Reduce the per-request round-trip count in `EfCvRepository.GetCvAsync`, since round-trip latency to a database outside Azure's network is more consequential.
- Produce real cold-start numbers (post 5+ minute idle) to inform the later go/no-go decision on promoting this to production.

**Non-Goals:**
- Deciding whether/how to promote this to production (SWA app settings, GitHub Actions secrets, decommissioning Azure SQL). That is a separate change once the spike's numbers are in.
- Changing `client/src/lib/api.js`'s fallback-to-local-JSON behavior, or any client-side code.
- Adding a test suite (none exists in this repo today; out of scope here).
- Tuning Neon's compute size, autoscaling, or branch/database topology beyond the single default branch already created.

## Decisions

**Provider package**: `Npgsql.EntityFrameworkCore.PostgreSQL` (latest stable matching EF Core 9), mirroring the existing `Microsoft.EntityFrameworkCore.SqlServer` reference in `Infrastructure.csproj`. This is the standard, actively maintained EF Core provider for Postgres — no alternative considered, since the whole point of the spike is to stay on EF Core and reuse the existing repository/DbContext code.

**Connection string handling**: replace `SqlConnectionStringBuilder` + the hardcoded `ConnectTimeout = 30` in `ServiceCollectionExtensions.cs` with `NpgsqlConnectionStringBuilder` and no explicit timeout override. The 30s override exists solely to give a single connection attempt a chance to land during Azure SQL's slow resume; Neon's resume is sub-second, so the Npgsql client default is sufficient. Use the **direct** (non-pooled) Neon host for local development and for `dotnet ef` design-time operations; note in `README.md` that a deployed environment should switch to the **pooled** (`-pooler`) host, since Azure Functions Consumption can open many short-lived connections per instance and Neon's own PgBouncer pooler absorbs that better than direct connections. Switching to the pooled host is not exercised in this spike (no deployment happens here) but is recorded so it isn't missed when this is promoted.

**Retry strategy**: delete `FastRetryExecutionStrategy` and configure `options.UseNpgsql(connectionString, npgsql => npgsql.EnableRetryOnFailure())` with Npgsql's default retry parameters (bounded count, increasing delay, targeting Npgsql's own transient-error classification). Rationale: the custom strategy's whole purpose was riding out a 45-second resume with 40 attempts at a fixed 500ms delay; Neon's resume is sub-second, so a short bounded retry is enough and there's no reason to maintain provider-specific retry code. Alternative considered: keep a custom strategy sized for Neon's shorter resume window — rejected, since it would just be re-deriving what `EnableRetryOnFailure()` already does for no added benefit.

**Migrations**: delete `Infrastructure/Migrations/*` and regenerate against the Postgres provider from the current model, which already includes `ContactAttempt`. The original plan was to regenerate as two migrations mirroring the SQL Server history (`InitialCreate` then `AddContactAttempts`), but since there's no intermediate model state to diff against on this fresh regeneration, running `dotnet ef migrations add AddContactAttempts` after `InitialCreate` produced an empty no-op migration (`InitialCreate` already captured every table). Squashed to a single `InitialCreate` migration instead of keeping a dead empty file — the resulting schema is identical either way, and there was never a real Postgres database with an intermediate applied state to preserve history for.

**`EfCvRepository.GetCvAsync` concurrency**: inject `IDbContextFactory<CvDbContext>`, registered via `AddDbContextFactory` (singleton). The write-path repositories (`EfContactRepository`, `EfContactAttemptStore`) keep injecting a plain scoped `CvDbContext`, but that registration is now `services.AddScoped<CvDbContext>(sp => sp.GetRequiredService<IDbContextFactory<CvDbContext>>().CreateDbContext())` instead of a separate `AddDbContext` call — calling both `AddDbContext` and `AddDbContextFactory` independently (each with its own `UseNpgsql(...)` call) was tried first and fails DI validation at startup (`Cannot consume scoped service 'DbContextOptions<CvDbContext>' from singleton 'IDbContextFactory<CvDbContext>'`), because both registrations compete to own `DbContextOptions<CvDbContext>` at different lifetimes. Sourcing the scoped context from the singleton factory avoids the conflict and keeps connection configuration in one place. Fire the four reads — profile+stats, experience, projects, skills — concurrently via `Task.WhenAll`, each against its own short-lived `DbContext` created from the factory. A single `DbContext` instance is not thread-safe for concurrent operations, so reusing the injected scoped context across parallel tasks is not an option; a factory-created context per task is the standard EF Core pattern for this. Alternative considered: leave the four reads sequential and accept the added latency — rejected because the added Neon round-trip cost is exactly what this spike is trying to characterize honestly, and the fix is small and self-contained within `EfCvRepository`.

**Design-time factory**: `CvDbContextFactory`'s hardcoded local connection string moves to a Postgres key-value format (`Host=localhost;Database=cvdatabase;Username=postgres;Password=postgres`) purely so `dotnet ef migrations add` has something syntactically valid to build against without a real database; the actual `dotnet ef database update` for this spike is run with `--connection` pointing at Neon.

## Risks / Trade-offs

- **[Risk] Local dev/design-time work happens against the real Neon project** (no local Postgres instance is being stood up for this spike) → **Mitigation**: only additive/idempotent operations touch it (`dotnet ef database update`, `Seed`, which is already documented as destructive-per-locale and safe to re-run); no destructive ad-hoc SQL is run against it outside the documented Seed/migration flow.
- **[Risk] `EnableRetryOnFailure()`'s default retry window may not exactly match Neon's real-world resume distribution** (measured 300ms–1.8s here, but not exhaustively) → **Mitigation**: the spike's explicit validation step is measuring cold start after 5+ minutes idle; if the default retry window proves too short in practice, that's a concrete finding to adjust before any production promotion, not a blind assumption.
- **[Risk] Parallelizing `GetCvAsync` opens up to 4 concurrent connections per CV request instead of 1** → **Mitigation**: Neon's pooled endpoint (documented for later production use) and typical Postgres `max_connections` comfortably absorb this for a low-traffic personal site; if this becomes a real constraint later, it's visible in Neon's dashboard before it's a production problem.
- **[Trade-off] Deleting and regenerating migrations loses the literal SQL-Server-era migration files' history** → accepted: they describe a schema that no longer applies once the provider changes, and the schema itself (table/column shape) is unchanged, only its physical representation.

## Migration Plan

This is a spike, not a production rollout — no deployment step is part of this change. The applied steps are local/manual, in order:

1. Update `Infrastructure.csproj` (swap package), `ServiceCollectionExtensions.cs`, `CvDbContextFactory.cs`, `Seed/Program.cs`, delete `FastRetryExecutionStrategy.cs`.
2. Delete `Infrastructure/Migrations/*`, regenerate `InitialCreate` then `AddContactAttempts` against Postgres.
3. Run `dotnet ef database update` against the real Neon project (direct host), then `dotnet run --project Seed`.
4. Update `EfCvRepository.GetCvAsync` for concurrent reads.
5. Run the Api locally, verify `GET /api/cv?lang=es` / `?lang=en` match today's Azure SQL-backed responses.
6. Let the Neon compute go idle for 5+ minutes, then measure first-query latency versus a warm follow-up query, and record the numbers when reporting this change's outcome.

Rollback is trivial: this branch never touches `main`, the deployed Function App, or the Azure SQL database — abandoning the branch is a complete rollback.

## Open Questions

(none — promoting this to production, if the spike succeeds, is explicitly deferred to a separate later change per proposal.md's Impact section)
