import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fadeUp, heroStagger } from '../../../constants/animations'

interface HeroSectionProps {
  heroImage: string
}

export const HeroSection: React.FC<HeroSectionProps> = memo(({ heroImage }) => {
  const { t } = useTranslation('home')

  return (
    <section className="relative min-h-[75vh] sm:min-h-[88vh] md:min-h-[95vh] lg:min-h-screen flex items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
      {/* Background Image with Cinematic Luxury Gradients */}
      <motion.div 
        initial={{ scale: 1.08, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={heroImage} 
          alt="S&I Atelier Luxury Bespoke Furniture" 
          className="w-full h-full object-cover object-center brightness-95"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141110] via-[#141110]/50 to-black/30" />
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[0.5px]" />
      </motion.div>

      {/* Hero Showcase Content */}
      <motion.div 
        variants={heroStagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto space-y-5 sm:space-y-7 pt-24 sm:pt-32 md:pt-36 pb-12 sm:pb-16"
      >

        <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.2] drop-shadow-2xl">
          <span className="gold-gradient-text inline-block">
            {t('hero_title_part1')} <br />
            {t('hero_title_highlight')}
          </span>
        </motion.h1>

        {/* Clean Showcase Discovery CTA */}
        <motion.div variants={fadeUp} className="flex items-center justify-center pt-2">
          <Link
            to="/limited-edition"
            className="px-7 sm:px-9 py-3 sm:py-3.5 rounded-full gold-btn-primary text-xs sm:text-sm font-bold flex items-center justify-center shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>{t('hero_cta_limited')}</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
})

export default HeroSection
