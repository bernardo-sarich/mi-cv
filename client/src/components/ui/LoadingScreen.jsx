import { useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTypingEffect } from '../../hooks/useTypingEffect.js'

export default function LoadingScreen() {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const message = t('loading.cv')
  const typed = useTypingEffect(message, 35)
  const text = reduced ? message : typed

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-4 py-3 text-left font-mono text-sm">
        <div className="text-textDim dark:text-dark-textDim">$ loading</div>
        <div className="text-accent dark:text-dark-accent">
          <span className="whitespace-pre">{'  '}</span>
          {text}
          {!reduced && <span className="animate-blink inline-block w-2">▍</span>}
        </div>
        <div className="mt-2 text-xs text-textDim dark:text-dark-textDim">
          {'// '}
          {t('loading.hint')}
        </div>
      </div>
    </div>
  )
}
