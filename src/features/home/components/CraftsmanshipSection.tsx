import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaGem, FaShieldHalved, FaTruckFast } from 'react-icons/fa6'
import { fadeUp, viewportOnce } from '../../../constants/animations'

export const CraftsmanshipSection: React.FC = memo(() => {
  const { t } = useTranslation('home')

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      className="max-w-7xl mx-auto px-6"
    >
      <div className="glass-panel-luxury rounded-3xl p-8 md:p-12 border border-[#C4A070]/20 bg-gradient-to-br from-[#141110] to-[#1C1816]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] mx-auto text-2xl">
              <FaGem />
            </div>
            <h4 className="font-bold text-base text-[#F2EFE8] font-serif">{t('guarantees_rare_title')}</h4>
            <p className="text-xs text-[#B3A9A3] leading-relaxed">
              {t('guarantees_rare_desc')}
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] mx-auto text-2xl">
              <FaShieldHalved />
            </div>
            <h4 className="font-bold text-base text-[#F2EFE8] font-serif">{t('guarantees_warranty_title')}</h4>
            <p className="text-xs text-[#B3A9A3] leading-relaxed">
              {t('guarantees_warranty_desc')}
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] mx-auto text-2xl">
              <FaTruckFast />
            </div>
            <h4 className="font-bold text-base text-[#F2EFE8] font-serif">{t('guarantees_vip_title')}</h4>
            <p className="text-xs text-[#B3A9A3] leading-relaxed">
              {t('guarantees_vip_desc')}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
})

export default CraftsmanshipSection
