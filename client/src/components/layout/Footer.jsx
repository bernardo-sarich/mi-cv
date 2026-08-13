import { useCVData } from '../../hooks/useCVData.js'

export default function Footer() {
  const { data } = useCVData()
  const firstName = (data?.name || '').split(' ')[0].toLowerCase()

  return (
    <footer className="border-t border-border dark:border-dark-border py-6 text-center">
      <span className="font-mono text-sm text-textDim dark:text-dark-textDim">
        {'</'}
        {firstName}
        {'>'}
      </span>
    </footer>
  )
}
