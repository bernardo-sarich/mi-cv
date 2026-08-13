## MODIFIED Requirements

### Requirement: Placeholder project data
The system SHALL source project entries from the CV content data layer, with no external data fetching required for the section to render.

#### Scenario: Section renders without network calls
- **WHEN** the Projects section is rendered
- **THEN** all project cards are sourced from the CV content data layer, and no request is made to fetch them

#### Scenario: Project data updates with the selected language
- **WHEN** the visitor switches the site language while the Projects section is visible
- **THEN** each project card's description updates to that language's content without a page reload
