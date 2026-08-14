const VARIANT_CLASSES = {
  primary:
    'bg-accent text-onAccent dark:bg-dark-accent dark:text-dark-onAccent border border-transparent hover:bg-accent/90 dark:hover:bg-dark-accent/90',
  secondary:
    'bg-transparent text-text dark:text-dark-text border border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent hover:bg-accentDim dark:hover:bg-dark-accentDim',
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  type = 'button',
  href,
  ...rest
}) {
  const classes = `inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium font-sans transition-colors ${VARIANT_CLASSES[variant]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
