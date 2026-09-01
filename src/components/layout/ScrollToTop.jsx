import { useState, memo } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { FaArrowUp } from 'react-icons/fa6'

const ScrollToTop = memo(function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  
  // High-performance scroll tracking via framer-motion
  const { scrollY, scrollYProgress } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const shouldShow = latest > 250
    if (shouldShow !== isVisible) {
      setIsVisible(shouldShow)
    }
  })

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-13 h-13 rounded-full group cursor-pointer select-none shadow-2xl"
          aria-label="الرجوع للأعلى"
        >
          {/* Scroll Progress Indicator Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 60 60">
            {/* Background Track Circle */}
            <circle
              cx="30"
              cy="30"
              r="26"
              className="stroke-[#C4A070]/20"
              strokeWidth="2.5"
              fill="transparent"
            />
            {/* Dynamic Progress Fill Circle */}
            <motion.circle
              cx="30"
              cy="30"
              r="26"
              className="stroke-[#C4A070]"
              strokeWidth="3"
              fill="transparent"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>

          {/* Inner Rounded Button */}
          <div className="flex items-center justify-center w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#1C1816] to-[#141110] text-[#F2EFE8] shadow-lg border border-[#C4A070]/30 group-hover:border-[#C4A070] group-hover:bg-[#141110] transition-all duration-300">
            <motion.div
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex items-center justify-center"
            >
              <FaArrowUp className="w-4 h-4 text-[#C4A070] group-hover:text-[#E3CAA9] transition-colors duration-300" />
            </motion.div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
})

export default ScrollToTop
