import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useScrollProgress } from '../../hooks/useScrollProgress.js'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import { useCVData } from '../../context/AppContext.jsx'
import SectionLabel from '../ui/SectionLabel.jsx'
import SectionTitle from '../ui/SectionTitle.jsx'

function getBulletContainerVariants(reduced) {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.12 },
    },
  }
}

function getBulletVariants(reduced) {
  return {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : undefined } },
  }
}

function Job({ job, index }) {
  const [ref, isVisible] = useScrollReveal(`experience-job-${index}`, {
    threshold: 0.2,
    rootMargin: '-35% 0px -35% 0px',
  })
  const reduced = useReducedMotion()
  const bulletContainerVariants = getBulletContainerVariants(reduced)
  const bulletVariants = getBulletVariants(reduced)

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reduced ? 0 : 0.5 }}
      className="grid gap-1 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-0"
    >
      <span className="pl-8 font-mono text-xs text-accent dark:text-dark-accent md:pl-0 md:pr-8 md:pt-1.5 md:text-right">
        {job.dates}
      </span>

      <div className="relative flex flex-col items-start gap-1 pl-8">
        {/* Sits on the rail: the rail is at the content column's left edge, and
            the dot is 10px wide, so -5px centers it. */}
        <span className="absolute left-[-5px] top-1.5 flex h-2.5 w-2.5">
          <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-accent dark:bg-dark-accent" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent dark:bg-dark-accent" />
        </span>

        <h3 className="text-lg font-semibold text-text dark:text-dark-text">
          {job.role} <span className="text-textDim dark:text-dark-textDim">· {job.company}</span>
        </h3>
        <motion.ul
          variants={bulletContainerVariants}
          initial="hidden"
          animate={isVisible ? 'show' : 'hidden'}
          className="mt-2 flex flex-col items-start gap-1.5"
        >
          {job.bullets.map((bullet) => (
            <motion.li
              key={bullet}
              variants={bulletVariants}
              className="text-sm text-textDim dark:text-dark-textDim"
            >
              {bullet}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.li>
  )
}

export default function Experience() {
  const { t } = useTranslation()
  const [progressRef, progress] = useScrollProgress()
  const { data } = useCVData()

  if (!data) return null

  return (
    <section id="experience" className="px-6 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <SectionLabel>{'<section id="experience">'}</SectionLabel>
        <SectionTitle>{t('experience.title')}</SectionTitle>

        {/* The rail sits at the left edge of the content column: flush left when
            the date stacks above on narrow viewports, and after the 10rem date
            column from md up. */}
        <div ref={progressRef} className="relative mt-12">
          <div className="absolute left-0 top-0 h-full border-l border-border dark:border-dark-border md:left-40" />
          <div
            className="absolute left-0 top-0 border-l-2 border-accent dark:border-dark-accent transition-[height] duration-150 ease-out md:left-40"
            style={{ height: `${progress}%` }}
          />

          <ul className="flex flex-col gap-12">
            {data.experience.map((job, index) => (
              <Job key={`${job.company}-${index}`} job={job} index={index} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
