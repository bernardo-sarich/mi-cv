## MODIFIED Requirements

### Requirement: Rain color follows the active theme
The falling characters SHALL be drawn in a fixed per-theme color: `#3ddc84` in dark theme and `#E2E8F0` in light theme, and SHALL update to the other theme's color when the user toggles the theme, without requiring a page reload. The light-theme value is a decorative tone chosen for this effect specifically — it is independent of the site's `accent` design-system token (which is calibrated for text/button contrast, not ambient background texture) and MAY diverge from it.

#### Scenario: Dark theme uses the dark accent
- **WHEN** the layers are rendered with the dark theme active
- **THEN** the falling characters are drawn in `#3ddc84`

#### Scenario: Light theme uses the light accent
- **WHEN** the layers are rendered with the light theme active
- **THEN** the falling characters are drawn in `#E2E8F0`

#### Scenario: Toggling the theme recolors the effect
- **WHEN** the user activates the theme toggle while the layers are rendered
- **THEN** subsequently drawn characters use the newly active theme's color
