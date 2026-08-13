import { useCallback, useEffect, useState } from 'react'

export function useScrollProgress() {
  const [node, setNode] = useState(null)
  const [progress, setProgress] = useState(0)

  // A callback ref (rather than useRef) so the effect below re-runs once the
  // node actually mounts, even if that happens after this hook's own first
  // render (e.g. the section it's attached to renders null while its content
  // is still loading, then mounts the real node on a later render).
  const ref = useCallback((element) => setNode(element), [])

  useEffect(() => {
    if (!node) return

    const handle = () => {
      const rect = node.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const total = rect.height + viewportHeight
      const scrolled = viewportHeight - rect.top
      const pct = Math.min(100, Math.max(0, (scrolled / total) * 100))
      setProgress(pct)
    }

    handle()
    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle)
    return () => {
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [node])

  return [ref, progress]
}
