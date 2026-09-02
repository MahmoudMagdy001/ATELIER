import React, { useState, useEffect } from 'react'
import { bespokeService } from '../services/bespokeService'
import { PageLoading } from '../../../components/ui/Loading'
import Button from '../../../components/ui/Button'
import ImagePicker from '../../../components/admin/ImagePicker'
import type { BespokeStep } from '../../../types/database'
import { 
  FaGem, 
  FaCheck, 
  FaPlus, 
  FaTrashCan, 
  FaImages, 
  FaFloppyDisk 
} from 'react-icons/fa6'

export default function AdminBespoke() {
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [heroTitle, setHeroTitle] = useState<string>('')
  const [heroSubtitle, setHeroSubtitle] = useState<string>('')
  const [serviceDescription, setServiceDescription] = useState<string>('')
  const [ctaText, setCtaText] = useState<string>('')
  const [heroImage, setHeroImage] = useState<string>('')
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null)
  const [steps, setSteps] = useState<BespokeStep[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const content = await bespokeService.fetchBespokeContent()
        if (content) {
          setHeroTitle(content.hero_title || 'تنفيذ التصاميم حسب الطلب')
          setHeroSubtitle(content.hero_subtitle || '')
          setServiceDescription(content.service_description || '')
          setCtaText(content.cta_text || 'طلب استشارة تصميم وتنفيذ مخصص')
          setHeroImage(content.hero_image || '')
          setSteps(Array.isArray(content.steps) ? content.steps : [])
        } else {
          // Defaults
          setHeroTitle('تنفيذ التصاميم حسب الطلب')
          setHeroSubtitle('صياغة أثاث راقٍ ومساحات معمارية حصرية مصممة خصيصاً لأدق تفاصيل قصرك أو فيلتك.')
          setServiceDescription('في S&I Atelier، لا نؤمن بالإنتاج النمطي المتكرر؛ بل نعتبر كل مساحة فراغاً معمارياً يستحق هويته النحتية الخاصة. نقوم بتطويع أفخر الأخشاب الأوروبية ورخام الطبيعة النادر لنحول المخططات الهندسية ورؤيتك إلى تحف واقعية تدوم عبر الأجيال.')
          setCtaText('طلب استشارة تصميم وتنفيذ مخصص')
          setHeroImage('')
          setSteps([
            { step: '01', title: 'الاستشارة والمخطط الهندسي', description: 'دراسة المخطط الهندسي والمساحات وتحديد النسب والارتفاعات المثالية.' },
            { step: '02', title: 'انتقاء الخامات الفاخرة', description: 'معاينة عينات الرخام الطبيعي وأخشاب الجوز وكتالوجات الأقمشة والجلود الإيطالية.' },
            { step: '03', title: 'الصياغة اليدوية والتنفيذ', description: 'تنفيذ القطع في ورشنا المتخصصة بأيدي نخبة من الحرفيين مع مطابقة أدق المقاسات.' },
            { step: '04', title: 'التوصيل والتركيب VIP', description: 'نقل وتركيب متخصص وتنسيق متكامل مع شهادة ضمان معتمدة للأثاث.' }
          ])
        }
      } catch (err: unknown) {
        console.warn('Failed to load bespoke settings:', (err as Error)?.message || err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleAddStep = () => {
    setSteps(prev => [
      ...prev,
      {
        step: `0${prev.length + 1}`,
        title: '',
        description: ''
      }
    ])
  }

  const handleUpdateStep = (index: number, field: keyof BespokeStep, value: string) => {
    setSteps(prev => prev.map((s, idx) => idx === index ? { ...s, [field]: value } : s))
  }

  const handleRemoveStep = (index: number) => {
    setSteps(prev => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let finalHeroImage = heroImage
      if (heroImageFile) {
        finalHeroImage = await bespokeService.uploadHeroImage(heroImageFile)
      }

      await bespokeService.updateBespokeContent({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        service_description: serviceDescription,
        cta_text: ctaText,
        hero_image: finalHeroImage,
        steps,
      })

      alert('تم حفظ وتحديث محتوى صفحة التنفيذ حسب الطلب بنجاح!')
    } catch (err: unknown) {
      alert('فشل الحفظ: ' + ((err as Error)?.message || String(err)))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageLoading text="جار تحميل إعدادات خدمة التنفيذ..." />

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans" dir="rtl">
      <div className="border-b border-[#E6E1DC] pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#14110F] flex items-center gap-2">
            <FaGem className="text-[#C5A880]" />
            <span>إدارة صفحة التنفيذ حسب الطلب (Bespoke Service)</span>
          </h1>
          <p className="text-xs text-[#8C7F75] mt-1">
            التحكم في نصوص التعريف، مراحل التنفيذ، وخلفية صفحة التنفيذ حسب الطلب
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Hero & Texts */}
        <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-6">
          <h3 className="font-bold text-sm text-[#14110F] border-b border-[#E6E1DC] pb-2 flex items-center justify-between">
            <span>العناوين والنصوص التعريفية</span>
            <span className="text-[11px] text-[#8C7F75] font-normal">النصوص التي تظهر في الواجهة العلوية لصفحة التنفيذ</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#14110F] mb-1.5">
                عنوان الصفحة الرئيسي (Hero Title) *
              </label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="مثال: تنفيذ التصاميم حسب الطلب"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D6CDC4] text-xs font-bold text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14110F] mb-1.5">
                نص زر التحويل والدعوة للطلب (CTA Text)
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="مثال: طلب استشارة تصميم وتنفيذ مخصص"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D6CDC4] text-xs font-bold text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#14110F] mb-1.5">
              العنوان الفرعي (Hero Subtitle)
            </label>
            <input
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="مثال: صياغة أثاث راقٍ ومساحات معمارية حصرية مصممة خصيصاً لأدق تفاصيل قصرك أو فيلتك."
              className="w-full px-4 py-2.5 rounded-xl border border-[#D6CDC4] text-xs font-medium text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#14110F] mb-1.5">
              وصف فلسفة الخدمة المعمارية (Service Description) *
            </label>
            <textarea
              rows={4}
              required
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              placeholder="اكتب نبذة وفلسفة الخدمة المعمارية بالتفصيل..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#D6CDC4] text-xs leading-relaxed font-medium text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
            />
          </div>

          {/* SECTION 2: Hero Image Upload (Direct Upload or Media Library) */}
          <div className="pt-4 border-t border-[#E6E1DC]">
            <ImagePicker
              label="صورة خلفية القسم الرئيسي لصفحة التنفيذ (Hero Banner Image)"
              value={heroImage}
              onChange={setHeroImage}
              file={heroImageFile}
              onFileChange={setHeroImageFile}
              onRemove={() => {
                setHeroImage('')
                setHeroImageFile(null)
              }}
              hint="صورة بانورامية فوتوغرافية فاخرة تعكس دقة التشطيبات وخامات الأثاث"
              title="اختر صورة لخلفية خدمة التنفيذ حسب الطلب من مكتبة الوسائط"
            />
          </div>
        </div>

        {/* SECTION 3: Steps Management */}
        <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#14110F]">
                مراحل التنفيذ والمسار (Creation Steps)
              </h3>
              <p className="text-[11px] text-[#8C7F75]">
                خطوات العمل التي يمر بها طلب التفصيل الخاص
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStep}
              className="px-3 py-1.5 rounded-xl bg-[#C5A880]/15 text-[#C5A880] hover:bg-[#C5A880] hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <FaPlus className="w-3 h-3" />
              <span>إضافة مرحلة</span>
            </button>
          </div>

          <div className="space-y-4">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#E6E1DC] bg-[#FAF8F5] space-y-3 relative group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={st.step || `0${idx + 1}`}
                      onChange={(e) => handleUpdateStep(idx, 'step', e.target.value)}
                      placeholder="01"
                      className="w-14 px-2 py-1.5 rounded-lg border border-[#D6CDC4] text-xs font-bold text-center text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                      placeholder="عنوان المرحلة (مثال: الاستشارة الهندسية)"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#D6CDC4] text-xs font-bold text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="حذف المرحلة"
                  >
                    <FaTrashCan className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={st.description}
                  onChange={(e) => handleUpdateStep(idx, 'description', e.target.value)}
                  placeholder="وصف وتفاصيل ما يحدث في هذه المرحلة..."
                  className="w-full px-3 py-2 rounded-lg border border-[#D6CDC4] text-xs font-medium text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={submitting}
            icon={<FaFloppyDisk />}
          >
            {submitting ? 'جار الحفظ...' : 'حفظ ونشر التعديلات'}
          </Button>
        </div>
      </form>
    </div>
  )
}
