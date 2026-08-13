## MODIFIED Requirements

### Requirement: Placeholder contact targets
Contact link targets SHALL come from the CV content data layer, requiring no external data fetching, so the section renders fully offline.

#### Scenario: Section renders without network calls
- **WHEN** the Contact section is rendered
- **THEN** all contact entries are sourced from the CV content data layer and no request is made to fetch them

#### Scenario: Contact targets update with the selected language
- **WHEN** the visitor switches the site language while the Contact section is visible
- **THEN** any language-specific contact content updates without a page reload, while the underlying addresses (GitHub, LinkedIn, email) remain the same across languages
