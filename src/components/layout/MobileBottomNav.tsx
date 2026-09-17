import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  FaHouse, 
  FaCouch, 
  FaCompassDrafting, 
  FaWhatsapp
} from 'react-icons/fa6'
import { CONTACT_INFO } from '../../constants/contactInfo'

export default function MobileBottomNav() {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')
  const location = useLocation()

  const whatsappInquiryText = isEn
    ? 'Hello S&I Atelier, I would like to view your collections.'
    : 'مرحباً S&I Atelier، أود الاستفسار عن المجموعات والخدمات.'

  const navItems = [
    {
      to: '/',
      label: t('nav.home', 'الرئيسية'),
      icon: FaHouse,
      exact: true,
    },
    {
      to: '/limited-edition',
      label: t('nav.limitedEdition', 'المجموعات'),
      icon: FaCouch,
      exact: false,
    },
    {
      to: '/bespoke',
      label: t('nav.bespoke', 'تفصيل خاص'),
      icon: FaCompassDrafting,
      exact: false,
    },
  ]

  return (
    <nav 
      aria-label={isEn ? 'Mobile bottom navigation' : 'شريط التنقل السفلي'}
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#141110]/95 backdrop-blur-xl border-t border-[#C4A070]/20 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto items-center px-2">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.to 
            : location.pathname.startsWith(item.to)

          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={`relative flex flex-col items-center justify-center py-1 text-center transition-all duration-200 select-none ${
                isActive ? 'text-[#C4A070]' : 'text-[#B3A9A3] hover:text-[#F2EFE8]'
              }`}
            >
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                isActive ? 'bg-[#C4A070]/15 scale-105' : 'bg-transparent'
              }`}>
                <Icon className="w-4 h-4" />
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#C4A070]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight leading-tight mt-0.5 font-medium truncate max-w-full px-0.5 ${
                isActive ? 'font-bold text-[#C4A070]' : 'text-[#827771]'
              }`}>
                {item.label}
              </span>
            </NavLink>
          )
        })}

        {/* WhatsApp direct tab for quick communication */}
        <a
          href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(whatsappInquiryText)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="relative flex flex-col items-center justify-center py-1 text-center text-[#B3A9A3] hover:text-[#C4A070] transition-colors select-none"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#C4A070]/10 text-[#C4A070]">
            <FaWhatsapp className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight leading-tight mt-0.5 font-medium text-[#827771] truncate max-w-full px-0.5">
            {isEn ? 'Contact' : 'تواصل'}
          </span>
        </a>
      </div>
    </nav>
  )
}
