import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaArrowLeft } from 'react-icons/fa6'
import { fadeUp, heroStagger } from '../../../constants/animations'

interface HeroSectionProps {
  heroImage: string
}

export const HeroSection: React.FC<HeroSectionProps> = memo(({ heroImage }) => {
  const { t } = useTranslation('home')

  return (
    <section className="relative min-h-[94vh] flex items-center justify-center text-center px-6 overflow-hidden">
      <motion.div 
        initial={{ scale: 1.12, opacity: 0.8 }}
        animate={{ scale: 1.03, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={heroImage} 
          alt="S&I Atelier Luxury Bespoke Furniture" 
          className="w-full h-full object-cover object-center brightness-90"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1816] via-[#1C1816]/70 to-black/35" />
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.8px]" />
      </motion.div>

      <motion.div 
        variants={heroStagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto space-y-7 pt-28 pb-12"
      >
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.15] drop-shadow-2xl">
          <span className="gold-gradient-text inline-block">
            {t('hero_title_part1')} <br />
            {t('hero_title_highlight')}
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-[#E3CAA9]/90 max-w-2xl mx-auto leading-relaxed md:leading-8 drop-shadow-md font-light">
          {t('hero_subtitle')}
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/limited-edition"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full gold-btn-primary text-xs font-bold flex items-center justify-center gap-2.5 shadow-xl transition-all"
          >
            <span>{t('hero_cta_limited')}</span>
            <FaArrowLeft className="w-3 h-3 ltr:rotate-180 transition-transform" />
          </Link>

          <Link
            to="/bespoke"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full gold-btn-secondary text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>{t('hero_cta_bespoke')}</span>
            <FaArrowLeft className="w-3 h-3 text-[#C4A070] ltr:rotate-180 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
})

export default HeroSection
