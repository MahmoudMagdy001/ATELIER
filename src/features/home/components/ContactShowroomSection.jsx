import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, viewportOnce } from '../../../constants/animations'
import { CONTACT_INFO } from '../../../constants/contactInfo'
import { 
  FaLocationDot, 
  FaPhone, 
  FaClock, 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapLocationDot, 
  FaArrowUpRightFromSquare, 
  FaCopy, 
  FaCheck,
  FaRoute,
  FaHeadset,
  FaArrowLeft
} from 'react-icons/fa6'

export default function ContactShowroomSection({ settings }) {
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)

  const primaryPhone = CONTACT_INFO.phone
  const secondaryPhone = CONTACT_INFO.vipLine
  const whatsappNum = CONTACT_INFO.whatsappRaw
  const address = CONTACT_INFO.address
  const email = CONTACT_INFO.email
  const googleMapsUrl = CONTACT_INFO.googleMapsUrl
  const mapsEmbedSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115949.33649557673!2d46.6752959!3d24.7135517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d48939b%3A0x62953e5e40a04910!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sar!2ssa!4v1709300000000!5m2!1sar!2ssa'

  const handleCopyPhone = () => {
    if (!primaryPhone) return
    navigator.clipboard.writeText(primaryPhone)
    setCopiedPhone(true)
    setTimeout(() => setCopiedPhone(false), 2000)
  }

  const handleCopyAddress = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="w-full space-y-8" 
      aria-labelledby="contact-showroom-heading"
    >
      {/* Header Matching Exactly with Home Sections (max-w-7xl px-6) */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6">
          <div className="space-y-2">
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
              <FaMapLocationDot className="w-3.5 h-3.5" /> صالة العرض والتواصل
            </span>
            <h2 id="contact-showroom-heading" className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
              موقع المعرض واستقبال الزوار
            </h2>
          </div>
          <a 
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#C4A070] hover:text-[#E5C9A3] flex items-center gap-1.5 transition-colors group"
          >
            <span>عرض الاتجاهات في خرائط Google</span>
            <FaArrowLeft className="w-3 h-3 group-hover:translate-x-[-4px] transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* Main Container: Wide container with custom padding */}
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <motion.div variants={fadeUp} className="flex flex-col lg:flex-row items-stretch gap-5 lg:gap-6 w-full">
        
        {/* RIGHT COLUMN: Compact Contact Cards */}
        <div className="w-full lg:w-[380px] xl:w-[430px] shrink-0 flex flex-col justify-between gap-3">
          
          {/* 1. Address Card */}
          {address && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141110] border border-[#C4A070]/20 hover:border-[#C4A070]/50 transition-all duration-300 shadow-xl group">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C4A070]/15 border border-[#C4A070]/30 flex items-center justify-center text-[#C4A070] text-base shrink-0 group-hover:scale-105 transition-transform">
                  <FaLocationDot />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-bold text-[#C4A070] uppercase tracking-wider">العنوان والموقع</span>
                    <button 
                      onClick={handleCopyAddress}
                      type="button"
                      className="text-[10px] text-[#827771] hover:text-[#C4A070] flex items-center gap-1 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/5"
                      title="نسخ العنوان"
                    >
                      {copiedAddress ? (
                        <>
                          <FaCheck className="w-2.5 h-2.5 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <FaCopy className="w-2.5 h-2.5" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold font-serif text-[#F2EFE8] leading-snug">
                    {address}
                  </h3>
                  <p className="text-[10.5px] text-[#827771] leading-tight">
                    مواقف سيارات VIP مجانية وخدمة استقبال خاصة لعملاء أتيليه.
                  </p>
                  <div className="pt-1">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#C4A070] hover:text-[#E5C9A3] transition-colors"
                    >
                      <FaRoute className="w-2.5 h-2.5" />
                      <span>الاتجاهات في خرائط Google</span>
                      <FaArrowUpRightFromSquare className="w-2 h-2" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Phone Numbers & Direct Support */}
          {(primaryPhone || whatsappNum || email) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141110] border border-[#C4A070]/20 hover:border-[#C4A070]/50 transition-all duration-300 shadow-xl group">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C4A070]/15 border border-[#C4A070]/30 flex items-center justify-center text-[#C4A070] text-base shrink-0 group-hover:scale-105 transition-transform">
                  <FaPhone />
                </div>
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-bold text-[#C4A070] uppercase tracking-wider">التواصل والمبيعات</span>
                    {primaryPhone && (
                      <button 
                        onClick={handleCopyPhone}
                        type="button"
                        className="text-[10px] text-[#827771] hover:text-[#C4A070] flex items-center gap-1 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/5"
                        title="نسخ الرقم الرئيسي"
                      >
                        {copiedPhone ? (
                          <>
                            <FaCheck className="w-2.5 h-2.5 text-emerald-400" />
                            <span className="text-emerald-400">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <FaCopy className="w-2.5 h-2.5" />
                            <span>نسخ</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {/* Primary Phone */}
                    {primaryPhone && (
                      <a 
                        href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                        className="p-2 px-3 rounded-xl bg-[#1C1816] border border-white/5 hover:border-[#C4A070]/40 transition-all flex items-center justify-between group/num"
                      >
                        <div className="min-w-0">
                          <span className="text-[9.5px] text-[#827771] block leading-tight">الهاتف الرئيسي / المعرض</span>
                          <span className="text-xs font-bold font-mono text-[#F2EFE8] group-hover/num:text-[#C4A070] transition-colors truncate block" dir="ltr">
                            {primaryPhone}
                          </span>
                        </div>
                        <span className="text-[9.5px] px-2 py-0.5 rounded bg-[#C4A070]/10 text-[#C4A070] font-bold shrink-0">
                          اتصال
                        </span>
                      </a>
                    )}

                    {/* VIP Projects Line if secondary exists */}
                    {secondaryPhone && (
                      <a 
                        href={`tel:${secondaryPhone.replace(/\s+/g, '')}`}
                        className="p-2 px-3 rounded-xl bg-[#1C1816] border border-white/5 hover:border-[#C4A070]/40 transition-all flex items-center justify-between group/num"
                      >
                        <div className="min-w-0">
                          <span className="text-[9.5px] text-[#827771] block leading-tight">مشاريع القصور والفيلات</span>
                          <span className="text-xs font-bold font-mono text-[#F2EFE8] group-hover/num:text-[#C4A070] transition-colors truncate block" dir="ltr">
                            {secondaryPhone}
                          </span>
                        </div>
                        <span className="text-[9.5px] px-2 py-0.5 rounded bg-[#C4A070]/10 text-[#C4A070] font-bold shrink-0">
                          مباشر
                        </span>
                      </a>
                    )}
                  </div>

                  {/* WhatsApp & Email Quick Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 pt-0.5">
                    {whatsappNum && (
                      <a
                        href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('مرحباً أتيليه، أود الاستفسار عن التصاميم وزيارة المعرض')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5" />
                        <span>واتساب فوري</span>
                      </a>
                    )}

                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 text-[#B3A9A3] hover:text-[#F2EFE8] hover:border-[#C4A070]/30 text-[10.5px] font-medium flex items-center justify-center gap-1.5 transition-all truncate"
                      >
                        <FaEnvelope className="w-3 h-3 text-[#C4A070] shrink-0" />
                        <span className="font-mono truncate">{email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Working Hours Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141110] border border-[#C4A070]/20 hover:border-[#C4A070]/50 transition-all duration-300 shadow-xl group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C4A070]/15 border border-[#C4A070]/30 flex items-center justify-center text-[#C4A070] text-base shrink-0 group-hover:scale-105 transition-transform">
                <FaClock />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <span className="text-[10px] font-bold text-[#C4A070] uppercase tracking-wider">مواعيد العمل واستقبال الزوار</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-[#1C1816] border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between text-[#F2EFE8] font-bold text-[11px]">
                      <span>السبت — الخميس</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                    <p className="text-[#827771] text-[10px]">
                      10:00 ص — 10:00 م
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-[#1C1816] border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between text-[#F2EFE8] font-bold text-[11px]">
                      <span>يوم الجمعة</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4A070]"></span>
                    </div>
                    <p className="text-[#827771] text-[10px]">
                      4:00 م — 10:00 م
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#C4A070] pt-0.5">
                  <FaHeadset className="w-2.5 h-2.5 shrink-0" />
                  <span className="leading-tight">استشارات كبار الشخصيات متاحة بموعد مسبق</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* LEFT COLUMN: Large Interactive Map */}
        <div className="flex-1 w-full flex flex-col">
          <div className="relative flex-1 min-h-[460px] lg:min-h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C4A070]/30 bg-[#141110] shadow-2xl flex flex-col group">
              
              {/* Top Luxury Bar */}
              <div className="p-3 px-4 sm:px-6 bg-[#141110]/95 backdrop-blur-md border-b border-[#C4A070]/20 flex items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-bold font-serif text-[#F2EFE8] truncate">
                    صالة عرض أتيليه الفاخرة — الرياض
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-[#C4A070] hover:bg-[#E5C9A3] text-[#1C1816] text-[11px] font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                  >
                    <span>فتح في الخرائط</span>
                    <FaArrowUpRightFromSquare className="w-2 h-2" />
                  </a>
                </div>
              </div>

              {/* Google Map Embed Iframe (Full bleed left) */}
              <div className="relative flex-1 w-full h-full min-h-[380px]">
                <iframe
                  title="موقع معرض أتيليه للأثاث الفاخر"
                  src={mapsEmbedSrc}
                  className="absolute inset-0 w-full h-full border-0 transition-opacity duration-300 brightness-90 contrast-105 hover:brightness-100"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* Map Bottom Information Footer */}
              <div className="p-3 px-4 sm:px-6 bg-[#141110]/95 backdrop-blur-md border-t border-[#C4A070]/20 flex items-center justify-between gap-3 text-xs z-10">
                <div className="flex items-center gap-2 min-w-0">
                  <FaLocationDot className="text-[#C4A070] w-3.5 h-3.5 shrink-0" />
                  <span className="text-[#827771] text-[11px] truncate">
                    طريق الملك فهد، حي العليا، الرياض — المملكة العربية السعودية
                  </span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#C4A070] hover:text-[#E5C9A3] shrink-0 flex items-center gap-1 transition-colors"
                >
                  <span>احصل على الاتجاهات</span>
                  <FaRoute className="w-2.5 h-2.5" />
                </a>
              </div>

            </div>
          </div>

        </motion.div>
      </div>
    </motion.section>
  )
}
