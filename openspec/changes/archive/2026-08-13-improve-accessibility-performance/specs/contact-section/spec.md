## ADDED Requirements

### Requirement: Reduced-motion confirmation feedback
When the visitor's system indicates a preference for reduced motion, the post-submission confirmation message SHALL appear and disappear immediately, with no fade transition, while still following the same visibility timing as the normal behavior.

#### Scenario: Confirmation appears without a fade transition
- **WHEN** the visitor submits a valid entry with `prefers-reduced-motion: reduce` in effect
- **THEN** the confirmation message becomes fully visible immediately, with no opacity or position transition
