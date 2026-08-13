# cv-persistence Specification

## Purpose

Provides the EF Core-backed implementation of the `ICvRepository` and `IContactRepository` ports, mapping Domain entities onto relational tables in Azure SQL Database without leaking persistence concerns into Domain or Application.

## Requirements

### Requirement: CvDbContext exposes a table per persistable entity
The system SHALL provide a `DbContext` with one `DbSet` for each persistable Domain entity: `Profile`, `Experience`, `Project`, `SkillCategory`, `Stat`, and `ContactMessage`.

#### Scenario: Each persistable entity has its own set
- **WHEN** the `DbContext` is inspected
- **THEN** it exposes a distinct `DbSet` for `Profile`, `Experience`, `Project`, `SkillCategory`, `Stat`, and `ContactMessage`, and no `DbSet` for `CvContent` (a read-time aggregate, not a stored entity)

### Requirement: Entity mapping uses Fluent API only
All entity-to-table mapping SHALL be configured through Fluent API (`OnModelCreating`). Domain entity classes SHALL NOT carry persistence-specific data annotations.

#### Scenario: Domain entities remain annotation-free
- **WHEN** a `Domain` entity class is inspected
- **THEN** it has no EF Core data annotation attributes (e.g. `[Table]`, `[Column]`, `[Key]`)

#### Scenario: Mapping is centralized in OnModelCreating
- **WHEN** the `DbContext`'s `OnModelCreating` method is inspected
- **THEN** it contains the Fluent API configuration for every mapped entity's table, keys, and relationships

### Requirement: ICvRepository is implemented against EF Core
The system SHALL provide an implementation of `ICvRepository` that reads `Profile`, `Experience`, `Project`, and `SkillCategory` data for a given `Language` via the `DbContext`, returning `Domain` types.

#### Scenario: Reading the CV returns only the requested language's rows
- **WHEN** the EF-backed `ICvRepository` implementation's read operation is called with a supported `Language`
- **THEN** it queries the underlying tables filtered to that `Language` and returns `Domain` entities assembled into a `CvContent`

### Requirement: IContactRepository is implemented against EF Core
The system SHALL provide an implementation of `IContactRepository` that persists a `ContactMessage` via the `DbContext`.

#### Scenario: Saving a contact message writes a row
- **WHEN** the EF-backed `IContactRepository` implementation's save operation is called with a `ContactMessage`
- **THEN** a corresponding row is added to the `ContactMessage` table and persisted on `SaveChanges`

### Requirement: Persistence implementations are registered for DI
The system SHALL register the `DbContext` and both EF-backed repository implementations in Infrastructure's dependency injection setup, resolving the database connection string from configuration.

#### Scenario: Infrastructure registration wires the EF implementations
- **WHEN** Infrastructure's service registration extension is invoked
- **THEN** `ICvRepository` resolves to the EF-backed implementation and `IContactRepository` resolves to the EF-backed implementation, both backed by a `DbContext` configured from a configuration-provided connection string

### Requirement: Initial migration is generated but not applied
The system SHALL include a generated EF Core migration that creates the initial schema for all mapped entities. This change SHALL NOT apply that migration to any database.

#### Scenario: Migration exists and creates all mapped tables
- **WHEN** the initial migration's `Up` method is inspected
- **THEN** it creates a table for each of `Profile`, `Experience`, `Project`, `SkillCategory`, `Stat`, and `ContactMessage`

#### Scenario: No database is touched by this change
- **WHEN** this change is applied
- **THEN** no `dotnet ef database update` or equivalent migration-apply step runs against any database
