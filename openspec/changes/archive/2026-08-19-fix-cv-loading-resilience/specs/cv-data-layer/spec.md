## MODIFIED Requirements

### Requirement: Language-scoped content accessor
The system SHALL provide a function that, given a requested language code, returns only that language's content object, without requiring the caller to know the underlying storage shape. The accessor SHALL fetch this content from the real CV API. If the fetch fails for any reason (network error, non-2xx response), the accessor SHALL fall back to the local mock content for the requested language instead of rejecting. The accessor SHALL bound the fetch with a fixed timeout (15-20 seconds); if the fetch has not completed within that timeout, the accessor SHALL abort it and fall back to the local mock content for the requested language, the same as any other fetch failure.

#### Scenario: Requesting a language returns only that language's content
- **WHEN** the accessor is called with a supported language code and the API request succeeds
- **THEN** it returns that language's `bio`, `stats`, `experience`, `skills`, and `projects` content, with no other language's content included in the result

#### Scenario: Accessor is swappable without changing its interface
- **WHEN** the accessor's internal source is later changed from local data to a network request
- **THEN** the function's signature and the shape of its returned content remain unchanged, so no caller needs to be modified

#### Scenario: API failure falls back to local mock content
- **WHEN** the accessor is called with a supported language code and the API request fails (network error or non-2xx response)
- **THEN** the accessor returns that language's content from the local mock data instead of throwing or returning nothing

#### Scenario: API request exceeding the timeout falls back to local mock content
- **WHEN** the accessor is called with a supported language code and the API request has not completed within the fixed timeout
- **THEN** the in-flight request is aborted and the accessor returns that language's content from the local mock data, the same as a network failure

### Requirement: Section content hook
The system SHALL expose CV content to section components through a hook that returns the current language's content, a loading indicator, and an error value. When the visitor switches language while a previous language's content request is still in flight, the hook SHALL cancel that superseded request rather than merely ignoring its eventual result.

#### Scenario: Hook exposes data, loading, and error
- **WHEN** a section component calls the content hook
- **THEN** it receives an object with `data`, `loading`, and `error` fields reflecting the current state of the content request

#### Scenario: Content updates when the visitor switches language
- **WHEN** the visitor toggles the site language while a section using the hook is mounted
- **THEN** the hook returns the newly selected language's content without requiring a page reload

#### Scenario: Switching language cancels the superseded in-flight request
- **WHEN** the visitor switches the site language again before the content request for the previous language has resolved
- **THEN** the hook cancels (aborts) the previous language's in-flight request instead of letting it continue to completion in the background
