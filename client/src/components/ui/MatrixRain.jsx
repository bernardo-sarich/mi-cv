import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../context/AppContext.jsx'

// Mirrors `#root { width: 1126px }` in src/index.css — the centered app column
// the strips must stay clear of. If that rule changes, change this with it.
const APP_COLUMN_WIDTH = 1126
const MIN_VIEWPORT = 1280
const FONT_SIZE = 14
const FRAME_MS = 1000 / 18
const FADE_ALPHA = 0.08
const LAYER_OPACITY = 0.31

// Mirrors the `accent` / `dark-accent` tokens in tailwind.config.js. Not read
// from CSS: index.css defines `--accent` as #aa3bff from a leftover template
// palette, unrelated to the site's green accent.
const ACCENT_BY_THEME = { dark: '#3ddc84', light: '#19804b' }

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]<>/\\|=+*-#$%&@'

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (event) => setMatches(event.matches)

    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

// Measured from clientWidth rather than a CSS `calc(100vw - ...)`: 100vw
// includes the scrollbar while #root centers within the content box, which
// would make the two strips asymmetric.
function measureGutter() {
  return Math.max(0, Math.floor((document.documentElement.clientWidth - APP_COLUMN_WIDTH) / 2))
}

export default function MatrixRain({ side }) {
  const canvasRef = useRef(null)
  const colorRef = useRef(ACCENT_BY_THEME.dark)
  const { theme } = useTheme()

  const isWide = useMediaQuery(`(min-width: ${MIN_VIEWPORT}px)`)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const enabled = isWide && !prefersReducedMotion

  // Kept in a ref so the draw loop picks up the new accent on its next frame.
  // As an effect dependency it would tear down and rebuild the loop on every
  // toggle, visibly restarting the rain.
  useEffect(() => {
    colorRef.current = ACCENT_BY_THEME[theme] ?? ACCENT_BY_THEME.dark
  }, [theme])

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    // All loop state is local to this effect invocation, so StrictMode's
    // double-mount gets two fully independent loops and the first cleanup
    // stops the first one outright — a shared ref would let them race.
    let columns = []
    let width = 0
    let height = 0
    let rafId = null
    let lastDraw = 0
    let resizeTimer = null

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = measureGutter()
      height = window.innerHeight

      canvas.style.width = `${width}px`
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))

      // Resizing the backing store resets every context property.
      ctx.scale(dpr, dpr)
      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', ui-monospace, monospace`
      ctx.textBaseline = 'top'

      columns = Array.from({ length: Math.floor(width / FONT_SIZE) }, () => ({
        y: -Math.random() * height,
        speed: FONT_SIZE * (0.4 + Math.random() * 0.25),
        row: null,
      }))
    }

    function draw() {
      // Erase instead of painting a background-colored rect, so the canvas
      // stays transparent and the page background shows through untouched.
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = `rgba(0, 0, 0, ${FADE_ALPHA})`
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = colorRef.current

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i]
        column.y += column.speed

        if (column.y > height) {
          // Randomized offset above the top so columns never re-sync into a
          // visible repeating pattern.
          column.y = -Math.random() * height * 0.5
          column.row = null
          continue
        }

        // One glyph per cell: redrawing the same cell would swap its character
        // every frame and read as flicker.
        const row = Math.floor(column.y / FONT_SIZE)
        if (row === column.row) continue
        column.row = row

        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx.fillText(char, i * FONT_SIZE, row * FONT_SIZE)
      }
    }

    function loop(now) {
      rafId = window.requestAnimationFrame(loop)
      if (now - lastDraw < FRAME_MS) return

      // Advance by a whole tick rather than resetting to `now`. Resetting
      // aliases against the refresh rate: when rAF fires just under FRAME_MS
      // apart, every other frame is rejected and the effect runs at half the
      // intended rate. Re-anchor only after a real gap (tab resume, stall).
      lastDraw += FRAME_MS
      if (now - lastDraw > FRAME_MS) lastDraw = now

      draw()
    }

    function start() {
      if (rafId !== null) return
      lastDraw = performance.now()
      rafId = window.requestAnimationFrame(loop)
    }

    function stop() {
      if (rafId === null) return
      window.cancelAnimationFrame(rafId)
      rafId = null
    }

    function onResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resizeCanvas, 150)
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') stop()
      else start()
    }

    resizeCanvas()
    if (document.visibilityState === 'visible') start()

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      stop()
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        [side]: 0,
        width: measureGutter(),
        height: '100vh',
        pointerEvents: 'none',
        opacity: LAYER_OPACITY,
        zIndex: 0,
      }}
    />
  )
}
