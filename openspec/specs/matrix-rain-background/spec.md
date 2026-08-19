# matrix-rain-background Specification

## Purpose

Provides an ambient, purely decorative "matrix rain" layer that fills the empty side gutters of the page on wide viewports, reinforcing the site's terminal aesthetic without competing with content, reaching assistive technology, or imposing a meaningful ongoing performance cost.

## Requirements

### Requirement: Ambient rain layer in both side gutters
The system SHALL render two decorative falling-character layers pinned to the viewport — one against the left edge and one against the right edge — each spanning the full viewport height and remaining in place while the page scrolls.

#### Scenario: Both gutters are populated on a wide viewport
- **WHEN** the page is loaded at a viewport width of 1600px with reduced motion not requested
- **THEN** a decorative falling-character layer is present against the left viewport edge and another against the right viewport edge, each spanning the full viewport height

#### Scenario: Layers stay fixed while the page scrolls
- **WHEN** the user scrolls the page down
- **THEN** both layers remain pinned to the viewport rather than scrolling away with the content

### Requirement: Layers are confined to the empty gutter
Each layer SHALL be exactly as wide as the empty space between its viewport edge and the centered app column, where the app column is 1126px wide. Gutter width SHALL be derived from the viewport's content width — excluding any classic scrollbar — because the app column is centered within that same content box. The layers SHALL NOT extend into the app column or paint over the column's side border, and SHALL re-derive their width when the viewport is resized.

#### Scenario: Strip width matches the available gutter
- **WHEN** the viewport's content width is 1585px
- **THEN** each layer is 229px wide — `(1585 - 1126) / 2` — and its inner edge stops at the app column's outer edge

#### Scenario: App column and its border stay clear
- **WHEN** the layers are rendered at any supported viewport width
- **THEN** no falling character is drawn inside the horizontal span occupied by the app column, and the column's side border remains unobscured

#### Scenario: A classic scrollbar does not skew the strips
- **WHEN** the page is scrollable and the browser reserves a classic scrollbar, so the window is 1600px but the content width is 1585px
- **THEN** both layers are 229px wide rather than 237px, and the right layer's outer edge stops at the content width instead of extending underneath the scrollbar

#### Scenario: Width follows a viewport resize
- **WHEN** the viewport is widened so its content width goes from 1585px to 1785px while the layers are rendered
- **THEN** each layer's width updates to the new gutter size (329px) rather than keeping its previous width

### Requirement: Rain renders behind all page content
The rain layers SHALL sit at a stacking level below every page section, the navigation bar, and the footer, so that no content is obscured, dimmed, or made harder to read by the effect, and no layer intercepts pointer input intended for the page.

#### Scenario: Content renders above the effect
- **WHEN** the layers are active and the page is displayed
- **THEN** all nav, section, and footer content renders fully opaque and legible above the effect

#### Scenario: Effect does not capture pointer events
- **WHEN** the user clicks or hovers anywhere over a rain layer's area
- **THEN** the layer does not receive or block the interaction

### Requirement: Effect is limited to wide viewports
The rain layers SHALL be rendered only when the viewport is at least 1280px wide. Below that width no layer SHALL exist in the document, and the effect SHALL be added or removed as the viewport crosses the threshold in either direction.

#### Scenario: Narrow viewport omits the effect entirely
- **WHEN** the page is loaded at a viewport width of 1024px
- **THEN** no rain layer exists in the document and no animation for the effect is running

#### Scenario: Effect appears when widening past the threshold
- **WHEN** the viewport is resized from 1100px to 1400px
- **THEN** the rain layers appear

#### Scenario: Effect is torn down when narrowing past the threshold
- **WHEN** the viewport is resized from 1400px to 1100px
- **THEN** the rain layers are removed from the document and their animation stops

### Requirement: Effect is limited to dark theme
The rain layers SHALL be rendered only when the active theme is dark. In light theme no layer SHALL exist in the document regardless of viewport width or reduced-motion preference, and the effect SHALL be added or removed as the theme changes in either direction.

#### Scenario: Light theme omits the effect entirely
- **WHEN** the page is displayed in light theme at a viewport width of 1600px with reduced motion not requested
- **THEN** no rain layer exists in the document and no animation for the effect is running

#### Scenario: Effect appears when switching to dark theme
- **WHEN** the user switches from light to dark theme while the viewport is at least 1280px wide and reduced motion is not requested
- **THEN** the rain layers appear

#### Scenario: Effect is torn down when switching to light theme
- **WHEN** the user switches from dark to light theme while the rain layers are rendered
- **THEN** the rain layers are removed from the document and their animation stops

### Requirement: Reduced-motion preference suppresses the effect
When the user's system indicates a preference for reduced motion, the system SHALL NOT render the rain layers at all — neither as a static nor as a slowed-down variant.

#### Scenario: Reduced motion prevents rendering
- **WHEN** the page is loaded at a viewport width of 1600px with `prefers-reduced-motion: reduce` in effect
- **THEN** no rain layer exists in the document and no animation for the effect is running

### Requirement: Effect is invisible to assistive technology
The rain layers SHALL be exposed as decorative content only: hidden from the accessibility tree, absent from the focus order, and contributing no text content to the page.

#### Scenario: Layers are excluded from the accessibility tree
- **WHEN** the page is inspected via the accessibility tree with the layers active
- **THEN** neither layer nor any of its content appears

#### Scenario: Layers are not reachable by keyboard
- **WHEN** the user tabs through the page from top to bottom
- **THEN** focus never lands on a rain layer

### Requirement: Rain color is fixed
The falling characters SHALL always be drawn in `#3ddc84` — the same fixed color regardless of any other state, since the effect only ever renders in dark theme.

#### Scenario: Effect always uses the same color
- **WHEN** the layers are rendered
- **THEN** the falling characters are drawn in `#3ddc84`

### Requirement: Restrained ambient visual treatment
The effect SHALL read as background texture rather than a focal element: characters SHALL be drawn at an effective opacity between 0.15 and 0.45, SHALL fall at a slow and even rate, and SHALL NOT produce abrupt flashing, strobing, or high-frequency flicker. Characters SHALL be drawn from a mixed set of letters, digits, and symbols in the site's monospace typeface.

#### Scenario: Effect stays low-contrast against the background
- **WHEN** the layers are rendered
- **THEN** the drawn characters' effective opacity is within the range 0.15–0.45

#### Scenario: Fall motion is steady and non-flashing
- **WHEN** the effect runs continuously
- **THEN** characters descend at a consistent slow rate with no abrupt full-layer brightness changes

#### Scenario: Character set is mixed
- **WHEN** the effect runs
- **THEN** the characters drawn include letters, digits, and symbols rather than a single character class

### Requirement: Animation cost is bounded
The effect SHALL be driven by the browser's animation frame scheduling rather than by interval timers, and SHALL advance its visual state at a throttled rate of approximately 15–20 updates per second regardless of the display's refresh rate.

#### Scenario: Update rate is throttled below refresh rate
- **WHEN** the effect runs on a 60Hz display
- **THEN** the effect's visual state advances roughly 15–20 times per second, not 60

#### Scenario: No interval timer drives the effect
- **WHEN** the effect is running
- **THEN** its progression is driven by animation-frame scheduling, so it is naturally suspended by the browser alongside other frame-driven animation

### Requirement: Animation suspends while the page is hidden
When the document becomes hidden — the tab is backgrounded or the window is minimized — the effect SHALL stop scheduling work entirely rather than continuing to compute frames, and SHALL resume when the document becomes visible again.

#### Scenario: Backgrounding the tab halts the effect
- **WHEN** the user switches to another browser tab while the effect is running
- **THEN** the effect stops scheduling animation work

#### Scenario: Returning to the tab resumes the effect
- **WHEN** the user switches back to the page
- **THEN** the effect resumes animating

### Requirement: Teardown leaves nothing running
When a rain layer is removed — on unmount, on a preference or viewport change that disables the effect, or on re-initialization after a theme or size change — the system SHALL cancel any pending animation frame and detach every listener it registered, so no callback, timer, or draw call for the removed layer executes afterward.

#### Scenario: Unmount cancels pending work
- **WHEN** a rain layer is unmounted
- **THEN** its pending animation frame is cancelled and no further draw for that layer occurs

#### Scenario: Re-initialization does not stack loops
- **WHEN** the effect re-initializes after a theme toggle or a viewport resize
- **THEN** exactly one animation loop per layer is running afterward, not one per re-initialization

#### Scenario: Listeners are detached on teardown
- **WHEN** a rain layer is removed
- **THEN** the resize, visibility, and preference listeners it registered are detached
