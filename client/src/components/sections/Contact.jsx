import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useCVData, useLang } from '../../context/AppContext.jsx'
import { CONTACT_INFO } from '../../data/contact-info.js'
import SectionLabel from '../ui/SectionLabel.jsx'
import SectionTitle from '../ui/SectionTitle.jsx'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.16.69-3.83-1.34-3.83-1.34-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.13 1.16a10.9 10.9 0 0 1 5.7 0c2.17-1.47 3.13-1.16 3.13-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.65 5.31-5.18 5.59.41.35.77 1.04.77 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  )
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

function MailIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2.5 6.5 9.5 7 9.5-7" />
    </svg>
  )
}

const stripProtocol = (url) => url.replace(/^https?:\/\//, '')

function buildContactLinks(contact) {
  return [
    {
      label: 'GitHub',
      value: stripProtocol(contact.github),
      href: contact.github,
      external: true,
      Icon: GitHubIcon,
    },
    {
      label: 'LinkedIn',
      value: stripProtocol(contact.linkedin),
      href: contact.linkedin,
      external: true,
      Icon: LinkedInIcon,
    },
    {
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      external: false,
      Icon: MailIcon,
    },
  ]
}

const EMPTY_FORM = { name: '', email: '', message: '' }
const EMPTY_ERRORS = { name: '', email: '', message: '' }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FIELD_ERROR_KEYS = {
  name: 'contact.errorRequired',
  email: 'contact.errorEmail',
  message: 'contact.errorRequired',
}

const FIELD_CLASSES =
  'w-full rounded-md border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-3 py-2 text-sm text-text dark:text-dark-text outline-none transition-colors focus:border-accent dark:focus:border-dark-accent'

const FIELD_ERROR_CLASSES = 'border-red-400 dark:border-red-500/70 focus:border-red-400 dark:focus:border-red-500/70'

const LABEL_CLASSES =
  'font-mono text-xs uppercase tracking-wide text-textDim dark:text-dark-textDim'

function FieldError({ message, reduced }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: reduced ? 0 : 0.15 }}
          className="font-mono text-xs text-red-500 dark:text-red-400"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function ContactLink({ link }) {
  const { Icon } = link

  return (
    <a
      href={link.href}
      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="block"
    >
      {/* Same glow values as ProjectCard in Projects.jsx — they duplicate the
          accent token on purpose; change them together. */}
      <Card className="flex items-center gap-3 p-4 transition-all duration-300 hover:border-accent dark:hover:border-dark-accent hover:shadow-[0_0_20px_rgba(31,157,92,0.35)] dark:hover:shadow-[0_0_20px_rgba(61,220,132,0.35)]">
        <span className="text-accent dark:text-dark-accent">
          <Icon />
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-sm text-text dark:text-dark-text">
            {link.label}
          </span>
          <span className="block truncate text-xs text-textDim dark:text-dark-textDim">
            {link.value}
          </span>
        </span>
      </Card>
    </a>
  )
}

export default function Contact() {
  const { t } = useTranslation()
  const { lang } = useLang()
  const { loading } = useCVData()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState(EMPTY_ERRORS)
  const [sent, setSent] = useState(false)
  const [status, setStatus] = useState('idle')
  const [generalError, setGeneralError] = useState('')
  const sentTimerRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    return () => clearTimeout(sentTimerRef.current)
  }, [])

  const validateField = (name, value) => {
    if (!value.trim()) return t('contact.errorRequired')
    if (name === 'email' && !EMAIL_PATTERN.test(value)) return t('contact.errorEmail')
    return ''
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: '' } : current))
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    setErrors((current) => ({ ...current, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {
      name: validateField('name', form.name),
      email: validateField('email', form.email),
      message: validateField('message', form.message),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setGeneralError('')
    setStatus('sending')

    try {
      const base = import.meta.env.VITE_API_BASE_URL || '/api'
      const response = await fetch(`${base}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (response.status === 201) {
        setForm(EMPTY_FORM)
        setErrors(EMPTY_ERRORS)
        clearTimeout(sentTimerRef.current)
        setSent(true)
        sentTimerRef.current = setTimeout(() => setSent(false), 4000)
      } else if (response.status === 400) {
        const problem = await response.json()
        const fieldErrors = { ...EMPTY_ERRORS }
        for (const field of Object.keys(FIELD_ERROR_KEYS)) {
          if (problem.errors?.[field]?.length) {
            fieldErrors[field] = t(FIELD_ERROR_KEYS[field])
          }
        }
        setErrors(fieldErrors)
      } else if (response.status === 429) {
        setGeneralError(t('contact.errorRateLimit'))
      } else {
        setGeneralError(t('contact.errorGeneric'))
      }
    } catch {
      setGeneralError(t('contact.errorGeneric'))
    } finally {
      setStatus('idle')
    }
  }

  if (loading) return null

  const contactLinks = buildContactLinks(CONTACT_INFO[lang])

  return (
    <section id="contacto" className="px-6 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionLabel>{'<section id="contacto">'}</SectionLabel>
        <SectionTitle>{t('contact.title')}</SectionTitle>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className={LABEL_CLASSES}>
                {t('contact.formName')}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${FIELD_CLASSES} ${errors.name ? FIELD_ERROR_CLASSES : ''}`}
              />
              <div id="contact-name-error">
                <FieldError message={errors.name} reduced={reduced} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className={LABEL_CLASSES}>
                {t('contact.formEmail')}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${FIELD_CLASSES} ${errors.email ? FIELD_ERROR_CLASSES : ''}`}
              />
              <div id="contact-email-error">
                <FieldError message={errors.email} reduced={reduced} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className={LABEL_CLASSES}>
                {t('contact.formMessage')}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                value={form.message}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${FIELD_CLASSES} resize-y ${errors.message ? FIELD_ERROR_CLASSES : ''}`}
              />
              <div id="contact-message-error">
                <FieldError message={errors.message} reduced={reduced} />
              </div>
            </div>

            <div>
              <Button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? t('contact.formSending') : t('contact.formSubmit')}
              </Button>
            </div>

            <FieldError message={generalError} reduced={reduced} />

            <AnimatePresence>
              {sent && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: reduced ? 0 : 0.25 }}
                  className="font-mono text-sm text-accent dark:text-dark-accent"
                >
                  {t('contact.formSent')}
                </motion.p>
              )}
            </AnimatePresence>
          </form>

          <div>
            <span className={LABEL_CLASSES}>{t('contact.linksTitle')}</span>
            <div className="mt-3 flex flex-col gap-3">
              {contactLinks.map((link) => (
                <ContactLink key={link.label} link={link} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
