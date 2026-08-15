## REMOVED Requirements

### Requirement: ICvRepository is implemented against EF Core
**Reason**: `ICvRepository` bundled four independent aggregates (`Profile`, `Experience`, `Project`, `SkillCategory`) behind one port and let the EF Core implementation decide how to compose them into a `CvContent` — a use-case-level decision that belongs in `Application`, not in a persistence port. Replaced by four per-aggregate ports (see "Per-aggregate CV read ports are implemented against EF Core" below); the composition into `CvContent` now happens in `GetCvUseCase`.
**Migration**: Callers that depended on `ICvRepository` (only `GetCvUseCase`) now depend on `IProfileRepository`, `IExperienceRepository`, `IProjectRepository`, and `ISkillCategoryRepository` instead, and perform the composition themselves. No externally observable behavior changes: `GET /api/cv` still returns the same profile, experience, projects, and skills for a given language.

## ADDED Requirements

### Requirement: Per-aggregate CV read ports are implemented against EF Core
The system SHALL provide four EF Core-backed implementations, one per independent Domain aggregate: a `Profile` reader (including its `Stat` rows), an `Experience` reader, a `Project` reader, and a `SkillCategory` reader. Each SHALL read only its own aggregate's rows for a given `Language` via the `DbContext`, returning `Domain` types, and SHALL NOT read or assemble any other aggregate's data.

#### Scenario: Reading the profile returns only that language's profile and stats
- **WHEN** the EF-backed profile reader is called with a supported `Language`
- **THEN** it queries the `Profile` and `Stat` tables filtered to that `Language` and returns a `Domain` `Profile` including its stats

#### Scenario: Reading experience returns only that language's rows
- **WHEN** the EF-backed experience reader is called with a supported `Language`
- **THEN** it queries the `Experience` table filtered to that `Language` and returns `Domain` `Experience` entities, with no `Profile`, `Project`, or `SkillCategory` data included

#### Scenario: Reading projects returns only that language's rows
- **WHEN** the EF-backed project reader is called with a supported `Language`
- **THEN** it queries the `Project` table filtered to that `Language` and returns `Domain` `Project` entities, with no `Profile`, `Experience`, or `SkillCategory` data included

#### Scenario: Reading skills returns only that language's rows
- **WHEN** the EF-backed skill category reader is called with a supported `Language`
- **THEN** it queries the `SkillCategory` table filtered to that `Language` and returns `Domain` `SkillCategory` entities, with no `Profile`, `Experience`, or `Project` data included

## MODIFIED Requirements

### Requirement: Persistence implementations are registered for DI
The system SHALL register the `DbContext` and the EF-backed implementations of `IProfileRepository`, `IExperienceRepository`, `IProjectRepository`, `ISkillCategoryRepository`, and `IContactRepository` in Infrastructure's dependency injection setup, resolving the database connection string from configuration.

#### Scenario: Infrastructure registration wires the EF implementations
- **WHEN** Infrastructure's service registration extension is invoked
- **THEN** `IProfileRepository`, `IExperienceRepository`, `IProjectRepository`, `ISkillCategoryRepository`, and `IContactRepository` each resolve to their EF-backed implementation, all backed by a `DbContext` configured from a configuration-provided connection string
