import { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaMagnifyingGlass, FaCircleInfo } from 'react-icons/fa6'
import ImagePicker from './ImagePicker'

export interface SEOSectionProps {
  metaTitle: string
  setMetaTitle: (val: string) => void
  metaDescription: string
  setMetaDescription: (val: string) => void
  keywords: string
  setKeywords: (val: string) => void
  canonicalUrl: string
  setCanonicalUrl: (val: string) => void
  robotsIndex?: boolean
  setRobotsIndex: (val: boolean) => void
  robotsFollow?: boolean
  setRobotsFollow: (val: boolean) => void
  robotsNoarchive?: boolean
  setRobotsNoarchive: (val: boolean) => void
  robotsNosnippet?: boolean
  setRobotsNosnippet: (val: boolean) => void
  ogTitle: string
  setOgTitle: (val: string) => void
  ogDescription: string
  setOgDescription: (val: string) => void
  ogImage: string
  setOgImage: (val: string) => void
  twitterCard?: string
  setTwitterCard: (val: string) => void
  imageAlt: string
  setImageAlt: (val: string) => void
  locale?: 'ar' | 'en'
}

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
  locale = 'ar',
}: SEOSectionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const isEn = locale === 'en'

  return (
    <div className="bg-white rounded-2xl border border-[#E6E1DC] overflow-hidden shadow-sm transition-all" dir={isEn ? 'ltr' : 'rtl'}>
      {/* Header Accordion */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-5 bg-[#FAF8F5] border-b border-[#E6E1DC] hover:bg-[#F3EFEA] transition-colors cursor-pointer ${isEn ? 'text-left' : 'text-right'}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#C4A070]/15 text-[#C4A070]">
            <FaMagnifyingGlass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#141110]">
              {isEn ? 'Advanced Search Engine Optimization (SEO & Social - English)' : 'إعدادات محركات البحث المتقدمة (SEO & Social)'}
            </h3>
            <p className="text-xs text-[#8C7F75] mt-0.5">
              {isEn ? 'Configure English meta tags, social share previews, and bot indexing' : 'تخصيص وسوم الميتا، بطاقات التواصل الاجتماعي، وأوامر الروبوتس'}
            </p>
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
                <label className="block text-xs font-bold text-[#5C544E]">
                  {isEn ? 'Meta Title (English)' : 'عنوان الميتا (Meta Title)'}
                </label>
                <span className={`text-[11px] ${metaTitle.length >= 50 && metaTitle.length <= 60 ? 'text-green-600 font-bold' : 'text-[#8C7F75]'}`}>
                  {metaTitle.length} / 60 {isEn ? 'chars' : 'حرف'}
                </span>
              </div>
              <input
                type="text"
                className={`w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all ${isEn ? 'text-left' : ''}`}
                placeholder={isEn ? 'English title appearing in Google search results...' : 'العنوان الذي يظهر في نتائج بحث جوجل...'}
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">
                {isEn ? 'Target Focus Keywords' : 'الكلمات المفتاحية المستهدفة (Focus Keywords)'}
              </label>
              <input
                type="text"
                className={`w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all ${isEn ? 'text-left' : ''}`}
                placeholder={isEn ? 'luxury furniture, bespoke palace interior, royal majlis' : 'أثاث فاخر, تصميم داخلي, مجالس راقية'}
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-[#5C544E]">
                {isEn ? 'Meta Description (English)' : 'الوصف التعريفي (Meta Description)'}
              </label>
              <span className={`text-[11px] ${metaDescription.length >= 120 && metaDescription.length <= 160 ? 'text-green-600 font-bold' : 'text-[#8C7F75]'}`}>
                {metaDescription.length} / 160 {isEn ? 'chars' : 'حرف'}
              </span>
            </div>
            <textarea
              rows={3}
              className={`w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all ${isEn ? 'text-left' : ''}`}
              placeholder={isEn ? 'Compelling summary appearing under the title in search engine results...' : 'وصف مشوق ومختصر يظهر تحت العنوان في نتائج محركات البحث...'}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>

          {/* Canonical & Alt */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">
                {isEn ? 'Canonical URL' : 'الرابط النموذجي (Canonical URL)'}
              </label>
              <input
                type="url"
                className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                placeholder={isEn ? 'Leave blank for auto-generation' : 'اتركه فارغاً للتوليد التلقائي'}
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">
                {isEn ? 'Featured Image Alt (English)' : 'نص الصورة البديل (Featured Image Alt)'}
              </label>
              <input
                type="text"
                className={`w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all ${isEn ? 'text-left' : ''}`}
                placeholder={isEn ? 'Describe image content for search engines & screen readers' : 'توضيح محتوى الصورة الرئيسية لمحركات البحث وقارئات الشاشة'}
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>
          </div>

          {/* Robots Rules */}
          <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E6E1DC]">
            <h4 className="text-xs font-bold text-[#141110] mb-3 flex items-center gap-1.5">
              <FaCircleInfo className="text-[#C4A070] w-4 h-4" />
              <span>{isEn ? 'Robots Meta Directives' : 'تعليمات برمجيات الروبوت (Robots Meta Directives)'}</span>
            </h4>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <label className="flex items-center gap-2 text-xs text-[#5C544E] cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-[#C4A070] focus:ring-[#C4A070] h-4 w-4 border-[#E6E1DC]"
                  checked={robotsIndex}
                  onChange={(e) => setRobotsIndex(e.target.checked)}
                />
                <span>{isEn ? 'Allow Indexing (Index)' : 'السماح بالفهرسة (Index)'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#5C544E] cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-[#C4A070] focus:ring-[#C4A070] h-4 w-4 border-[#E6E1DC]"
                  checked={robotsFollow}
                  onChange={(e) => setRobotsFollow(e.target.checked)}
                />
                <span>{isEn ? 'Follow Links (Follow)' : 'تتبع الروابط (Follow)'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#5C544E] cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-[#C4A070] focus:ring-[#C4A070] h-4 w-4 border-[#E6E1DC]"
                  checked={robotsNoarchive}
                  onChange={(e) => setRobotsNoarchive(e.target.checked)}
                />
                <span>{isEn ? 'No Archive (NoArchive)' : 'منع الأرشفة المخبأة (NoArchive)'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#5C544E] cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-[#C4A070] focus:ring-[#C4A070] h-4 w-4 border-[#E6E1DC]"
                  checked={robotsNosnippet}
                  onChange={(e) => setRobotsNosnippet(e.target.checked)}
                />
                <span>{isEn ? 'No Snippet (NoSnippet)' : 'منع المقتطفات (NoSnippet)'}</span>
              </label>
            </div>
          </div>

          {/* Social Sharing / OpenGraph */}
          <div className="border-t border-[#E6E1DC] pt-5 space-y-4">
            <h4 className="text-xs font-bold text-[#141110]">
              {isEn ? 'Social Share Cards (Open Graph / Twitter - English)' : 'تخصيص المشاركة عبر وسائل التواصل (Open Graph / Twitter)'}
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#5C544E] mb-1">
                  {isEn ? 'Social Card Title (OG Title - English)' : 'عنوان المشاركة (OG Title)'}
                </label>
                <input
                  type="text"
                  className={`w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2 text-xs font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all ${isEn ? 'text-left' : ''}`}
                  placeholder={isEn ? 'Leave blank to use main title' : 'اتركه فارغاً لاستخدام العنوان الرئيسي'}
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                />
              </div>

              <div>
                <ImagePicker
                  compact
                  label={isEn ? 'OG Share Image URL' : 'رابط صورة المشاركة (OG Image)'}
                  value={ogImage}
                  onChange={setOgImage}
                  placeholder={isEn ? 'Custom preview image URL for social media' : 'رابط صورة مخصصة تظهر عند مشاركة الرابط'}
                  title={isEn ? 'Choose image for social media' : 'اختر صورة لمشاركتها على شبكات التواصل'}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#5C544E] mb-1">
                  {isEn ? 'Social Card Description (OG Description - English)' : 'وصف المشاركة (OG Description)'}
                </label>
                <textarea
                  rows={2}
                  className={`w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2 text-xs font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:outline-none transition-all ${isEn ? 'text-left' : ''}`}
                  placeholder={isEn ? 'Leave blank to use meta description' : 'اتركه فارغاً لاستخدام الوصف التعريفي'}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C544E] mb-1">
                  {isEn ? 'Twitter Card Type' : 'نوع بطاقة تويتر (Twitter Card)'}
                </label>
                <select
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-xs font-medium text-[#141110] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all cursor-pointer"
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value)}
                >
                  <option value="summary_large_image">{isEn ? 'Large Image Card (Summary Large Image)' : 'صورة كبيرة بارزة (Summary Large Image)'}</option>
                  <option value="summary">{isEn ? 'Small Thumbnail Card (Summary Card)' : 'صورة مصغرة (Summary Card)'}</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
