import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import { useCVData } from '../../hooks/useCVData.js'
import SectionLabel from '../ui/SectionLabel.jsx'
import SectionTitle from '../ui/SectionTitle.jsx'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'

function getBadgeContainerVariants(reduced) {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.06 },
    },
  }
}

function getBadgeVariants(reduced) {
  return {
    hidden: { opacity: 0, scale: 0.7 },
    show: {
      opacity: 1,
      scale: 1,
      transition: reduced ? { duration: 0 } : { ease: [0.34, 1.56, 0.64, 1], duration: 0.4 },
    },
  }
}

function SkillCategory({ category, index }) {
  const [ref, isVisible] = useScrollReveal(`skills-category-${index}`, {
    threshold: 0.2,
  })
  const reduced = useReducedMotion()
  const badgeContainerVariants = getBadgeContainerVariants(reduced)
  const badgeVariants = getBadgeVariants(reduced)

  return (
    <Card ref={ref} className="p-5">
      <span className="font-mono text-xs uppercase tracking-wide text-textDim dark:text-dark-textDim">
        {category.name}
      </span>
      <motion.div
        variants={badgeContainerVariants}
        initial="hidden"
        animate={isVisible ? 'show' : 'hidden'}
        className="mt-3 flex flex-wrap gap-2"
      >
        {category.items.map((item) => (
          <motion.div key={item} variants={badgeVariants}>
            <Badge>{item}</Badge>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  )
}

export default function Skills() {
  const { t } = useTranslation()
  const { data } = useCVData()

  if (!data) return null

  return (
    <section id="stack" className="px-6 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionLabel>{'<section id="stack">'}</SectionLabel>
        <SectionTitle>{t('skills.title')}</SectionTitle>

        <div
          className="mt-8 grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          {data.skills.map((category, index) => (
            <SkillCategory key={category.name} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
