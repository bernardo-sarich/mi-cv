## Purpose

Defines the HTTP surface the `Api` project exposes over the existing Application use cases: reading the bilingual CV and submitting a contact message, with consistent error responses and origin restriction.

## ADDED Requirements

### Requirement: GET /api/cv returns the CV for a language
The system SHALL expose `GET /api/cv` accepting an optional `lang` query parameter with values `es` or `en`. When `lang` is omitted or is not one of the two supported values, the system SHALL default to `es` rather than rejecting the request. On success, the system SHALL respond `200 OK` with the CV content (profile, experience, projects, skills) for the resolved language as JSON.

#### Scenario: Explicit supported language
- **WHEN** a client requests `GET /api/cv?lang=en`
- **THEN** the response is `200 OK` with the English CV content as JSON

#### Scenario: Missing language defaults to Spanish
- **WHEN** a client requests `GET /api/cv` with no `lang` parameter
- **THEN** the response is `200 OK` with the Spanish CV content

#### Scenario: Unrecognized language defaults to Spanish
- **WHEN** a client requests `GET /api/cv?lang=fr`
- **THEN** the response is `200 OK` with the Spanish CV content, not an error

### Requirement: POST /api/contact accepts a validated contact submission
The system SHALL expose `POST /api/contact` accepting a JSON body with `name`, `email`, and `message`. All three fields SHALL be required and non-blank, and `email` SHALL be a syntactically valid email address. On success, the system SHALL persist the submission and respond `201 Created`. When any field is missing, blank, or `email` is malformed, the system SHALL respond `400 Bad Request` and SHALL NOT persist anything.

#### Scenario: Valid submission is accepted and persisted
- **WHEN** a client submits `POST /api/contact` with a non-blank `name`, a non-blank `message`, and a syntactically valid `email`
- **THEN** the response is `201 Created` and the submission is durably stored

#### Scenario: Missing or blank field is rejected
- **WHEN** a client submits `POST /api/contact` with `name`, `email`, or `message` missing or blank
- **THEN** the response is `400 Bad Request` and no submission is stored

#### Scenario: Malformed email is rejected
- **WHEN** a client submits `POST /api/contact` with a `email` value that is not a syntactically valid email address
- **THEN** the response is `400 Bad Request` and no submission is stored

### Requirement: Errors are returned as RFC 7807 Problem Details
Every error response from the `Api` project SHALL use the `application/problem+json` content type and the `ProblemDetails` shape (`type`, `title`, `status`, `detail`). Validation failures SHALL respond `400` with a `detail` describing which field(s) failed. Unexpected failures SHALL respond `500` with a generic `detail` that does not include exception messages, stack traces, or other internal implementation details; the full internal error SHALL be logged server-side.

#### Scenario: Validation error shape
- **WHEN** any endpoint rejects a request for failing validation
- **THEN** the response has status `400`, content type `application/problem+json`, and a body identifying the invalid field(s)

#### Scenario: Unexpected error shape
- **WHEN** an endpoint encounters an unexpected failure (e.g. the database is unreachable)
- **THEN** the response has status `500`, content type `application/problem+json`, a generic `detail` with no internal exception details, and the full error is logged server-side

### Requirement: CORS is restricted to configured origins
The system SHALL only allow cross-origin requests to `/api/*` from an explicitly configured allow-list of origins. The system SHALL NOT allow requests from arbitrary origins (`*`).

#### Scenario: Configured origin is allowed
- **WHEN** a browser sends a cross-origin request to `/api/cv` or `/api/contact` from an origin present in the configured allow-list
- **THEN** the response includes CORS headers permitting that origin

#### Scenario: Unlisted origin is not granted access
- **WHEN** a browser sends a cross-origin request to `/api/cv` or `/api/contact` from an origin not present in the configured allow-list
- **THEN** the response does not include CORS headers granting that origin access
