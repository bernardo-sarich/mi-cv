import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/AppContext.jsx'

export default function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const label = theme === 'light' ? t('theme.switchToDeveloperMode') : t('theme.switchToCorporateMode')
  const text = theme === 'light' ? t('theme.developerMode') : t('theme.corporateMode')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      className="inline-flex cursor-pointer items-center justify-center rounded-md border border-border dark:border-dark-border px-3 py-2 text-sm font-medium font-sans text-text dark:text-dark-text transition-colors hover:border-accent dark:hover:border-dark-accent hover:text-accent dark:hover:text-dark-accent"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.175 }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
