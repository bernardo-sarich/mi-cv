## MODIFIED Requirements

### Requirement: Placeholder skill data
The system SHALL source skill categories and items from the CV content data layer, with no external data fetching required for the section to render.

#### Scenario: Section renders without network calls
- **WHEN** the Skills section is rendered
- **THEN** all categories and skill items are sourced from the CV content data layer, and no request is made to fetch them

#### Scenario: Skill data updates with the selected language
- **WHEN** the visitor switches the site language while the Skills section is visible
- **THEN** the category names and skill items update to that language's content without a page reload
