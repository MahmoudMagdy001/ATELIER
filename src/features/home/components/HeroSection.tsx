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
    <section className="relative min-h-[52vh] sm:min-h-[64vh] md:min-h-[80vh] flex items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
      {/* Background Image with Cinematic Luxury Gradients */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0.85 }}
        animate={{ scale: 1.02, opacity: 1 }}
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#141110] via-[#141110]/60 to-black/35" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
      </motion.div>

      {/* Hero Showcase Content */}
      <motion.div 
        variants={heroStagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto space-y-4 sm:space-y-6 pt-20 sm:pt-28 pb-8 sm:pb-12"
      >

        <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.2] drop-shadow-2xl">
          <span className="gold-gradient-text inline-block">
            {t('hero_title_part1')} <br />
            {t('hero_title_highlight')}
          </span>
        </motion.h1>

        {/* Clean Showcase Discovery CTAs */}
        <motion.div variants={fadeUp} className="flex flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/limited-edition"
            className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full gold-btn-primary text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>{t('hero_cta_limited')}</span>
            <FaArrowLeft className="w-2.5 h-2.5 ltr:rotate-180 transition-transform" />
          </Link>

          <Link
            to="/bespoke"
            className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full gold-btn-secondary text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>{t('hero_cta_bespoke')}</span>
            <FaArrowLeft className="w-2.5 h-2.5 text-[#C4A070] ltr:rotate-180 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
})

export default HeroSection
