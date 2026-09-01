import { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaMagnifyingGlass, FaCircleInfo } from 'react-icons/fa6'

export default function SEOSection({
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  keywords,
  setKeywords,
  canonicalUrl,
  setCanonicalUrl,
  robotsIndex = true,
  setRobotsIndex,
  robotsFollow = true,
  setRobotsFollow,
  robotsNoarchive = false,
  setRobotsNoarchive,
  robotsNosnippet = false,
  setRobotsNosnippet,
  ogTitle,
  setOgTitle,
  ogDescription,
  setOgDescription,
  ogImage,
  setOgImage,
  twitterCard = 'summary_large_image',
  setTwitterCard,
  imageAlt,
  setImageAlt,
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="bg-white rounded-2xl border border-[#E6E1DC] overflow-hidden shadow-sm transition-all" dir="rtl">
      {/* Header Accordion */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-[#FAF8F5] border-b border-[#E6E1DC] hover:bg-[#F3EFEA] transition-colors cursor-pointer text-right"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#C5A880]/15 text-[#C5A880]">
            <FaMagnifyingGlass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#14110F]">إعدادات محركات البحث المتقدمة (SEO & Social)</h3>
            <p className="text-xs text-[#8C7F75] mt-0.5">تخصيص وسوم الميتا، بطاقات التواصل الاجتماعي، وأوامر الروبوتس</p>
          </div>
        </div>
        <div className="text-[#8C7F75]">
          {isOpen ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Content Form */}
      {isOpen && (
        <div className="p-6 space-y-6">
          
          {/* Title & Keywords */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-[#5C544E]">عنوان الميتا (Meta Title)</label>
                <span className={`text-[11px] ${metaTitle.length >= 50 && metaTitle.length <= 60 ? 'text-green-600 font-bold' : 'text-[#8C7F75]'}`}>
                  {metaTitle.length} / 60 حرف
                </span>
              </div>
              <input
                type="text"
                className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                placeholder="العنوان الذي يظهر في نتائج بحث جوجل..."
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الكلمات المفتاحية المستهدفة (Focus Keywords)</label>
              <input
                type="text"
                className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                placeholder="أثاث فاخر, تصميم داخلي, مجالس راقية"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-[#5C544E]">الوصف التعريفي (Meta Description)</label>
              <span className={`text-[11px] ${metaDescription.length >= 120 && metaDescription.length <= 160 ? 'text-green-600 font-bold' : 'text-[#8C7F75]'}`}>
                {metaDescription.length} / 160 حرف
              </span>
            </div>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
              placeholder="وصف مشوق ومختصر يظهر تحت العنوان في نتائج محركات البحث..."
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>

          {/* Canonical & Alt */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الرابط النموذجي (Canonical URL)</label>
              <input
                type="url"
                className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                placeholder="اتركه فارغاً للتوليد التلقائي"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">نص الصورة البديل (Featured Image Alt)</label>
              <input
                type="text"
                className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                placeholder="توضيح محتوى الصورة الرئيسية لمحركات البحث وقارئات الشاشة"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>
          </div>

          {/* Robots Rules */}
          <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E6E1DC]">
            <h4 className="text-xs font-bold text-[#14110F] mb-3 flex items-center gap-1.5">
              <FaCircleInfo className="text-[#C5A880] w-4 h-4" />
              <span>تعليمات برمجيات الروبوت (Robots Meta Directives)</span>
            </h4>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <label className="flex items-center gap-2 text-xs text-[#5C544E] cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-[#C5A880] focus:ring-[#C5A880] h-4 w-4 border-[#E6E1DC]"
                  checked={robotsIndex}
                  onChange={(e) => setRobotsIndex(e.target.checked)}
                />
                <span>السماح بالفهرسة (Index)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#5C544E] cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-[#C5A880] focus:ring-[#C5A880] h-4 w-4 border-[#E6E1DC]"
                  checked={robotsFollow}
                  onChange={(e) => setRobotsFollow(e.target.checked)}
                />
                <span>تتبع الروابط (Follow)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#5C544E] cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-[#C5A880] focus:ring-[#C5A880] h-4 w-4 border-[#E6E1DC]"
                  checked={robotsNoarchive}
                  onChange={(e) => setRobotsNoarchive(e.target.checked)}
                />
                <span>منع الأرشفة المخبأة (NoArchive)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#5C544E] cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-[#C5A880] focus:ring-[#C5A880] h-4 w-4 border-[#E6E1DC]"
                  checked={robotsNosnippet}
                  onChange={(e) => setRobotsNosnippet(e.target.checked)}
                />
                <span>منع المقتطفات (NoSnippet)</span>
              </label>
            </div>
          </div>

          {/* Social Sharing / OpenGraph */}
          <div className="border-t border-[#E6E1DC] pt-5 space-y-4">
            <h4 className="text-xs font-bold text-[#14110F]">تخصيص المشاركة عبر وسائل التواصل (Open Graph / Twitter)</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#5C544E] mb-1">عنوان المشاركة (OG Title)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2 text-xs text-[#14110F]"
                  placeholder="اتركه فارغاً لاستخدام العنوان الرئيسي"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C544E] mb-1">رابط صورة المشاركة (OG Image)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2 text-xs text-[#14110F]"
                  placeholder="رابط صورة مخصصة تظهر عند مشاركة الرابط"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#5C544E] mb-1">وصف المشاركة (OG Description)</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2 text-xs text-[#14110F]"
                  placeholder="اتركه فارغاً لاستخدام الوصف التعريفي"
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C544E] mb-1">نوع بطاقة تويتر (Twitter Card)</label>
                <select
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-xs text-[#14110F]"
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value)}
                >
                  <option value="summary_large_image">صورة كبيرة بارزة (Summary Large Image)</option>
                  <option value="summary">صورة مصغرة (Summary Card)</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
