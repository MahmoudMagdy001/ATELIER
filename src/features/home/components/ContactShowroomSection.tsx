import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fadeUp, viewportOnce } from '../../../constants/animations'
import { CONTACT_INFO } from '../../../constants/contactInfo'
import { FaLocationDot, FaPhone, FaClock, FaWhatsapp, FaArrowUpRightFromSquare } from 'react-icons/fa6'
import type { SiteSettings } from '../../../types/database'

export interface ContactShowroomSectionProps {
  settings?: SiteSettings | null
}

export default function ContactShowroomSection({ settings: _settings }: ContactShowroomSectionProps) {
  const { t, i18n } = useTranslation('contact')
  const isEn = i18n.language?.startsWith('en')

  const primaryPhone = CONTACT_INFO.phone
  const secondaryPhone = CONTACT_INFO.vipLine
  const whatsappNum = CONTACT_INFO.whatsappRaw
  const address = isEn ? 'Riyadh / Industrial District / Al-Shifa Area' : CONTACT_INFO.address
  const googleMapsUrl = CONTACT_INFO.googleMapsUrl

  return (
    <section 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6" 
      aria-labelledby="contact-showroom-heading"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="rounded-3xl border border-[#C4A070]/25 bg-gradient-to-b from-[#1C1816]/90 to-[#141110]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#C4A070]/15">
          <div className="space-y-2 text-start">
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
              <FaLocationDot className="w-3.5 h-3.5" /> {t('section_badge')}
            </span>
            <h2 id="contact-showroom-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#F2EFE8]">
              {t('section_title')}
            </h2>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start lg:self-auto px-5 py-2.5 rounded-full border border-[#C4A070]/40 text-xs font-bold text-[#C4A070] hover:bg-[#C4A070] hover:text-[#141110] transition-all duration-300"
          >
            <span>{t('google_maps_directions')}</span>
            <FaArrowUpRightFromSquare className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-start">
          {/* Address */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C4A070] uppercase tracking-wider">
              <FaLocationDot className="w-3.5 h-3.5" />
              <span>{t('address_title')}</span>
            </div>
            <p className="text-sm text-[#F2EFE8] font-medium leading-relaxed">
              {address}
            </p>
            <p className="text-xs text-[#B3A9A3]">
              {t('address_desc')}
            </p>
          </div>

          {/* Working Hours */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C4A070] uppercase tracking-wider">
              <FaClock className="w-3.5 h-3.5" />
              <span>{t('hours_title')}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#F2EFE8]">
              <span className="text-[#B3A9A3]">{t('sat_thu')}:</span> {t('sat_thu_hours')}
            </p>
            <p className="text-xs sm:text-sm text-[#F2EFE8]">
              <span className="text-[#B3A9A3]">{t('fri')}:</span> {t('fri_hours')}
            </p>
          </div>

          {/* Contact & WhatsApp */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C4A070] uppercase tracking-wider">
              <FaPhone className="w-3.5 h-3.5" />
              <span>{t('contact_sales_title')}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono" dir="ltr">
              <a href={`tel:${primaryPhone.replace(/\s+/g, '')}`} className="text-[#C4A070] hover:underline">
                {primaryPhone}
              </a>
              {secondaryPhone && (
                <>
                  <span className="text-white/20">|</span>
                  <a href={`tel:${secondaryPhone.replace(/\s+/g, '')}`} className="text-[#C4A070] hover:underline">
                    {secondaryPhone}
                  </a>
                </>
              )}
            </div>
            <div>
              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#C4A070]/40 text-xs font-bold text-[#F2EFE8] hover:text-[#C4A070] transition-colors"
              >
                <FaWhatsapp className="w-3.5 h-3.5 text-[#C4A070]" />
                <span>{t('instant_whatsapp')}</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
