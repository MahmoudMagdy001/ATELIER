import React, { memo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { hoverScale, tapScale } from '../../constants/animations'

const MotionLink = motion.create(Link)

const variants = {
  primary:
    'gold-btn-primary font-bold shadow-lg shadow-[#C4A070]/25 rounded-full',
  secondary:
    'gold-btn-secondary font-semibold rounded-full',
  outline:
    'border border-[#C4A070]/40 text-[#C4A070] hover:bg-[#C4A070]/15 hover:border-[#C4A070] hover:text-white font-semibold rounded-full',
  ghost:
    'text-[#C4A070] hover:bg-white/5 hover:text-[#F2EFE8] font-medium rounded-full',
  luxury:
    'bg-[#1C1816] text-[#F2EFE8] border border-[#C4A070]/30 hover:border-[#C4A070] hover:bg-[#26211F] font-medium rounded-full shadow-md',
  admin:
    'bg-[#141110] text-white hover:bg-[#26211F] font-bold rounded-xl border border-white/10 shadow-sm',
  'admin-outline':
    'border border-[#E6E1DC] text-[#5C544E] hover:border-[#C4A070] hover:text-[#141110] font-medium bg-white rounded-xl',
}

const sizes = {
  sm: 'px-4 py-1.5 text-xs gap-1.5',
  md: 'px-6 py-2.5 text-xs sm:text-sm gap-2',
  lg: 'px-8 py-3.5 text-sm sm:text-base gap-2.5',
}

export type ButtonVariant = keyof typeof variants
export type ButtonSize = keyof typeof sizes

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
  href?: string
  to?: string
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
  target?: string
  rel?: string
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
  disabled,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[#141110] ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`

  const content = (
    <>
      {icon && iconPosition === 'start' && <span className="shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'end' && <span className="shrink-0">{icon}</span>}
    </>
  )

  if (to && !disabled) {
    return (
      <MotionLink
        to={to}
        className={classes}
        whileHover={hoverScale}
        whileTap={tapScale}
        {...(props as HTMLMotionProps<'a'>)}
      >
        {content}
      </MotionLink>
    )
  }

  if (href && !disabled) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={hoverScale}
        whileTap={tapScale}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...(props as HTMLMotionProps<'a'>)}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      className={classes}
      whileHover={disabled ? undefined : hoverScale}
      whileTap={disabled ? undefined : tapScale}
      disabled={disabled}
      {...props}
    >
      {content}
    </motion.button>
  )
})

export default Button
