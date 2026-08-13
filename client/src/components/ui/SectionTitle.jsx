export default function SectionTitle({ children, className = '', ...rest }) {
  return (
    <h2
      className={`mt-1 text-xl font-bold tracking-tight text-text dark:text-dark-text md:text-2xl ${className}`}
      {...rest}
    >
      {children}
    </h2>
  )
}
