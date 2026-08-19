## ADDED Requirements

### Requirement: Offensive content filtering
The contact form SHALL check the `name`, `email`, and `message` fields against a client-side offensive-content filter, in addition to their existing required/format/length validation. When a field's value matches the filter, submission SHALL be blocked, that field SHALL show a localized "offensive content" error message and an invalid-state border, and no request SHALL be sent to the backend contact endpoint. This filtering happens entirely in the browser and is not enforced server-side.

#### Scenario: Field containing offensive content is blocked
- **WHEN** the visitor submits the form with offensive content in the name, email, or message field
- **THEN** submission is prevented, the affected field shows a localized "offensive content" error message and an invalid-state border, and no request is sent to the backend

#### Scenario: Field without offensive content submits normally
- **WHEN** the visitor submits the form with no offensive content in any field, and all other validation passes
- **THEN** the form proceeds to send the request to the backend as usual

#### Scenario: Error clears as the visitor corrects the field
- **WHEN** a field is showing the offensive-content error and the visitor edits its value to remove the offending content
- **THEN** the error message and invalid-state border for that field are cleared, following the same behavior as other field-level validation errors
