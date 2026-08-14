## MODIFIED Requirements

### Requirement: Placeholder contact targets
Contact link targets SHALL come from a dedicated, client-side contact info source keyed by language, requiring no CV data hook, API call, or other network fetch, so the section renders fully offline and immediately.

#### Scenario: Section renders without network calls
- **WHEN** the Contact section is rendered
- **THEN** all contact entries are sourced from the dedicated client-side contact info source and no request is made to fetch them

#### Scenario: Contact targets update with the selected language
- **WHEN** the visitor switches the site language while the Contact section is visible
- **THEN** any language-specific contact content updates without a page reload, while the underlying addresses (GitHub, LinkedIn, email) remain the same across languages

#### Scenario: Section renders independently of CV data availability
- **WHEN** the CV content API is slow, unreachable, or returns an error
- **THEN** the Contact section's form and contact links still render normally, since neither depends on CV content
