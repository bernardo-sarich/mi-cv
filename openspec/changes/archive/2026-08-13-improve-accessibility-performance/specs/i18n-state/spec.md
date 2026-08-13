## MODIFIED Requirements

### Requirement: Supported UI chrome translation keys
The system SHALL provide Spanish and English translations for the following fixed UI-chrome keys: `nav.about`, `nav.experience`, `nav.projects`, `nav.contact`, `hero.downloadCv`, `hero.viewProjects`, `experience.title`, `skills.title`, `projects.title`, `projects.viewRepo`, `contact.title`, `contact.formName`, `contact.formEmail`, `contact.formMessage`, `contact.formSubmit`, `contact.formSent`, `theme.switchToLight`, `theme.switchToDark`, `lang.switchToEn`, `lang.switchToEs`.

These translations cover fixed interface chrome only (navigation, buttons, form labels, and control accessible names) — bilingual CV content (bio, experience entries, project descriptions) is out of scope and is sourced elsewhere.

#### Scenario: Every key resolves in both languages
- **WHEN** any of the listed keys is looked up under the `es` language or under the `en` language
- **THEN** a non-empty translated string is returned for that key in each language

## ADDED Requirements

### Requirement: Language toggle accessible name
The language toggle control SHALL expose a descriptive `aria-label` naming the action it performs (switching to the other supported language), rather than relying solely on its visible text, and that label SHALL update to reflect the target language whenever the active language changes.

#### Scenario: Label names the target language when Spanish is active
- **WHEN** the active language is `es`
- **THEN** the language toggle control's `aria-label` describes switching to English

#### Scenario: Label names the target language when English is active
- **WHEN** the active language is `en`
- **THEN** the language toggle control's `aria-label` describes switching to Spanish
