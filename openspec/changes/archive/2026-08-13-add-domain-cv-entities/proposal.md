## Why

The `api/` solution has `Domain`, `Application`, `Infrastructure`, and `Api` projects scaffolded (per the Clean Architecture restructure) but `Domain` has no business entities yet, and `Application` has no ports. `GET /api/cv` and `POST /api/contact` cannot be built until the CV's domain model and repository contracts exist.

## What Changes

- Add business entities to `Domain`: `Profile`, `Experience`, `Project`, `SkillCategory`, `ContactMessage`.
- `Profile`, `Experience`, `Project`, and `SkillCategory` each carry a `Language` property (`es`/`en`), mirroring how `client/src/data/cv-data.json` duplicates its entire tree per language today — this keeps the domain model's shape a direct match for the current content source and lets a future EF migration seed straight from it.
- `ContactMessage` has no `Language` property — a contact submission isn't authored in a fixed site language.
- Add `Application` ports (interfaces) that will drive future use cases: `ICvRepository` (read the full CV — profile, experience, projects, skill categories — for a given language) and `IContactRepository` (persist a `ContactMessage`).
- `Domain` stays dependency-free: no EF Core, no external NuGet packages, only base .NET types.

## Capabilities

### New Capabilities
- `cv-domain-model`: the CV's core business entities (`Profile`, `Experience`, `Project`, `SkillCategory`, `ContactMessage`) and the repository ports (`ICvRepository`, `IContactRepository`) that `Application` will depend on to read and write them.

### Modified Capabilities
(none — no existing spec describes backend domain behavior yet)

## Impact

- **Affected code**: `api/Domain` (new entity classes), `api/Application` (new port interfaces, referencing `Domain`).
- **Not in scope**: `Infrastructure` (EF Core `DbContext`, migrations, repository implementations), `Api` (the `GET /api/cv` / `POST /api/contact` HTTP triggers), and any change to `client/`. Those are future changes that will depend on this one.
- **Dependencies**: none added — this change deliberately keeps `Domain` free of NuGet packages.
