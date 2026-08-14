## MODIFIED Requirements

### Requirement: POST /api/contact accepts a validated contact submission
The system SHALL expose `POST /api/contact` accepting a JSON body with `name`, `email`, and `message`. All three fields SHALL be required and non-blank. `name` SHALL NOT exceed 200 characters. `email` SHALL be a syntactically valid email address and SHALL NOT exceed 320 characters. `message` SHALL be at least 10 characters and SHALL NOT exceed 5000 characters. On success, the system SHALL persist the submission and respond `201 Created`. When any required field is missing or blank, `email` is malformed or too long, `name` is too long, or `message` is too short or too long, the system SHALL respond `400 Bad Request` and SHALL NOT persist anything.

On a successful submission, after persisting it, the system SHALL attempt to send an email notification containing the submitted name, email, and message to the site owner's configured address. This notification attempt SHALL NOT affect the `201 Created` response: if the notification fails for any reason (delivery error, timeout, misconfiguration), the failure SHALL be logged server-side and SHALL NOT be surfaced to the client, SHALL NOT change the response status, and SHALL NOT cause the persisted submission or the recorded rate-limit attempt to be rolled back or discarded.

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

#### Scenario: Valid submission triggers an owner notification email
- **WHEN** a client submits `POST /api/contact` with valid fields and the submission is persisted successfully
- **THEN** the system attempts to send an email to the site owner's configured address containing the submitted name, email, and message

#### Scenario: Notification failure does not affect the client response or the stored data
- **WHEN** a valid submission is persisted successfully but the subsequent email notification attempt fails
- **THEN** the response is still `201 Created`, the persisted submission and recorded attempt are unaffected, and the failure is logged server-side
