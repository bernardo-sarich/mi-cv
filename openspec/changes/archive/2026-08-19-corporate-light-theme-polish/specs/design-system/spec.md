## MODIFIED Requirements

### Requirement: Card component
The system SHALL provide a `Card` UI component that renders a container using the `surface` background token and a rounded border radius, with no embedded business logic. The container's elevation treatment SHALL differ by theme: in light theme it SHALL render with a soft box-shadow and no visible border; in dark theme it SHALL render with the `border` token and no box-shadow.

#### Scenario: Card renders themed container
- **WHEN** `Card` is rendered with child content in dark theme
- **THEN** it renders a container with `surface` background, rounded corners, a `border`-colored border, and no box-shadow

#### Scenario: Card renders with shadow in light theme
- **WHEN** `Card` is rendered with child content in light theme
- **THEN** it renders a container with `surface` background, rounded corners, a soft box-shadow, and no visible border
