import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../../context/AppContext.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-md border border-border dark:border-dark-border px-3 py-2 text-sm font-medium font-sans text-text dark:text-dark-text"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.175 }}
        >
          {theme === 'dark' ? 'Dark' : 'Light'}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
