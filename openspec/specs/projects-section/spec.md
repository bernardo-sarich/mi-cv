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
The system SHALL render project cards inside a horizontally scrollable container that snaps each card into alignment as the visitor scrolls, and that scrolls smoothly rather than jumping.

#### Scenario: Cards snap into alignment while scrolling
- **WHEN** the visitor scrolls the carousel container horizontally, by drag or via the navigation buttons
- **THEN** scrolling comes to rest with a project card aligned to the start of the visible area rather than stopping mid-card

### Requirement: Carousel navigation buttons
The previous/next buttons SHALL move the carousel's visible content by approximately one card width per click, animated smoothly rather than jumping instantly.

#### Scenario: Next button scrolls the carousel forward
- **WHEN** the visitor clicks the "next" navigation button
- **THEN** the carousel's scroll position moves forward by approximately one card width, animated smoothly

#### Scenario: Previous button scrolls the carousel backward
- **WHEN** the visitor clicks the "previous" navigation button
- **THEN** the carousel's scroll position moves backward by approximately one card width, animated smoothly

### Requirement: Project card content
Each project card SHALL display: the project's name in a visually distinct accent-colored style, a short description, one or more small badges naming technologies used, and a link to the project's repository that opens in a new browser tab.

#### Scenario: Card displays all required project fields
- **WHEN** a project card is rendered
- **THEN** it shows the project name, a short description, stack tags as badges, and a repository link

#### Scenario: Repository link opens in a new tab
- **WHEN** the visitor activates a project card's repository link
- **THEN** the linked repository page opens in a new browser tab, without navigating away from the current page

### Requirement: Card hover emphasis
On pointer hover, a project card SHALL visually emphasize itself with a slight scale increase, an accent-colored glow, and a highlighted border, transitioning smoothly rather than changing abruptly.

#### Scenario: Card emphasizes on hover
- **WHEN** the visitor hovers a project card with a pointer
- **THEN** the card smoothly scales up slightly and shows an accent-colored glow and highlighted border, reverting smoothly when the pointer leaves

### Requirement: Placeholder project data
The system SHALL source project entries (4 example projects) from local placeholder data, with no external data fetching required for the section to render.

#### Scenario: Section renders without network calls
- **WHEN** the Projects section is rendered
- **THEN** all project cards are sourced from local hardcoded data
