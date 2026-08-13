import { useRef } from 'react'
import SectionLabel from '../ui/SectionLabel.jsx'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'

const PROJECTS = [
  {
    name: 'task-flow-api',
    description: 'API REST para gestión de tareas con autenticación JWT y colas de trabajo.',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    repoUrl: 'https://github.com/example/task-flow-api',
  },
  {
    name: 'metrics-dashboard',
    description: 'Dashboard en tiempo real para visualizar métricas de infraestructura.',
    stack: ['React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
    repoUrl: 'https://github.com/example/metrics-dashboard',
  },
  {
    name: 'data-pipeline',
    description: 'Pipeline de ingesta y transformación de datos en streaming.',
    stack: ['Python', 'Kafka', 'Docker'],
    repoUrl: 'https://github.com/example/data-pipeline',
  },
  {
    name: 'auth-service',
    description: 'Servicio de autenticación centralizado con soporte OAuth2 y SSO.',
    stack: ['Go', 'PostgreSQL', 'Kubernetes'],
    repoUrl: 'https://github.com/example/auth-service',
  },
]

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.16.69-3.83-1.34-3.83-1.34-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.13 1.16a10.9 10.9 0 0 1 5.7 0c2.17-1.47 3.13-1.16 3.13-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.65 5.31-5.18 5.59.41.35.77 1.04.77 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  )
}

function ProjectCard({ project }) {
  return (
    <Card
      className="w-[300px] flex-shrink-0 snap-start p-5 transition-all duration-300 hover:scale-[1.02] hover:border-accent dark:hover:border-dark-accent hover:shadow-[0_0_20px_rgba(31,157,92,0.35)] dark:hover:shadow-[0_0_20px_rgba(61,220,132,0.35)]"
    >
      <h3 className="font-mono text-lg font-bold text-accent dark:text-dark-accent">
        {project.name}
      </h3>
      <p className="mt-2 text-sm text-textDim dark:text-dark-textDim">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>

      <a
        href={project.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-text dark:text-dark-text hover:text-accent dark:hover:text-dark-accent"
      >
        <GitHubIcon />
        Ver repo
      </a>
    </Card>
  )
}

export default function Projects() {
  const scrollerRef = useRef(null)

  const scroll = (direction) => {
    scrollerRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' })
  }

  return (
    <section id="projects" className="px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative">
          <SectionLabel>{'<section id="projects">'}</SectionLabel>

          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Anterior"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border dark:border-dark-border text-text dark:text-dark-text hover:border-accent dark:hover:border-dark-accent"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Siguiente"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border dark:border-dark-border text-text dark:text-dark-text hover:border-accent dark:hover:border-dark-accent"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="no-scrollbar mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-3"
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
