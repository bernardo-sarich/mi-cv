# cv-data-seed Specification

## Purpose

Provides a manually-run tool that populates the CV database tables from `client/src/data/cv-data.json`, since no admin write path exists yet and the database is otherwise never populated.

## Requirements

### Requirement: Seed migrates CV content for every locale
The system SHALL provide a runnable seed tool that reads `client/src/data/cv-data.json` and, for each locale present in the file, writes a `Profile` (with its `Stat` rows), `Experience`, `Project`, and `SkillCategory` rows to the database.

#### Scenario: Running the seed against an empty database
- **WHEN** the seed tool is run against a database with no existing CV rows
- **THEN** afterwards each locale in `cv-data.json` has a corresponding `Profile` row (with its `Stat` rows) and the matching `Experience`, `Project`, and `SkillCategory` rows, with field values equal to the source JSON

#### Scenario: The contact block is not migrated
- **WHEN** the seed tool processes a locale's data
- **THEN** the locale's `contact` field (github/linkedin/email) is not written anywhere, since no table exists to hold it

### Requirement: Seed is idempotent per locale
Running the seed tool more than once SHALL NOT create duplicate rows. Each run SHALL leave the database in the same end state for a given `cv-data.json` input, regardless of how many times it has previously run.

#### Scenario: Running the seed twice in a row
- **WHEN** the seed tool is run successfully, and then run again against the same database with unchanged `cv-data.json` content
- **THEN** the row counts for `Profile`, `Stat`, `Experience`, `Project`, and `SkillCategory` after the second run equal the row counts after the first run

#### Scenario: Running the seed after cv-data.json changes
- **WHEN** `cv-data.json` content for a locale changes and the seed tool is run again
- **THEN** the database rows for that locale reflect the new content, with no leftover rows from the previous version

### Requirement: Seed never hardcodes a connection string
The seed tool SHALL resolve its database connection string from configuration (the same `ConnectionStrings:CvDatabase` key used at runtime by the Api), and SHALL NOT contain a literal connection string, credential, or secret in source code.

#### Scenario: Connection string is missing from configuration
- **WHEN** the seed tool is run without a `ConnectionStrings:CvDatabase` value available in its configuration
- **THEN** the tool fails fast with an error identifying the missing configuration key, and makes no database connection attempt

### Requirement: Local connection string setup is documented
The repository SHALL include a tracked, non-secret example settings file showing which configuration keys a developer must supply locally, and a README documenting how to derive a working local configuration from it and how the equivalent secret is supplied in deployed environments.

#### Scenario: New developer sets up the seed locally
- **WHEN** a developer follows `api/README.md` and copies the tracked example settings file to the gitignored local settings file, filling in a real connection string
- **THEN** the seed tool and the Api can both resolve `ConnectionStrings:CvDatabase` from that local file, and no secret value exists anywhere in tracked files
