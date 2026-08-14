import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getCVData } from '../lib/api.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { i18n } = useTranslation()
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState(i18n.language?.slice(0, 2) || 'es')
  const [cvData, setCvData] = useState(null)
  const [cvLoading, setCvLoading] = useState(true)
  const [cvError, setCvError] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    i18n.changeLanguage(lang)
  }, [lang, i18n])

  useEffect(() => {
    let cancelled = false
    setCvLoading(true)

    getCVData(lang)
      .then((result) => {
        if (!cancelled) setCvData(result)
      })
      .catch((err) => {
        if (!cancelled) setCvError(err)
      })
      .finally(() => {
        if (!cancelled) setCvLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [lang])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
      lang,
      toggleLang: () => setLang((current) => (current === 'es' ? 'en' : 'es')),
      cvData,
      cvLoading,
      cvError,
    }),
    [theme, lang, cvData, cvLoading, cvError],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

export function useTheme() {
  const { theme, toggleTheme } = useAppContext()
  return { theme, toggleTheme }
}

export function useLang() {
  const { lang, toggleLang } = useAppContext()
  return { lang, toggleLang }
}

export function useCVData() {
  const { cvData, cvLoading, cvError } = useAppContext()
  return { data: cvData, loading: cvLoading, error: cvError }
}
