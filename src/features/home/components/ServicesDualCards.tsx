import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaGem, FaCouch, FaArrowLeft } from 'react-icons/fa6'
import { fadeUp, staggerContainer, viewportOnce, cardHover, springHover } from '../../../constants/animations'

interface ServicesDualCardsProps {
  productsCount: number
}

export const ServicesDualCards: React.FC<ServicesDualCardsProps> = ({ productsCount }) => {
  const { t } = useTranslation('home')

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="max-w-7xl mx-auto px-6 space-y-10"
    >
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6">
        <div className="space-y-2 text-start">
          <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
            <FaGem className="w-3.5 h-3.5" /> {t('services_badge')}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
            {t('services_title')}
          </h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
        {/* Card 1: Limited Edition */}
        <motion.div 
          variants={fadeUp}
          whileHover={cardHover}
          transition={springHover}
          className="rounded-3xl bg-[#141110] border border-[#C4A070]/25 overflow-hidden p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-2xl relative group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] text-xl">
              <FaCouch />
            </div>
            <span className="text-[11px] font-bold text-[#C4A070] uppercase tracking-widest block" dir="ltr">
              {t('service_card1_num')}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors">
              {t('service_card1_title')}
            </h3>
            <p className="text-xs sm:text-sm text-[#DEDAD6]/80 leading-relaxed font-light">
              {t('service_card1_desc')}
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-[#827771]">
              {t('service_card1_count', { count: productsCount })}
            </span>
            <Link
              to="/limited-edition"
              className="px-5 py-2.5 rounded-full gold-btn-primary text-xs font-bold flex items-center gap-2"
            >
              <span>{t('service_card1_cta')}</span>
              <FaArrowLeft className="w-3 h-3 ltr:rotate-180 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Card 2: Bespoke Service */}
        <motion.div 
          variants={fadeUp}
          whileHover={cardHover}
          transition={springHover}
          className="rounded-3xl bg-[#141110] border border-[#C4A070]/25 overflow-hidden p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-2xl relative group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] text-xl">
              <FaGem />
            </div>
            <span className="text-[11px] font-bold text-[#C4A070] uppercase tracking-widest block" dir="ltr">
              {t('service_card2_num')}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors">
              {t('service_card2_title')}
            </h3>
            <p className="text-xs sm:text-sm text-[#DEDAD6]/80 leading-relaxed font-light">
              {t('service_card2_desc')}
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-[#827771]">{t('service_card2_highlight')}</span>
            <Link
              to="/bespoke"
              className="px-5 py-2.5 rounded-full gold-btn-secondary text-xs font-bold flex items-center gap-2"
            >
              <span>{t('service_card2_cta')}</span>
              <FaArrowLeft className="w-3 h-3 text-[#C4A070] ltr:rotate-180 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default ServicesDualCards
