import { forwardRef } from 'react'

const Card = forwardRef(function Card({ children, className = '', ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={`rounded-xl border border-border dark:border-dark-border bg-surface dark:bg-dark-surface ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
})

export default Card
