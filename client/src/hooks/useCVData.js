import { useEffect, useState } from 'react'
import { useLang } from '../context/AppContext.jsx'
import { getCVData } from '../lib/api.js'

export function useCVData() {
  const { lang } = useLang()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getCVData(lang)
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [lang])

  return { data, loading, error }
}
