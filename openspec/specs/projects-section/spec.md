# projects-section Specification

## Purpose

Displays example projects as a horizontally scrollable carousel of cards so visitors can browse the site owner's work (name, description, stack, repo link) without scrolling the whole page vertically.

## Requirements

### Requirement: Section structure
The system SHALL render a `Projects` section identified by `id="projects"`, containing a `SectionLabel` and two navigation buttons (previous/next) for controlling the carousel's scroll position.

#### Scenario: Section renders with label and controls
- **WHEN** the Projects section mounts on the page
- **THEN** it renders inside `<section id="projects">` with a `SectionLabel` and two buttons for scrolling the carousel backward and forward

### Requirement: Horizontal scrollable carousel
The system SHALL render project cards inside a horizontally scrollable container that snaps each card into alignment as the visitor scrolls, and that scrolls smoothly rather than jumping. Below the `sm` breakpoint exactly one card SHALL be visible at once; at `sm` and above, at most three cards SHALL be visible at once. In both cases, no partial card SHALL peek at either edge of the visible area.

#### Scenario: Cards snap into alignment while scrolling
- **WHEN** the visitor scrolls the carousel container horizontally, by drag or via the navigation buttons
- **THEN** scrolling comes to rest with a project card aligned to the start of the visible area rather than stopping mid-card

#### Scenario: No partial card is visible at rest on mobile
- **WHEN** the viewport is below the `sm` breakpoint and the carousel is at rest, whether at its initial position, after a navigation click, or after a manual drag
- **THEN** exactly one project card is fully visible, filling the available width, and no sliver of a second card is visible at either edge

#### Scenario: No partial card is visible at rest on larger screens
- **WHEN** the viewport is at the `sm` breakpoint or above and the carousel is at rest, whether at its initial position, after a navigation click, or after a manual drag
- **THEN** exactly three project cards are fully visible, and no sliver of a fourth card is visible at either edge

### Requirement: Carousel navigation buttons
The previous/next buttons SHALL move the carousel's visible content by exactly one card per click, animated smoothly rather than jumping instantly, and SHALL land on the exact same scroll position regardless of how the visitor arrived at the current one. Clicking "previous" at the first page or "next" at the last page SHALL have no effect.

#### Scenario: Next button scrolls the carousel forward
- **WHEN** the visitor clicks the "next" navigation button
- **THEN** the carousel's scroll position moves forward by exactly one card, animated smoothly, with the same three cards' worth of content fully visible at rest

#### Scenario: Previous button scrolls the carousel backward
- **WHEN** the visitor clicks the "previous" navigation button
- **THEN** the carousel's scroll position moves backward by exactly one card, animated smoothly, with the same three cards' worth of content fully visible at rest

#### Scenario: Returning to the first page always lands on the exact same position
- **WHEN** the visitor navigates forward one or more pages and then clicks "previous" back to the first page
- **THEN** the carousel rests at the exact same scroll position as it had on initial load, not an intermediate position between the first and second card

### Requirement: Project card content
Each project card SHALL display: the project's name in a visually distinct accent-colored style, a short description, one or more small badges naming technologies used, and a link to the project's repository that opens in a new browser tab.

#### Scenario: Card displays all required project fields
- **WHEN** a project card is rendered
- **THEN** it shows the project name, a short description, stack tags as badges, and a repository link

#### Scenario: Repository link opens in a new tab
- **WHEN** the visitor activates a project card's repository link
- **THEN** the linked repository page opens in a new browser tab, without navigating away from the current page

### Requirement: Card hover emphasis
On pointer hover, a project card SHALL visually emphasize itself with a slight scale increase, an accent-colored glow, and a highlighted border, transitioning smoothly rather than changing abruptly. This emphasis SHALL render in full even for the leftmost or rightmost visible card, without being clipped by the carousel's scrollable container.

#### Scenario: Card emphasizes on hover
- **WHEN** the visitor hovers a project card with a pointer
- **THEN** the card smoothly scales up slightly and shows an accent-colored glow and highlighted border, reverting smoothly when the pointer leaves

#### Scenario: Edge card's hover emphasis is not clipped
- **WHEN** the visitor hovers the leftmost or rightmost card currently visible in the carousel
- **THEN** its glow and scale render in full, without a hard-edged cutoff from the carousel's scroll container

### Requirement: Placeholder project data
The system SHALL source project entries from the CV content data layer, with no external data fetching required for the section to render.

#### Scenario: Section renders without network calls
- **WHEN** the Projects section is rendered
- **THEN** all project cards are sourced from the CV content data layer, and no request is made to fetch them

#### Scenario: Project data updates with the selected language
- **WHEN** the visitor switches the site language while the Projects section is visible
- **THEN** each project card's description updates to that language's content without a page reload
