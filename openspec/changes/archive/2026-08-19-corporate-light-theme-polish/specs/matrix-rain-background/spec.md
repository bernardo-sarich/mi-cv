## ADDED Requirements

### Requirement: Effect is limited to dark theme
The rain layers SHALL be rendered only when the active theme is dark. In light theme no layer SHALL exist in the document regardless of viewport width or reduced-motion preference, and the effect SHALL be added or removed as the theme changes in either direction.

#### Scenario: Light theme omits the effect entirely
- **WHEN** the page is displayed in light theme at a viewport width of 1600px with reduced motion not requested
- **THEN** no rain layer exists in the document and no animation for the effect is running

#### Scenario: Effect appears when switching to dark theme
- **WHEN** the user switches from light to dark theme while the viewport is at least 1280px wide and reduced motion is not requested
- **THEN** the rain layers appear

#### Scenario: Effect is torn down when switching to light theme
- **WHEN** the user switches from dark to light theme while the rain layers are rendered
- **THEN** the rain layers are removed from the document and their animation stops

### Requirement: Rain color is fixed
The falling characters SHALL always be drawn in `#3ddc84` — the same fixed color regardless of any other state, since the effect only ever renders in dark theme.

#### Scenario: Effect always uses the same color
- **WHEN** the layers are rendered
- **THEN** the falling characters are drawn in `#3ddc84`

## MODIFIED Requirements

### Requirement: Restrained ambient visual treatment
The effect SHALL read as background texture rather than a focal element: characters SHALL be drawn at an effective opacity between 0.15 and 0.45, SHALL fall at a slow and even rate, and SHALL NOT produce abrupt flashing, strobing, or high-frequency flicker. Characters SHALL be drawn from a mixed set of letters, digits, and symbols in the site's monospace typeface.

#### Scenario: Effect stays low-contrast against the background
- **WHEN** the layers are rendered
- **THEN** the drawn characters' effective opacity is within the range 0.15–0.45

#### Scenario: Fall motion is steady and non-flashing
- **WHEN** the effect runs continuously
- **THEN** characters descend at a consistent slow rate with no abrupt full-layer brightness changes

#### Scenario: Character set is mixed
- **WHEN** the effect runs
- **THEN** the characters drawn include letters, digits, and symbols rather than a single character class

## REMOVED Requirements

### Requirement: Rain color follows the active theme
**Reason**: The effect no longer renders in light theme (see "Effect is limited to dark theme"), so there is nothing left to switch colors between — the requirement's premise of a per-theme color pair no longer applies.
**Migration**: Replaced by "Rain color is fixed", which specifies the single color the effect always uses.
