## Purpose

Provides the persistent page shell — top navigation, section anchors, and footer — that every page section is mounted into and navigated between.

## Requirements

### Requirement: Persistent site navigation
The system SHALL render a navigation bar that stays visible at the top of the viewport while the user scrolls the page, with a semi-transparent, blurred background so page content remains partially visible behind it.

#### Scenario: Nav stays visible while scrolling
- **WHEN** the user scrolls down the page
- **THEN** the navigation bar remains fixed/sticky at the top of the viewport

#### Scenario: Nav background is translucent with blur
- **WHEN** page content scrolls underneath the navigation bar
- **THEN** the navigation bar's background is semi-transparent and blurs the content behind it

### Requirement: Brand mark
The navigation bar SHALL display a brand mark styled as `~/[name]` in the site's monospace typeface, where the `~/` prefix is rendered at reduced opacity relative to the name.

#### Scenario: Brand mark renders with dimmed prefix
- **WHEN** the navigation bar is rendered
- **THEN** it shows `~/` followed by the site owner's name, with the `~/` visually dimmer than the name, in the monospace font family

### Requirement: Section anchor navigation
The navigation bar SHALL provide links to each main page section (sobre-mi, experience, stack, projects, contacto), and activating a link SHALL smoothly scroll the viewport to that section without a full page reload.

#### Scenario: Clicking a nav link scrolls to its section
- **WHEN** the user activates the "experience" nav link
- **THEN** the viewport smoothly scrolls until the section with id `experience` is in view, and the URL does not perform a full navigation/reload

### Requirement: Reduced-motion anchor navigation
When the visitor's system indicates a preference for reduced motion, activating a section anchor link in the navigation bar SHALL jump the viewport to that section immediately, with no animated scroll.

#### Scenario: Nav link jumps instead of smooth-scrolling
- **WHEN** the user activates a section anchor link in the navigation bar with `prefers-reduced-motion: reduce` in effect
- **THEN** the viewport jumps immediately to the target section with no animated scroll

### Requirement: Locale and theme controls in nav
The navigation bar SHALL include the language toggle and theme toggle controls, positioned so they remain reachable at every supported viewport width.

#### Scenario: Toggles are present and usable in the nav
- **WHEN** the navigation bar is rendered on desktop or mobile
- **THEN** the language toggle and theme toggle are both visible and operable within the nav

### Requirement: Responsive navigation collapse
On narrow viewports, the navigation SHALL collapse the section links into a hamburger-triggered menu instead of showing them inline.

#### Scenario: Mobile viewport shows hamburger menu
- **WHEN** the viewport width is at or below the site's mobile breakpoint
- **THEN** the section links are hidden by default and a hamburger control is shown; activating it reveals the section links

#### Scenario: Desktop viewport shows inline links
- **WHEN** the viewport width is above the site's mobile breakpoint
- **THEN** the section links are shown inline in the nav and no hamburger control is displayed

### Requirement: Page section scaffold
The application SHALL render five page sections, in order, each with a stable DOM id matching its anchor target: Hero (`sobre-mi`), Experience (`experience`), Skills (`stack`), Projects (`projects`), and Contact (`contacto`).

#### Scenario: All section anchors exist in the DOM
- **WHEN** the page is loaded
- **THEN** elements with ids `sobre-mi`, `experience`, `stack`, `projects`, and `contacto` exist in the document, in that order

### Requirement: Site footer
The system SHALL render a footer below the page sections, centered, showing `</[name]>` in the site's monospace typeface with a subtle top border separating it from the content above.

#### Scenario: Footer renders at the end of the page
- **WHEN** the page is loaded
- **THEN** a footer is rendered after the last section, horizontally centered, displaying `</[name]>` in the monospace font, with a visible top border
