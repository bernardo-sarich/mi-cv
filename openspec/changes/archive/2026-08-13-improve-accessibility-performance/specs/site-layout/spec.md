## ADDED Requirements

### Requirement: Reduced-motion anchor navigation
When the visitor's system indicates a preference for reduced motion, activating a section anchor link in the navigation bar SHALL jump the viewport to that section immediately, with no animated scroll.

#### Scenario: Nav link jumps instead of smooth-scrolling
- **WHEN** the user activates a section anchor link in the navigation bar with `prefers-reduced-motion: reduce` in effect
- **THEN** the viewport jumps immediately to the target section with no animated scroll
