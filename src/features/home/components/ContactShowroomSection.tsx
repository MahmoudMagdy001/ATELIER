import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fadeUp, staggerContainer, viewportOnce, hoverScale, tapScale, springHover } from '../../../constants/animations'
import { CONTACT_INFO } from '../../../constants/contactInfo'
import VipBespokeCta from '../../../components/ui/VipBespokeCta'
import { supabase } from '../../../lib/supabase'
import { 
  FaLocationDot, 
  FaPhone, 
  FaClock, 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapLocationDot, 
  FaArrowUpRightFromSquare, 
  FaCopy, 
  FaCheck,
  FaRoute,
  FaHeadset,
  FaArrowLeft,
  FaPaperPlane,
  FaUser,
  FaPen,
  FaCircleCheck,
  FaSpinner,
  FaCalendarDays
} from 'react-icons/fa6'

import type { SiteSettings } from '../../../types/database'

export interface ContactShowroomSectionProps {
  settings?: SiteSettings | null
}

export default function ContactShowroomSection({ settings }: ContactShowroomSectionProps) {
  const { t, i18n } = useTranslation('contact')
  const isEn = i18n.language?.startsWith('en')

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

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: 'fullVilla',
    preferredTime: 'morning',
    message: ''
  })
  const [formStatus, setFormStatus] = useState<{
    submitting: boolean
    submitted: boolean
    error: string | null
  }>({
    submitting: false,
    submitted: false,
    error: null
  })

  const primaryPhone = CONTACT_INFO.phone
  const secondaryPhone = CONTACT_INFO.vipLine
  const whatsappNum = CONTACT_INFO.whatsappRaw
  const address = isEn ? 'Riyadh / Industrial District / Al-Shifa Area' : CONTACT_INFO.address
  const email = CONTACT_INFO.email
  const googleMapsUrl = CONTACT_INFO.googleMapsUrl
  const mapsEmbedSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115949.33649557673!2d46.6752959!3d24.7135517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d48939b%3A0x62953e5e40a04910!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sar!2ssa!4v1709300000000!5m2!1sar!2ssa'

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormStatus(prev => ({ ...prev, error: t('form.errorRequired') }))
      return
    }

    setFormStatus({ submitting: true, submitted: false, error: null })

    try {
      // Attempt to save to Supabase inquiries / contact_messages table if available
      try {
        await supabase.from('inquiries').insert([{
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          service_type: formData.serviceType,
          preferred_time: formData.preferredTime,
          message: formData.message.trim(),
          created_at: new Date().toISOString()
        }])
      } catch (dbErr: unknown) {
        console.info('Inquiries table log:', (dbErr as Error)?.message)
      }

      setFormStatus({ submitting: false, submitted: true, error: null })
    } catch (_err) {
      setFormStatus({ submitting: false, submitted: false, error: t('form.errorGeneral') })
    }
  }

  const handleDirectWhatsApp = () => {
    const serviceLabel = t(`form.serviceOptions.${formData.serviceType}` as const, { defaultValue: formData.serviceType })
    const timeLabel = t(`form.timeOptions.${formData.preferredTime}` as const, { defaultValue: formData.preferredTime })
    const text = t('form.whatsappPayload', {
      name: formData.name || (isEn ? 'Not specified' : 'غير محدد'),
      phone: formData.phone || (isEn ? 'Not specified' : 'غير محدد'),
      serviceType: serviceLabel,
      preferredTime: timeLabel,
      message: formData.message || (isEn ? 'None' : 'لا يوجد')
    })
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleResetForm = () => {
    setFormData({
      name: '',
      phone: '',
      serviceType: 'fullVilla',
      preferredTime: 'morning',
      message: ''
    })
    setFormStatus({ submitting: false, submitted: false, error: null })
  }

  return (
    <section 
      className="w-full space-y-10 sm:space-y-12" 
      aria-labelledby="contact-showroom-heading"
    >
      {/* 1. TOP BANNER: VIP BESPOKE SERVICE CTA (Seamlessly Integrated in this Unified Section) */}
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

      {/* 3. ORIGINAL MAP & CONTACT CARDS ROW (Side-by-side exactly as originally designed) */}
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
                        className="text-[10px] text-[#827771] hover:text-[#C4A070] flex items-center gap-1 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/5"
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
                          className="text-[10px] text-[#827771] hover:text-[#C4A070] flex items-center gap-1 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/5"
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
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C4A070] animate-pulse"></span>
                      </div>
                      <p className="text-[#827771] text-[10px]">
                        {t('sat_thu_hours')}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-[#1C1816] border border-white/5 space-y-0.5">
                      <div className="flex items-center justify-between text-[#F2EFE8] font-bold text-[11px]">
                        <span>{t('fri')}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C4A070]"></span>
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
                  <span className="w-2 h-2 rounded-full bg-[#C4A070] animate-ping"></span>
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
                ></iframe>
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

      {/* 4. LUXURY CONTACT FORM */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full pt-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative w-full space-y-6"
        >
          <div className="relative z-10 space-y-6">
            {/* Form Header */}
            <div className="border-b border-[#C4A070]/20 pb-5">
              <div className="space-y-2 text-start">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C4A070]">
                  <FaPaperPlane className="w-3.5 h-3.5" />
                  <span className="tracking-wider uppercase">{t('form_badge')}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F2EFE8]">
                  {t('form_title')}
                </h3>
                <p className="text-xs sm:text-sm text-[#DEDAD6] leading-relaxed">
                  {t('form_desc')}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {formStatus.submitted ? (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-10 px-6 text-center space-y-4 rounded-2xl bg-[#C4A070]/10 border border-[#C4A070]/30"
                >
                  <div className="w-16 h-16 rounded-full bg-[#C4A070]/20 border border-[#C4A070]/40 text-[#C4A070] flex items-center justify-center mx-auto text-3xl">
                    <FaCircleCheck />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif text-xl font-bold text-[#F2EFE8]">
                      {t('success_title')}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#DEDAD6] max-w-lg mx-auto leading-relaxed">
                      {t('success_desc')}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                    <button
                      onClick={handleDirectWhatsApp}
                      className="px-6 py-3 rounded-xl gold-btn-primary font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      <span>{t('open_whatsapp_direct')}</span>
                    </button>
                    <button
                      onClick={handleResetForm}
                      className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-[#DEDAD6] text-xs font-medium border border-white/10 transition-all cursor-pointer"
                    >
                      <span>{t('send_another')}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleFormSubmit}
                  className="space-y-5"
                >
                  {/* Inputs Grid: 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-start">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                        <FaUser className="w-3 h-3 text-[#C4A070]" />
                        <span>{t('name_label')}</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder={t('name_placeholder')}
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#141110] border border-[#C4A070]/35 focus:border-[#C4A070] text-[#F2EFE8] placeholder-[#A69B95] text-xs sm:text-sm outline-none transition-all shadow-sm focus:ring-1 focus:ring-[#C4A070]/40"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                        <FaPhone className="w-3 h-3 text-[#C4A070]" />
                        <span>{t('phone_label')}</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder={t('phone_placeholder')}
                        value={formData.phone}
                        onChange={handleInputChange}
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-[#141110] border border-[#C4A070]/35 focus:border-[#C4A070] text-[#F2EFE8] placeholder-[#A69B95] text-xs sm:text-sm outline-none transition-all text-start font-mono shadow-sm focus:ring-1 focus:ring-[#C4A070]/40"
                      />
                    </div>

                    {/* Service Type */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                        <FaPen className="w-3 h-3 text-[#C4A070]" />
                        <span>{t('service_label')}</span>
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        style={{ color: '#F2EFE8', backgroundColor: '#141110' }}
                        className="w-full px-4 py-3 rounded-xl bg-[#141110] border border-[#C4A070]/35 focus:border-[#C4A070] text-[#F2EFE8] text-xs sm:text-sm outline-none transition-all cursor-pointer font-medium shadow-sm focus:ring-1 focus:ring-[#C4A070]/40"
                      >
                        <option value="fullVilla" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('service_options.villa')}</option>
                        <option value="bespoke" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('service_options.bespoke')}</option>
                        <option value="visit" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('service_options.visit')}</option>
                        <option value="limited" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('service_options.limited')}</option>
                        <option value="collab" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('service_options.collab')}</option>
                      </select>
                    </div>

                    {/* Preferred Time */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                        <FaCalendarDays className="w-3 h-3 text-[#C4A070]" />
                        <span>{t('time_label')}</span>
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        style={{ color: '#F2EFE8', backgroundColor: '#141110' }}
                        className="w-full px-4 py-3 rounded-xl bg-[#141110] border border-[#C4A070]/35 focus:border-[#C4A070] text-[#F2EFE8] text-xs sm:text-sm outline-none transition-all cursor-pointer font-medium shadow-sm focus:ring-1 focus:ring-[#C4A070]/40"
                      >
                        <option value="morning" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('time_options.morning')}</option>
                        <option value="evening" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('time_options.evening')}</option>
                        <option value="anytime" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('time_options.anytime')}</option>
                        <option value="whatsapp_only" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('time_options.whatsapp_only')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-2 text-start">
                    <label className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                      <span>{t('message_label')}</span>
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder={t('message_placeholder')}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#141110] border border-[#C4A070]/35 focus:border-[#C4A070] text-[#F2EFE8] placeholder-[#A69B95] text-xs sm:text-sm outline-none transition-all resize-none shadow-sm focus:ring-1 focus:ring-[#C4A070]/40"
                    ></textarea>
                  </div>

                  {formStatus.error && (
                    <p className="text-xs text-rose-400 bg-rose-950/30 border border-rose-500/20 p-3 rounded-xl">
                      {formStatus.error}
                    </p>
                  )}

                  {/* Submit & WhatsApp Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                    <motion.button
                      whileHover={hoverScale}
                      whileTap={tapScale}
                      transition={springHover}
                      type="button"
                      onClick={handleDirectWhatsApp}
                      className="w-full sm:w-auto py-3.5 px-7 rounded-full bg-[#C4A070]/15 hover:bg-[#C4A070] hover:text-[#1C1816] border border-[#C4A070]/40 text-[#E3CAA9] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      <span>{t('instant_whatsapp_btn')}</span>
                    </motion.button>

                    <motion.button
                      whileHover={hoverScale}
                      whileTap={tapScale}
                      transition={springHover}
                      type="submit"
                      disabled={formStatus.submitting}
                      className="w-full sm:w-auto py-3.5 px-8 rounded-full gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {formStatus.submitting ? (
                        <>
                          <FaSpinner className="w-3.5 h-3.5 animate-spin" />
                          <span>{t('submitting')}</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="w-3 h-3" />
                          <span>{t('submit_btn')}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


