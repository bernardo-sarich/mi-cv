## REMOVED Requirements

### Requirement: Primary call-to-action buttons
**Reason**: This requirement described the "Descargar CV" button as inert, which no longer reflects the implemented behavior (and predates the dedicated `cv-download` capability that now documents the download behavior in detail).
**Migration**: Replaced by the "Hero call-to-action buttons" requirement below, which documents the "Descargar CV" button as functional. See also `cv-download` for the full download behavior (file naming, language matching).

## ADDED Requirements

### Requirement: Hero call-to-action buttons
The Hero section SHALL render two call-to-action buttons: a primary-styled "Descargar CV" button that downloads the CV PDF matching the site's current language when activated (see `cv-download` for the full download behavior), and a secondary-styled "Ver proyectos →" button that smoothly scrolls the viewport to the `projects` section when activated.

#### Scenario: Download CV button downloads the CV
- **WHEN** the visitor activates the "Descargar CV" button
- **THEN** the CV PDF matching the site's current language is downloaded, without a full page navigation

#### Scenario: View projects button scrolls to projects section
- **WHEN** the user activates the "Ver proyectos →" button
- **THEN** the viewport smoothly scrolls until the section with id `projects` is in view, without a full page reload
