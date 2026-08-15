# i18n-state Specification

## Purpose

Provides global language state and fixed UI-chrome translations (nav, buttons, form labels) for the `client` app in Spanish and English, plus a control that lets the user switch between them.

## Requirements

### Requirement: Browser-detected initial language
The system SHALL initialize the active language by inspecting the browser's reported language preference: `es` when the browser's primary language is an `es-*` locale, and `en` for any other browser language. The fallback language SHALL remain `es`.

#### Scenario: Browser reports a Spanish locale
- **WHEN** the app starts with no prior language state and the browser's primary language is an `es-*` locale (e.g., `es-AR`, `es-ES`)
- **THEN** the active language is `es` and UI chrome text renders using the Spanish translations

#### Scenario: Browser reports a non-Spanish locale
- **WHEN** the app starts with no prior language state and the browser's primary language is not an `es-*` locale (e.g., `en-US`, `pt-BR`, `fr`)
- **THEN** the active language is `en` and UI chrome text renders using the English translations

### Requirement: Supported UI chrome translation keys
The system SHALL provide Spanish and English translations for the following fixed UI-chrome keys: `nav.about`, `nav.experience`, `nav.projects`, `nav.contact`, `hero.downloadCv`, `hero.viewProjects`, `experience.title`, `skills.title`, `projects.title`, `projects.viewRepo`, `contact.title`, `contact.formName`, `contact.formEmail`, `contact.formMessage`, `contact.formSubmit`, `contact.formSent`, `theme.switchToLight`, `theme.switchToDark`, `lang.switchToEn`, `lang.switchToEs`.

These translations cover fixed interface chrome only (navigation, buttons, form labels, and control accessible names) — bilingual CV content (bio, experience entries, project descriptions) is out of scope and is sourced elsewhere.

#### Scenario: Every key resolves in both languages
- **WHEN** any of the listed keys is looked up under the `es` language or under the `en` language
- **THEN** a non-empty translated string is returned for that key in each language

### Requirement: Language switch updates rendered UI chrome
The system SHALL re-render all UI chrome text using the newly selected language whenever the active language changes, without requiring a page reload.

#### Scenario: Switching to English updates visible text
- **WHEN** the active language changes from `es` to `en`
- **THEN** UI chrome elements bound to the translation keys immediately display their English text

#### Scenario: Switching back to Spanish restores text
- **WHEN** the active language changes from `en` back to `es`
- **THEN** UI chrome elements bound to the translation keys immediately display their Spanish text

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

### Requirement: Language toggle accessible name
The language toggle control SHALL expose a descriptive `aria-label` naming the action it performs (switching to the other supported language), rather than relying solely on its visible text, and that label SHALL update to reflect the target language whenever the active language changes.

#### Scenario: Label names the target language when Spanish is active
- **WHEN** the active language is `es`
- **THEN** the language toggle control's `aria-label` describes switching to English

#### Scenario: Label names the target language when English is active
- **WHEN** the active language is `en`
- **THEN** the language toggle control's `aria-label` describes switching to Spanish
