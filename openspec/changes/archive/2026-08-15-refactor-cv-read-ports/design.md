## Context

See `proposal.md` - Why. Relevant constraints for this design:

- `Profile` (with `Stat`), `Experience`, `Project`, and `SkillCategory` have no relationships or shared invariants in `Domain` — they're four independent aggregates, not one composite aggregate.
- `EfCvRepository.GetCvAsync` currently fires its four reads concurrently via `IDbContextFactory<CvDbContext>` + `Task.WhenAll`, one `DbContext` per read (a single `DbContext` isn't thread-safe across concurrent operations). That concurrency behavior must survive the refactor.
- `Infrastructure/ServiceCollectionExtensions.cs` registers `IDbContextFactory<CvDbContext>` (singleton) and derives the scoped `CvDbContext` from it (`services.AddScoped<CvDbContext>(sp => sp.GetRequiredService<IDbContextFactory<CvDbContext>>().CreateDbContext())`), specifically to avoid a DI validation conflict between `AddDbContext` and `AddDbContextFactory` both trying to own `DbContextOptions<CvDbContext>` (documented in the `migrate-db-to-neon-postgres` archived change). This registration is unaffected by this refactor.
- `CvFunction.cs` calls `GetCvUseCase.ExecuteAsync(language, ct)` and serializes the returned `CvContent` — this call site does not change.

## Goals / Non-Goals

**Goals:**
- Move the composition of `CvContent` from Infrastructure (`EfCvRepository`) to Application (`GetCvUseCase`), so `Application` orchestrates ports instead of forwarding a pre-assembled result.
- Give each independent aggregate (`Profile`, `Experience`, `Project`, `SkillCategory`) its own port and EF Core implementation.
- Preserve the four-concurrent-reads behavior and its observable performance characteristics (no new sequential round-trips against Neon).
- Preserve `GET /api/cv`'s response shape and behavior exactly.

**Non-Goals:**
- Changing `IContactRepository`/`EfContactRepository` or `IContactAttemptStore`/`EfContactAttemptStore` — already one port per entity.
- Introducing a generic/reusable repository abstraction (e.g. `IRepository<T>`) — each of the four ports stays a small, specific interface matching what `GetCvUseCase` actually needs, consistent with the existing `IContactRepository`/`IContactAttemptStore` style in this codebase.
- Adding a new OpenSpec capability for `GetCvUseCase`'s orchestration — it has no independently observable behavior beyond what `cv-api`'s `GET /api/cv` requirement already covers.

## Decisions

**Port shape**: four narrow ports in `Application/Ports/`, each with a single method returning a `Domain` type directly (not an entity/DTO type), mirroring `IContactRepository`'s existing style:
- `IProfileRepository.GetProfileAsync(Language, CancellationToken) : Task<Profile>`
- `IExperienceRepository.GetExperienceAsync(Language, CancellationToken) : Task<IReadOnlyList<Experience>>`
- `IProjectRepository.GetProjectsAsync(Language, CancellationToken) : Task<IReadOnlyList<Project>>`
- `ISkillCategoryRepository.GetSkillsAsync(Language, CancellationToken) : Task<IReadOnlyList<SkillCategory>>`

Alternative considered: a single `ICvReadPort` with four methods (same interface, just not split into four types) — rejected, since that still couples the four aggregates behind one contract for no reason once the composing logic moves to `GetCvUseCase`; nothing shares an implementation across the four reads, so one interface per aggregate is the more honest boundary and matches "one repository per aggregate," the principle motivating this change in the first place.

**Where composition happens**: `GetCvUseCase.ExecuteAsync` calls all four ports via `Task.WhenAll`, then constructs the `CvContent`. This makes `GetCvUseCase` a real use case (it does something) instead of a pass-through, matching what `Application`'s use cases are documented to do.

**Infrastructure implementations**: four new classes (`EfProfileRepository`, `EfExperienceRepository`, `EfProjectRepository`, `EfSkillCategoryRepository`), each taking `IDbContextFactory<CvDbContext>` and creating its own `DbContext` per call — the same pattern `EfCvRepository`'s private methods already use today, just promoted to public classes implementing the new ports. `EfCvRepository.cs` is deleted; its four private methods become the bodies of the four new classes' public methods (including the existing `.OrderBy(x => x.Id)` fix already applied to Experience/Project/SkillCategory).

**DI registration**: `ServiceCollectionExtensions.AddInfrastructure` replaces the single `services.AddScoped<ICvRepository, EfCvRepository>()` line with four `AddScoped` registrations, one per new port/implementation pair. No change to how `IDbContextFactory<CvDbContext>` or the scoped `CvDbContext` themselves are registered.

**Concurrency ownership**: `Task.WhenAll` moves from `EfCvRepository.GetCvAsync` to `GetCvUseCase.ExecuteAsync`. This is still pure orchestration (no infrastructure-specific types cross into `Application` — each port returns plain `Domain` types), so it doesn't leak persistence concerns upward; `Application` already depends on `Task`/`CancellationToken` for every other use case.

## Risks / Trade-offs

- **[Risk] Four DI registrations and four small files instead of one** → accepted: this is the explicit point of the change (repository per aggregate, matching the project's stated Clean/Hexagonal Architecture), not an accident to mitigate.
- **[Trade-off] `GetCvUseCase` now has infrastructure-adjacent concerns (firing four reads concurrently)** → acceptable: orchestrating multiple ports concurrently is a legitimate `Application`-layer responsibility (it only touches `Domain` types and `Task`), distinct from deciding *how* each individual read is executed against Postgres, which stays inside each EF Core implementation.
- **[Risk] Silent behavior drift during the port split (e.g. dropping the `.OrderBy(x => x.Id)` fix from a recent commit)** → mitigation: task list requires diffing each new EF implementation against the corresponding private method it replaces, and running `dotnet build` plus a manual `GET /api/cv?lang=es`/`?lang=en` check against a real database before marking the change done.

## Migration Plan

Purely internal refactor, no data or deployment changes:

1. Add `IProfileRepository`, `IExperienceRepository`, `IProjectRepository`, `ISkillCategoryRepository` to `Application/Ports/`; remove `ICvRepository`.
2. Add `EfProfileRepository`, `EfExperienceRepository`, `EfProjectRepository`, `EfSkillCategoryRepository` to `Infrastructure/Persistence/`, each implementing one new port using the corresponding logic from today's `EfCvRepository` private methods; delete `EfCvRepository.cs`.
3. Update `GetCvUseCase` to depend on the four new ports and compose `CvContent` via `Task.WhenAll`.
4. Update `ServiceCollectionExtensions.AddInfrastructure`'s registrations.
5. `dotnet build` the `api/` solution; fix any compile errors from the port change.
6. Manually verify `GET /api/cv?lang=es` and `?lang=en` against a real database still return the same shape as before.
7. Update `CLAUDE.md` and `README.md`'s `Infrastructure`/`EfCvRepository`/`ICvRepository` descriptions to match.

Rollback: revert the commit(s); no schema or data changes are involved.

## Open Questions

(none)
