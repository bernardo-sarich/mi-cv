## Why

`Application/Ports/ICvRepository.cs` and `IContactRepository.cs` define the contracts the CV backend needs to read and persist data, but `Infrastructure/ServiceCollectionExtensions.cs` registers nothing — there is no implementation. The `/api/cv` and `/api/contact` endpoints described in CLAUDE.md cannot exist until Infrastructure can actually talk to a database.

## What Changes

- Add `Microsoft.EntityFrameworkCore.SqlServer` and `Microsoft.EntityFrameworkCore.Design` package references to `Infrastructure.csproj`.
- Add a `CvDbContext` (`Infrastructure/Persistence/CvDbContext.cs`) with a `DbSet<T>` for each persistable Domain entity: `Profile`, `Experience`, `Project`, `SkillCategory`, `Stat`, `ContactMessage`.
- Configure all entity-to-table mapping via Fluent API in `OnModelCreating` (no data annotations on Domain classes).
- Add `EfCvRepository : ICvRepository` and `EfContactRepository : IContactRepository` in `Infrastructure/Persistence/`, implemented against `CvDbContext`, consuming and returning `Domain` types directly (no separate EF-only entity classes — see design.md for the reasoning).
- Register `CvDbContext` (via `AddDbContext`, reading a `CvDatabase` connection string from configuration) and both repositories in `Infrastructure/ServiceCollectionExtensions.cs`.
- Generate the initial EF Core migration (`dotnet ef migrations add InitialCreate`) under `Infrastructure/Migrations/`. The migration is generated only — it is **not** applied to any database in this change.

## Capabilities

### New Capabilities
- `cv-persistence`: EF Core-backed implementation of `ICvRepository` and `IContactRepository` — the `CvDbContext`, its Fluent API mappings, the two repository classes, and their DI registration.

### Modified Capabilities
(none — `cv-domain-model`'s entities and port contracts are unchanged; this change only adds an implementation behind the existing ports)

## Impact

- **Affected code**: `Infrastructure/Infrastructure.csproj`, `Infrastructure/ServiceCollectionExtensions.cs`, new files under `Infrastructure/Persistence/` and `Infrastructure/Migrations/`.
- **New dependencies**: `Microsoft.EntityFrameworkCore.SqlServer`, `Microsoft.EntityFrameworkCore.Design` (design-time only, needed for `dotnet ef migrations`).
- **Configuration**: introduces a `CvDatabase` connection string expectation (not yet supplied — local dev/CI has no database to point it at, so nothing in this change runs migrations or opens a connection at startup beyond DI registration).
- **Out of scope**: applying the migration to a real Azure SQL Database, the `Api` layer's `/api/cv` and `/api/contact` HTTP endpoints, and any change to Domain entities or Application ports.
