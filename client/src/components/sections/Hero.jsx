import { motion } from 'framer-motion'
import { useTypingEffect } from '../../hooks/useTypingEffect.js'
import { useCounterAnimation } from '../../hooks/useCounterAnimation.js'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'

const STATS = [{ value: 7, suffix: '+', label: 'años de experiencia' }]

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const blockVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

function Stat({ value, suffix, label, start }) {
  const count = useCounterAnimation(value, 1200, start)
  return (
    <div className="flex flex-col items-start">
      <span className="font-mono text-2xl font-bold text-text dark:text-dark-text">
        {count}
        {suffix}
      </span>
      <span className="text-sm text-textDim dark:text-dark-textDim">
        {label}
      </span>
    </div>
  )
}

export default function Hero() {
  const typed = useTypingEffect('who-am-i', 70)
  const [statsRef, statsVisible] = useScrollReveal('hero-stats', {
    threshold: 0.3,
  })

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="sobre-mi" className="px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:gap-12"
      >
        <motion.div
          variants={containerVariants}
          className="flex flex-col items-start gap-6"
        >
          <motion.div
            variants={blockVariants}
            className="flex flex-col items-start gap-3"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-mono text-4xl font-bold text-text dark:text-dark-text md:text-5xl">
                Bernardo Sarich
              </h1>
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-accent dark:bg-dark-accent" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent dark:bg-dark-accent" />
                </span>
                <span className="text-sm text-textDim dark:text-dark-textDim">
                  online
                </span>
              </span>
            </div>
            <Badge className="w-fit bg-accentDim dark:bg-dark-accentDim text-accent dark:text-dark-accent border-transparent">
              Backend Developer
            </Badge>
          </motion.div>

          <motion.p
            variants={blockVariants}
            className="max-w-prose text-textDim dark:text-dark-textDim"
          >
            Desarrollador de software especializado en backend, construyendo
            sistemas robustos y escalables. Placeholder — se reemplaza con datos
            reales en la capa de datos.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="flex flex-col gap-6"
        >
          <motion.div
            variants={blockVariants}
            className="w-full rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-4 py-3 text-left font-mono text-sm"
          >
            <div className="text-textDim dark:text-dark-textDim">
              $ who-am-i
            </div>
            <div className="text-accent dark:text-dark-accent">
              <span className="whitespace-pre">{'  '}</span>
              {typed}
              <span className="animate-blink inline-block w-2">▍</span>
            </div>
          </motion.div>

          <motion.div
            variants={blockVariants}
            className="flex flex-wrap items-start gap-x-8 gap-y-6"
          >
            <div ref={statsRef} className="flex flex-wrap gap-8">
              {STATS.map((stat) => (
                <Stat key={stat.label} {...stat} start={statsVisible} />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="primary">Descargar CV</Button>
              <Button variant="secondary" onClick={scrollToProjects}>
                Ver proyectos →
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
