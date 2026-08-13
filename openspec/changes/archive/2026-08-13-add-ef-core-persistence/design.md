> **Addendum (post-archive correction):** Decisions 1–4 below were superseded during code review — using `Domain` classes directly as EF entities coupled Domain to persistence, violating this repo's Clean/Hexagonal Architecture rule (Domain must not depend on Infrastructure-shaped concerns). The implementation now uses dedicated EF entity classes in `Infrastructure/Persistence/Entities/` (`ProfileEntity`, `ExperienceEntity`, `ProjectEntity`, `SkillCategoryEntity`, `StatEntity`, `ContactMessageEntity`), each with a real `Id` and mutable properties, mapped to/from `Domain` types via `ToDomain()`/`FromDomain()` methods called from `EfCvRepository`/`EfContactRepository`. This removes the need for shadow keys and EF's field-based access tricks (decisions 2 and 4) since the EF entities now have ordinary public properties. Decisions 5–8 (JSON string-list columns, `Language` as `nvarchar`, connection string name, Design package as dev-only) are unchanged. The migration was regenerated against the new model.

## Context

See proposal.md - Why. Relevant constraints from the current codebase:

- `Domain` entities (`Profile`, `Experience`, `Project`, `SkillCategory`, `Stat`, `ContactMessage`) are plain POCOs with `required` + `init`-only properties and **no `Id` / technical key** — `cv-domain-model`'s spec deliberately keeps Domain free of persistence concerns and free of EF Core references.
- Collection properties (`Profile.Stats`, `Experience.Bullets`, `Project.Stack`, `SkillCategory.Items`) are typed `IReadOnlyList<T>` with no public setter — only `init`.
- `Infrastructure.csproj` currently targets `net9.0` and references only `Domain`.

## Goals / Non-Goals

**Goals:**
- Map all six persistable entities onto SQL Server tables using only Fluent API, without adding any attribute or `Id` property to `Domain`.
- Keep `EfCvRepository` / `EfContactRepository` working directly against `Domain` types — no parallel EF-entity/DTO layer.
- Produce a generated, buildable `InitialCreate` migration.

**Non-Goals:**
- Applying the migration to a real database, or provisioning the Azure SQL Database instance itself.
- Designing a translation table for the Es/En content duplication — out of scope, per proposal.md.
- Performance tuning (indexes beyond keys/FKs, caching) — the CV dataset is tiny and read-mostly.

## Decisions

**1. Domain entities are also the EF entities (no separate persistence model).**
`Profile`, `Experience`, etc. are simple data holders with no behavior. Introducing a parallel `ProfileEntity`/mapper layer would double the maintenance surface for no benefit at this size. Trade-off accepted: if Domain ever needs a shape EF can't map cleanly (e.g. a value object), this decision will need revisiting — flagged here rather than designed around speculatively.

**2. Primary keys are shadow properties, not added to Domain.**
Since Domain intentionally has no `Id`, each entity gets a shadow `int Id` key configured via `builder.Entity<T>().Property<int>("Id"); .HasKey("Id");` (SQL Server identity column by convention). Alternative considered — adding a public `Id` to each Domain class — rejected: it would change `cv-domain-model`'s entities, which this change deliberately leaves untouched (see proposal.md - Modified Capabilities: none).

**3. `Profile` → `Stat` is a shadow-FK one-to-many, not an owned/JSON collection.**
The proposal requires a standalone `DbSet<Stat>`, so `Stat` must be its own table (not EF `OwnsMany`, which wouldn't produce a queryable `DbSet`). `Stat` has no back-reference to `Profile` in Domain, so the FK (`ProfileId`) is configured as a shadow property via `HasMany(p => p.Stats).WithOne().HasForeignKey("ProfileId")`.

**4. `init`-only / no-setter collection properties are mapped via EF's field-based access.**
`Profile.Stats`, `Experience.Bullets`, `Project.Stack`, `SkillCategory.Items` expose no public setter. EF Core resolves auto-implemented properties' compiler-generated backing fields automatically and can materialize `required`/`init` properties through them without any Domain code changes — this is existing EF Core behavior, not something this change adds. No fallback needed; if it turns out not to work for a specific property during implementation, that's an `openspec-apply-change` blocker to raise, not a silent workaround.

**5. String-list properties (`Bullets`, `Stack`, `Items`) are stored as a single JSON column, not a child table.**
SQL Server has no native array column type, and these lists are opaque content (never queried by individual element). Mapping them as `nvarchar` JSON via `.Property(e => e.Bullets).HasConversion(...)` with a value comparer is simpler than a normalized child table and matches how they're actually used (read-and-render, never filtered). This is a single field's storage format, not the "JSON-blob CV" CLAUDE.md rules out — the overall model stays one table per entity.

**6. `Language` enum stored as `nvarchar`, not `int`.**
`.HasConversion<string>()` on the `Language` property of every language-scoped entity, so rows are human-readable when inspecting the database directly (useful given the audience described in CLAUDE.md includes technical reviewers). Minor call — either representation works.

**7. Connection string name: `CvDatabase`.**
`AddDbContext<CvDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("CvDatabase")))` in `Infrastructure/ServiceCollectionExtensions.cs`. No value is supplied by this change; local/CI builds that never construct the DI container at runtime are unaffected.

**8. `Microsoft.EntityFrameworkCore.Design` is a design-time-only dependency.**
Referenced with `<PrivateAssets>all</PrivateAssets>` so it doesn't flow to consumers of `Infrastructure` — it exists solely so `dotnet ef migrations add` works.

## Risks / Trade-offs

- [EF's field-based materialization of `required`/`init` collection properties might hit an edge case for one of the four collection properties] → Mitigation: if `dotnet build` or `dotnet ef migrations add` surfaces a mapping error for a specific property, that becomes an explicit blocker during apply (do not silently add setters to Domain without flagging it).
- [Shadow keys/FKs are less discoverable than explicit `Id` properties when reading Domain code] → Mitigation: documented here and via Fluent API comments in `OnModelCreating`; acceptable since keeping Domain persistence-free is the higher priority (established by `cv-domain-model`).
- [JSON-column string lists can't be queried/filtered by SQL] → Mitigation: none needed — nothing in the current or planned scope filters CV content by bullet/skill-item text.

## Migration Plan

1. Add package references, `CvDbContext`, Fluent mappings, both repositories, DI registration (this change).
2. Run `dotnet ef migrations add InitialCreate` to generate `Infrastructure/Migrations/`; commit the generated files; do not run `database update`.
3. (Future, separate change) Provision the Azure SQL Database, supply the `CvDatabase` connection string, apply the migration, wire up the `Api` endpoints.

Rollback for this change is simply reverting the commit — no database state exists yet to roll back.
