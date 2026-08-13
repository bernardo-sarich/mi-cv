## 1. Domain: shared types

- [x] 1.1 Add `Domain/Language.cs` with `public enum Language { Es, En }`.

## 2. Domain: entities

- [x] 2.1 Add `Domain/Stat.cs` (`Value`, `Suffix`, `Label`) used by `Profile.Stats`.
- [x] 2.2 Add `Domain/Profile.cs` with `Language`, `Name`, `Title`, `Bio`, `IReadOnlyList<Stat> Stats`.
- [x] 2.3 Add `Domain/Experience.cs` with `Language`, `Company`, `Role`, `Dates`, `IReadOnlyList<string> Bullets`.
- [x] 2.4 Add `Domain/Project.cs` with `Language`, `Name`, `Description`, `IReadOnlyList<string> Stack`, `Link`.
- [x] 2.5 Add `Domain/SkillCategory.cs` with `Language`, `Name`, `IReadOnlyList<string> Items`.
- [x] 2.6 Add `Domain/ContactMessage.cs` with `Name`, `Email`, `Message`, `SubmittedAt` (no `Language`).
- [x] 2.7 Add `Domain/CvContent.cs` aggregating one language's full CV: `Language`, `Profile`, `IReadOnlyList<Experience>`, `IReadOnlyList<Project>`, `IReadOnlyList<SkillCategory>` — the return shape for `ICvRepository`.
- [x] 2.8 Confirm `Domain.csproj` still has zero `<PackageReference>` entries after adding the entities.

## 3. Application: ports

- [x] 3.1 Add `Application/Ports/ICvRepository.cs` with `Task<CvContent> GetCvAsync(Language language, CancellationToken cancellationToken = default)`.
- [x] 3.2 Add `Application/Ports/IContactRepository.cs` with `Task SaveAsync(ContactMessage message, CancellationToken cancellationToken = default)`.
- [x] 3.3 Confirm both interfaces reference only `Domain` types and base .NET types (no Infrastructure/EF Core types).

## 4. Verification

- [x] 4.1 Run `dotnet build` from `api/` and confirm `Domain` and `Application` compile cleanly.
