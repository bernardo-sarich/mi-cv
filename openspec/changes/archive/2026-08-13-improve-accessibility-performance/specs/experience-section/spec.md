## ADDED Requirements

### Requirement: Reduced-motion reveal and pulse behavior
When the visitor's system indicates a preference for reduced motion, each job entry SHALL be fully visible immediately rather than waiting to scroll into the central band of the viewport, its achievement bullets SHALL all be visible at once rather than cascading in sequentially, and timeline dots SHALL be shown without their pulse animation.

#### Scenario: Job entries are visible immediately
- **WHEN** the Experience section is rendered with `prefers-reduced-motion: reduce` in effect
- **THEN** every job entry is fully opaque and in its final position without waiting for scroll position, and with no fade-in or slide-up transition

#### Scenario: Bullets appear together instead of cascading
- **WHEN** a job entry is rendered with `prefers-reduced-motion: reduce` in effect
- **THEN** all of its achievement bullets are visible at once, with no per-bullet stagger delay

#### Scenario: Timeline dots do not pulse
- **WHEN** a job entry's timeline dot is rendered with `prefers-reduced-motion: reduce` in effect
- **THEN** the dot is shown without the repeating pulse animation
