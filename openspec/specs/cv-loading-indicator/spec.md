# cv-loading-indicator Specification

## Purpose

Gives the visitor visual feedback, styled to match the site's terminal aesthetic, for the window between first paint and CV content becoming available, instead of a blank gap between the nav and the footer.

## Requirements

### Requirement: Loading placeholder shown while CV content is unavailable
The system SHALL render a loading placeholder in place of the Hero/Experience/Skills/Projects/Contact section stack whenever the CV content hook's `loading` value is `true`, and SHALL render the real sections once it becomes `false`.

#### Scenario: Placeholder shows during initial load
- **WHEN** the page first mounts and the CV content hook's `loading` is `true`
- **THEN** the loading placeholder is rendered in place of the section stack, and none of the Hero/Experience/Skills/Projects/Contact sections are rendered

#### Scenario: Placeholder is replaced once content is available
- **WHEN** the CV content hook's `loading` transitions to `false`
- **THEN** the loading placeholder is no longer rendered and the section stack renders in its place

#### Scenario: Placeholder reappears on a language switch
- **WHEN** the visitor switches the site language, re-triggering a CV content fetch with `loading` set back to `true`
- **THEN** the loading placeholder is shown again until the newly requested language's content resolves

### Requirement: Nav, footer, and background are unaffected by the loading state
The persistent site shell (navigation bar, footer, and the Matrix rain background) SHALL remain mounted and unaffected while the loading placeholder is shown.

#### Scenario: Nav and footer stay visible during loading
- **WHEN** the loading placeholder is shown
- **THEN** the navigation bar and footer are still rendered and remain interactive

### Requirement: Loading placeholder matches the site's terminal aesthetic
The loading placeholder SHALL use the site's monospace typeface and existing terminal-style visual language (a prompt-style line and a blinking block cursor), rather than a generic spinner, and SHALL use the site's design tokens for color so it renders correctly in both themes.

#### Scenario: Placeholder uses the monospace terminal style
- **WHEN** the loading placeholder is rendered
- **THEN** its text uses the site's monospace font and a blinking cursor consistent with the cursor already used elsewhere on the site (e.g. the Hero section's typed line)

#### Scenario: Placeholder adapts to the active theme
- **WHEN** the visitor toggles between dark and light theme while the loading placeholder is visible
- **THEN** the placeholder's colors update to the corresponding theme's tokens without a page reload

### Requirement: Reduced-motion loading placeholder
When the visitor's system indicates a preference for reduced motion, the loading placeholder SHALL show its text immediately without a typing animation, and SHALL NOT animate the blinking cursor.

#### Scenario: Placeholder skips animation under reduced motion
- **WHEN** the loading placeholder is rendered with `prefers-reduced-motion: reduce` in effect
- **THEN** its text appears fully formed immediately, with no character-by-character typing animation and no blinking cursor animation
