import { useEffect, useRef, useState } from 'react'

export function useScrollProgress() {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
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
  }, [])

  return [ref, progress]
}
