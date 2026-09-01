import React, { useState, useEffect } from 'react'
import { adminService } from '../../admin/services/adminService'
import SEO from '../../../components/ui/SEO'
import { PageLoading } from '../../../components/ui/Loading'
import { FaGem, FaAward, FaBuildingColumns, FaWhatsapp, FaPhone } from 'react-icons/fa6'

export default function About() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await adminService.fetchSettings()
        setSettings(data)
      } catch (err) {
        console.warn('Failed to load settings:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  if (loading) return <PageLoading text="جار تحميل بيانات الدار..." />

  return (
    <div className="bg-[#1C1816] text-[#F2EFE8] min-h-screen font-sans pt-20" dir="rtl">
      <SEO
        title={`عن ${settings?.site_name || 'أتيليه للأثاث الفاخر'} | الحرفية والرؤية المعمارية`}
        description={settings?.site_description || 'دار أثاث فاخرة رائدة تجمع بين الحرفية الإيطالية والتصاميم المعمارية المصنوعة بالطلب.'}
        slug="about"
      />

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs text-[#C4A070] tracking-[0.25em] font-bold uppercase">
            THE HOUSE OF BESPOKE ELEGANCE
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#F2EFE8]">
            {settings?.site_name || 'أتيليه (ATELIER)'}
          </h1>
          <p className="text-xs md:text-sm text-[#B3A9A3] leading-relaxed">
            حيث تلتقي الرؤية المعمارية بالأثاث المصنوع بالطلب لأرقى القصور والفيلات.
          </p>
        </div>

        {/* Story Card */}
        <div className="rounded-3xl bg-[#141110] border border-[#C4A070]/20 p-8 sm:p-12 md:p-16 space-y-8 shadow-2xl">
          <div className="space-y-4 text-sm md:text-base text-[#DEDAD6] leading-loose">
            <p>
              تأسست <strong className="text-[#C4A070]">{settings?.site_name || 'ATELIER'}</strong> لتكون الوجهة الأولى والفريدة لعشاق الفخامة الخالدة والتصاميم المخصصة بالطلب.
            </p>
            <p>
              {settings?.site_description || 'نبتكر قطع أثاث فريدة وتصاميم داخلية استثنائية تعكس الفخامة المطلقة للقصور والمساحات الراقية بأيدي أمهر الحرفيين الإيطاليين والعالميين.'}
            </p>
            <p>
              نؤمن بأن كل فراغ معماري يمتلك شخصيته المستقلة، لذا نصنع كل قطعة بأبعاد وألوان وخامات تتناغم كلياً مع فلسفة المكان ورغبة العميل.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="p-6 rounded-2xl bg-white/5 space-y-2 text-center border border-white/5">
              <FaGem className="text-2xl text-[#C4A070] mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#F2EFE8]">حرفية استثنائية</h4>
              <p className="text-xs text-[#827771] leading-relaxed">انتقاء دقيق لأندر أخشاب الجوز المعتق، الرخام الطبيعي، والمخمل الإيطالي</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 space-y-2 text-center border border-white/5">
              <FaBuildingColumns className="text-2xl text-[#C4A070] mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#F2EFE8]">تصميم مخصص 100%</h4>
              <p className="text-xs text-[#827771] leading-relaxed">صناعة وتعديل المقاسات والخيارات لتطابق مخطط قصرك أو مساحتك تماماً</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 space-y-2 text-center border border-white/5">
              <FaAward className="text-2xl text-[#C4A070] mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#F2EFE8]">ضمان واهتمام دائم</h4>
              <p className="text-xs text-[#827771] leading-relaxed">ضمان شامل 10 سنوات مع خدمة كونسيرج وصيانة دورية راقية</p>
            </div>
          </div>

          {/* Contact Box */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
            <div className="text-center sm:text-right">
              <h5 className="text-sm font-bold text-[#F2EFE8]">هل ترغب في زيارة صالة العرض الخاصة؟</h5>
              <p className="text-xs text-[#827771]">احجز موعداً خاصاً مع كبير المصممين لمعاينة الكتالوجات الحصرية.</p>
            </div>

            <div className="flex gap-3">
              <a
                href="https://wa.me/966501234567?text=مرحباً%20أتيليه،%20أود%20حجز%20موعد%20استشارة%20معمارية"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
                <span>حجز موعد</span>
              </a>
              <a
                href="tel:+966501234567"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#F2EFE8] text-xs font-bold flex items-center gap-2 border border-white/10"
              >
                <FaPhone className="w-3.5 h-3.5 text-[#C4A070]" />
                <span>اتصال</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
