import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGlobe } from 'react-icons/fa6'

export interface LanguageSwitcherProps {
  className?: string
  compact?: boolean
}

export default function LanguageSwitcher({ className = '', compact = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'ar'
  const [isExpanded, setIsExpanded] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 200)
  }

  const handleLanguageToggle = (lang: 'ar' | 'en') => {
    if (currentLang === lang) return
    i18n.changeLanguage(lang)
  }

  // Handle click outside to collapse on touch/mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Language Selector"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center rounded-full p-1 bg-[#141110] border border-[#C4A070]/30 hover:border-[#C4A070]/60 shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-colors duration-300 select-none ${className}`}
      dir="ltr"
    >
      {/* Globe Icon Button */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-label={currentLang === 'ar' ? 'تغيير اللغة' : 'Change Language'}
        aria-expanded={isExpanded}
        className={`flex items-center justify-center rounded-full text-[#C4A070] hover:text-[#E3CAA9] transition-all duration-300 cursor-pointer ${
          compact ? 'w-6 h-6' : 'w-7 h-7'
        }`}
      >
        <FaGlobe className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      </button>

      {/* Language Options Expanding Horizontally */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="lang-options"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden flex items-center gap-1 ps-1 pe-0.5 whitespace-nowrap"
          >
            {/* Arabic button */}
            <button
              type="button"
              onClick={() => handleLanguageToggle('ar')}
              aria-pressed={currentLang === 'ar'}
              aria-label="تغيير اللغة إلى العربية"
              className={`relative shrink-0 px-2.5 py-1 rounded-full text-xs font-bold transition-colors duration-300 cursor-pointer ${
                currentLang === 'ar'
                  ? 'text-[#1C1816]'
                  : 'text-[#B3A9A3] hover:text-[#F2EFE8]'
              }`}
            >
              {currentLang === 'ar' && (
                <motion.div
                  layoutId="active-lang-pill"
                  className="absolute inset-0 bg-gradient-to-r from-[#C4A070] to-[#E3CAA9] rounded-full shadow-[0_0_12px_rgba(196,160,112,0.6)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 font-sans tracking-wide">عربي</span>
            </button>

            {/* English button */}
            <button
              type="button"
              onClick={() => handleLanguageToggle('en')}
              aria-pressed={currentLang === 'en'}
              aria-label="Switch language to English"
              className={`relative shrink-0 px-2.5 py-1 rounded-full text-xs font-bold transition-colors duration-300 cursor-pointer ${
                currentLang === 'en'
                  ? 'text-[#1C1816]'
                  : 'text-[#B3A9A3] hover:text-[#F2EFE8]'
              }`}
            >
              {currentLang === 'en' && (
                <motion.div
                  layoutId="active-lang-pill"
                  className="absolute inset-0 bg-gradient-to-r from-[#C4A070] to-[#E3CAA9] rounded-full shadow-[0_0_12px_rgba(196,160,112,0.6)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 font-sans tracking-wide">EN</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

