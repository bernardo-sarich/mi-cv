export default function Badge({ children, className = '', ...rest }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border dark:border-dark-border px-2.5 py-0.5 text-xs text-textDim dark:text-dark-textDim font-sans ${className}`}
      {...rest}
    >
      {children}
    </span>
  )
}
