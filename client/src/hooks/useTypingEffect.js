import { useEffect, useState } from 'react'

export function useTypingEffect(text, speedMs = 40) {
  const [output, setOutput] = useState('')

  useEffect(() => {
    setOutput('')
    if (!text) return

    let index = 0
    const interval = setInterval(() => {
      index += 1
      setOutput(text.slice(0, index))
      if (index >= text.length) clearInterval(interval)
    }, speedMs)

    return () => clearInterval(interval)
  }, [text, speedMs])

  return output
}
