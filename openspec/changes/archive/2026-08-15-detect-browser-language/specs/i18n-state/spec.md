## REMOVED Requirements

### Requirement: Spanish default language
**Reason**: Replaced by browser-language detection so a non-Spanish-speaking visitor lands on an English UI by default instead of always seeing Spanish.
**Migration**: See "Requirement: Browser-detected initial language" below.

## ADDED Requirements

### Requirement: Browser-detected initial language
The system SHALL initialize the active language by inspecting the browser's reported language preference: `es` when the browser's primary language is an `es-*` locale, and `en` for any other browser language. The fallback language SHALL remain `es`.

#### Scenario: Browser reports a Spanish locale
- **WHEN** the app starts with no prior language state and the browser's primary language is an `es-*` locale (e.g., `es-AR`, `es-ES`)
- **THEN** the active language is `es` and UI chrome text renders using the Spanish translations

#### Scenario: Browser reports a non-Spanish locale
- **WHEN** the app starts with no prior language state and the browser's primary language is not an `es-*` locale (e.g., `en-US`, `pt-BR`, `fr`)
- **THEN** the active language is `en` and UI chrome text renders using the English translations

## MODIFIED Requirements

### Requirement: Language toggle control
The system SHALL provide a user-facing control that displays the current active language and switches the active language when activated, transitioning its own visual content with a crossfade of approximately 150-200ms. The control SHALL also display a globe icon alongside the language label to visually signal that it is a language switcher.

#### Scenario: Activating control switches language
- **WHEN** the user activates the language toggle control
- **THEN** the active language switches to the other supported language and UI chrome text updates accordingly

#### Scenario: Control content crossfades on change
- **WHEN** the active language changes
- **THEN** the control's visual content transitions with an opacity crossfade lasting approximately 150-200ms rather than changing abruptly

#### Scenario: Control displays a globe icon
- **WHEN** the language toggle control is rendered
- **THEN** a globe icon is visible alongside the current language label
