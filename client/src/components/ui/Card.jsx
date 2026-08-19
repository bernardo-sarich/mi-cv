import { forwardRef } from 'react'

const Card = forwardRef(function Card({ children, className = '', ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={`rounded-xl border border-transparent dark:border-dark-border bg-surface dark:bg-dark-surface shadow-sm dark:shadow-none ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
})

export default Card
