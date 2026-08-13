# experience-section Specification

## Purpose

Defines the Experience section shown inside the `experience` anchor: a scroll-progress timeline of work history entries, each revealing itself and its achievement bullets as the visitor scrolls the page.

## Requirements

### Requirement: Section label
The Experience section SHALL render inside a `<section id="experience">` element, introduced by a `SectionLabel` identifying the section.

#### Scenario: Section renders with label
- **WHEN** the Experience section is rendered
- **THEN** a `<section>` element with id `experience` is present, containing a `SectionLabel` element

### Requirement: Vertical timeline with scroll progress
The Experience section SHALL render a vertical timeline consisting of a static full-height line spanning all job entries, overlaid by a second, accent-colored line whose height is proportional to the visitor's scroll progress through the section (0% when the section's top has not yet reached the point of measurement, 100% once the section has fully scrolled past that point).

#### Scenario: Progress line starts empty before the section is reached
- **WHEN** the Experience section has not yet scrolled into the tracked viewport range
- **THEN** the accent-colored progress line's height is 0%

#### Scenario: Progress line fills as the user scrolls through the section
- **WHEN** the visitor scrolls from the top to the bottom of the Experience section
- **THEN** the accent-colored progress line's height increases proportionally, reaching 100% once the section has fully passed through the tracked viewport range

### Requirement: Job entries
The Experience section SHALL render a list of job entries (placeholder hardcoded data with 3 example jobs), each displaying: a small pulsing accent-colored dot positioned on the timeline, a date range (e.g. "2022 — presente") in small accent-colored text, a role and company name, and a bulleted list of achievements.

#### Scenario: Each job renders its required elements
- **WHEN** a job entry is rendered
- **THEN** it shows a timeline dot with a pulse effect, an accent-colored date range, the role and company, and a bulleted list of achievement items

#### Scenario: Timeline dot pulses continuously
- **WHEN** a job entry's timeline dot is rendered
- **THEN** the dot displays a continuously repeating, subtle pulse animation

### Requirement: Scroll-triggered job reveal
Each job entry SHALL be visually hidden (transparent, offset downward) until it scrolls into the central band of the viewport, at which point it SHALL animate to fully visible with a fade-in and slide-up transition, so entries reveal one at a time as the visitor scrolls rather than all at once.

#### Scenario: Job is hidden before reaching the central band
- **WHEN** a job entry has not yet scrolled into the central band of the viewport
- **THEN** it remains transparent and offset from its final position

#### Scenario: Job reveals on reaching the central band
- **WHEN** a job entry first scrolls into the central band of the viewport
- **THEN** it transitions to fully opaque and its final position via a fade-in and slide-up animation

### Requirement: Cascading bullet reveal
Within a revealed job entry, its achievement bullets SHALL animate in sequentially rather than simultaneously, each starting approximately 0.12 seconds after the previous bullet's animation.

#### Scenario: Bullets cascade in sequence
- **WHEN** a job entry becomes visible and its bullets animate in
- **THEN** each bullet's entrance animation begins approximately 0.12 seconds after the previous bullet's, in list order
