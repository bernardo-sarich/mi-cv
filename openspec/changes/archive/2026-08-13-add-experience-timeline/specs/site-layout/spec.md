## MODIFIED Requirements

### Requirement: Section anchor navigation
The navigation bar SHALL provide links to each main page section (sobre-mi, experience, proyectos, contacto), and activating a link SHALL smoothly scroll the viewport to that section without a full page reload.

#### Scenario: Clicking a nav link scrolls to its section
- **WHEN** the user activates the "experience" nav link
- **THEN** the viewport smoothly scrolls until the section with id `experience` is in view, and the URL does not perform a full navigation/reload

### Requirement: Page section scaffold
The application SHALL render five page sections, in order, each with a stable DOM id matching its anchor target: Hero (`sobre-mi`), Experience (`experience`), Skills (`skills`), Projects (`proyectos`), and Contact (`contacto`).

#### Scenario: All section anchors exist in the DOM
- **WHEN** the page is loaded
- **THEN** elements with ids `sobre-mi`, `experience`, `skills`, `proyectos`, and `contacto` exist in the document, in that order
