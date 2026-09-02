import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { bespokeService } from '../services/bespokeService'
import SEO from '../../../components/ui/SEO'
import { CONTACT_INFO } from '../../../constants/contactInfo'
import { 
  fadeUp, 
  heroStagger, 
  staggerContainer, 
  viewportOnce, 
  springHover, 
  hoverScale, 
  tapScale 
} from '../../../constants/animations'
import { 
  FaGem, 
  FaAward, 
  FaPhone, 
  FaWhatsapp, 
  FaCheck, 
  FaCompass, 
  FaLayerGroup,
  FaShieldHalved,
  FaTruckFast
} from 'react-icons/fa6'
import heroBannerImg from '../../../assets/hero-banner.jpg'

export default function BespokeService() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const content = await bespokeService.fetchBespokeContent()
        setData(content)
      } catch (err) {
        console.warn('Failed to load bespoke content:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const whatsappNum = CONTACT_INFO.whatsappRaw
  const primaryPhone = CONTACT_INFO.phone

  const heroTitle = data?.hero_title || 'تنفيذ التصاميم حسب الطلب'
  const heroSubtitle = data?.hero_subtitle || 'صياغة أثاث راقٍ ومساحات معمارية حصرية مصممة خصيصاً لأدق تفاصيل قصرك أو فيلتك.'
  const serviceDesc = data?.service_description || 'في S&I Atelier، لا نؤمن بالإنتاج النمطي المتكرر؛ بل نعتبر كل مساحة فراغاً معمارياً يستحق هويته النحتية الخاصة. نقوم بتطويع أفخر الأخشاب الأوروبية ورخام الطبيعة النادر لنحول المخططات الهندسية ورؤيتك إلى تحف واقعية تدوم عبر الأجيال.'
  const steps = Array.isArray(data?.steps) && data.steps.length > 0 ? data.steps : [
    { step: '01', title: 'الاستشارة والمخطط الهندسي', description: 'دراسة المخطط الهندسي والمساحات وتحديد النسب والارتفاعات المثالية.' },
    { step: '02', title: 'انتقاء الخامات الفاخرة', description: 'معاينة عينات الرخام الطبيعي وأخشاب الجوز وكتالوجات الأقمشة والجلود الإيطالية.' },
    { step: '03', title: 'الصياغة اليدوية والتنفيذ', description: 'تنفيذ القطع في ورشنا المتخصصة بأيدي نخبة من الحرفيين مع مطابقة أدق المقاسات.' },
    { step: '04', title: 'التوصيل والتركيب VIP', description: 'نقل وتركيب متخصص وتنسيق متكامل مع شهادة ضمان معتمدة للأثاث.' }
  ]
  const ctaText = data?.cta_text || 'طلب استشارة تصميم وتنفيذ مخصص'
  const heroImage = data?.hero_image || heroBannerImg

  return (
    <div className="bg-transparent text-[#F2EFE8] min-h-screen font-sans" dir="rtl">
      <SEO
        title="خدمة التنفيذ حسب الطلب (Bespoke) | S&I Atelier"
        description="صياغة أثاث راقٍ وتصاميم معمارية مخصصة لأرقى القصور والفيلات بأيدي كبار الحرفيين."
        slug="bespoke"
      />

      {/* 1. Hero Header (Matching Limited Edition Page Style) */}
      <div className="relative pt-32 pb-16 md:pt-36 md:pb-20 px-6 border-b border-[#C4A070]/20 bg-[#141110] overflow-hidden">
        {/* Ambient Brand Identity Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(196,160,112,0.15),rgba(20,17,16,0))] pointer-events-none" />

        <motion.div 
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="relative max-w-4xl mx-auto text-center space-y-6"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C4A070]/30 bg-[#1C1816]/60 backdrop-blur-md text-[11px] font-bold text-[#C4A070]">
            <span>BESPOKE CREATION</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4A070]" />
            <span>تنفيذ حصري بالطلب</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F2EFE8] leading-tight tracking-normal">
            تنفيذ التصاميم <span className="gold-gradient-text">حسب الطلب</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-[#DEDAD6] max-w-2xl mx-auto leading-relaxed md:leading-8 font-light">
            {heroSubtitle}
          </motion.p>
        </motion.div>
      </div>

      {/* 2. SERVICE DEFINITION & PHILOSOPHY */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="rounded-3xl fluted-panel border border-[#C4A070]/25 p-8 sm:p-12 md:p-16 space-y-8 shadow-2xl relative overflow-hidden"
        >
          <div className="space-y-4">
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
              <FaCompass className="w-3.5 h-3.5" /> فلسفة الصياغة الخاصة
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#F2EFE8]">
              تحويل رؤيتك المعمارية إلى واقع ملموس
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#DEDAD6] leading-loose font-light">
            {serviceDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] shrink-0">
                <FaGem />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#F2EFE8]">تطويع أدق المقاسات</h4>
                <p className="text-[11px] text-[#827771]">مطابقة 100% لمخطط المساحة</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] shrink-0">
                <FaShieldHalved />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#F2EFE8]">خامات نادرة معتمدة</h4>
                <p className="text-[11px] text-[#827771]">رخام وأخشاب وجلود أوروبية</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] shrink-0">
                <FaTruckFast />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#F2EFE8]">تسليم وتركيب VIP</h4>
                <p className="text-[11px] text-[#827771]">فريق هندسي متخصص للموقع</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. PROCESS STEPS (مراحل التنفيذ) */}
      <section className="max-w-7xl mx-auto px-6 pb-20 space-y-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center justify-center gap-2">
            <FaAward className="w-3.5 h-3.5" /> مسار العمل
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
            مراحل ابتكار قطعتك الحصرية
          </h2>
          <p className="text-xs sm:text-sm text-[#827771] leading-relaxed">
            من أول استشارة هندسية وحتى استقرار القطعة في قصرك، نرافقك بخطوات دقيقة تضمن أعلى مستويات الدقة.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((st, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="p-6 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-4 relative shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-2xl font-serif font-extrabold text-[#C4A070] block" dir="ltr">
                  {st.step || `0${idx + 1}`}
                </span>
                <h3 className="font-serif text-base font-bold text-[#F2EFE8] leading-snug">
                  {st.title}
                </h3>
                <p className="text-xs text-[#827771] leading-relaxed">
                  {st.description}
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] text-[#C4A070] font-bold">
                <FaCheck className="w-3 h-3 text-emerald-400" />
                <span>مرحلة معتمدة</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. DIRECT CALL-TO-ACTION & DIRECT PHONE (تحويل مباشر لرقم الشركة) */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="rounded-3xl bg-gradient-to-r from-[#7A5D2B] via-[#C4A070] to-[#E5C9A3] p-8 sm:p-12 text-[#1C1816] shadow-2xl space-y-8 text-center relative overflow-hidden"
        >
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs tracking-widest font-extrabold uppercase bg-black/10 px-4 py-1.5 rounded-full inline-block">
              DIRECT CONCIERGE ACCESS
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold leading-tight">
              جاهز لبدء تنفيذ تصميمك الحصري؟
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[#2B2623] leading-relaxed">
              تواصل مباشرة مع فريق كبار المصممين المعماريين بشركة S&I Atelier لحجز موعد استشارة ومعاينة الخامات.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {/* Direct Phone Call Button */}
            <motion.a
              whileHover={hoverScale}
              whileTap={tapScale}
              transition={springHover}
              href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#1C1816] text-[#F2EFE8] font-bold text-sm flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all cursor-pointer"
            >
              <FaPhone className="w-4 h-4 text-[#C4A070]" />
              <div className="text-right">
                <span className="text-[10px] text-[#827771] block leading-tight">اتصال مباشر برقم الشركة</span>
                <span className="font-mono text-sm" dir="ltr">{primaryPhone}</span>
              </div>
            </motion.a>

            {/* Direct WhatsApp Button */}
            <motion.a
              whileHover={hoverScale}
              whileTap={tapScale}
              transition={springHover}
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('مرحباً S&I Atelier، أود الاستفسار عن خدمة التنفيذ حسب الطلب وتفصيل أثاث خاص')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-2xl hover:bg-emerald-800 transition-all cursor-pointer"
            >
              <FaWhatsapp className="w-5 h-5" />
              <span>محادثة واتساب فورية</span>
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
