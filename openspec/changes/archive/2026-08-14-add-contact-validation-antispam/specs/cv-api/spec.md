## MODIFIED Requirements

### Requirement: POST /api/contact accepts a validated contact submission
The system SHALL expose `POST /api/contact` accepting a JSON body with `name`, `email`, and `message`. All three fields SHALL be required and non-blank. `name` SHALL NOT exceed 200 characters. `email` SHALL be a syntactically valid email address and SHALL NOT exceed 320 characters. `message` SHALL be at least 10 characters and SHALL NOT exceed 5000 characters. On success, the system SHALL persist the submission and respond `201 Created`. When any required field is missing or blank, `email` is malformed or too long, `name` is too long, or `message` is too short or too long, the system SHALL respond `400 Bad Request` and SHALL NOT persist anything.

#### Scenario: Valid submission is accepted and persisted
- **WHEN** a client submits `POST /api/contact` with a non-blank `name` under 200 characters, a `message` between 10 and 5000 characters, and a syntactically valid `email` under 320 characters
- **THEN** the response is `201 Created` and the submission is durably stored

#### Scenario: Missing or blank field is rejected
- **WHEN** a client submits `POST /api/contact` with `name`, `email`, or `message` missing or blank
- **THEN** the response is `400 Bad Request` and no submission is stored

#### Scenario: Malformed email is rejected
- **WHEN** a client submits `POST /api/contact` with an `email` value that is not a syntactically valid email address
- **THEN** the response is `400 Bad Request` and no submission is stored

#### Scenario: Oversized field is rejected
- **WHEN** a client submits `POST /api/contact` with `name` over 200 characters, `email` over 320 characters, or `message` over 5000 characters
- **THEN** the response is `400 Bad Request` and no submission is stored

#### Scenario: Message below the minimum length is rejected
- **WHEN** a client submits `POST /api/contact` with a `message` shorter than 10 characters
- **THEN** the response is `400 Bad Request` and no submission is stored

## ADDED Requirements

### Requirement: POST /api/contact silently discards honeypot submissions
The request body accepted by `POST /api/contact` SHALL include an optional honeypot field not rendered by the legitimate contact form. When that field is present and non-blank, the system SHALL respond `201 Created` without persisting the submission or otherwise treating it as an error, so automated submitters cannot distinguish a discarded submission from a real one.

#### Scenario: Honeypot field filled in
- **WHEN** a client submits `POST /api/contact` with the honeypot field set to a non-blank value, regardless of the other fields
- **THEN** the response is `201 Created` and no submission is stored

#### Scenario: Honeypot field left blank
- **WHEN** a client submits `POST /api/contact` with the honeypot field blank or omitted, and the other fields are valid
- **THEN** the submission is validated and processed normally

### Requirement: POST /api/contact rate-limits submissions per IP address
The system SHALL track `POST /api/contact` submission attempts per client IP address within a sliding time window. When a client IP exceeds a configured maximum number of attempts within that window, the system SHALL respond `429 Too Many Requests` and SHALL NOT persist the submission, regardless of whether the fields are otherwise valid. The rate limit SHALL be enforced consistently across concurrently running instances of the API.

#### Scenario: Submissions within the limit succeed
- **WHEN** a client IP submits `POST /api/contact` with valid fields fewer times than the configured maximum within the current time window
- **THEN** each submission is validated and processed normally

#### Scenario: Submissions exceeding the limit are rejected
- **WHEN** a client IP has already reached the configured maximum number of submissions within the current time window and submits `POST /api/contact` again
- **THEN** the response is `429 Too Many Requests` and no submission is stored
