## MODIFIED Requirements

### Requirement: Language-scoped content accessor
The system SHALL provide a function that, given a requested language code, returns only that language's content object, without requiring the caller to know the underlying storage shape. The accessor SHALL fetch this content from the real CV API. If the fetch fails for any reason (network error, non-2xx response), the accessor SHALL fall back to the local mock content for the requested language instead of rejecting.

#### Scenario: Requesting a language returns only that language's content
- **WHEN** the accessor is called with a supported language code and the API request succeeds
- **THEN** it returns that language's `bio`, `stats`, `experience`, `skills`, `projects`, and `contact` content, with no other language's content included in the result

#### Scenario: Accessor is swappable without changing its interface
- **WHEN** the accessor's internal source is later changed from local data to a network request
- **THEN** the function's signature and the shape of its returned content remain unchanged, so no caller needs to be modified

#### Scenario: API failure falls back to local mock content
- **WHEN** the accessor is called with a supported language code and the API request fails (network error or non-2xx response)
- **THEN** the accessor returns that language's content from the local mock data instead of throwing or returning nothing
