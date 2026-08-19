import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCVData } from '../../context/AppContext.jsx'
import SectionLabel from '../ui/SectionLabel.jsx'
import SectionTitle from '../ui/SectionTitle.jsx'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.16.69-3.83-1.34-3.83-1.34-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.13 1.16a10.9 10.9 0 0 1 5.7 0c2.17-1.47 3.13-1.16 3.13-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.65 5.31-5.18 5.59.41.35.77 1.04.77 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  )
}

function ProjectCard({ project }) {
  const { t } = useTranslation()
  return (
    <Card className="w-[calc(100vw-3rem)] flex-shrink-0 snap-start p-6 transition-all duration-300 hover:scale-[1.02] hover:border-accent dark:hover:border-dark-accent hover:shadow-[0_0_20px_rgba(31,157,92,0.35)] dark:hover:shadow-[0_0_20px_rgba(61,220,132,0.35)] sm:w-[300px]">
      <h3 className="font-mono text-lg font-bold text-accent dark:text-dark-accent">
        {project.name}
      </h3>
      <p className="mt-2 text-sm text-textDim dark:text-dark-textDim">{project.desc}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>

      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-text dark:text-dark-text hover:text-accent dark:hover:text-dark-accent"
      >
        <GitHubIcon />
        {t('projects.viewRepo')}
      </a>
    </Card>
  )
}

// Keeps the "Anterior"/"Siguiente" buttons landing exactly on a snap point instead of
// approximating with scrollBy — an imprecise jump can rest scroll-snap on the wrong
// card, leaving the peek buffer that hides the next card eaten up on the wrong side.
// The card width is responsive (one full-width card on mobile, 300px from `sm` up), so
// the step is measured from the DOM instead of hardcoded, and the visible-card count
// used for the last page's max index is derived from how many steps fit the scroller.
//
// The hover-glow buffer around the first/last card is the scroller's own left/right
// padding (sm:px-5, zero on mobile where hover doesn't apply) rather than a spacer
// element — padding sits inside the scroller's box so overflow-x doesn't clip it, and
// unlike a spacer it doesn't introduce an extra flex `gap` on top of itself, so page 0
// and every later page land on a consistent, predictable offset.
const GAP = 16 // gap-4

function getCardStep(scroller) {
  const firstCard = scroller?.children[0]
  return firstCard ? firstCard.offsetWidth + GAP : 0
}

function getStartOffset(scroller) {
  return scroller ? parseFloat(getComputedStyle(scroller).paddingLeft) || 0 : 0
}

function getVisibleCards(scroller, step) {
  if (!scroller || !step) return 1
  return Math.max(1, Math.round(scroller.clientWidth / step))
}

export default function Projects() {
  const { t } = useTranslation()
  const scrollerRef = useRef(null)
  const { data } = useCVData()
  const [pageIndex, setPageIndex] = useState(0)

  const goToPage = (nextIndex) => {
    const scroller = scrollerRef.current
    const step = getCardStep(scroller)
    const visibleCards = getVisibleCards(scroller, step)
    const maxIndex = Math.max(0, (data?.projects.length ?? 0) - visibleCards)
    const clamped = Math.min(Math.max(nextIndex, 0), maxIndex)
    setPageIndex(clamped)
    scroller?.scrollTo({
      left: clamped === 0 ? 0 : getStartOffset(scroller) + clamped * step,
      behavior: 'smooth',
    })
  }

  if (!data) return null

  return (
    <section id="projects" className="px-6 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="relative">
          <SectionLabel>{'<section id="projects">'}</SectionLabel>
          <SectionTitle>{t('projects.title')}</SectionTitle>

          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 gap-2">
            <button
              type="button"
              onClick={() => goToPage(pageIndex - 1)}
              aria-label="Anterior"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border dark:border-dark-border text-text dark:text-dark-text transition-colors hover:border-accent dark:hover:border-dark-accent hover:text-accent dark:hover:text-dark-accent"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => goToPage(pageIndex + 1)}
              aria-label="Siguiente"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border dark:border-dark-border text-text dark:text-dark-text transition-colors hover:border-accent dark:hover:border-dark-accent hover:text-accent dark:hover:text-dark-accent"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="no-scrollbar mx-auto mt-12 flex max-w-[976px] gap-4 overflow-x-auto scroll-px-0 sm:scroll-px-5 sm:justify-center snap-x snap-mandatory scroll-smooth px-0 py-3 sm:px-5"
        >
          {data.projects.map((project, index) => (
            <ProjectCard key={`${project.name}-${index}`} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
