import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTypingEffect } from '../../hooks/useTypingEffect.js'
import { useCounterAnimation } from '../../hooks/useCounterAnimation.js'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import { useCVData, useLang } from '../../context/AppContext.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'

function getContainerVariants(reduced) {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.08 },
    },
  }
}

function getBlockVariants(reduced) {
  return {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : undefined } },
  }
}

function Stat({ value, suffix, label, start }) {
  const count = useCounterAnimation(value, 1200, start)
  return (
    <Card className="flex flex-col items-start gap-1 px-5 py-4">
      <span className="font-mono text-2xl font-bold text-accent dark:text-dark-accent">
        {count}
        {suffix}
      </span>
      <span className="text-sm text-textDim dark:text-dark-textDim">{label}</span>
    </Card>
  )
}

export default function Hero() {
  const { t } = useTranslation()
  const typed = useTypingEffect('who-am-i', 70)
  const { data } = useCVData()
  const typedBio = useTypingEffect(data?.bio, 22.5)
  const [statsRef, statsVisible] = useScrollReveal('hero-stats', {
    threshold: 0.3,
  })
  const { lang } = useLang()
  const reduced = useReducedMotion()
  const containerVariants = getContainerVariants(reduced)
  const blockVariants = getBlockVariants(reduced)

  const scrollToProjects = () => {
    document
      .getElementById('projects')
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  const cvFileName = lang === 'es' ? 'Bernardo_Sarich_CV_ES.pdf' : 'Bernardo_Sarich_CV_EN.pdf'

  if (!data) return null

  return (
    <section id="sobre-mi" className="px-6 py-8 sm:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:gap-12"
      >
        <motion.div variants={containerVariants} className="flex flex-col items-start gap-6">
          <motion.div variants={blockVariants} className="flex flex-col items-start gap-3">
            <h1 className="font-mono text-4xl font-bold text-text dark:text-dark-text md:text-5xl">
              {data.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="w-fit bg-accentDim dark:bg-dark-accentDim text-accent dark:text-dark-accent border-transparent">
                {data.title}
              </Badge>
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-accent dark:bg-dark-accent" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent dark:bg-dark-accent" />
                </span>
                <span className="text-sm text-textDim dark:text-dark-textDim">online</span>
              </span>
            </div>
          </motion.div>

          <motion.p
            variants={blockVariants}
            className="max-w-prose text-textDim dark:text-dark-textDim"
          >
            {reduced ? data.bio : typedBio}
          </motion.p>
        </motion.div>

        <motion.div variants={containerVariants} className="flex flex-col gap-6">
          <motion.div
            variants={blockVariants}
            className="w-full rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-4 py-3 text-left font-mono text-sm"
          >
            <div className="text-textDim dark:text-dark-textDim">$ who-am-i</div>
            <div className="text-accent dark:text-dark-accent">
              <span className="whitespace-pre">{'  '}</span>
              {typed}
              <span className="animate-blink inline-block w-2">▍</span>
            </div>
          </motion.div>

          <motion.div variants={blockVariants} className="flex flex-wrap items-stretch gap-4">
            <div ref={statsRef} className="flex flex-wrap gap-8">
              {data.stats.map((stat) => (
                <Stat key={stat.label} {...stat} start={statsVisible} />
              ))}
            </div>

            <div className="flex min-w-[11rem] flex-1 flex-col gap-3">
              <Button
                variant="primary"
                className="w-full flex-1"
                href={`/cv/${cvFileName}`}
                download={cvFileName}
              >
                {t('hero.downloadCv')}
              </Button>
              <Button variant="secondary" className="w-full flex-1" onClick={scrollToProjects}>
                {t('hero.viewProjects')} →
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
