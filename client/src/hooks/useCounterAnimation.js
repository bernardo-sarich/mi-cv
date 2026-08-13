import { useEffect, useState } from 'react'

export function useCounterAnimation(target, durationMs = 1000, start = true) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return

    let startTime = null

    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / durationMs, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }

    const frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, durationMs, start])

  return value
}
