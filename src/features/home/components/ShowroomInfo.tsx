import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fadeUp, viewportOnce } from '../../../constants/animations'
import { 
  FaLocationDot, 
  FaPhone, 
  FaClock, 
  FaWhatsapp, 
  FaEnvelope, 
  FaArrowUpRightFromSquare, 
  FaCopy, 
  FaCheck,
  FaRoute,
  FaHeadset
} from 'react-icons/fa6'

interface ShowroomInfoProps {
  address: string
  primaryPhone: string
  secondaryPhone?: string
  whatsappNum: string
  email: string
  googleMapsUrl: string
  mapsEmbedSrc: string
  isEn: boolean
}

export const ShowroomInfo: React.FC<ShowroomInfoProps> = ({
  address,
  primaryPhone,
  secondaryPhone,
  whatsappNum,
  email,
  googleMapsUrl,
  mapsEmbedSrc,
  isEn,
}) => {
  const { t } = useTranslation('contact')
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const phoneTimeoutRef = useRef<number | null>(null)
  const addressTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (phoneTimeoutRef.current) window.clearTimeout(phoneTimeoutRef.current)
      if (addressTimeoutRef.current) window.clearTimeout(addressTimeoutRef.current)
    }
  }, [])

  const handleCopyPhone = () => {
    if (!primaryPhone) return
    navigator.clipboard.writeText(primaryPhone)
    setCopiedPhone(true)
    if (phoneTimeoutRef.current) window.clearTimeout(phoneTimeoutRef.current)
    phoneTimeoutRef.current = window.setTimeout(() => setCopiedPhone(false), 2000)
  }

  const handleCopyAddress = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopiedAddress(true)
    if (addressTimeoutRef.current) window.clearTimeout(addressTimeoutRef.current)
    addressTimeoutRef.current = window.setTimeout(() => setCopiedAddress(false), 2000)
  }

  return (
    <div className="w-full px-3 sm:px-4 lg:px-6">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp} 
        className="flex flex-col lg:flex-row items-stretch gap-5 lg:gap-6 w-full"
      >
        {/* CONTACT CARDS COLUMN */}
        <div className="w-full lg:w-[380px] xl:w-[430px] shrink-0 flex flex-col justify-between gap-3 text-start">
          {/* 1. Address Card */}
          {address && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141110] border border-[#C4A070]/20 hover:border-[#C4A070]/50 transition-all duration-300 shadow-xl group">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C4A070]/15 border border-[#C4A070]/30 flex items-center justify-center text-[#C4A070] text-base shrink-0 group-hover:scale-105 transition-transform">
                  <FaLocationDot />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-bold text-[#C4A070] uppercase tracking-wider">{t('address_title')}</span>
                    <button 
                      onClick={handleCopyAddress}
                      type="button"
                      className="text-[10px] text-[#827771] hover:text-[#C4A070] flex items-center gap-1 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/5 focus-visible:ring-1 focus-visible:ring-[#C4A070] focus-visible:outline-none"
                      title={t('copy')}
                    >
                      {copiedAddress ? (
                        <>
                          <FaCheck className="w-2.5 h-2.5 text-[#C4A070]" />
                          <span className="text-[#C4A070]">{t('copied')}</span>
                        </>
                      ) : (
                        <>
                          <FaCopy className="w-2.5 h-2.5" />
                          <span>{t('copy')}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold font-serif text-[#F2EFE8] leading-snug">
                    {address}
                  </h3>
                  <p className="text-[10.5px] text-[#827771] leading-tight">
                    {t('address_desc')}
                  </p>
                  <div className="pt-1">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#C4A070] hover:text-[#E5C9A3] transition-colors"
                    >
                      <FaRoute className="w-2.5 h-2.5" />
                      <span>{t('google_maps_directions')}</span>
                      <FaArrowUpRightFromSquare className="w-2 h-2" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Phone Numbers & Direct Support */}
          {(primaryPhone || whatsappNum || email) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141110] border border-[#C4A070]/20 hover:border-[#C4A070]/50 transition-all duration-300 shadow-xl group">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C4A070]/15 border border-[#C4A070]/30 flex items-center justify-center text-[#C4A070] text-base shrink-0 group-hover:scale-105 transition-transform">
                  <FaPhone />
                </div>
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-bold text-[#C4A070] uppercase tracking-wider">{t('contact_sales_title')}</span>
                    {primaryPhone && (
                      <button 
                        onClick={handleCopyPhone}
                        type="button"
                        className="text-[10px] text-[#827771] hover:text-[#C4A070] flex items-center gap-1 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/5 focus-visible:ring-1 focus-visible:ring-[#C4A070] focus-visible:outline-none"
                        title={t('copy')}
                      >
                        {copiedPhone ? (
                          <>
                            <FaCheck className="w-2.5 h-2.5 text-[#C4A070]" />
                            <span className="text-[#C4A070]">{t('copied')}</span>
                          </>
                        ) : (
                          <>
                            <FaCopy className="w-2.5 h-2.5" />
                            <span>{t('copy')}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {/* Primary Phone */}
                    {primaryPhone && (
                      <a 
                        href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                        className="p-2 px-3 rounded-xl bg-[#1C1816] border border-white/5 hover:border-[#C4A070]/40 transition-all flex items-center justify-between group/num"
                      >
                        <div className="min-w-0">
                          <span className="text-[9.5px] text-[#827771] block leading-tight">{t('main_phone_label')}</span>
                          <span className="text-xs font-bold font-mono text-[#F2EFE8] group-hover/num:text-[#C4A070] transition-colors truncate block" dir="ltr">
                            {primaryPhone}
                          </span>
                        </div>
                        <span className="text-[9.5px] px-2 py-0.5 rounded bg-[#C4A070]/10 text-[#C4A070] font-bold shrink-0">
                          {t('call')}
                        </span>
                      </a>
                    )}

                    {/* VIP Projects Line if secondary exists */}
                    {secondaryPhone && (
                      <a 
                        href={`tel:${secondaryPhone.replace(/\s+/g, '')}`}
                        className="p-2 px-3 rounded-xl bg-[#1C1816] border border-white/5 hover:border-[#C4A070]/40 transition-all flex items-center justify-between group/num"
                      >
                        <div className="min-w-0">
                          <span className="text-[9.5px] text-[#827771] block leading-tight">{t('vip_phone_label')}</span>
                          <span className="text-xs font-bold font-mono text-[#F2EFE8] group-hover/num:text-[#C4A070] transition-colors truncate block" dir="ltr">
                            {secondaryPhone}
                          </span>
                        </div>
                        <span className="text-[9.5px] px-2 py-0.5 rounded bg-[#C4A070]/10 text-[#C4A070] font-bold shrink-0">
                          {t('direct')}
                        </span>
                      </a>
                    )}
                  </div>

                  {/* WhatsApp & Email Quick Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 pt-0.5">
                    {whatsappNum && (
                      <a
                        href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(isEn ? 'Hello S&I Atelier, I would like to inquire about bespoke designs and showroom visit' : 'مرحباً أتيليه، أود الاستفسار عن التصاميم وزيارة المعرض')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-[#C4A070]/15 border border-[#C4A070]/30 text-[#E3CAA9] hover:bg-[#C4A070] hover:text-[#1C1816] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5" />
                        <span>{t('instant_whatsapp')}</span>
                      </a>
                    )}

                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 text-[#B3A9A3] hover:text-[#F2EFE8] hover:border-[#C4A070]/30 text-[10.5px] font-medium flex items-center justify-center gap-1.5 transition-all truncate"
                      >
                        <FaEnvelope className="w-3 h-3 text-[#C4A070] shrink-0" />
                        <span className="font-mono truncate">{email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Working Hours Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141110] border border-[#C4A070]/20 hover:border-[#C4A070]/50 transition-all duration-300 shadow-xl group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C4A070]/15 border border-[#C4A070]/30 flex items-center justify-center text-[#C4A070] text-base shrink-0 group-hover:scale-105 transition-transform">
                <FaClock />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <span className="text-[10px] font-bold text-[#C4A070] uppercase tracking-wider">{t('hours_title')}</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-[#1C1816] border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between text-[#F2EFE8] font-bold text-[11px]">
                      <span>{t('sat_thu')}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4A070] animate-pulse" />
                    </div>
                    <p className="text-[#827771] text-[10px]">
                      {t('sat_thu_hours')}
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-[#1C1816] border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between text-[#F2EFE8] font-bold text-[11px]">
                      <span>{t('fri')}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4A070]" />
                    </div>
                    <p className="text-[#827771] text-[10px]">
                      {t('fri_hours')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#C4A070] pt-0.5">
                  <FaHeadset className="w-2.5 h-2.5 shrink-0" />
                  <span className="leading-tight">{t('vip_consultation_notice')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAP COLUMN */}
        <div className="flex-1 w-full flex flex-col">
          <div className="relative flex-1 min-h-[460px] lg:min-h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C4A070]/30 bg-[#141110] shadow-2xl flex flex-col group">
            {/* Top Luxury Bar */}
            <div className="p-3 px-4 sm:px-6 bg-[#141110]/95 backdrop-blur-md border-b border-[#C4A070]/20 flex items-center justify-between gap-3 z-10">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#C4A070] animate-ping" />
                <span className="text-xs font-bold font-serif text-[#F2EFE8] truncate">
                  {t('showroom_bar_title')}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-[#C4A070] hover:bg-[#E5C9A3] text-[#1C1816] text-[11px] font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                >
                  <span>{t('open_maps')}</span>
                  <FaArrowUpRightFromSquare className="w-2 h-2" />
                </a>
              </div>
            </div>

            {/* Google Map Embed Iframe */}
            <div className="relative flex-1 w-full h-full min-h-[380px]">
              <iframe
                title={t('showroom_bar_title')}
                src={mapsEmbedSrc}
                className="absolute inset-0 w-full h-full border-0 transition-opacity duration-300 brightness-90 contrast-105 hover:brightness-100"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Map Bottom Information Footer */}
            <div className="p-3 px-4 sm:px-6 bg-[#141110]/95 backdrop-blur-md border-t border-[#C4A070]/20 flex items-center justify-between gap-3 text-xs z-10">
              <div className="flex items-center gap-2 min-w-0">
                <FaLocationDot className="text-[#C4A070] w-3.5 h-3.5 shrink-0" />
                <span className="text-[#827771] text-[11px] truncate">
                  {address}
                </span>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#C4A070] hover:text-[#E5C9A3] shrink-0 flex items-center gap-1 transition-colors"
              >
                <span>{t('get_directions')}</span>
                <FaRoute className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ShowroomInfo
