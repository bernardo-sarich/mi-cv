## Purpose

Provides global dark/light theme state for the `client` app, shared across every component, backed by the `design-system` Tailwind color tokens, plus a control that lets the user toggle it.

## ADDED Requirements

### Requirement: Global theme context
The system SHALL expose a theme context with the current theme value (`'dark'` or `'light'`) and a `toggle` operation that switches between the two values, accessible to any descendant component.

#### Scenario: Default theme is dark
- **WHEN** the app starts with no prior theme state
- **THEN** the current theme value is `'dark'`

#### Scenario: Toggle switches theme value
- **WHEN** the theme is `'dark'` and `toggle` is invoked
- **THEN** the current theme value becomes `'light'`, and invoking `toggle` again returns it to `'dark'`

### Requirement: Root element reflects theme
The system SHALL apply a `dark` class to the document root element (`<html>`) when the current theme is `'dark'`, and SHALL remove it when the current theme is `'light'`, so that Tailwind's `darkMode: 'class'` tokens render correctly.

#### Scenario: Dark theme applies root class
- **WHEN** the current theme value is `'dark'`
- **THEN** the `<html>` element has the `dark` class present

#### Scenario: Light theme removes root class
- **WHEN** the current theme value is `'light'`
- **THEN** the `<html>` element does not have the `dark` class present

### Requirement: Theme toggle control
The system SHALL provide a user-facing control that displays the current theme state and invokes the theme toggle when activated, transitioning its own visual content with a crossfade of approximately 150-200ms.

#### Scenario: Activating control toggles theme
- **WHEN** the user activates the theme toggle control
- **THEN** the global theme value switches to the other value and the `<html>` root class updates accordingly

#### Scenario: Control content crossfades on change
- **WHEN** the theme value changes
- **THEN** the control's visual content transitions with an opacity crossfade lasting approximately 150-200ms rather than changing abruptly
