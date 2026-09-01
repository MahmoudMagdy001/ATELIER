import { memo } from 'react'

export const Card = memo(function Card({
  children,
  className = '',
  hover = true,
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E6E1DC] overflow-hidden transition-all duration-300 ${
        hover ? 'hover:shadow-lg hover:border-[#C5A880]/50' : 'shadow-sm'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})

export default Card
