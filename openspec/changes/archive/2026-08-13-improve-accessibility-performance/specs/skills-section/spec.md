## ADDED Requirements

### Requirement: Reduced-motion reveal behavior
When the visitor's system indicates a preference for reduced motion, skill categories and their badges SHALL be fully visible immediately, without waiting to scroll into view and without the scale/bounce pop-in animation.

#### Scenario: Categories and badges appear immediately
- **WHEN** the Skills section is rendered with `prefers-reduced-motion: reduce` in effect
- **THEN** every skill category and its badges are fully visible in their final state immediately, with no scroll-triggered reveal delay and no scale pop-in transition
