import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import SEO from '../../../components/ui/SEO'
import { CONTACT_INFO } from '../../../constants/contactInfo'
import { fadeUp, heroStagger, viewportOnce } from '../../../constants/animations'
import { FaShieldHalved, FaLock, FaUserCheck, FaEnvelope, FaPhone } from 'react-icons/fa6'

export default function PrivacyPolicy() {
  const { i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')
  const isRtl = i18n.dir() === 'rtl'

  const title = isEn ? 'Privacy Policy & Terms | S&I Atelier' : 'سياسة الخصوصية والشروط | S&I Atelier'
  const desc = isEn 
    ? 'Privacy policy, client data protection, and terms of service for S&I Atelier bespoke furniture.' 
    : 'سياسة الخصوصية وحماية بيانات العملاء وشروط تقديم خدمات الأثاث الفاخر في S&I Atelier.'

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className="w-full max-w-full overflow-x-hidden bg-transparent text-[#F2EFE8] min-h-screen font-sans pt-28 md:pt-36 pb-20"
    >
      <SEO
        title={title}
        description={desc}
        slug="privacy-policy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <motion.div 
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="text-center space-y-4 border-b border-[#C4A070]/20 pb-10"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C4A070]/10 border border-[#C4A070]/30 text-[#C4A070] text-xs font-bold">
            <FaShieldHalved className="w-3.5 h-3.5" />
            <span>{isEn ? 'CONFIDENTIALITY & TRUST' : 'السرية وحماية الخصوصية'}</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F2EFE8] leading-tight">
            {isEn ? 'Privacy Policy & Terms of Service' : 'سياسة الخصوصية والشروط والأحكام'}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xs sm:text-sm text-[#A19A91] max-w-xl mx-auto font-light leading-relaxed">
            {isEn
              ? 'At S&I Atelier, we hold the privacy and blueprints of our palace and estate clientele in the highest regard.'
              : 'في دار S&I Atelier، نلتزم بأعلى معايير السرية والأمان لبيانات ومخططات عملائنا الكرام من أصحاب القصور والفيلات.'}
          </motion.p>
        </motion.div>

        {/* Content Sections */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="space-y-8 text-start rtl:text-right ltr:text-left text-xs sm:text-sm text-[#DEDAD6]/90 leading-relaxed font-light"
        >
          {/* Section 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-3 shadow-xl">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#C4A070] flex items-center gap-2.5">
              <FaLock className="w-4 h-4 text-[#C4A070]" />
              <span>{isEn ? '1. Collection & Protection of Information' : '1. جمع البيانات وحمايتها'}</span>
            </h2>
            <p>
              {isEn
                ? 'We only collect client information necessary to deliver bespoke architectural furniture commissions, design consultations, and delivery arrangements (e.g. name, contact telephone, floorplan specifications, and delivery destination in the Kingdom of Saudi Arabia).'
                : 'نقوم بجمع البيانات الضرورية فقط لإتمام طلبات تصنيع الأثاث الفاخر والاستشارات المعمارية والتوصيل (مثل الاسم، رقم الهاتف، أبعاد ومخططات المساحات، وعنوان التسليم داخل المملكة العربية السعودية).'}
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-3 shadow-xl">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#C4A070] flex items-center gap-2.5">
              <FaShieldHalved className="w-4 h-4 text-[#C4A070]" />
              <span>{isEn ? '2. Architectural Confidentiality' : '2. سرية المخططات والتصاميم'}</span>
            </h2>
            <p>
              {isEn
                ? 'All architectural drawings, floor plans, and custom furniture dimensions shared with our atelier are classified as strictly confidential and are never disclosed, rented, or distributed to any third party.'
                : 'جميع المخططات الهندسية وتفاصيل القصور والمقاسات الخاصة التي يشاركها العميل معنا تخضع لسرية تامة ومطلقة، ولا يتم نشرها أو مشاركتها مع أي جهة خارجية تحت أي ظرف.'}
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-3 shadow-xl">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#C4A070] flex items-center gap-2.5">
              <FaUserCheck className="w-4 h-4 text-[#C4A070]" />
              <span>{isEn ? '3. Orders & Custom Manufacturing Terms' : '3. شروط التصنيع حسب الطلب'}</span>
            </h2>
            <p>
              {isEn
                ? 'Bespoke commissions are handcrafted exclusively upon approved specifications. Delivery timelines, noble materials (European marble, aged walnut, fine textiles), and inspection terms are formalized transparently prior to commencement.'
                : 'تُصنع قطع التصنيع الخاص يدوياً وفق المواصفات والمخططات المعتمدة من العميل. يتم تحديد المواعيد الزمنية وخامات الخشب والرخام والأقمشة الإيطالية بوضوح في أمر العمل قبل بدء التنفيذ.'}
            </p>
          </div>

          {/* Section 4: Contact */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1C1816] to-[#141110] border border-[#C4A070]/30 space-y-4 shadow-xl">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#F2EFE8]">
              {isEn ? 'Inquiries & Legal Advisory' : 'للاستفسارات والتواصل الرسمي'}
            </h2>
            <p className="text-xs text-[#A19A91]">
              {isEn
                ? 'For any questions regarding your data privacy or bespoke terms, our concierge is available at:'
                : 'لأي استفسار يخص خصوصية بياناتك أو شروط التنفيذ والضمان، يسعدنا تواصلك المباشر مع إدارة الأتيليه:'}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs">
              <a 
                href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} 
                className="inline-flex items-center gap-2 text-[#C4A070] hover:text-[#E5C9A3] transition-colors"
              >
                <FaPhone className="w-3.5 h-3.5" />
                <span dir="ltr" className="font-mono">{CONTACT_INFO.phone}</span>
              </a>
              <span className="text-white/20">•</span>
              <a 
                href={`mailto:${CONTACT_INFO.email}`} 
                className="inline-flex items-center gap-2 text-[#C4A070] hover:text-[#E5C9A3] transition-colors"
              >
                <FaEnvelope className="w-3.5 h-3.5" />
                <span>{CONTACT_INFO.email}</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Return Button */}
        <div className="text-center pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full gold-btn-secondary text-xs font-bold transition-all"
          >
            <span>{isEn ? 'Return to Home' : 'العودة للصفحة الرئيسية'}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
