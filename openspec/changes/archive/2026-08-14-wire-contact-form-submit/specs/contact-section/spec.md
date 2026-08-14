## MODIFIED Requirements

### Requirement: Submit feedback
On a valid submission the system SHALL send the form data to the backend contact endpoint and SHALL NOT navigate away or reload the page. While the request is in flight, the submit control SHALL be disabled and SHALL indicate a sending state. On a successful response the system SHALL clear the form fields and display a temporary confirmation message that automatically disappears approximately 4 seconds later.

#### Scenario: Valid submission sends the data and shows a temporary confirmation
- **WHEN** the visitor submits the form with all fields filled and a valid email address
- **THEN** the system sends the form data to the backend, the page does not reload or navigate, and once the backend confirms success the fields are cleared and a confirmation message becomes visible

#### Scenario: Submit control is disabled while sending
- **WHEN** a submission request is in flight
- **THEN** the submit control is disabled and shows a sending state, preventing duplicate submissions

#### Scenario: Confirmation disappears on its own
- **WHEN** roughly 4 seconds have passed since the confirmation message appeared, with no further interaction
- **THEN** the confirmation message is no longer displayed

#### Scenario: Resubmitting restarts the confirmation
- **WHEN** the visitor submits a second valid message while a confirmation from a previous submission is still visible
- **THEN** the confirmation remains visible and its disappearance is deferred to roughly 4 seconds after the newer submission

### Requirement: Reduced-motion confirmation feedback
When the visitor's system indicates a preference for reduced motion, the post-submission confirmation message SHALL appear and disappear immediately, with no fade transition, while still following the same visibility timing as the normal behavior.

#### Scenario: Confirmation appears without a fade transition
- **WHEN** the visitor's submission succeeds with `prefers-reduced-motion: reduce` in effect
- **THEN** the confirmation message becomes fully visible immediately, with no opacity or position transition

## ADDED Requirements

### Requirement: Server-side validation error mapping
If the backend rejects a submission as invalid, the system SHALL map the returned per-field errors onto the corresponding form field (name, email, message) and display a localized error message and invalid-state border for each affected field, using the same visual treatment as client-side validation errors. The form SHALL NOT be cleared and no confirmation message SHALL appear.

#### Scenario: Backend reports a field as invalid
- **WHEN** the backend responds to a submission with a validation error for one or more fields
- **THEN** each affected field shows a localized error message and an invalid-state border, the form fields keep their entered values, and no confirmation message appears

### Requirement: Rate-limit and general submission error feedback
If the backend reports that the visitor has submitted too many messages recently, or the request fails for any other reason (network failure, unexpected response, server error), the system SHALL display a localized, non-field error message near the submit control. The form SHALL NOT be cleared and no confirmation message SHALL appear. This error SHALL be cleared when the visitor attempts to submit again.

#### Scenario: Backend reports rate limiting
- **WHEN** the backend responds indicating the visitor has submitted too many messages recently
- **THEN** a localized "too many attempts" message appears near the submit control, the form fields keep their entered values, and no confirmation message appears

#### Scenario: Request fails unexpectedly
- **WHEN** the submission request fails due to a network error, a server error, or any other unexpected response
- **THEN** a localized generic error message appears near the submit control, the form fields keep their entered values, and no confirmation message appears

#### Scenario: General error clears on the next attempt
- **WHEN** a general submission error is being displayed and the visitor submits the form again
- **THEN** the previous general error is cleared before the new submission attempt's outcome is shown
