## ADDED Requirements

### Requirement: Reduced-motion entrance and interaction behavior
When the visitor's system indicates a preference for reduced motion, the Hero section's staggered entrance animation, the "online" indicator's pulse/ring effect, and the "Ver proyectos →" button's scroll behavior SHALL each present their final/target state immediately, with no animated transition, instead of their normal animated behavior.

#### Scenario: Blocks appear immediately instead of staggering in
- **WHEN** the Hero section mounts with `prefers-reduced-motion: reduce` in effect
- **THEN** the terminal, name/status/role, bio, and stats/call-to-action blocks are all fully visible and in their final position immediately, with no fade-in, slide-up, or stagger delay

#### Scenario: Online indicator does not pulse
- **WHEN** the Hero section is rendered with `prefers-reduced-motion: reduce` in effect
- **THEN** the accent-colored status dot is shown without the expanding-ring pulse animation

#### Scenario: View projects button jumps instead of smooth-scrolling
- **WHEN** the user activates the "Ver proyectos →" button with `prefers-reduced-motion: reduce` in effect
- **THEN** the viewport jumps immediately to the `projects` section with no animated scroll
