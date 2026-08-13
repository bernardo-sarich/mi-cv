export default function SectionLabel({ children, className = '', ...rest }) {
  return (
    <span
      className={`font-mono text-xs tracking-wide text-textDim dark:text-dark-textDim ${className}`}
      {...rest}
    >
      {children}
    </span>
  )
}
