import cvData from '../data/cv-data.json'

const FETCH_TIMEOUT_MS = 18000

export async function getCVData(lang, signal) {
  const timeoutController = new AbortController()
  const onExternalAbort = () => timeoutController.abort()

  if (signal) {
    if (signal.aborted) timeoutController.abort()
    else signal.addEventListener('abort', onExternalAbort)
  }

  const timeoutId = setTimeout(() => timeoutController.abort(), FETCH_TIMEOUT_MS)

  try {
    const base = import.meta.env.VITE_API_BASE_URL || '/api'
    const response = await fetch(`${base}/cv?lang=${lang}`, { signal: timeoutController.signal })

    if (!response.ok) {
      throw new Error(`CV API responded with status ${response.status}`)
    }

    return await response.json()
  } catch {
    return cvData[lang]
  } finally {
    clearTimeout(timeoutId)
    signal?.removeEventListener('abort', onExternalAbort)
  }
}
