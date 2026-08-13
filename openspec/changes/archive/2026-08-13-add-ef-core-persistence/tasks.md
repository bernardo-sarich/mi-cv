## 1. Package references

- [x] 1.1 Add `Microsoft.EntityFrameworkCore.SqlServer` to `Infrastructure.csproj`
- [x] 1.2 Add `Microsoft.EntityFrameworkCore.Design` to `Infrastructure.csproj` with `PrivateAssets="all"`

## 2. DbContext and Fluent API mapping

- [x] 2.1 Create `Infrastructure/Persistence/CvDbContext.cs` with `DbSet<Profile>`, `DbSet<Experience>`, `DbSet<Project>`, `DbSet<SkillCategory>`, `DbSet<Stat>`, `DbSet<ContactMessage>`
- [x] 2.2 In `OnModelCreating`, configure a shadow `int Id` primary key (identity) for each of the six entities
- [x] 2.3 Configure `Profile.Stats` as a one-to-many relationship to `Stat` with a shadow `ProfileId` foreign key
- [x] 2.4 Configure `Bullets` (`Experience`), `Stack` (`Project`), and `Items` (`SkillCategory`) as JSON-converted string-list columns with a value comparer
- [x] 2.5 Configure `Language` as `.HasConversion<string>()` on every entity that carries it (`Profile`, `Experience`, `Project`, `SkillCategory`)
- [x] 2.6 Configure required string properties (`Name`, `Title`, `Bio`, `Company`, `Role`, `Dates`, `Description`, `Link`, `Suffix`, `Label`, `Email`, `Message`) as non-nullable

## 3. Repository implementations

- [x] 3.1 Create `Infrastructure/Persistence/EfCvRepository.cs` implementing `ICvRepository.GetCvAsync`, querying `Profile` (with `Stats`), `Experience`, `Project`, `SkillCategory` filtered by the given `Language`, and assembling a `CvContent`
- [x] 3.2 Create `Infrastructure/Persistence/EfContactRepository.cs` implementing `IContactRepository.SaveAsync`, adding the `ContactMessage` and calling `SaveChangesAsync`

## 4. Dependency injection

- [x] 4.1 In `Infrastructure/ServiceCollectionExtensions.cs`, register `CvDbContext` via `AddDbContext`, reading the `CvDatabase` connection string from `IConfiguration`
- [x] 4.2 Register `ICvRepository` → `EfCvRepository` and `IContactRepository` → `EfContactRepository`
- [x] 4.3 Update `AddInfrastructure`'s signature if needed to accept `IConfiguration`, and update its call site in `Api/Program.cs` accordingly

## 5. Migration

- [x] 5.1 Install/confirm the `dotnet-ef` tool is available for running migration commands
- [x] 5.2 Run `dotnet ef migrations add InitialCreate --project Infrastructure --startup-project Api` (or equivalent) to generate `Infrastructure/Migrations/`
- [x] 5.3 Verify the generated migration's `Up()` creates a table for each of the six entities and that the project builds
- [x] 5.4 Confirm no `dotnet ef database update` (or equivalent) is run — migration is generated only, not applied

## 6. Verification

- [x] 6.1 `dotnet build` succeeds for the whole `api/` solution
- [x] 6.2 Review that `Domain` project still has zero `<PackageReference>` entries (unaffected by this change)
