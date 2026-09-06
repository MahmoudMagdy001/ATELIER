import React from 'react'
import { FaLanguage, FaCheck, FaCircleExclamation } from 'react-icons/fa6'

export type AdminLocale = 'ar' | 'en'

interface AdminLanguageTabsProps {
  activeLocale: AdminLocale
  onChange: (locale: AdminLocale) => void
  hasEnglishContent?: boolean
  className?: string
}

export default function AdminLanguageTabs({
  activeLocale,
  onChange,
  hasEnglishContent = false,
  className = ''
}: AdminLanguageTabsProps) {
  return (
    <div className={`flex items-center justify-between p-1.5 rounded-2xl bg-[#141110] border border-[#C4A070]/20 ${className}`}>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange('ar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeLocale === 'ar'
              ? 'bg-[#C4A070] text-[#1C1816] shadow-md shadow-[#C4A070]/20 font-extrabold'
              : 'text-[#B3A9A3] hover:text-[#F2EFE8] hover:bg-white/5'
          }`}
        >
          <span>🇸🇦 العربية (الأساسية)</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('en')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeLocale === 'en'
              ? 'bg-[#C4A070] text-[#1C1816] shadow-md shadow-[#C4A070]/20 font-extrabold'
              : 'text-[#B3A9A3] hover:text-[#F2EFE8] hover:bg-white/5'
          }`}
        >
          <span>🇬🇧 English</span>
          {hasEnglishContent ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]" title="تم إدخال النص الإنجليزي">
              <FaCheck className="w-2.5 h-2.5" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px]" title="محتوى اختياري - في حال تركه فارغاً سيتم استخدام النص العربي كبديل">
              <FaCircleExclamation className="w-2.5 h-2.5" />
            </span>
          )}
        </button>
      </div>

      <div className="text-[11px] text-[#827771] hidden sm:flex items-center gap-1.5 px-3">
        <FaLanguage className="w-3.5 h-3.5 text-[#C4A070]" />
        <span>{activeLocale === 'ar' ? 'محتوى اللغة العربية' : 'English Content (Optional with Arabic fallback)'}</span>
      </div>
    </div>
  )
}
