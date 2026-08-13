## Context

See `proposal.md` — Why. The constraints that actually shape the implementation are all pre-existing facts about the current layout, and several contradict the intuitive approach:

- **The app column is 1126px, not 1080px.** `client/src/index.css` sets `#root { width: 1126px; margin: 0 auto; border-inline: 1px solid var(--border); display: flex; flex-direction: column; min-height: 100svh; }`. The sections' `max-w-5xl` (1024px) is nested *inside* that. The genuinely empty gutter is therefore everything outside 1126px, and 1126 is the number the strips must key off — confirmed as the chosen reference.
- **`body` has an opaque background.** `client/src/styles/tailwind.css` applies `body { @apply bg-bg text-text dark:bg-dark-bg ... }`. A fixed element at `z-index: -1` paints *behind* that background and would be completely invisible. The common "just put it at `z-index: -1`" trick is not available here.
- **Page sections are statically positioned.** They are plain `<section className="px-4 py-8">` — none of them sets `position: relative; z-index: 1` today. A fixed canvas at `z-index: 0` would paint *above* their in-flow content, so content has to be lifted deliberately.
- **`--accent` in `index.css` is `#aa3bff` (purple).** That variable belongs to a leftover template palette and is unrelated to the site's green `accent` Tailwind token. Reading the accent from CSS custom properties would produce the wrong color.
- **Theme is class-based and lives in React state.** `AppContext` toggles `.dark` on `<html>` and exposes `useTheme()`. There is no CSS variable carrying the green accent.

## Goals / Non-Goals

**Goals:**

- One reusable component, mounted twice (`side="left" | "right"`), with all geometry derived from a single measured number.
- Correct behavior at the seams: scrollbar width, device pixel ratio, resize, theme toggle, React StrictMode double-invocation.
- Recoloring on theme change must not restart the animation.

**Non-Goals:**

- Changing `#root { width: 1126px }`, the `border-inline`, or the leftover template palette in `index.css`. The strips adapt to the layout as it exists.
- Any tablet/mobile variant, or a static fallback for reduced-motion users. Below the gate the effect simply does not exist.
- Extracting a general-purpose canvas-animation hook. One component, one job.

## Decisions

### Measure the gutter in JS from `documentElement.clientWidth`; never `100vw` in a `calc()`

The obvious spelling is `width: calc((100vw - 1126px) / 2)` in CSS. It is wrong here: `100vw` **includes** the classic scrollbar's width, while `#root`'s `margin: 0 auto` centers it within the content box, which **excludes** the scrollbar. On a browser with a ~15px classic scrollbar, the CSS form makes each strip ~7.5px too wide and pushes the right strip partly under the scrollbar — visibly asymmetric.

Instead, a single measurement drives everything:

```
gutter = Math.max(0, Math.floor((document.documentElement.clientWidth - APP_COLUMN_WIDTH) / 2))
```

`APP_COLUMN_WIDTH = 1126` is a module constant with a comment pointing at the `index.css` rule it mirrors. That measured value sets the element's inline `width`, the canvas backing-store size, and the column count — one source of truth, no chance of the three disagreeing.

*Alternative considered:* pure CSS `calc()` with `scrollbar-gutter: stable`. Rejected — it fixes the symmetry only by changing global scrolling behavior for the whole site, which is out of scope for a decorative layer.

### Gate by conditional render, driven by `matchMedia`

Both gates — `(min-width: 1280px)` and `(prefers-reduced-motion: reduce)` — are read through `matchMedia` with `change` listeners, and the component returns `null` when either fails. Nothing is rendered, so no canvas, no loop, no listeners.

*Alternative considered:* render always and hide with `display: none` or a CSS media query. Rejected — the canvas and its animation frame would stay alive, defeating the entire point of the gate. The spec requires the layer to be *absent*, not hidden.

The two media queries are read by a small local hook so the mount decision lives in one place and both instances share the same logic.

### Throttle inside a single `requestAnimationFrame` loop with a timestamp gate

```
const FRAME_MS = 1000 / 18   // ~18fps

function loop(now) {
  rafRef.current = requestAnimationFrame(loop)
  if (now - lastRef.current < FRAME_MS) return
  lastRef.current = now
  draw()
}
```

Scheduling the next frame first and returning early keeps the loop's shape simple and makes cancellation a single `cancelAnimationFrame(rafRef.current)`. Drawing runs ~18 times per second instead of 60 — roughly a third of the work — and rAF means the browser throttles or suspends the loop on its own when the page is backgrounded, on top of the explicit visibility handling below.

*Alternative considered:* `setInterval` at 55ms. Rejected — it keeps firing in background tabs (clamped, but still firing), it drifts against the compositor, and it produces tearing when it lands mid-frame.

*Alternative considered:* full 60fps with delta-time-based movement for smoother motion. Rejected — three times the draw calls for a background element the reader is not supposed to be looking at.

### Stop the loop on `visibilitychange`, don't just skip frames

On `document.visibilityState === 'hidden'`, cancel the pending frame and null the handle; on `'visible'`, reset the throttle timestamp and restart the loop. Resetting `lastRef` on resume matters — otherwise the first frame back sees a huge `now - last` delta and, if movement were ever made delta-proportional, would jump. It also avoids an immediate double-draw.

*Alternative considered:* keep the loop running and early-return while hidden. Rejected — that still burns a callback per frame; the requirement is that no work is scheduled.

### Keep the accent color in a ref, not in the effect's dependency list

`useTheme()` supplies `theme`; a module constant maps it to the accent hex:

```
const ACCENT_BY_THEME = { dark: '#3ddc84', light: '#1f9d5c' }  // mirrors tailwind.config.js
```

If `theme` were a dependency of the animation effect, every toggle would tear down and rebuild the loop, resetting all column positions — the rain would visibly restart on each toggle. Instead the main effect depends only on geometry, and a separate one-line effect writes the current color into `colorRef.current`, which `draw()` reads each frame. Toggling recolors the next drawn frame and nothing else.

*Alternative considered:* `getComputedStyle(document.documentElement).getPropertyValue('--accent')`. Rejected outright — that variable is `#aa3bff` purple from the leftover template palette (see Context). It would silently render the effect in the wrong color.

*Alternative considered:* importing `tailwind.config.js` to read the token. Rejected — pulls build configuration into the runtime bundle to obtain two hex strings.

### Trails via `destination-out` erasure, keeping the canvas transparent

The classic implementation paints a low-alpha *background-colored* rectangle over the canvas each frame to fade the previous glyphs. That would require the strip to know and track the page background token, and it turns the strip into an opaque block that must stay in sync with `bg` / `dark-bg` forever.

Instead each frame erases rather than paints:

```
ctx.globalCompositeOperation = 'destination-out'
ctx.fillStyle = 'rgba(0,0,0,0.08)'
ctx.fillRect(0, 0, w, h)
ctx.globalCompositeOperation = 'source-over'
```

The canvas stays fully transparent, so whatever the page background is — now or after any future theme work — shows through untouched. Same per-frame cost as the opaque version.

Overall opacity is set **once** on the element (`opacity: 0.31`, tuned up from an initial 0.2 after seeing it live) rather than baked into every `fillStyle`. Glyphs are drawn at full alpha internally, so the trail gradient stays clean, and the single element-level value is what satisfies the 0.15–0.35 requirement — one number to tune.

### Lift content with a stacking wrapper in `App.jsx` that preserves `#root`'s flex role

Given the opaque `body` background and the statically positioned sections (see Context), the canvases must sit at `z-index: 0` and the content must be lifted above them. In `App.jsx`, the two instances render first, then the existing children move into a wrapper:

```jsx
<AppProvider>
  <MatrixRain side="left" />
  <MatrixRain side="right" />
  <div className="relative z-10 flex flex-1 flex-col">
    {/* Nav, Hero, Experience, Skills, Projects, #contacto, Footer — unchanged */}
  </div>
</AppProvider>
```

The `flex flex-1 flex-col` is not decoration: `#root` is `display: flex; flex-direction: column; min-height: 100svh`, and its children are currently direct flex items. Collapsing them under one wrapper without restoring the flex role would change how the footer sits at short viewport heights. The canvases themselves are `position: fixed`, so they are out of flow and are not flex items — they add nothing to the layout.

Nav keeps its `sticky top-0 z-50`. A `position: relative` ancestor does not create a scroll container, so sticky is unaffected; the nav's `z-50` simply resolves inside the wrapper's stacking context, where nothing competes with it.

*Alternative considered:* set `#root { position: relative; z-index: 1 }` in `index.css` and portal the canvases to `document.body`. It preserves the flex layout with zero DOM change and is arguably tidier — but it spreads the change across a global stylesheet and adds a portal, to solve a problem one wrapper already solves inside the change's own file.

*Alternative considered:* add `relative z-10` to each of the four section components plus Nav and Footer. Rejected — six edits where one does the job, and every future section would have to remember to do it.

### Column model and character set

Column width equals the font size (14px JetBrains Mono, matching the site's mono stack). Column count is `Math.floor(gutter / 14)` — at the 1280px gate that is 5 columns per side, at 1920px it is 28. Each column holds a head Y-position and a small per-column speed jitter inside a narrow band, so the fall reads as even rather than uniform-lockstep; heads wrap to the top with a randomized offset so the strips never fall into a visible repeating pattern.

Character set is drawn from `A–Z`, `0–9`, and the code punctuation the site already uses in its labels: `{ } [ ] < > / \ | = + * - # $ % & @`. Katakana — the literal Matrix set — is rejected on two counts: it clashes with the `</nombre>` and `<section id="...">` code-punctuation language the site speaks, and JetBrains Mono has no katakana coverage, so it would render as tofu boxes.

### Handle device pixel ratio, capped at 2

The canvas backing store is sized `gutter * dpr` × `innerHeight * dpr` with the CSS size kept in logical pixels and `ctx.scale(dpr, dpr)` applied after each resize. Without it, text is visibly blurry on high-DPI displays. `dpr` is capped at 2 so a 3x display does not quadruple the fill cost for a decorative layer.

Resize is handled by a `resize` listener debounced ~150ms, which re-measures the gutter, re-sizes the canvas (which also clears it), and recomputes the column array. Mount/unmount across the 1280px threshold is handled separately by the `matchMedia` listener, so the resize path never has to reason about the gate.

## Risks / Trade-offs

- **The `1126` constant duplicates a value owned by `index.css`.** If that rule changes, the strips silently misalign — they would overlap the app column or leave a gap. → Single exported constant with a comment naming the file and rule it mirrors, so a grep for `1126` finds both sites.
- **React StrictMode double-invokes effects in development.** A partial cleanup would leave two loops per canvas, showing up as rain falling at double speed in dev but correct in production — an easy bug to dismiss. → Cleanup cancels the frame handle *and* detaches every listener; the loop handle lives in a ref that the cleanup nulls, so a stacked loop is not representable.
- **`destination-out` fading never reaches exactly zero alpha.** Very faint residue can accumulate on pixels that are never redrawn. → At 0.08 alpha and ~18fps, a glyph is down to ~1.5% alpha within about three seconds, and the element's 0.2 opacity puts that far below the visible threshold. Resize clears the canvas outright.
- **Two always-on canvases on desktop.** Even throttled, this is nonzero continuous work on a page that previously had none at rest. → Combined draw area is small (~2 × 240 × 1000 logical px at 1600px wide), the loop runs at ~18fps, the tab-hidden path stops it entirely, and the 1280px gate keeps it off every viewport where the gutter would not justify it.
- **The gutter is narrow right at the 1280px gate** — 77px, about 5 columns per side. It reads more as sparse texture than as rain. → Accepted deliberately: the 1280px threshold was the explicit choice, and the effect degrades to "quiet" rather than to "broken" as the viewport narrows toward it.

## Migration Plan

Purely additive — one new file plus a wrapper in `App.jsx`. No data, no persisted state, no API surface. Rollback is deleting the two `<MatrixRain />` lines; the wrapper `div` is inert on its own and can stay or go independently.

## Open Questions

- Exact glyph size and column density (14px vs 16px) and the precise fall speed are tuning values. They can be settled by eye during implementation without touching the specs or the task breakdown.
- Whether to mask each strip with a vertical gradient fade at the top and bottom edges, so the rain dissolves instead of clipping at the viewport edges. Purely cosmetic polish; it is a one-line `mask-image` addition if wanted after seeing the effect live.
