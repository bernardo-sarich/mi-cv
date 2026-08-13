import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import SectionLabel from '../ui/SectionLabel.jsx'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'

const CATEGORIES = [
  {
    name: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'Go', 'SQL'],
  },
  {
    name: 'Frameworks',
    items: ['React', 'Node.js', 'Express', 'Django', 'Tailwind CSS'],
  },
  {
    name: 'Infra',
    items: ['Docker', 'AWS', 'Kubernetes', 'GitHub Actions', 'Nginx'],
  },
  {
    name: 'Data',
    items: ['PostgreSQL', 'Redis', 'MongoDB', 'Kafka'],
  },
]

const badgeContainerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
}

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { ease: [0.34, 1.56, 0.64, 1], duration: 0.4 },
  },
}

function SkillCategory({ category, index }) {
  const [ref, isVisible] = useScrollReveal(`skills-category-${index}`, { threshold: 0.2 })

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
  return (
    <section id="stack" className="px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <SectionLabel>{'<section id="stack">'}</SectionLabel>

        <div
          className="mt-8 grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
        >
          {CATEGORIES.map((category, index) => (
            <SkillCategory key={category.name} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
