// Animation variants for smooth page transitions and interactive elements (Matching Milaf Luxury System)

export const pageFadeSlide = {
  initial: { opacity: 0, y: 14 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.25, 1, 0.5, 1] 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { 
      duration: 0.25, 
      ease: 'easeIn' 
    } 
  }
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] }
  })
}

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.55, 
      delay: i * 0.08, 
      ease: [0.25, 1, 0.5, 1] 
    },
  }),
}

export const fadeDown = {
  hidden: { opacity: 0, y: -24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.55, 
      delay: i * 0.08, 
      ease: [0.25, 1, 0.5, 1] 
    },
  }),
}

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.5, 
      delay: i * 0.08, 
      ease: [0.25, 1, 0.5, 1] 
    },
  }),
}

export const staggerContainer = {
  hidden: {},
  visible: { 
    transition: { 
      staggerChildren: 0.09,
      delayChildren: 0.05
    } 
  },
}

export const heroStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
}

export const viewportOnce = { once: true, margin: '-50px' }
export const viewportOnce80 = { once: true, margin: '-80px' }

export const springHover = { type: 'spring', stiffness: 350, damping: 22 }
export const hoverScale = { scale: 1.03 }
export const tapScale = { scale: 0.97 }
export const hoverScaleLg = { scale: 1.06 }
export const tapScaleSm = { scale: 0.95 }
export const cardHover = { y: -6 }
