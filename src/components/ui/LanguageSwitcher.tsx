import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaGlobe } from 'react-icons/fa6'

export interface LanguageSwitcherProps {
  className?: string
  compact?: boolean
}

export default function LanguageSwitcher({ className = '', compact = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')
  const currentLang = isEn ? 'en' : 'ar'

  const toggleLanguage = () => {
    const nextLang = currentLang === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(nextLang)
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={isEn ? 'التبديل إلى اللغة العربية' : 'Switch language to English'}
      className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 h-9 sm:h-10 rounded-full bg-[#181413] border border-[#C4A070]/40 hover:border-[#C4A070] text-[#F2EFE8] hover:text-[#C4A070] shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer active:scale-95 select-none focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none shrink-0 ${className}`}
      dir="ltr"
    >
      <FaGlobe className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-[#C4A070] shrink-0`} />
      <span className="text-xs font-bold font-sans tracking-wide text-[#C4A070]">
        {isEn ? 'عربي' : 'EN'}
      </span>
    </button>
  )
}
