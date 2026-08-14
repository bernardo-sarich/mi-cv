# cv-download Specification

## Purpose

Lets a site visitor download Bernardo's CV as a PDF, automatically matching the file to the language currently selected on the site.

## Requirements

### Requirement: CV PDF assets are served by the client
The system SHALL serve two static PDF files, one per supported language (`es`, `en`), as part of the client build output.

#### Scenario: PDF assets are reachable
- **WHEN** a client requests the Spanish or English CV PDF URL
- **THEN** the corresponding PDF file is returned successfully

### Requirement: Download button in Hero
The Hero section's "Download CV" button SHALL be functional and trigger a CV download when activated.

#### Scenario: Button downloads instead of doing nothing
- **WHEN** the visitor activates the Hero "Download CV" button
- **THEN** the matching CV PDF is downloaded

### Requirement: Downloaded file matches the selected language
Activating the download button SHALL download the PDF matching the site's current language (`lang` from `AppContext`), without a full page navigation.

#### Scenario: Spanish selected
- **WHEN** the visitor activates the download button while `lang` is `es`
- **THEN** `Bernardo_Sarich_CV_ES.pdf` is downloaded

#### Scenario: English selected
- **WHEN** the visitor activates the download button while `lang` is `en`
- **THEN** `Bernardo_Sarich_CV_EN.pdf` is downloaded

#### Scenario: Language switched before downloading
- **WHEN** the visitor toggles the language and then activates the download button
- **THEN** the file downloaded matches the newly selected language, not the previous one
