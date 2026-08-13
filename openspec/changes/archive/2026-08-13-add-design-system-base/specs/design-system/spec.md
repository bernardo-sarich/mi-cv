## Purpose

Defines the shared Tailwind color tokens, font families, and base reusable UI components (Button, Badge, Card, SectionLabel) that every page section in the `client` app must use for consistent dark/light theming.

## ADDED Requirements

### Requirement: Dark and light color tokens
The system SHALL expose the following Tailwind color tokens, available in both a dark and a light variant selected via the `dark` class strategy (`darkMode: 'class'`): `bg`, `navBg`, `surface`, `border`, `text`, `textDim`, `accent`, `accentDim`, `onAccent`.

Dark values SHALL be exactly:
- `bg`: `#0a0d0c`
- `navBg`: `rgba(10,13,12,0.82)`
- `surface`: `#11161a`
- `border`: `#1f2a28`
- `text`: `#e6ede9`
- `textDim`: `#8a9a94`
- `accent`: `#3ddc84`
- `accentDim`: `rgba(61,220,132,0.14)`
- `onAccent`: `#08130d`

Light values SHALL be exactly:
- `bg`: `#f7f8f7`
- `navBg`: `rgba(247,248,247,0.85)`
- `surface`: `#ffffff`
- `border`: `#dbe2de`
- `text`: `#101513`
- `textDim`: `#5b6863`
- `accent`: `#1f9d5c`
- `accentDim`: `rgba(31,157,92,0.10)`
- `onAccent`: `#ffffff`

#### Scenario: Default theme renders light tokens
- **WHEN** the `<html>` element does not have the `dark` class present
- **THEN** elements using the token classes (e.g. `bg-bg`, `text-text`, `border-border`) render using the light values listed above

#### Scenario: Dark theme renders dark tokens
- **WHEN** the `<html>` element has the `dark` class present
- **THEN** elements using the token classes render using the dark values listed above

### Requirement: Custom font families
The system SHALL configure a `mono` font family resolving to JetBrains Mono (with a monospace fallback stack) and a `sans` font family resolving to Inter (with a sans-serif fallback stack), both available as Tailwind utility classes (`font-mono`, `font-sans`).

#### Scenario: Mono utility applies JetBrains Mono
- **WHEN** an element has the `font-mono` class
- **THEN** its computed `font-family` starts with `"JetBrains Mono"`

#### Scenario: Sans utility applies Inter
- **WHEN** an element has the `font-sans` class
- **THEN** its computed `font-family` starts with `Inter`

### Requirement: Button component
The system SHALL provide a `Button` UI component supporting a `primary` variant (solid `accent` background, `onAccent` text) and a `secondary` variant (transparent background, `border`-colored outline, `text` colored label), with no embedded business logic — only presentation and the props needed to render it (e.g. variant, children, onClick, type, disabled).

#### Scenario: Primary variant styling
- **WHEN** `Button` is rendered with `variant="primary"`
- **THEN** it renders with the `accent` token as background and `onAccent` token as text color

#### Scenario: Secondary variant styling
- **WHEN** `Button` is rendered with `variant="secondary"`
- **THEN** it renders with a `border`-colored outline and no filled background

### Requirement: Badge component
The system SHALL provide a `Badge` UI component for displaying short labels (e.g. technology stack tags) as small text with a border, with no embedded business logic.

#### Scenario: Badge renders label with border
- **WHEN** `Badge` is rendered with text content
- **THEN** it renders that content as small text inside a bordered container using the theme's `border` and `textDim`/`text` tokens

### Requirement: Card component
The system SHALL provide a `Card` UI component that renders a container using the `surface` background token, the `border` token, and a rounded border radius, with no embedded business logic.

#### Scenario: Card renders themed container
- **WHEN** `Card` is rendered with child content
- **THEN** it renders a container with `surface` background, `border`-colored border, and rounded corners containing that content

### Requirement: SectionLabel component
The system SHALL provide a `SectionLabel` UI component that renders small, reduced-opacity decorative text in the `mono` font family, intended to visually label a page section (e.g. resembling `<section id="...">`), with no embedded business logic.

#### Scenario: SectionLabel renders decorative mono text
- **WHEN** `SectionLabel` is rendered with a label string
- **THEN** it renders that string in the `mono` font family, at a small size, with reduced opacity relative to the surrounding text
