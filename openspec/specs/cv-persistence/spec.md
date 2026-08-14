# cv-persistence Specification

## Purpose

Provides the EF Core-backed implementation of the `ICvRepository` and `IContactRepository` ports, mapping Domain entities onto relational tables in Azure SQL Database without leaking persistence concerns into Domain or Application.

## Requirements

### Requirement: CvDbContext exposes a table per persistable entity
The system SHALL provide a `DbContext` with one `DbSet` for each persistable Domain entity: `Profile`, `Experience`, `Project`, `SkillCategory`, `Stat`, `ContactMessage`, and `ContactAttempt`.

#### Scenario: Each persistable entity has its own set
- **WHEN** the `DbContext` is inspected
- **THEN** it exposes a distinct `DbSet` for `Profile`, `Experience`, `Project`, `SkillCategory`, `Stat`, `ContactMessage`, and `ContactAttempt`, and no `DbSet` for `CvContent` (a read-time aggregate, not a stored entity)

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

### Requirement: Transient connection failures are retried automatically
The system SHALL configure the `DbContext` to automatically retry database operations that fail due to a transient SQL connection error (for example, the database resuming from an auto-paused state), using a short fixed delay between attempts, before surfacing the failure to the caller.

#### Scenario: A transient failure during database resume is retried
- **WHEN** a database operation fails with a transient SQL error while the database is resuming from being auto-paused
- **THEN** the system automatically retries the operation after a short fixed delay, up to a bounded number of attempts, so a transient failure that resolves within that window is not observed by the caller

#### Scenario: A non-transient failure or exhausted retries is surfaced
- **WHEN** a database operation fails with an error that is not classified as transient, or all retry attempts have been exhausted
- **THEN** the failure is surfaced to the caller instead of being retried indefinitely

### Requirement: Migrations are generated and applied manually, not by the deployment pipeline
The system SHALL include generated EF Core migrations that create and evolve the schema for all mapped entities, including `ContactAttempt`. Applying a migration to a database SHALL be a manual, documented step (`dotnet ef database update`), never an automatic part of the CI/CD deployment workflow.

#### Scenario: Migrations create all mapped tables
- **WHEN** the migrations are inspected
- **THEN** together they create a table for each of `Profile`, `Experience`, `Project`, `SkillCategory`, `Stat`, `ContactMessage`, and `ContactAttempt`

#### Scenario: Deployment does not apply migrations automatically
- **WHEN** the CI/CD workflow builds and deploys the Api
- **THEN** no `dotnet ef database update` or equivalent migration-apply step runs as part of that pipeline; applying migrations to a database is a manual step documented in `api/README.md`
