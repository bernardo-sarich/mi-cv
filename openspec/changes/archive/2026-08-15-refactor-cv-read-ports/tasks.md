## 1. Application ports

- [x] 1.1 Add `Application/Ports/IProfileRepository.cs` with `Task<Profile> GetProfileAsync(Language language, CancellationToken cancellationToken = default)`
- [x] 1.2 Add `Application/Ports/IExperienceRepository.cs` with `Task<IReadOnlyList<Experience>> GetExperienceAsync(Language language, CancellationToken cancellationToken = default)`
- [x] 1.3 Add `Application/Ports/IProjectRepository.cs` with `Task<IReadOnlyList<Project>> GetProjectsAsync(Language language, CancellationToken cancellationToken = default)`
- [x] 1.4 Add `Application/Ports/ISkillCategoryRepository.cs` with `Task<IReadOnlyList<SkillCategory>> GetSkillsAsync(Language language, CancellationToken cancellationToken = default)`
- [x] 1.5 Delete `Application/Ports/ICvRepository.cs`

## 2. Infrastructure implementations

- [x] 2.1 Add `Infrastructure/Persistence/EfProfileRepository.cs` implementing `IProfileRepository`, moving `EfCvRepository.GetProfileAsync`'s body (profile + `Include(p => p.Stats)` + `SingleAsync`) and its `ToDomain()` mapping
- [x] 2.2 Add `Infrastructure/Persistence/EfExperienceRepository.cs` implementing `IExperienceRepository`, moving `EfCvRepository.GetExperienceAsync`'s body (including the existing `.OrderBy(e => e.Id)`) and its `ToDomain()` mapping
- [x] 2.3 Add `Infrastructure/Persistence/EfProjectRepository.cs` implementing `IProjectRepository`, moving `EfCvRepository.GetProjectsAsync`'s body (including the existing `.OrderBy(p => p.Id)`) and its `ToDomain()` mapping
- [x] 2.4 Add `Infrastructure/Persistence/EfSkillCategoryRepository.cs` implementing `ISkillCategoryRepository`, moving `EfCvRepository.GetSkillsAsync`'s body (including the existing `.OrderBy(s => s.Id)`) and its `ToDomain()` mapping
- [x] 2.5 Delete `Infrastructure/Persistence/EfCvRepository.cs`

## 3. Application orchestration

- [x] 3.1 Update `Application/UseCases/GetCvUseCase.cs` to depend on the four new ports, fire `GetProfileAsync`/`GetExperienceAsync`/`GetProjectsAsync`/`GetSkillsAsync` concurrently via `Task.WhenAll`, and construct the `CvContent` from the four results (same shape `EfCvRepository.GetCvAsync` built today)

## 4. DI registration

- [x] 4.1 Update `Infrastructure/ServiceCollectionExtensions.cs`: replace `services.AddScoped<ICvRepository, EfCvRepository>()` with four `AddScoped` registrations for `IProfileRepository`/`EfProfileRepository`, `IExperienceRepository`/`EfExperienceRepository`, `IProjectRepository`/`EfProjectRepository`, `ISkillCategoryRepository`/`EfSkillCategoryRepository`

## 5. Verification

- [x] 5.1 `dotnet build` the `api/` solution and fix any compile errors
- [x] 5.2 Run the Api locally (`dotnet run --project Api`) and manually check `GET /api/cv?lang=es` and `GET /api/cv?lang=en` return the same profile/stats/experience/projects/skills shape as before the refactor

## 6. Docs

- [x] 6.1 Update `CLAUDE.md`'s `Infrastructure` bullet to describe the four per-aggregate ports/implementations instead of the single `EfCvRepository`/`ICvRepository`, keeping the note about `IDbContextFactory` + `Task.WhenAll` but reattributing it to `GetCvUseCase`
- [x] 6.2 Update `README.md`'s "Por qué" paragraph in the relational-model decision section, which currently claims a single `EfCvRepository` "cubre las cinco entidades... en vez de tener una clase por tabla" — correct it to describe the new one-port-per-aggregate structure
