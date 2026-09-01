import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa6'
import { CONTACT_INFO } from '../../constants/contactInfo'

export default function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent('مرحباً دار أتيليه، أود الاستفسار عن تفصيل قطع الأثاث وخدمات التصميم')}`

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.2 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="group relative flex items-center cursor-pointer"
      >
        {/* Tooltip in Luxury Theme */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 pointer-events-none transition-all duration-200 ease-out hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141110]/95 backdrop-blur-md border border-[#C4A070]/40 text-[#F2EFE8] text-xs font-bold shadow-2xl shadow-black/80 whitespace-nowrap z-50">
          <span className="w-2 h-2 rounded-full bg-[#C4A070] animate-pulse"></span>
          <span>استشارة فورية عبر واتساب</span>
        </div>

        {/* WhatsApp Button - Atelier Luxury Gold Identity */}
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#A68353] via-[#C4A070] to-[#E3CAA9] text-[#1C1816] shadow-[0_8px_25px_rgba(196,160,112,0.45)] border border-[#F2EFE8]/30 group-hover:from-[#C4A070] group-hover:to-[#F2EFE8] transition-all duration-300">
          {/* Subtle Luxury Ripple Rings */}
          <span className="absolute inset-0 rounded-full bg-[#C4A070] animate-ping opacity-25 pointer-events-none duration-1000"></span>
          <span className="absolute -inset-1 rounded-full bg-[#C4A070]/30 blur-sm group-hover:opacity-100 opacity-60 transition-opacity"></span>

          {/* Inner WhatsApp Icon in Luxury Dark Charcoal */}
          <FaWhatsapp className="relative z-10 w-7 h-7 text-[#1C1816] drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />

          {/* Luxury Status Indicator Dot */}
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#1C1816] border-2 border-[#E3CAA9] rounded-full z-20 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-[#C4A070] rounded-full"></span>
          </span>
        </div>
      </motion.a>
    </div>
  )
}
