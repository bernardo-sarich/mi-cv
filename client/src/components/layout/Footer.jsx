import { useLang } from '../../context/AppContext.jsx'
import cvData from '../../data/mock/cv-data.json'

export default function Footer() {
  const { lang } = useLang()
  const firstName = (cvData[lang]?.name || '').split(' ')[0].toLowerCase()

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
