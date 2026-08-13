export default function SectionLabel({ children, className = '', ...rest }) {
  return (
    <span
      className={`font-mono text-xs tracking-wide text-textDim dark:text-dark-textDim opacity-60 ${className}`}
      {...rest}
    >
      {children}
    </span>
  )
}
