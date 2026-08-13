## Purpose

Defines the CV's core business entities and the repository contracts (ports) that the Application layer depends on to read and persist them, independent of any storage technology.

## ADDED Requirements

### Requirement: Profile entity
The system SHALL define a `Profile` entity representing a person's CV headline, scoped to one language, with `Language`, `Name`, `Title`, `Bio`, and a collection of `Stats`.

#### Scenario: Profile is language-scoped
- **WHEN** a `Profile` is constructed
- **THEN** it carries a `Language` value identifying which supported language (`es` or `en`) its `Name`, `Title`, `Bio`, and `Stats` content is written in

### Requirement: Experience entity
The system SHALL define an `Experience` entity representing one work history entry, scoped to one language, with `Language`, `Company`, `Role`, `Dates`, and a collection of `Bullets`.

#### Scenario: Experience is language-scoped
- **WHEN** an `Experience` is constructed
- **THEN** it carries a `Language` value identifying which supported language its `Bullets` (and the rest of its content) is written in

### Requirement: Project entity
The system SHALL define a `Project` entity representing one portfolio project, scoped to one language, with `Language`, `Name`, `Description`, a collection of `Stack` items, and a `Link`.

#### Scenario: Project is language-scoped
- **WHEN** a `Project` is constructed
- **THEN** it carries a `Language` value identifying which supported language its `Description` is written in

### Requirement: SkillCategory entity
The system SHALL define a `SkillCategory` entity representing one grouping of skills, scoped to one language, with `Language`, `Name`, and a collection of `Items`.

#### Scenario: SkillCategory is language-scoped
- **WHEN** a `SkillCategory` is constructed
- **THEN** it carries a `Language` value identifying which supported language it belongs to

### Requirement: ContactMessage entity
The system SHALL define a `ContactMessage` entity representing one inbound contact-form submission, with `Name`, `Email`, `Message`, and `SubmittedAt`, and no `Language` property.

#### Scenario: ContactMessage has no language
- **WHEN** a `ContactMessage` is constructed
- **THEN** it exposes `Name`, `Email`, `Message`, and `SubmittedAt`, and has no `Language` field, since a submission is not authored in a fixed site language

### Requirement: Domain has no external dependencies
The `Domain` project SHALL depend only on base .NET types. It SHALL NOT reference Entity Framework Core or any other external NuGet package.

#### Scenario: Domain project file lists no package references
- **WHEN** the `Domain` project file is inspected
- **THEN** it contains no `<PackageReference>` entries

### Requirement: ICvRepository port
The system SHALL define an `ICvRepository` port in the Application layer with an operation to read the full CV — `Profile`, `Experience` entries, `Project` entries, and `SkillCategory` entries — for a given language.

#### Scenario: Reading the CV for a language returns only that language's content
- **WHEN** `ICvRepository`'s read operation is called with a supported language code
- **THEN** the returned `Profile`, `Experience`, `Project`, and `SkillCategory` data all carry that same `Language`

### Requirement: IContactRepository port
The system SHALL define an `IContactRepository` port in the Application layer with an operation to persist a `ContactMessage`.

#### Scenario: Saving a contact message
- **WHEN** `IContactRepository`'s save operation is called with a `ContactMessage`
- **THEN** the port's contract guarantees the message is durably stored, without specifying how

### Requirement: Ports have no infrastructure dependencies
`ICvRepository` and `IContactRepository` SHALL be plain interfaces referencing only `Domain` entities and base .NET types, with no Entity Framework Core or other infrastructure-specific types in their signatures.

#### Scenario: Port signatures use only Domain and base .NET types
- **WHEN** the `ICvRepository` and `IContactRepository` interface signatures are inspected
- **THEN** every parameter and return type is either a `Domain` entity, a collection of one, or a base .NET type
