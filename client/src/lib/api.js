import cvData from '../data/cv-data.json'

export async function getCVData(lang) {
  try {
    const base = import.meta.env.VITE_API_BASE_URL || '/api'
    const response = await fetch(`${base}/cv?lang=${lang}`)

    if (!response.ok) {
      throw new Error(`CV API responded with status ${response.status}`)
    }

    return await response.json()
  } catch {
    return cvData[lang]
  }
}
