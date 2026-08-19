## MODIFIED Requirements

### Requirement: Global theme context
The system SHALL expose a theme context with the current theme value (`'dark'` or `'light'`) and a `toggle` operation that switches between the two values, accessible to any descendant component.

#### Scenario: Default theme is dark
- **WHEN** the app starts with no prior theme state and the browser reports `window.matchMedia('(prefers-color-scheme: dark)').matches` as `true`
- **THEN** the current theme value is `'dark'`

#### Scenario: Default theme is light
- **WHEN** the app starts with no prior theme state and `window.matchMedia('(prefers-color-scheme: dark)').matches` is `false` (or `matchMedia` is unavailable)
- **THEN** the current theme value is `'light'`

#### Scenario: Toggle switches theme value
- **WHEN** the theme is `'dark'` and `toggle` is invoked
- **THEN** the current theme value becomes `'light'`, and invoking `toggle` again returns it to `'dark'`

### Requirement: Theme toggle accessible name
The theme toggle control SHALL expose a descriptive `aria-label` naming the action it performs (switching to the other theme), rather than relying solely on its visible text, and that label SHALL update to reflect the target theme whenever the current theme changes. The label vocabulary SHALL frame the action as entering or leaving "Developer Mode" rather than naming the raw theme value.

#### Scenario: Label names the target theme when dark is active
- **WHEN** the current theme is `'dark'`
- **THEN** the theme toggle control's `aria-label` describes switching to Corporate Mode (light theme)

#### Scenario: Label names the target theme when light is active
- **WHEN** the current theme is `'light'`
- **THEN** the theme toggle control's `aria-label` describes switching to Developer Mode (dark theme)
