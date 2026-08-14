import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCVData } from '../../context/AppContext.jsx'
import LangToggle from '../ui/LangToggle.jsx'
import ThemeToggle from '../ui/ThemeToggle.jsx'

const SECTIONS = [
  { id: 'sobre-mi', key: 'about' },
  { id: 'experience', key: 'experience' },
  { id: 'stack', key: 'skills' },
  { id: 'projects', key: 'projects' },
  { id: 'contacto', key: 'contact' },
]

export default function Nav() {
  const { t } = useTranslation()
  const { data } = useCVData()
  const [menuOpen, setMenuOpen] = useState(false)
  const firstName = (data?.name || '').split(' ')[0].toLowerCase()

  return (
    <header className="sticky top-0 z-50 border-b border-border dark:border-dark-border bg-navBg dark:bg-dark-navBg backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 sm:px-8">
        <a href="#sobre-mi" className="font-mono text-sm font-medium text-text dark:text-dark-text">
          <span className="opacity-40">~/</span>
          {firstName}
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="font-sans text-sm text-textDim dark:text-dark-textDim hover:text-text dark:hover:text-dark-text"
            >
              {t(`nav.${section.key}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
          <div className="md:hidden">
            <LangToggle />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="inline-flex cursor-pointer md:hidden items-center justify-center rounded-md border border-border dark:border-dark-border p-2 text-text dark:text-dark-text transition-colors hover:border-accent dark:hover:border-dark-accent hover:text-accent dark:hover:text-dark-accent"
          >
            <span className="sr-only">Menu</span>
            {menuOpen ? (
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border dark:border-dark-border px-6 py-3 sm:px-8 space-y-3">
          <nav className="flex flex-col gap-3">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setMenuOpen(false)}
                className="font-sans text-sm text-textDim dark:text-dark-textDim hover:text-text dark:hover:text-dark-text"
              >
                {t(`nav.${section.key}`)}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  )
}
