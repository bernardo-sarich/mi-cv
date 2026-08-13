## 1. Constants and gating hook

- [x] 1.1 In `client/src/components/ui/MatrixRain.jsx`, define the module constants: `APP_COLUMN_WIDTH = 1126` (with a comment naming the `#root` rule in `client/src/index.css` it mirrors), `MIN_VIEWPORT = 1280`, `FONT_SIZE = 14`, `FRAME_MS = 1000 / 18`, `FADE_ALPHA = 0.08`, `LAYER_OPACITY = 0.31`, `ACCENT_BY_THEME = { dark: '#3ddc84', light: '#1f9d5c' }` (with a comment mirroring `tailwind.config.js`), and the character pool (`A–Z`, `0–9`, `{ } [ ] < > / \ | = + * - # $ % & @`).
- [x] 1.2 Add a local `useMediaQuery(query)` helper in the same file that reads `matchMedia(query).matches`, subscribes to its `change` event, and detaches on cleanup.
- [x] 1.3 In the component body, gate on `useMediaQuery('(min-width: 1280px)')` and `useMediaQuery('(prefers-reduced-motion: reduce)')`, returning `null` when the viewport is too narrow or reduced motion is requested — so no canvas, loop, or listener is created.

## 2. Geometry and canvas sizing

- [x] 2.1 Write a `measureGutter()` helper returning `Math.max(0, Math.floor((document.documentElement.clientWidth - APP_COLUMN_WIDTH) / 2))`. Do not use `100vw` in CSS for this — it includes the scrollbar and would make the two strips asymmetric.
- [x] 2.2 Render a `<canvas>` with `position: fixed`, `top: 0`, `height: 100vh`, `pointer-events: none`, `opacity: LAYER_OPACITY`, `zIndex: 0`, an inline `width` set from the measured gutter, and `left: 0` or `right: 0` selected by the `side` prop (`'left' | 'right'`).
- [x] 2.3 Write a `resizeCanvas()` routine that re-measures the gutter, caps `devicePixelRatio` at 2, sets the backing store to `gutter * dpr` × `innerHeight * dpr`, sets the CSS size in logical pixels, applies `ctx.scale(dpr, dpr)`, and re-applies the font (`${FONT_SIZE}px 'JetBrains Mono', ui-monospace, monospace`) since resizing a canvas resets its context state.
- [x] 2.4 Recompute the column array in `resizeCanvas()`: `Math.floor(gutter / FONT_SIZE)` columns, each seeded with a randomized head Y-position and a small per-column speed jitter inside a narrow band.
- [x] 2.5 Attach a `resize` listener debounced ~150ms that calls `resizeCanvas()`, and clear the pending debounce timer in the effect cleanup.

## 3. Draw loop

- [x] 3.1 Implement `draw()`: fade the previous frame with `globalCompositeOperation = 'destination-out'` and `fillRect` at `rgba(0,0,0,FADE_ALPHA)`, restore `'source-over'`, then draw one random character per column at full alpha in `colorRef.current`.
- [x] 3.2 Advance each column's head by its speed each draw; when a head passes the canvas height, wrap it to a randomized negative offset so the strips never settle into a visible repeating pattern.
- [x] 3.3 Implement the throttled loop: schedule the next frame first, then early-return when `now - lastRef.current < FRAME_MS`, otherwise update `lastRef.current` and call `draw()`. Use `requestAnimationFrame` only — no `setInterval`.
- [x] 3.4 Keep the rAF handle in a ref, and have `start()` / `stop()` helpers guard against scheduling a second loop while one is already pending.

## 4. Visibility and teardown

- [x] 4.1 Add a `visibilitychange` listener: on `hidden`, cancel the pending frame and null the handle; on `visible`, reset `lastRef.current` to the current timestamp and restart the loop.
- [x] 4.2 In the effect cleanup, cancel the pending animation frame, null the handle, and detach the `resize` and `visibilitychange` listeners — verify no callback or draw for the layer can run after unmount.
- [x] 4.3 Confirm the effect is idempotent under React StrictMode's development double-invocation: exactly one loop per canvas after mount, with no doubled fall speed in dev.

## 5. Theme wiring

- [x] 5.1 Read `theme` from `useTheme()` (`client/src/context/AppContext.jsx`) and map it through `ACCENT_BY_THEME`. Do not read `--accent` from CSS — `index.css` defines it as `#aa3bff` purple from a leftover template palette.
- [x] 5.2 Store the resolved accent in a ref updated by its own small effect, and read `colorRef.current` inside `draw()`, so `theme` is not a dependency of the animation effect and toggling never restarts the loop or resets column positions.

## 6. Accessibility

- [x] 6.1 Set `aria-hidden="true"` on the canvas and give it no text content, label, or `role`.
- [x] 6.2 Confirm the canvas is not focusable and does not appear in the accessibility tree.

## 7. Integration in the app shell

- [x] 7.1 In `client/src/App.jsx`, render `<MatrixRain side="left" />` and `<MatrixRain side="right" />` as the first children inside `AppProvider`.
- [x] 7.2 Wrap the existing children (`Nav` through `Footer`, including the `#contacto` div) in `<div className="relative z-10 flex flex-1 flex-col">` — the flex classes restore the layout role those elements had as direct flex children of `#root` (`display: flex; flex-direction: column; min-height: 100svh`).
- [x] 7.3 Verify `Nav`'s `sticky top-0 z-50` still sticks correctly inside the new wrapper, and that the footer still sits at the bottom on a short-content viewport.

## 8. Verification

- [x] 8.1 In the browser at ≥1280px: rain is visible in both gutters, symmetric, confined outside the app column, and never paints over `#root`'s `border-inline`.
- [x] 8.2 Resize across the 1280px threshold in both directions and confirm the canvases are added to and removed from the DOM (not merely hidden), and that strip widths track the gutter when resizing above the threshold.
- [x] 8.3 Toggle the theme and confirm the rain recolors to the active accent without restarting or resetting the columns.
- [x] 8.4 Enable OS reduced-motion, reload, and confirm no canvas exists in the DOM.
- [ ] 8.5 Background the tab, then return, and confirm via DevTools performance profiling that no animation work is scheduled while hidden and that it resumes cleanly.
- [x] 8.6 Confirm text remains fully legible and clickable over the strips' area, and that the effect never intercepts pointer events.
- [x] 8.7 Run `npm run lint`, `npm run format:check`, and `npm run build` in `client/` and confirm all pass.
