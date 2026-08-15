## Why

`ICvRepository` is a single port whose EF Core implementation (`EfCvRepository`) reads `Profile`+`Stat`, `Experience`, `Project`, and `SkillCategory` — four Domain entities with no relationships or invariants between them — and composes them into a `CvContent`. That composition is a use-case-level decision (what `GET /api/cv` needs together), not a persistence fact about any one entity, so it belongs in `Application`. Today it doesn't: `GetCvUseCase.ExecuteAsync` is a pure pass-through (`=> cvRepository.GetCvAsync(...)`), because all the orchestration already happened on the Infrastructure side of the port. This inverts the dependency the project's own Clean/Hexagonal Architecture documentation (`CLAUDE.md`, `README.md`) claims to follow, and was flagged during a review of those docs against the actual code.

## What Changes

- Replace the single `ICvRepository` port with four ports, one per independent aggregate: `IProfileRepository`, `IExperienceRepository`, `IProjectRepository`, `ISkillCategoryRepository`. **BREAKING** (internal): `ICvRepository` is removed.
- Each new port's EF Core implementation (`EfProfileRepository`, `EfExperienceRepository`, `EfProjectRepository`, `EfSkillCategoryRepository`) does only simple per-table access filtered by `Language`, mirroring today's private `GetProfileAsync`/`GetExperienceAsync`/`GetProjectsAsync`/`GetSkillsAsync` methods on `EfCvRepository` — no composition.
- `GetCvUseCase` (Application) becomes the place that composes `CvContent`: it calls the four ports concurrently via `Task.WhenAll` and assembles the result.
- Keep the existing four-concurrent-queries behavior (`IDbContextFactory<CvDbContext>`, one `DbContext` instance per concurrent call, since a single `DbContext` isn't thread-safe) — only the layer issuing the four calls moves from Infrastructure to Application.
- Update `Infrastructure/ServiceCollectionExtensions.cs`'s DI registration to register the four new ports instead of `ICvRepository`.
- Leave `IContactRepository`/`EfContactRepository` and `IContactAttemptStore`/`EfContactAttemptStore` untouched — they already have one port/implementation per entity.
- No change to the `GET /api/cv` HTTP contract, response shape, or client behavior.
- Update `openspec/specs/cv-persistence/spec.md` (delta), and, once applied, `CLAUDE.md`/`README.md`'s descriptions of `Infrastructure`/`EfCvRepository`/`ICvRepository`.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `cv-persistence`: replaces the "`ICvRepository` is implemented against EF Core" requirement (one port that reads and assembles all four entities) with a requirement describing four separate per-aggregate ports, each with a simple EF Core implementation, and no port-level composition into `CvContent`.

## Impact

- **Affected code**: `api/Application/Ports/ICvRepository.cs` (removed, replaced by four new port files), `api/Application/UseCases/GetCvUseCase.cs`, `api/Infrastructure/Persistence/EfCvRepository.cs` (removed, replaced by four new implementation files), `api/Infrastructure/ServiceCollectionExtensions.cs`.
- **Not affected**: `Domain/` (including `CvContent`, which stays the Application-assembled result type), `Api/CvFunction.cs` (still calls `GetCvUseCase.ExecuteAsync` the same way), `EfContactRepository`, `EfContactAttemptStore`, `client/` (no observable change to `GET /api/cv`).
- **Dependencies**: none added or removed.
- **Docs**: `openspec/specs/cv-persistence/spec.md` gets a delta; `CLAUDE.md` and `README.md` need their `Infrastructure`/`EfCvRepository` descriptions updated once the code change lands (tracked as a task, not part of the spec delta itself).
