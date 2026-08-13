## Context

`api/` is a 4-project Clean Architecture solution (`Api` → `Application` → `Domain` ← `Infrastructure`) with no entities or ports yet. The only existing content source is `client/src/data/cv-data.json`, which duplicates its entire tree under top-level `es`/`en` keys — including fields that never actually differ by language (`company`, `dates`, `stack`, skill category names, contact links). See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Model `Profile`, `Experience`, `Project`, `SkillCategory`, `ContactMessage` as plain C# classes in `Domain`.
- Model language as a `Language` property on every entity except `ContactMessage`, matching the source JSON's per-language duplication.
- Define `ICvRepository` and `IContactRepository` in `Application`, with signatures using only `Domain` types.

**Non-Goals:**
- No EF Core `DbContext`, entity configuration, or migrations (`Infrastructure`) — a later change.
- No HTTP triggers or DTOs (`Api`) — a later change.
- No validation logic, value objects, or business rules beyond plain data holders — the source JSON has no validation today, and none is asked for here.

## Decisions

### Language as an entity property, not a query parameter type
Two options were on the table: (a) give each entity a `Language` property, so a full CV read returns two rows per language-scoped concept (today's JSON shape), or (b) keep entities language-neutral and thread `Language` only through repository method parameters, with translatable text pulled from a side table.

Chosen: (a). The source JSON already duplicates the *entire* per-language subtree, including fields that don't actually vary text-wise (`company`, `dates`, `stack`, skill category `name`, `Project.Link`). Modeling `Language` as a property keeps `Domain` a direct structural mirror of the current content, keeps `ICvRepository`'s contract simple (one call, one language, one full graph back), and avoids introducing a second "translation" concept that the current data doesn't need. The cost — some invariant fields get stored twice, once per language row — is accepted as a known trade-off (see Risks) rather than solved with a more normalized model the source data doesn't call for.

`ContactMessage` is excluded from this: a contact submission is authored once, in whatever language the visitor typed it, and isn't part of the bilingual content tree — adding `Language` to it would misrepresent what the field means.

### Ports live in Application, return Domain types directly
`ICvRepository.GetCvAsync(Language language)` returns a single aggregate result (e.g., a `CvContent` composed of `Profile` + lists of `Experience`/`Project`/`SkillCategory`) rather than four separate calls — mirrors how the client currently consumes one full per-language object. `IContactRepository.SaveAsync(ContactMessage message)` returns `Task`. Both are async to anticipate a real database in `Infrastructure`.

### `Language` representation
Modeled as an enum (`Language { Es, En }`) rather than a raw string — the set of supported languages is fixed and known (matches `i18n-state`'s two-language contract on the client), and an enum keeps `Domain` dependency-free while still preventing invalid language values at compile time.

## Risks / Trade-offs

- **Duplicated invariant fields** (`Company`, `Dates`, `Stack`, skill category `Name`, contact links) are stored once per language row → accepted; matches the current source JSON exactly, keeps the model uniform, and can be revisited if/when `Infrastructure` migrations make the duplication costly.
- **No shared identity across an entity's two language rows** (e.g., nothing links the `es` and `en` `Experience` for "Acme Corp") → not needed by any current requirement (`GET /api/cv` reads one language at a time); a future change can add a correlation key if cross-language lookups become necessary.
