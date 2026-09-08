import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fadeUp, viewportOnce } from '../../../constants/animations'
import { CONTACT_INFO } from '../../../constants/contactInfo'
import VipBespokeCta from '../../../components/ui/VipBespokeCta'
import ShowroomInfo from './ShowroomInfo'
import VipBespokeForm from './VipBespokeForm'
import { FaMapLocationDot, FaArrowLeft } from 'react-icons/fa6'
import type { SiteSettings } from '../../../types/database'

export interface ContactShowroomSectionProps {
  settings?: SiteSettings | null
}

export default function ContactShowroomSection({ settings }: ContactShowroomSectionProps) {
  const { t, i18n } = useTranslation('contact')
  const isEn = i18n.language?.startsWith('en')

  const primaryPhone = CONTACT_INFO.phone
  const secondaryPhone = CONTACT_INFO.vipLine
  const whatsappNum = CONTACT_INFO.whatsappRaw
  const address = isEn ? 'Riyadh / Industrial District / Al-Shifa Area' : CONTACT_INFO.address
  const email = CONTACT_INFO.email
  const googleMapsUrl = CONTACT_INFO.googleMapsUrl
  const mapsEmbedSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115949.33649557673!2d46.6752959!3d24.7135517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d48939b%3A0x62953e5e40a04910!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sar!2ssa!4v1709300000000!5m2!1sar!2ssa'

  return (
    <section 
      className="w-full space-y-10 sm:space-y-12" 
      aria-labelledby="contact-showroom-heading"
    >
      {/* 1. TOP BANNER: VIP BESPOKE SERVICE CTA */}
      <div className="w-full">
        <VipBespokeCta settings={settings} />
      </div>

      {/* 2. SECTION HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp} 
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6"
        >
          <div className="space-y-2 text-start">
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
              <FaMapLocationDot className="w-3.5 h-3.5" /> {t('section_badge')}
            </span>
            <h2 id="contact-showroom-heading" className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#F2EFE8]">
              {t('section_title')}
            </h2>
          </div>
          <a 
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#C4A070] hover:text-[#E5C9A3] flex items-center gap-1.5 transition-colors group self-start sm:self-auto"
          >
            <span>{t('google_maps_directions')}</span>
            <FaArrowLeft className="w-3 h-3 ltr:rotate-180 group-hover:ltr:translate-x-1 group-hover:rtl:translate-x-[-4px] transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* 3. SHOWROOM & MAP ROW */}
      <ShowroomInfo
        address={address}
        primaryPhone={primaryPhone}
        secondaryPhone={secondaryPhone}
        whatsappNum={whatsappNum}
        email={email}
        googleMapsUrl={googleMapsUrl}
        mapsEmbedSrc={mapsEmbedSrc}
        isEn={isEn}
      />

      {/* 4. LUXURY CONTACT FORM */}
      <VipBespokeForm
        whatsappNum={whatsappNum}
        isEn={isEn}
      />
    </section>
  )
}
