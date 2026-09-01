import { useState, useEffect } from 'react'
import { FaCircleCheck, FaCircleXmark, FaCircleExclamation, FaCalculator } from 'react-icons/fa6'

/**
 * Real-time Rank Math & Yoast style SEO score calculator
 */
export default function SEOAnalyzer({
  title = '',
  description = '',
  content = '',
  focusKeyword = '',
  imageAlt = '',
  canonicalUrl = '',
}) {
  const [score, setScore] = useState(0)
  const [checks, setChecks] = useState([])
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const textContent = content ? content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : ''
    const wordCount = textContent ? textContent.split(/\s+/).length : 0

    const newChecks = []
    let tempScore = 0

    const keyword = focusKeyword ? focusKeyword.trim().toLowerCase() : ''
    const titleLower = title.toLowerCase()
    const descLower = description.toLowerCase()
    const textLower = textContent.toLowerCase()

    // 1. Title Length Check (50-60 chars)
    if (title.length >= 45 && title.length <= 65) {
      newChecks.push({ id: 'title-len', status: 'success', text: 'طول عنوان المقال مثالي جداً (45-65 حرفاً)' })
      tempScore += 12
    } else if (title.length > 0 && title.length < 45) {
      newChecks.push({ id: 'title-len', status: 'warning', text: 'عنوان المقال قصير. أضف كلمات مفتاحية أو صياغة أوضح (أقل من 45 حرفاً)' })
      tempScore += 6
    } else if (title.length > 65) {
      newChecks.push({ id: 'title-len', status: 'warning', text: 'عنوان المقال طويل وقد يظهر مقتطعاً في نتائج البحث (أكثر من 65 حرفاً)' })
      tempScore += 6
    } else {
      newChecks.push({ id: 'title-len', status: 'danger', text: 'يرجى كتابة عنوان المقال أولاً' })
    }

    // 2. Meta Description Length Check (120-160 chars)
    if (description.length >= 110 && description.length <= 165) {
      newChecks.push({ id: 'desc-len', status: 'success', text: 'طول الوصف التعريفي (Meta Description) ممتاز ومكتمل (110-165 حرفاً)' })
      tempScore += 12
    } else if (description.length > 0 && description.length < 110) {
      newChecks.push({ id: 'desc-len', status: 'warning', text: 'الوصف التعريفي قصير. أضف المزيد من التفاصيل الجذابة (أقل من 110 أحرف)' })
      tempScore += 6
    } else if (description.length > 165) {
      newChecks.push({ id: 'desc-len', status: 'warning', text: 'الوصف التعريفي يتجاوز الحد الموصى به لمحركات البحث' })
      tempScore += 6
    } else {
      newChecks.push({ id: 'desc-len', status: 'danger', text: 'يرجى كتابة وصف تعريفي للمقال لجذب النقرات في جوجل' })
    }

    // 3. Focus Keyword Checks
    if (keyword) {
      // In Title
      if (titleLower.includes(keyword)) {
        newChecks.push({ id: 'kw-title', status: 'success', text: `الكلمة المفتاحية المستهدفة موجودة في العنوان الرئيسية` })
        tempScore += 15
      } else {
        newChecks.push({ id: 'kw-title', status: 'danger', text: `الكلمة المفتاحية غير موجودة في عنوان المقال الرئيسي` })
      }

      // In Description
      if (descLower.includes(keyword)) {
        newChecks.push({ id: 'kw-desc', status: 'success', text: `الكلمة المفتاحية المستهدفة موجودة في الوصف التعريفي` })
        tempScore += 15
      } else {
        newChecks.push({ id: 'kw-desc', status: 'warning', text: `الكلمة المفتاحية غير مذكورة داخل الوصف التعريفي` })
        tempScore += 4
      }

      // In Content
      if (textLower.includes(keyword)) {
        // Keyword density
        const occurrences = (textLower.match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
        const density = wordCount > 0 ? ((occurrences / wordCount) * 100).toFixed(1) : 0

        if (density >= 0.5 && density <= 3.0) {
          newChecks.push({ id: 'kw-density', status: 'success', text: `كثافة الكلمة المفتاحية في المحتوى ممتازة (${occurrences} مرات - بنسبة ${density}%)` })
          tempScore += 15
        } else if (density > 3.0) {
          newChecks.push({ id: 'kw-density', status: 'warning', text: `تكرار مفرط للكلمة المفتاحية (${density}%). تجنب حشو الكلمات (Keyword Stuffing)` })
          tempScore += 8
        } else {
          newChecks.push({ id: 'kw-density', status: 'warning', text: `تكرار الكلمة المفتاحية قليل (${occurrences} مرات). اذكرها أكثر داخل النص` })
          tempScore += 8
        }
      } else {
        newChecks.push({ id: 'kw-content', status: 'danger', text: `الكلمة المفتاحية غير مذكورة إطلاقاً في نص المقال` })
      }
    } else {
      newChecks.push({ id: 'kw-none', status: 'danger', text: 'لم يتم تحديد كلمة مفتاحية رئيسية (Focus Keyword) لتحليل المقال' })
    }

    // 4. Content Word Count Check
    if (wordCount >= 600) {
      newChecks.push({ id: 'word-count', status: 'success', text: `طول المقال احترافي وغني بالمعلومات (${wordCount} كلمة)` })
      tempScore += 15
    } else if (wordCount >= 300) {
      newChecks.push({ id: 'word-count', status: 'warning', text: `طول المقال جيد (${wordCount} كلمة). يفضل الوصول إلى 600+ كلمة لنتائج تصدر أقوى` })
      tempScore += 9
    } else if (wordCount > 0) {
      newChecks.push({ id: 'word-count', status: 'danger', text: `المقال قصير جداً (${wordCount} كلمة). مقالات الـ SEO القوية تتطلب 300 كلمة على الأقل` })
      tempScore += 3
    } else {
      newChecks.push({ id: 'word-count', status: 'danger', text: 'محتوى المقال فارغ' })
    }

    // 5. Headings Check (H2/H3 presence)
    if (content.includes('<h2') || content.includes('<h3')) {
      newChecks.push({ id: 'headings', status: 'success', text: 'المقال منظم ويحتوي على عناوين فرعية (H2 / H3)' })
      tempScore += 8
    } else {
      newChecks.push({ id: 'headings', status: 'warning', text: 'لم يتم إضافة عناوين فرعية (H2 / H3) لتقسيم فقرات المقال' })
      tempScore += 2
    }

    // 6. Image Alt Tag
    if (imageAlt && imageAlt.trim().length > 3) {
      newChecks.push({ id: 'img-alt', status: 'success', text: 'تم تخصيص نص بديل (Alt Text) للصورة البارزة لتحسين محركات البحث' })
      tempScore += 8
    } else {
      newChecks.push({ id: 'img-alt', status: 'warning', text: 'لم يتم كتابة نص بديل للصورة البارزة (مهم للـ SEO وقارئات الشاشة)' })
      tempScore += 2
    }

    setScore(Math.min(100, tempScore))
    setChecks(newChecks)
  }, [title, description, content, focusKeyword, imageAlt, canonicalUrl])

  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-300'
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-300'
    return 'text-rose-700 bg-rose-50 border-rose-300'
  }

  const getScoreBadge = () => {
    if (score >= 80) return 'ممتاز (SEO Ready)'
    if (score >= 50) return 'جيد (يحتاج تحسينات)'
    return 'ضعيف (يتطلب معالجة)'
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E6E1DC] overflow-hidden shadow-sm transition-all" dir="rtl">
      {/* Header */}
      <div className="p-4 bg-[#FAF8F5] border-b border-[#E6E1DC] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#C5A880]/15 text-[#C5A880]">
            <FaCalculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#14110F]">تحليل جودة الـ SEO الحي (Rank Math Score)</h4>
            <p className="text-xs text-[#8C7F75] mt-0.5">فحص لحظي ومباشر لتوافق المقال مع معايير محركات البحث</p>
          </div>
        </div>

        {/* Score Pill */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold text-xs ${getScoreColor()}`}>
          <span className="text-base font-extrabold">{score}/100</span>
          <span>{getScoreBadge()}</span>
        </div>
      </div>

      {/* Checklist Breakdown */}
      <div className="p-5 space-y-2.5 max-h-96 overflow-y-auto">
        {checks.map((check) => (
          <div key={check.id} className="flex items-start gap-2.5 text-xs py-1">
            {check.status === 'success' && <FaCircleCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
            {check.status === 'warning' && <FaCircleExclamation className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
            {check.status === 'danger' && <FaCircleXmark className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
            <span className={check.status === 'success' ? 'text-[#14110F]' : check.status === 'warning' ? 'text-[#5C544E]' : 'text-rose-700 font-medium'}>
              {check.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
