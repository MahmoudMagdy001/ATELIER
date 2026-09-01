import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { hoverScale, tapScale } from '../../constants/animations'

const MotionLink = motion.create(Link)

const variants = {
  primary:
    'bg-[#C5A880] text-white hover:bg-[#B59362] font-semibold shadow-md shadow-[#C5A880]/20',
  secondary:
    'border-2 border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-white font-semibold',
  outline:
    'border border-[#E6E1DC] text-[#5C544E] hover:border-[#C5A880] hover:text-[#14110F] font-medium bg-white',
  ghost:
    'text-[#5C544E] hover:bg-[#FAF8F5] font-medium',
  luxury:
    'bg-[#2B2623] text-[#FAF8F5] hover:bg-[#14110F] font-medium shadow-md',
}

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3 text-base rounded-2xl gap-2.5',
}

const Button = memo(function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  href,
  to,
  className = '',
  ...props
}) {
  const classes = `inline-flex items-center justify-center transition-all duration-200 cursor-pointer ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`

  const content = (
    <>
      {icon && iconPosition === 'start' && <span className="shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'end' && <span className="shrink-0">{icon}</span>}
    </>
  )

  const Component = to ? MotionLink : href ? motion.a : motion.button

  return (
    <Component
      className={classes}
      whileHover={hoverScale}
      whileTap={tapScale}
      {...(to ? { to } : {})}
      {...(href ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: href.startsWith('http') ? 'noopener noreferrer' : undefined } : {})}
      {...props}
    >
      {content}
    </Component>
  )
})

export default Button
