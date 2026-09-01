export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const viewportOnce = { once: true, margin: '-50px' }
export const viewportOnce80 = { once: true, margin: '-80px' }

export const springHover = { type: 'spring', stiffness: 300, damping: 20 }
export const hoverScale = { scale: 1.03 }
export const tapScale = { scale: 0.97 }
export const hoverScaleLg = { scale: 1.1 }
export const tapScaleSm = { scale: 0.95 }
