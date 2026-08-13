const VARIANT_CLASSES = {
  primary:
    'bg-accent text-onAccent dark:bg-dark-accent dark:text-dark-onAccent border border-transparent',
  secondary:
    'bg-transparent text-text dark:text-dark-text border border-border dark:border-dark-border',
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium font-sans transition-colors ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
