import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import { FaCompass, FaArrowLeft, FaWhatsapp } from 'react-icons/fa6'
import { fadeUp, staggerContainer, viewportOnce } from '../../../constants/animations'

interface AboutPhilosophySectionProps {
  rawWhatsapp: string
  isEn: boolean
}

export const AboutPhilosophySection: React.FC<AboutPhilosophySectionProps> = ({ rawWhatsapp, isEn }) => {
  const { t } = useTranslation('home')

  const whatsappMessage = encodeURIComponent(
    isEn 
      ? 'Hello S&I Atelier, I would like to inquire about bespoke furniture for a palace or villa' 
      : 'مرحباً S&I Atelier، أود الاستفسار عن تفصيل أثاث خاص لقصر أو فيلا'
  )

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="max-w-7xl mx-auto px-6"
    >
      <div className="rounded-3xl bg-[#141110] border border-[#C4A070]/20 p-8 sm:p-12 md:p-16 space-y-12 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div variants={fadeUp} className="lg:col-span-7 space-y-6 text-start">
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
              <FaCompass className="w-3.5 h-3.5" /> {t('about_badge')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F2EFE8] leading-tight">
              {t('about_title_pre')} <span className="gold-gradient-text">S&I Atelier</span> {t('about_title_post')}
            </h2>
            <div className="space-y-4 text-sm md:text-base text-[#DEDAD6] leading-loose font-light">
              <p>
                <Trans 
                  i18nKey="home:about_p1"
                  components={{
                    date: <strong className="text-[#C4A070] font-semibold" />,
                    strong: <strong className="text-[#C4A070] font-bold" />,
                    gold: <strong className="gold-gradient-text font-bold font-serif text-sm md:text-base drop-shadow-[0_0_12px_rgba(196,160,112,0.55)] border-b border-[#C4A070]/60 pb-0.5" />
                  }}
                />
              </p>
              <p>
                {t('about_p2')}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/bespoke"
                className="px-6 py-3 rounded-full gold-btn-primary text-xs font-bold inline-flex items-center gap-2"
              >
                <span>{t('about_cta_bespoke')}</span>
                <FaArrowLeft className="w-3 h-3 ltr:rotate-180 transition-transform" />
              </Link>
              <a
                href={`https://wa.me/${rawWhatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full gold-btn-secondary text-xs font-bold inline-flex items-center gap-2"
              >
                <FaWhatsapp className="w-4 h-4 text-[#C4A070]" />
                <span>{t('about_cta_whatsapp')}</span>
              </a>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-5 grid grid-cols-2 gap-4 text-start">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#C4A070]/20 space-y-2">
              <span className="text-3xl font-serif font-bold text-[#C4A070]">{t('about_features.handmade_val')}</span>
              <h4 className="text-sm font-bold text-[#F2EFE8]">{t('about_features.handmade_title')}</h4>
              <p className="text-xs text-[#827771] leading-relaxed">{t('about_features.handmade_desc')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#C4A070]/20 space-y-2">
              <span className="text-3xl font-serif font-bold text-[#C4A070]">{t('about_features.warranty_val')}</span>
              <h4 className="text-sm font-bold text-[#F2EFE8]">{t('about_features.warranty_title')}</h4>
              <p className="text-xs text-[#827771] leading-relaxed">{t('about_features.warranty_desc')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#C4A070]/20 space-y-2">
              <span className="text-3xl font-serif font-bold text-[#C4A070]">{t('about_features.vip_val')}</span>
              <h4 className="text-sm font-bold text-[#F2EFE8]">{t('about_features.vip_title')}</h4>
              <p className="text-xs text-[#827771] leading-relaxed">{t('about_features.vip_desc')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#C4A070]/20 space-y-2">
              <span className="text-3xl font-serif font-bold text-[#C4A070]">{t('about_features.exclusive_val')}</span>
              <h4 className="text-sm font-bold text-[#F2EFE8]">{t('about_features.exclusive_title')}</h4>
              <p className="text-xs text-[#827771] leading-relaxed">{t('about_features.exclusive_desc')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default AboutPhilosophySection
