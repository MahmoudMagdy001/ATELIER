import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'outline' | 'charcoal' | 'sale' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'gold',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full tracking-wide transition-colors uppercase'

  const sizeStyles = {
    sm: 'text-[10px] px-2.5 py-0.5 font-bold',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5'
  }

  const variantStyles = {
    gold: 'bg-[#C4A070] text-[#141110] shadow-sm shadow-[#C4A070]/20 font-bold',
    outline: 'border border-[#C4A070]/40 text-[#C4A070] bg-[#C4A070]/10',
    charcoal: 'bg-[#26211F] text-[#DEDAD6] border border-white/10',
    sale: 'bg-red-500/15 text-red-400 border border-red-500/30 font-bold',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
  }

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
