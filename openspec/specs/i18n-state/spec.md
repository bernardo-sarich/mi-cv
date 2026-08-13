# i18n-state Specification

## Purpose

Provides global language state and fixed UI-chrome translations (nav, buttons, form labels) for the `client` app in Spanish and English, plus a control that lets the user switch between them.

## Requirements

### Requirement: Spanish default language
The system SHALL initialize with Spanish (`es`) as the active and fallback language when the app starts with no prior language selection.

#### Scenario: App starts in Spanish
- **WHEN** the app starts with no prior language state
- **THEN** the active language is `es` and UI chrome text renders using the Spanish translations

### Requirement: Supported UI chrome translation keys
The system SHALL provide Spanish and English translations for the following fixed UI-chrome keys: `nav.about`, `nav.experience`, `nav.projects`, `nav.contact`, `hero.downloadCv`, `hero.viewProjects`, `experience.title`, `skills.title`, `projects.title`, `projects.viewRepo`, `contact.title`, `contact.formName`, `contact.formEmail`, `contact.formMessage`, `contact.formSubmit`, `contact.formSent`.

These translations cover fixed interface chrome only (navigation, buttons, form labels) — bilingual CV content (bio, experience entries, project descriptions) is out of scope and is sourced elsewhere.

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
The system SHALL provide a user-facing control that displays the current active language and switches the active language when activated, transitioning its own visual content with a crossfade of approximately 150-200ms.

#### Scenario: Activating control switches language
- **WHEN** the user activates the language toggle control
- **THEN** the active language switches to the other supported language and UI chrome text updates accordingly

#### Scenario: Control content crossfades on change
- **WHEN** the active language changes
- **THEN** the control's visual content transitions with an opacity crossfade lasting approximately 150-200ms rather than changing abruptly
