import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import { CONTACT_INFO } from '../../constants/contactInfo'

export default function FloatingWhatsApp() {
  const { t } = useTranslation()
  const defaultMessage = t('floating.whatsappDefaultMessage')
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(defaultMessage)}`

  return (
    <div className="hidden md:block fixed bottom-6 end-6 z-40 select-none">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('floating.whatsappAria')}
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.2 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="group relative flex items-center cursor-pointer"
      >
        {/* Tooltip in Luxury Theme */}
        <div className="absolute end-full me-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 pointer-events-none transition-all duration-200 ease-out hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141110]/95 backdrop-blur-md border border-[#C4A070]/40 text-[#F2EFE8] text-xs font-bold shadow-2xl shadow-black/80 whitespace-nowrap z-50">
          <span className="w-2 h-2 rounded-full bg-[#C4A070]"></span>
          <span>{t('floating.whatsappTooltip')}</span>
        </div>

        {/* WhatsApp Button - Atelier Luxury Gold Identity (Calm, Static Elegance) */}
        <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-[#A68353] via-[#C4A070] to-[#E3CAA9] text-[#1C1816] shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-[#F2EFE8]/30 group-hover:from-[#C4A070] group-hover:to-[#F2EFE8] transition-all duration-300">
          {/* Inner WhatsApp Icon in Luxury Dark Charcoal */}
          <FaWhatsapp className="relative z-10 w-6 h-6 md:w-7 md:h-7 text-[#1C1816] drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />

        </div>
      </motion.a>
    </div>
  )
}
