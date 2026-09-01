import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { adminService } from '../../admin/services/adminService'
import SEO from '../../../components/ui/SEO'
import { 
  fadeUp, 
  heroStagger, 
  staggerContainer, 
  viewportOnce, 
  springHover, 
  hoverScale, 
  tapScale 
} from '../../../constants/animations'
import { FaGem, FaAward, FaBuildingColumns, FaWhatsapp, FaPhone } from 'react-icons/fa6'

export default function About() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await adminService.fetchSettings()
        setSettings(data)
      } catch (err) {
        console.warn('Failed to load settings:', err.message)
      }
    }
    loadSettings()
  }, [])

  const whatsappNumber = settings?.whatsapp_number || settings?.contact_whatsapp || '966501234567'
  const contactPhone = settings?.contact_phone || '+966501234567'

  return (
    <div className="bg-[#1C1816] text-[#F2EFE8] min-h-screen font-sans relative" dir="rtl">
      <SEO
        title="عن دار أتيليه (ATELIER) | الحرفية والرؤية المعمارية"
        description="دار أثاث فاخرة رائدة تجمع بين الحرفية الإيطالية والتصاميم المعمارية المصنوعة بالطلب لأرقى القصور والفيلات."
        slug="about"
      />

      {/* Top Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(196,160,112,0.15),transparent)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-16 md:pt-36 md:pb-20 space-y-16 relative z-10">
        {/* Header */}
        <motion.div 
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="relative text-center max-w-3xl mx-auto space-y-6 pt-4"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C4A070]/10 border border-[#C4A070]/30 shadow-sm backdrop-blur-md">
            <FaBuildingColumns className="w-3.5 h-3.5 text-[#C4A070]" />
            <span className="text-xs text-[#C4A070] tracking-[0.25em] font-bold uppercase">
              THE HOUSE OF BESPOKE ELEGANCE
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#F2EFE8] leading-tight">
            دار <span className="gold-gradient-text">أتيليه (ATELIER)</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-[#DEDAD6] leading-relaxed md:leading-8 font-light">
            حيث تلتقي الرؤية المعمارية بالأثاث المصنوع بالطلب لأرقى القصور والفيلات.
          </motion.p>
        </motion.div>

        {/* Story Card */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="rounded-3xl bg-[#141110] border border-[#C4A070]/20 p-8 sm:p-12 md:p-16 space-y-8 shadow-2xl"
        >
          <div className="space-y-4 text-sm md:text-base text-[#DEDAD6] leading-loose">
            <p>
              تأسست <strong className="text-[#C4A070]">دار أتيليه (ATELIER)</strong> لتكون الوجهة الأولى والفريدة لعشاق الفخامة الخالدة والتصاميم المخصصة بالطلب.
            </p>
            <p>
              نبتكر قطع أثاث فريدة وتصاميم داخلية استثنائية تعكس الفخامة المطلقة للقصور والمساحات الراقية بأيدي أمهر الحرفيين الإيطاليين والعالميين.
            </p>
            <p>
              نؤمن بأن كل فراغ معماري يمتلك شخصيته المستقلة، لذا نصنع كل قطعة بأبعاد وألوان وخامات تتناغم كلياً مع فلسفة المكان ورغبة العميل.
            </p>
          </div>

          {/* Pillars */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10"
          >
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={springHover}
              className="p-6 rounded-2xl bg-white/5 space-y-2 text-center border border-white/5"
            >
              <FaGem className="text-2xl text-[#C4A070] mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#F2EFE8]">حرفية استثنائية</h4>
              <p className="text-xs text-[#827771] leading-relaxed">انتقاء دقيق لأندر أخشاب الجوز المعتق، الرخام الطبيعي، والمخمل الإيطالي</p>
            </motion.div>
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={springHover}
              className="p-6 rounded-2xl bg-white/5 space-y-2 text-center border border-white/5"
            >
              <FaBuildingColumns className="text-2xl text-[#C4A070] mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#F2EFE8]">تصميم مخصص 100%</h4>
              <p className="text-xs text-[#827771] leading-relaxed">صناعة وتعديل المقاسات والخيارات لتطابق مخطط قصرك أو مساحتك تماماً</p>
            </motion.div>
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={springHover}
              className="p-6 rounded-2xl bg-white/5 space-y-2 text-center border border-white/5"
            >
              <FaAward className="text-2xl text-[#C4A070] mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#F2EFE8]">ضمان واهتمام دائم</h4>
              <p className="text-xs text-[#827771] leading-relaxed">ضمان شامل 10 سنوات مع خدمة كونسيرج وصيانة دورية راقية</p>
            </motion.div>
          </motion.div>

          {/* Contact Box */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
            <div className="text-center sm:text-right">
              <h5 className="text-sm font-bold text-[#F2EFE8]">هل ترغب في زيارة صالة العرض الخاصة؟</h5>
              <p className="text-xs text-[#827771]">احجز موعداً خاصاً مع كبير المصممين لمعاينة الكتالوجات الحصرية.</p>
            </div>

            <div className="flex gap-3">
              <motion.a
                whileHover={hoverScale}
                whileTap={tapScale}
                transition={springHover}
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً أتيليه، أود حجز موعد استشارة معمارية')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
                <span>حجز موعد</span>
              </motion.a>
              <motion.a
                whileHover={hoverScale}
                whileTap={tapScale}
                transition={springHover}
                href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#F2EFE8] text-xs font-bold flex items-center gap-2 border border-white/10"
              >
                <FaPhone className="w-3.5 h-3.5 text-[#C4A070]" />
                <span>اتصال</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
