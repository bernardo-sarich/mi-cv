# contact-section Specification

## Purpose

Gives visitors a way to reach the site owner from the end of the page: a short contact form plus a set of direct contact links (code hosting, professional network, email), filling the `contacto` anchor the navigation already points at.

## Requirements

### Requirement: Section structure
The system SHALL render a Contact section identified by `id="contacto"`, containing a `SectionLabel` showing the section's own tag and a visible heading, followed by the section body.

#### Scenario: Section renders with label and heading
- **WHEN** the Contact section mounts on the page
- **THEN** it renders inside `<section id="contacto">` with a `SectionLabel` reading `<section id="contacto">` and a heading with the localized Contact title

### Requirement: Two-column responsive layout
The section body SHALL present the contact form and the contact links side by side on wide viewports, and stacked in a single column on narrow viewports, with the form first in reading order in both cases.

#### Scenario: Wide viewport shows two columns
- **WHEN** the viewport is at or above the site's medium breakpoint
- **THEN** the contact form and the contact-links list are laid out side by side

#### Scenario: Narrow viewport stacks the columns
- **WHEN** the viewport is below the site's medium breakpoint
- **THEN** the contact form and the contact-links list are stacked vertically, form first, each spanning the available width

### Requirement: Contact form fields and styled validation
The form SHALL provide exactly three inputs — name (single-line text), email (email-typed input), and message (multi-line text) — plus a submit control, and SHALL disable the browser's native validation UI in favor of an in-page validation styled to match the site. Every field SHALL have a programmatically associated label. A field left blank, or an email field containing a value that is not a valid email address, SHALL be flagged as invalid on blur or on submit attempt, showing a localized error message and an accent-matching invalid border below/around the field; submission SHALL be blocked while any field is invalid, and no confirmation message SHALL appear.

#### Scenario: All three fields are present and labelled
- **WHEN** the contact form is rendered
- **THEN** it shows a name field, an email field, a message textarea, each with an associated visible label, and a submit button, and no browser-native validation popups are used

#### Scenario: Empty submission is blocked with an in-page error
- **WHEN** the visitor activates the submit control with one or more fields left blank
- **THEN** submission is prevented, each blank field shows a localized "required" error message and an invalid-state border, and no confirmation message appears

#### Scenario: Malformed email is blocked with an in-page error
- **WHEN** the visitor fills every field but enters a value that is not a valid email address in the email field, and submits
- **THEN** submission is prevented and the email field shows a localized invalid-email error message and an invalid-state border

#### Scenario: Error clears as the visitor corrects the field
- **WHEN** a field is showing a validation error and the visitor edits its value
- **THEN** the error message and invalid-state border for that field are cleared immediately, without waiting for a re-submit

### Requirement: Demo submit feedback
On a valid submission the system SHALL NOT navigate away, reload the page, or contact any server. It SHALL instead clear the form fields and display a temporary confirmation message that automatically disappears approximately 4 seconds later.

#### Scenario: Valid submission shows a temporary confirmation
- **WHEN** the visitor submits the form with all fields filled and a valid email address
- **THEN** the page does not reload or navigate, the fields are cleared, and a confirmation message identifying itself as a demo (for example `// mensaje enviado (demo)`) becomes visible

#### Scenario: Confirmation disappears on its own
- **WHEN** roughly 4 seconds have passed since the confirmation message appeared, with no further interaction
- **THEN** the confirmation message is no longer displayed

#### Scenario: Resubmitting restarts the confirmation
- **WHEN** the visitor submits a second valid message while a confirmation from a previous submission is still visible
- **THEN** the confirmation remains visible and its disappearance is deferred to roughly 4 seconds after the newer submission

#### Scenario: No network request is made
- **WHEN** the visitor submits the form
- **THEN** no request is sent to any backend endpoint

### Requirement: Reduced-motion confirmation feedback
When the visitor's system indicates a preference for reduced motion, the post-submission confirmation message SHALL appear and disappear immediately, with no fade transition, while still following the same visibility timing as the normal behavior.

#### Scenario: Confirmation appears without a fade transition
- **WHEN** the visitor submits a valid entry with `prefers-reduced-motion: reduce` in effect
- **THEN** the confirmation message becomes fully visible immediately, with no opacity or position transition

### Requirement: Contact links list
The section SHALL display a list of direct contact entries — code hosting profile, professional network profile, and email address — each rendered as its own bordered block containing an icon and the entry's label and target. External profile links SHALL open in a new browser tab; the email entry SHALL open the visitor's mail client.

#### Scenario: Each contact entry renders as an icon block
- **WHEN** the contact links list is rendered
- **THEN** it shows one bordered block per entry, each containing an icon and the entry's name and address

#### Scenario: Profile links open in a new tab
- **WHEN** the visitor activates the code hosting or professional network entry
- **THEN** the linked profile opens in a new browser tab without navigating away from the current page

#### Scenario: Email entry opens a mail client
- **WHEN** the visitor activates the email entry
- **THEN** the browser hands the address to the visitor's mail client rather than loading a page

### Requirement: Contact link hover emphasis
On pointer hover, a contact link block SHALL emphasize itself by highlighting its border in the accent color and adding a subtle accent-colored glow, transitioning smoothly rather than changing abruptly, and reverting when the pointer leaves.

#### Scenario: Block emphasizes on hover
- **WHEN** the visitor hovers a contact link block with a pointer
- **THEN** the block's border takes the accent color and a subtle accent-colored glow appears, animated smoothly

#### Scenario: Emphasis reverts on pointer leave
- **WHEN** the pointer leaves a previously hovered contact link block
- **THEN** the border and glow return smoothly to their resting appearance

### Requirement: Placeholder contact targets
Contact link targets SHALL come from the CV content data layer, requiring no external data fetching, so the section renders fully offline.

#### Scenario: Section renders without network calls
- **WHEN** the Contact section is rendered
- **THEN** all contact entries are sourced from the CV content data layer and no request is made to fetch them

#### Scenario: Contact targets update with the selected language
- **WHEN** the visitor switches the site language while the Contact section is visible
- **THEN** any language-specific contact content updates without a page reload, while the underlying addresses (GitHub, LinkedIn, email) remain the same across languages

### Requirement: Localized section strings
The section's user-facing text — heading, field labels, submit control, and confirmation message — SHALL be served from the site's translation resources in both supported languages, and SHALL update when the visitor switches language without a page reload.

#### Scenario: Switching language updates the section text
- **WHEN** the visitor toggles the site language while the Contact section is visible
- **THEN** the heading, field labels and submit control text change to the newly selected language
