import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import { FaAward } from 'react-icons/fa6'
import { fadeUp, staggerContainer, viewportOnce } from '../../../constants/animations'

export const VisionStorySection: React.FC = memo(() => {
  const { t } = useTranslation('home')

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="max-w-7xl mx-auto px-6 space-y-12"
    >
      <motion.div variants={fadeUp} className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center justify-center gap-2">
          <FaAward className="w-3.5 h-3.5" /> {t('history_badge')}
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
          {t('history_title')}
        </h2>
        <p className="text-sm text-[#DEDAD6]/80 leading-relaxed font-light">
          {t('history_desc')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
        <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] font-serif font-bold text-lg">
            01
          </div>
          <h3 className="font-serif text-xl font-bold text-[#F2EFE8]">{t('history_step1_title')}</h3>
          <p className="text-xs text-[#827771] leading-relaxed">
            <Trans
              i18nKey="home:history_step1_desc"
              components={{
                date: <strong className="text-[#C4A070] font-semibold" />,
                gold: <strong className="gold-gradient-text font-bold font-serif text-[13px] drop-shadow-[0_0_10px_rgba(196,160,112,0.55)] border-b border-[#C4A070]/60 pb-0.5" />
              }}
            />
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] font-serif font-bold text-lg">
            02
          </div>
          <h3 className="font-serif text-xl font-bold text-[#F2EFE8]">{t('history_step2_title')}</h3>
          <p className="text-xs text-[#827771] leading-relaxed">
            {t('history_step2_desc')}
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] font-serif font-bold text-lg">
            03
          </div>
          <h3 className="font-serif text-xl font-bold text-[#F2EFE8]">{t('history_step3_title')}</h3>
          <p className="text-xs text-[#827771] leading-relaxed">
            {t('history_step3_desc')}
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
})

export default VisionStorySection
