import { useEffect, useRef, useState } from 'react'

// `key` is a debugging identity only — each call already gets its own
// ref/state/observer, so it does not affect isolation or caching.
export function useScrollReveal(key, options = { threshold: 0.2 }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, options)

    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return [ref, isVisible]
}
