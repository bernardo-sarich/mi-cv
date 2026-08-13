## MODIFIED Requirements

### Requirement: Name, online status, and role
The Hero section SHALL display the site owner's name (sourced from the CV content data) as a top-level heading in the site's monospace font, an "online" status indicator consisting of an accent-colored dot with an expanding pulse/ring effect plus the label "online", and a role badge (sourced from the CV content data) using the `accentDim` background and `accent` text tokens.

#### Scenario: Name renders as a prominent mono heading
- **WHEN** the Hero section is rendered
- **THEN** the owner's name from the CV content data is shown as a level-1 heading in the `mono` font family, at a large, bold weight

#### Scenario: Online indicator pulses continuously
- **WHEN** the Hero section is rendered
- **THEN** an accent-colored dot is shown next to the name with a continuously repeating expanding-ring animation, accompanied by the text "online"

#### Scenario: Role badge uses accent tokens
- **WHEN** the Hero section is rendered
- **THEN** a badge showing the owner's role from the CV content data is displayed with the `accentDim` token as background and `accent` token as text color

### Requirement: Bio paragraph
The Hero section SHALL display the bio paragraph from the CV content data beneath the name/status/role header.

#### Scenario: Bio text is visible
- **WHEN** the Hero section is rendered
- **THEN** a paragraph of introductory bio text from the CV content data is shown below the name/status/role header

#### Scenario: Bio text updates with the selected language
- **WHEN** the visitor switches the site language while the Hero section is visible
- **THEN** the bio paragraph updates to that language's bio text without a page reload

### Requirement: Animated stats row
The Hero section SHALL display a row of one or more stats from the CV content data, each with a numeric value that animates upward from 0 to its final value once the Hero section becomes visible in the viewport, and does not animate before that point.

#### Scenario: Stat count-up triggers on entering the viewport
- **WHEN** the Hero section's stats row scrolls into the viewport for the first time
- **THEN** each stat's displayed number animates from 0 up to its final value from the CV content data

#### Scenario: Stat count-up does not run before the section is visible
- **WHEN** the Hero section's stats row has not yet entered the viewport
- **THEN** the stat numbers remain at their initial (0) state and do not begin animating
