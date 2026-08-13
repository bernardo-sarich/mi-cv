import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useLang } from '../../context/AppContext.jsx'

export default function LangToggle() {
  const { t } = useTranslation()
  const { lang, toggleLang } = useLang()
  const label = lang === 'es' ? t('lang.switchToEn') : t('lang.switchToEs')

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={label}
      className="inline-flex cursor-pointer items-center justify-center rounded-md border border-border dark:border-dark-border px-3 py-2 text-sm font-medium font-sans text-text dark:text-dark-text transition-colors hover:border-accent dark:hover:border-dark-accent hover:text-accent dark:hover:text-dark-accent"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={lang}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.175 }}
        >
          {lang === 'es' ? 'ES' : 'EN'}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
