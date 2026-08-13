import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { i18n } = useTranslation()
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState(i18n.language?.slice(0, 2) || 'es')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    i18n.changeLanguage(lang)
  }, [lang, i18n])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
      lang,
      toggleLang: () => setLang((current) => (current === 'es' ? 'en' : 'es')),
    }),
    [theme, lang],
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
