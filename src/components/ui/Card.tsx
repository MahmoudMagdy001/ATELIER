import React, { forwardRef } from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'glass' | 'fluted' | 'outline'
  interactive?: boolean
  children?: React.ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'surface',
  interactive = false,
  className = '',
  children,
  ...props
}, ref) => {
  const baseStyles = 'rounded-2xl transition-all duration-300 relative overflow-hidden'

  const variantStyles = {
    surface: 'bg-[#181514] border border-[#C4A070]/20 shadow-xl shadow-black/40',
    glass: 'bg-[#1C1816]/85 backdrop-blur-xl border border-[#C4A070]/25 shadow-2xl shadow-black/50',
    fluted: 'bg-[#141110] border border-[#C4A070]/20 fluted-panel shadow-xl shadow-black/40',
    outline: 'bg-transparent border border-[#C4A070]/30 hover:border-[#C4A070]/60'
  }

  const interactiveStyles = interactive
    ? 'hover:-translate-y-1 hover:border-[#C4A070]/50 hover:shadow-2xl hover:shadow-[#C4A070]/10 cursor-pointer'
    : ''

  return (
    <div
      ref={ref}
      className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card
