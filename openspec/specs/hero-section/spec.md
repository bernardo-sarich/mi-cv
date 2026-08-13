# hero-section Specification

## Purpose

Defines the Hero section shown inside the `sobre-mi` anchor at the top of the page: the terminal-style identity block, name/status/role header, bio, primary CTAs, and animated stats that introduce the site owner.

## Requirements

### Requirement: Terminal identity block
The Hero section SHALL render a terminal-style block containing a static line `$ who-am-i` in the `textDim` token, followed on the next line by a typed-out rendering of the string `who-am-i` that reveals one additional character at a time, and a block cursor (`▍`) that blinks (toggles visibility) indefinitely once rendered.

#### Scenario: Terminal prompt line renders statically
- **WHEN** the Hero section is rendered
- **THEN** a line reading `$ who-am-i` is shown in the `textDim` color token, present immediately without animation

#### Scenario: Typed line reveals character by character
- **WHEN** the Hero section mounts
- **THEN** the second terminal line starts empty and progressively displays `who-am-i`, adding one character at a time until the full string is shown

#### Scenario: Cursor blinks indefinitely after mount
- **WHEN** the Hero section has been mounted for any length of time
- **THEN** the block cursor `▍` continues to toggle between visible and hidden on a fixed interval, with no defined end state

### Requirement: Name, online status, and role
The Hero section SHALL display the site owner's name as a top-level heading in the site's monospace font, an "online" status indicator consisting of an accent-colored dot with an expanding pulse/ring effect plus the label "online", and a role badge using the `accentDim` background and `accent` text tokens.

#### Scenario: Name renders as a prominent mono heading
- **WHEN** the Hero section is rendered
- **THEN** the owner's name is shown as a level-1 heading in the `mono` font family, at a large, bold weight

#### Scenario: Online indicator pulses continuously
- **WHEN** the Hero section is rendered
- **THEN** an accent-colored dot is shown next to the name with a continuously repeating expanding-ring animation, accompanied by the text "online"

#### Scenario: Role badge uses accent tokens
- **WHEN** the Hero section is rendered
- **THEN** a badge showing the owner's role (e.g. "Backend Developer") is displayed with the `accentDim` token as background and `accent` token as text color

### Requirement: Bio paragraph
The Hero section SHALL display a short bio paragraph beneath the name/status/role header, using placeholder text until real CV data is wired in.

#### Scenario: Bio text is visible
- **WHEN** the Hero section is rendered
- **THEN** a paragraph of introductory bio text is shown below the name/status/role header

### Requirement: Primary call-to-action buttons
The Hero section SHALL render two call-to-action buttons: a primary-styled "Descargar CV" button with no attached download behavior, and a secondary-styled "Ver proyectos →" button that smoothly scrolls the viewport to the `projects` section when activated.

#### Scenario: Download CV button is present but inert
- **WHEN** the Hero section is rendered
- **THEN** a primary-styled button labeled "Descargar CV" is shown, and activating it does not trigger a file download or navigation

#### Scenario: View projects button scrolls to projects section
- **WHEN** the user activates the "Ver proyectos →" button
- **THEN** the viewport smoothly scrolls until the section with id `projects` is in view, without a full page reload

### Requirement: Animated stats row
The Hero section SHALL display a row of one or more stats (e.g. "7+ años de experiencia"), each with a numeric value that animates upward from 0 to its final value once the Hero section becomes visible in the viewport, and does not animate before that point.

#### Scenario: Stat count-up triggers on entering the viewport
- **WHEN** the Hero section's stats row scrolls into the viewport for the first time
- **THEN** each stat's displayed number animates from 0 up to its configured final value

#### Scenario: Stat count-up does not run before the section is visible
- **WHEN** the Hero section's stats row has not yet entered the viewport
- **THEN** the stat numbers remain at their initial (0) state and do not begin animating

### Requirement: Staggered entrance animation
The Hero section's major blocks (terminal, name/status/role, bio, and the stats/call-to-action group) SHALL each animate in with a fade-in and slide-up effect on mount, cascading rather than all appearing at once. The Hero is laid out as two columns, so each column runs its own staggered sequence and the two sequences play in parallel.

#### Scenario: Blocks fade and slide in on mount
- **WHEN** the Hero section first mounts
- **THEN** the terminal, name/status/role, bio, and stats/call-to-action blocks each transition from transparent/offset to fully visible/in-place

#### Scenario: Blocks animate in a staggered sequence within each column
- **WHEN** the Hero section's entrance animation plays
- **THEN** within a column, each block's animation begins after a short, consistent delay relative to the block above it, rather than that column's blocks animating simultaneously
