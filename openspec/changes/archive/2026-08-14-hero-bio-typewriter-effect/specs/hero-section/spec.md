## MODIFIED Requirements

### Requirement: Bio paragraph
The Hero section SHALL display the bio paragraph from the CV content data beneath the name/status/role header, revealing its text one character at a time (a typewriter effect) rather than showing the full text immediately, except when the visitor's system indicates a preference for reduced motion, in which case the full bio text SHALL be shown immediately with no typing animation.

#### Scenario: Bio text is visible
- **WHEN** the Hero section is rendered
- **THEN** the bio paragraph from the CV content data is shown below the name/status/role header

#### Scenario: Bio text types out character by character
- **WHEN** the Hero section mounts (or the bio text becomes available) with no reduced-motion preference in effect
- **THEN** the bio paragraph starts empty and progressively displays the bio text below the name/status/role header, adding one character at a time until the full text is shown

#### Scenario: Bio text updates with the selected language
- **WHEN** the visitor switches the site language while the Hero section is visible
- **THEN** the bio paragraph restarts the typewriter effect and types out that language's bio text from empty, without a page reload

#### Scenario: Bio text appears immediately under reduced motion
- **WHEN** the Hero section mounts (or the bio text changes) with `prefers-reduced-motion: reduce` in effect
- **THEN** the full bio text is shown immediately below the name/status/role header, with no character-by-character typing animation
