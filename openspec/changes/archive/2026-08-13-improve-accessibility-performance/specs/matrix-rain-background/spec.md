## MODIFIED Requirements

### Requirement: Rain color follows the active theme
The falling characters SHALL be drawn in the site's `accent` color for the currently active theme — `#3ddc84` in dark theme and `#19804b` in light theme — and SHALL update to the other theme's accent when the user toggles the theme, without requiring a page reload.

#### Scenario: Dark theme uses the dark accent
- **WHEN** the layers are rendered with the dark theme active
- **THEN** the falling characters are drawn in `#3ddc84`

#### Scenario: Light theme uses the light accent
- **WHEN** the layers are rendered with the light theme active
- **THEN** the falling characters are drawn in `#19804b`

#### Scenario: Toggling the theme recolors the effect
- **WHEN** the user activates the theme toggle while the layers are rendered
- **THEN** subsequently drawn characters use the newly active theme's accent color
