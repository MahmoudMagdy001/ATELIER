import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import SEO from '../../../components/ui/SEO'
import { CONTACT_INFO } from '../../../constants/contactInfo'
import { 
  fadeUp, 
  heroStagger, 
  staggerContainer, 
  viewportOnce, 
  springHover, 
  hoverScale, 
  tapScale 
} from '../../../constants/animations'
import { 
  FaGem, 
  FaAward, 
  FaPhone, 
  FaWhatsapp, 
  FaCheck, 
  FaCompass, 
  FaShieldHalved,
  FaTruckFast,
  FaCouch,
  FaCrown,
  FaBed,
  FaLayerGroup,
  FaCertificate,
  FaLock,
  FaHandshake
} from 'react-icons/fa6'

interface BespokeStepItem {
  step: string
  title: string
  description: string
}

interface CapabilityItem {
  id: string
  title: string
  desc: string
}

interface StandardItem {
  title: string
  desc: string
}

export default function BespokeService() {
  const { t, i18n } = useTranslation('bespoke')
  const isEn = i18n.language?.startsWith('en')

  const whatsappNum = CONTACT_INFO.whatsappRaw
  const primaryPhone = CONTACT_INFO.phone

  const rawSteps = t('steps', { returnObjects: true })
  const steps: BespokeStepItem[] = Array.isArray(rawSteps) ? (rawSteps as BespokeStepItem[]) : []

  const rawCapabilities = t('capabilities', { returnObjects: true })
  const capabilities: CapabilityItem[] = Array.isArray(rawCapabilities) ? (rawCapabilities as CapabilityItem[]) : []

  const rawStandards = t('standards', { returnObjects: true })
  const standards: StandardItem[] = Array.isArray(rawStandards) ? (rawStandards as StandardItem[]) : []

  const capabilityIcons: Record<string, React.ReactNode> = {
    majlis: <FaCouch className="w-5 h-5 text-[#C4A070]" />,
    dining: <FaCrown className="w-5 h-5 text-[#C4A070]" />,
    suites: <FaBed className="w-5 h-5 text-[#C4A070]" />,
    paneling: <FaLayerGroup className="w-5 h-5 text-[#C4A070]" />
  }

  const standardIcons = [
    <FaShieldHalved className="w-5 h-5 text-[#C4A070]" key="warranty" />,
    <FaCertificate className="w-5 h-5 text-[#C4A070]" key="cert" />,
    <FaLock className="w-5 h-5 text-[#C4A070]" key="privacy" />
  ]

  return (
    <div className="bg-transparent text-[#F2EFE8] min-h-screen font-sans">
      <SEO
        title={t('meta_title')}
        description={t('meta_description')}
        slug="bespoke"
      />

      {/* 1. Hero Header */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 border-b border-[#C4A070]/20 bg-[#141110] overflow-hidden">
        {/* Ambient Brand Identity Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(196,160,112,0.18),rgba(20,17,16,0))] pointer-events-none" />

        <motion.div 
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="relative max-w-4xl mx-auto text-center space-y-6"
        >
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight tracking-normal">
            <span className="gold-gradient-text inline-block">
              {t('hero_title_pre')} {t('hero_title_highlight')}
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-[#DEDAD6] max-w-2xl mx-auto leading-relaxed md:leading-8 font-light">
            {t('hero_subtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* 2. THE ATELIER PHILOSOPHY */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-start">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="rounded-3xl fluted-panel border border-[#C4A070]/25 p-8 sm:p-12 md:p-16 space-y-8 shadow-2xl relative overflow-hidden"
        >
          <div className="space-y-4">
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
              <FaCompass className="w-3.5 h-3.5" /> {t('philosophy_badge')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#F2EFE8] leading-snug">
              {t('philosophy_title')}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#DEDAD6] leading-loose font-light">
            {t('philosophy_desc')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] shrink-0">
                <FaGem className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#F2EFE8]">{t('feature1_title')}</h4>
                <p className="text-xs text-[#A19A91] leading-relaxed">{t('feature1_desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] shrink-0">
                <FaShieldHalved className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#F2EFE8]">{t('feature2_title')}</h4>
                <p className="text-xs text-[#A19A91] leading-relaxed">{t('feature2_desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] shrink-0">
                <FaTruckFast className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#F2EFE8]">{t('feature3_title')}</h4>
                <p className="text-xs text-[#A19A91] leading-relaxed">{t('feature3_desc')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. BESPOKE CAPABILITIES & SOLUTIONS */}
      {capabilities.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto space-y-4"
          >
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center justify-center gap-2">
              <FaHandshake className="w-3.5 h-3.5" /> {t('capabilities_badge')}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
              {t('capabilities_title')}
            </h2>
            <p className="text-xs sm:text-sm text-[#A19A91] leading-relaxed">
              {t('capabilities_desc')}
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-start"
          >
            {capabilities.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className="p-6 rounded-3xl bg-[#181413] border border-[#C4A070]/20 space-y-4 relative shadow-xl hover:border-[#C4A070]/50 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/10 flex items-center justify-center border border-[#C4A070]/20 group-hover:scale-110 transition-transform">
                    {capabilityIcons[item.id] || <FaGem className="w-5 h-5 text-[#C4A070]" />}
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#F2EFE8] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#A19A91] leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 4. THE BESPOKE PROCESS JOURNEY */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center justify-center gap-2">
            <FaAward className="w-3.5 h-3.5" /> {t('process_badge')}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
            {t('process_title')}
          </h2>
          <p className="text-xs sm:text-sm text-[#A19A91] leading-relaxed">
            {t('process_desc')}
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-start"
        >
          {steps.map((st: BespokeStepItem, idx: number) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="p-6 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-4 relative shadow-xl flex flex-col justify-between hover:border-[#C4A070]/40 transition-colors"
            >
              <div className="space-y-3">
                <span className="text-2xl font-serif font-extrabold text-[#C4A070] block" dir="ltr">
                  {st.step || `0${idx + 1}`}
                </span>
                <h3 className="font-serif text-base font-bold text-[#F2EFE8] leading-snug">
                  {st.title}
                </h3>
                <p className="text-xs text-[#A19A91] leading-relaxed font-light">
                  {st.description}
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] text-[#C4A070] font-bold">
                <FaCheck className="w-3 h-3 text-emerald-400" />
                <span>{t('step_certified')}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. EXCLUSIVITY & TRUST STANDARDS */}
      {standards.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="text-center max-w-xl mx-auto space-y-3"
          >
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center justify-center gap-2">
              <FaShieldHalved className="w-3.5 h-3.5" /> {t('standards_badge')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F2EFE8]">
              {t('standards_title')}
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start"
          >
            {standards.map((std, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3 shadow-lg hover:border-[#C4A070]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C4A070]/10 flex items-center justify-center mb-2">
                  {standardIcons[idx] || <FaShieldHalved className="w-5 h-5 text-[#C4A070]" />}
                </div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#F2EFE8]">
                  {std.title}
                </h3>
                <p className="text-xs text-[#A19A91] leading-relaxed font-light">
                  {std.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 6. DIRECT CONCIERGE CALL-TO-ACTION */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="rounded-3xl bg-gradient-to-r from-[#7A5D2B] via-[#C4A070] to-[#E5C9A3] p-8 sm:p-12 text-[#1C1816] shadow-2xl space-y-8 text-center relative overflow-hidden"
        >
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs tracking-widest font-extrabold uppercase bg-black/10 px-4 py-1.5 rounded-full inline-block" dir="ltr">
              {t('cta_badge')}
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold leading-tight">
              {t('cta_title')}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[#26211F] leading-relaxed">
              {t('cta_desc')}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {/* Direct Phone Call Button */}
            <motion.a
              whileHover={hoverScale}
              whileTap={tapScale}
              transition={springHover}
              href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1C1816] text-[#F2EFE8] font-bold text-sm flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all cursor-pointer"
            >
              <FaPhone className="w-4 h-4 text-[#C4A070]" />
              <div className="text-start">
                <span className="text-[10px] text-[#A19A91] block leading-tight">{t('phone_label')}</span>
                <span className="font-mono text-sm" dir="ltr">{primaryPhone}</span>
              </div>
            </motion.a>

            {/* Direct WhatsApp Button */}
            <motion.a
              whileHover={hoverScale}
              whileTap={tapScale}
              transition={springHover}
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(t('whatsapp_message'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-2xl hover:bg-emerald-800 transition-all cursor-pointer"
            >
              <FaWhatsapp className="w-5 h-5" />
              <span>{t('whatsapp_btn')}</span>
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
