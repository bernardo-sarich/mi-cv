## MODIFIED Requirements

### Requirement: Bilingual content structure
The system SHALL store all person-specific CV content in one local data source keyed by the two supported language codes (`es`, `en`), with each language entry containing: `bio`, `stats`, `experience`, `skills`, and `projects`. Contact information (GitHub/LinkedIn/email) is not part of this content source; it is provided by a separate, dedicated client-side source outside this capability.

#### Scenario: Both languages hold the same structure
- **WHEN** the content source is loaded
- **THEN** the `es` and `en` entries each provide `bio`, `stats`, `experience`, `skills`, and `projects` fields, with no field present in one language and absent in the other, and neither entry carries a `contact` field

### Requirement: Language-scoped content accessor
The system SHALL provide a function that, given a requested language code, returns only that language's content object, without requiring the caller to know the underlying storage shape. The accessor SHALL fetch this content from the real CV API. If the fetch fails for any reason (network error, non-2xx response), the accessor SHALL fall back to the local mock content for the requested language instead of rejecting.

#### Scenario: Requesting a language returns only that language's content
- **WHEN** the accessor is called with a supported language code and the API request succeeds
- **THEN** it returns that language's `bio`, `stats`, `experience`, `skills`, and `projects` content, with no other language's content included in the result

#### Scenario: Accessor is swappable without changing its interface
- **WHEN** the accessor's internal source is later changed from local data to a network request
- **THEN** the function's signature and the shape of its returned content remain unchanged, so no caller needs to be modified

#### Scenario: API failure falls back to local mock content
- **WHEN** the accessor is called with a supported language code and the API request fails (network error or non-2xx response)
- **THEN** the accessor returns that language's content from the local mock data instead of throwing or returning nothing
