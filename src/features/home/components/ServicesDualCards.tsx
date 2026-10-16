import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fadeUp, staggerContainer, viewportOnce, cardHover, springHover } from '../../../constants/animations'

interface ServicesDualCardsProps {
  productsCount?: number
  collectionsImage?: string
  bespokeImage?: string
}

export const ServicesDualCards: React.FC<ServicesDualCardsProps> = ({ 
  collectionsImage = '/hero-banner.jpg',
  bespokeImage = '/hero-banner.jpg',
}) => {
  const { t, i18n } = useTranslation('home')
  const isEn = i18n.language?.startsWith('en')
  const isRtl = i18n.dir() === 'rtl'

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8"
    >
      <motion.div variants={fadeUp} className="border-b border-[#C4A070]/20 pb-4 sm:pb-6">
        <h2 
          dir={isRtl ? 'rtl' : 'ltr'}
          className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#F2EFE8] text-start rtl:text-right ltr:text-left flex items-center gap-2"
        >
          <span>{t('services_title_pre')}</span>
          <span className="gold-gradient-text">{t('services_title_highlight')}</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Portal 1: Ready & Limited Edition Collections (بيع المنتجات) */}
        <motion.div 
          variants={fadeUp}
          whileHover={cardHover}
          transition={springHover}
          dir={isRtl ? 'rtl' : 'ltr'}
          className="group relative rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[440px] md:min-h-[480px] flex flex-col justify-end p-6 sm:p-8 md:p-10 border border-[#C4A070]/25 shadow-2xl bg-[#141110] text-start rtl:text-right ltr:text-left"
        >
          {/* Background Photography with Editorial Zoom */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              src={collectionsImage} 
              alt={t('service_card1_title')} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.75] group-hover:brightness-85"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141110] via-[#141110]/55 to-black/30" />
          </div>

          {/* Editorial Content */}
          <div className="relative z-10 space-y-3">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#C4A070] uppercase tracking-wider block">
              {t('service_card1_num')}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#F2EFE8] leading-tight group-hover:text-[#C4A070] transition-colors">
              {t('service_card1_title')}
            </h3>
            <p className="text-xs sm:text-sm text-[#DEDAD6]/80 font-light max-w-md leading-relaxed">
              {t('service_card1_desc')}
            </p>

            <div className="pt-4 flex items-center justify-start">
              <span className="inline-flex items-center justify-center px-6 py-2.5 rounded-full gold-btn-primary text-xs font-bold shadow-lg group-hover:scale-[1.02] transition-transform">
                {t('service_card1_cta')}
              </span>
            </div>
          </div>

          {/* Full Card Interactive Link */}
          <Link 
            to="/limited-edition" 
            className="absolute inset-0 z-20" 
            aria-label={t('service_card1_title')} 
          />
        </motion.div>

        {/* Portal 2: Bespoke Architectural Commissions (التصنيع حسب الطلب) */}
        <motion.div 
          variants={fadeUp}
          whileHover={cardHover}
          transition={springHover}
          dir={isRtl ? 'rtl' : 'ltr'}
          className="group relative rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[440px] md:min-h-[480px] flex flex-col justify-end p-6 sm:p-8 md:p-10 border border-[#C4A070]/25 shadow-2xl bg-[#141110] text-start rtl:text-right ltr:text-left"
        >
          {/* Background Photography with Editorial Zoom */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              src={bespokeImage} 
              alt={t('service_card2_title')} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.75] group-hover:brightness-85"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141110] via-[#141110]/55 to-black/30" />
          </div>

          {/* Editorial Content */}
          <div className="relative z-10 space-y-3">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#C4A070] uppercase tracking-wider block">
              {t('service_card2_num')}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#F2EFE8] leading-tight group-hover:text-[#C4A070] transition-colors">
              {t('service_card2_title')}
            </h3>
            <p className="text-xs sm:text-sm text-[#DEDAD6]/80 font-light max-w-md leading-relaxed">
              {t('service_card2_desc')}
            </p>

            <div className="pt-4 flex items-center justify-start">
              <span className="inline-flex items-center justify-center px-6 py-2.5 rounded-full gold-btn-secondary text-xs font-bold shadow-lg group-hover:scale-[1.02] transition-transform">
                {t('service_card2_cta')}
              </span>
            </div>
          </div>

          {/* Full Card Interactive Link */}
          <Link 
            to="/bespoke" 
            className="absolute inset-0 z-20" 
            aria-label={t('service_card2_title')} 
          />
        </motion.div>
      </div>
    </motion.section>
  )
}

export default ServicesDualCards
