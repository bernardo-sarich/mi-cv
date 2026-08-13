# cv-data-layer Specification

## Purpose

Provides the single source of bilingual CV content and the accessor/hook that section components use to read it, structured so a future real API can be swapped in behind the same interface without touching consuming components.

## Requirements

### Requirement: Bilingual content structure
The system SHALL store all person-specific CV content in one local data source keyed by the two supported language codes (`es`, `en`), with each language entry containing: `bio`, `stats`, `experience`, `skills`, `projects`, and `contact`.

#### Scenario: Both languages hold the same structure
- **WHEN** the content source is loaded
- **THEN** the `es` and `en` entries each provide `bio`, `stats`, `experience`, `skills`, `projects`, and `contact` fields, with no field present in one language and absent in the other

### Requirement: Language-scoped content accessor
The system SHALL provide a function that, given a requested language code, returns only that language's content object, without requiring the caller to know the underlying storage shape.

#### Scenario: Requesting a language returns only that language's content
- **WHEN** the accessor is called with a supported language code
- **THEN** it returns that language's `bio`, `stats`, `experience`, `skills`, `projects`, and `contact` content, with no other language's content included in the result

#### Scenario: Accessor is swappable without changing its interface
- **WHEN** the accessor's internal source is later changed from local data to a network request
- **THEN** the function's signature and the shape of its returned content remain unchanged, so no caller needs to be modified

### Requirement: Section content hook
The system SHALL expose CV content to section components through a hook that returns the current language's content, a loading indicator, and an error value.

#### Scenario: Hook exposes data, loading, and error
- **WHEN** a section component calls the content hook
- **THEN** it receives an object with `data`, `loading`, and `error` fields reflecting the current state of the content request

#### Scenario: Content updates when the visitor switches language
- **WHEN** the visitor toggles the site language while a section using the hook is mounted
- **THEN** the hook returns the newly selected language's content without requiring a page reload

### Requirement: No component reads the data file directly
Section components SHALL obtain CV content only through the section content hook, never by importing the underlying data file.

#### Scenario: Section components have no direct data import
- **WHEN** the Hero, Experience, Skills, Projects, or Contact component source is inspected
- **THEN** none of them import the CV content data file directly; each obtains content through the hook
