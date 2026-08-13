# skills-section Specification

## Purpose

Displays the site owner's technical stack as categorized groups of skills so visitors can quickly scan languages, frameworks, and tools without reading prose.

## Requirements

### Requirement: Skills section structure
The system SHALL render a `Skills` section identified by `id="stack"`, containing a section label consistent with other CV sections.

#### Scenario: Section renders with label
- **WHEN** the Skills section mounts on the page
- **THEN** it renders inside `<section id="stack">` with a section label

### Requirement: Categorized skill display
The system SHALL group skills into named categories (e.g. Languages, Frameworks, Infra, Data) and display each category's name and its list of skill items.

#### Scenario: Category displays name and items
- **WHEN** a skill category is rendered
- **THEN** its category name is shown in uppercase, small, dimmed text, and each of its skill items is shown as a badge

### Requirement: Responsive category grid
The system SHALL lay out skill categories in a responsive grid that adapts the number of columns to available width, with each category column no narrower than approximately 220px.

#### Scenario: Grid reflows on narrow viewport
- **WHEN** the viewport width is reduced below the width needed for multiple ~220px columns
- **THEN** the grid reduces the number of columns so each category remains at least ~220px wide

### Requirement: Scroll-triggered category reveal
The system SHALL reveal each skill category (fade/transition in) only once it scrolls into the viewport, using the same scroll-reveal behavior as other CV sections.

#### Scenario: Category revealed on scroll into view
- **WHEN** a skill category enters the viewport for the first time
- **THEN** the category transitions from hidden to visible and remains visible on subsequent scrolling away and back

### Requirement: Staggered badge pop-in animation
The system SHALL animate each skill badge within a revealed category from scale 0.7 to scale 1 using a back/bounce-style easing, with each badge's animation delayed incrementally after the previous badge's.

#### Scenario: Badges pop in with stagger
- **WHEN** a skill category becomes visible
- **THEN** its badges animate from scale 0.7 to scale 1 with bounce-style easing, each badge starting its animation after the previous one

### Requirement: Placeholder skill data
The system SHALL source skill categories and items from the CV content data layer, with no external data fetching required for the section to render.

#### Scenario: Section renders without network calls
- **WHEN** the Skills section is rendered
- **THEN** all categories and skill items are sourced from the CV content data layer, and no request is made to fetch them

#### Scenario: Skill data updates with the selected language
- **WHEN** the visitor switches the site language while the Skills section is visible
- **THEN** the category names and skill items update to that language's content without a page reload

### Requirement: Reduced-motion reveal behavior
When the visitor's system indicates a preference for reduced motion, skill categories and their badges SHALL be fully visible immediately, without waiting to scroll into view and without the scale/bounce pop-in animation.

#### Scenario: Categories and badges appear immediately
- **WHEN** the Skills section is rendered with `prefers-reduced-motion: reduce` in effect
- **THEN** every skill category and its badges are fully visible in their final state immediately, with no scroll-triggered reveal delay and no scale pop-in transition
