## MODIFIED Requirements

### Requirement: Job entries
The Experience section SHALL render the list of job entries from the CV content data, each displaying: a small pulsing accent-colored dot positioned on the timeline, a date range (e.g. "2022 — presente") in small accent-colored text, a role and company name, and a bulleted list of achievements.

#### Scenario: Each job renders its required elements
- **WHEN** a job entry is rendered
- **THEN** it shows a timeline dot with a pulse effect, an accent-colored date range, the role and company, and a bulleted list of achievement items, all sourced from the CV content data

#### Scenario: Timeline dot pulses continuously
- **WHEN** a job entry's timeline dot is rendered
- **THEN** the dot displays a continuously repeating, subtle pulse animation

#### Scenario: Job list updates with the selected language
- **WHEN** the visitor switches the site language while the Experience section is visible
- **THEN** the job entries' role, company, dates, and bullets update to that language's content without a page reload
