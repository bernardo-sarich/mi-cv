## ADDED Requirements

### Requirement: Theme toggle accessible name
The theme toggle control SHALL expose a descriptive `aria-label` naming the action it performs (switching to the other theme), rather than relying solely on its visible text, and that label SHALL update to reflect the target theme whenever the current theme changes.

#### Scenario: Label names the target theme when dark is active
- **WHEN** the current theme is `'dark'`
- **THEN** the theme toggle control's `aria-label` describes switching to light mode

#### Scenario: Label names the target theme when light is active
- **WHEN** the current theme is `'light'`
- **THEN** the theme toggle control's `aria-label` describes switching to dark mode
