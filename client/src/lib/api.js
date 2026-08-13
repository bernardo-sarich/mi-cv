import mockCVData from '../data/mock/cv-data.json'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export async function fetchCVData() {
  try {
    const response = await fetch(`${API_BASE}/cv`)
    if (!response.ok) throw new Error(`API responded with ${response.status}`)
    return await response.json()
  } catch {
    return mockCVData
  }
}
