import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { PageLoading } from '../../../components/ui/Loading'
import { useAdminOffers } from '../hooks/useAdminOffers'
import { 
  FaPen, 
  FaTrash, 
  FaPlus, 
  FaEye, 
  FaFloppyDisk, 
  FaTag, 
  FaLayerGroup, 
  FaCouch, 
  FaPercent,
  FaCalendarDays,
  FaCircleExclamation
} from 'react-icons/fa6'
import SEOSection from '../../../components/admin/SEOSection'
import SEOAnalyzer from '../../../components/admin/SEOAnalyzer'
import ImagePicker from '../../../components/admin/ImagePicker'
import AdminLanguageTabs, { type AdminLocale } from '../../../components/admin/AdminLanguageTabs'
import type { OfferVariant } from '../../../types/database'

export default function AdminOffers() {
  const [activeLocale, setActiveLocale] = useState<AdminLocale>('ar')
  const {
    offers,
    products,
    loading,
    isEditing,
    currentOffer,
    selectedProductId,
    handleSelectProduct,
    applyBulkDiscount,
    title,
    setTitle,
    titleEn,
    setTitleEn,
    slug,
    setSlug,
    description,
    setDescription,
    descriptionEn,
    setDescriptionEn,
    discountLabel,
    setDiscountLabel,
    discountLabelEn,
    setDiscountLabelEn,
    validUntil,
    setValidUntil,
    badge,
    setBadge,
    badgeEn,
    setBadgeEn,
    status,
    setStatus,
    imageFile,
    setImageFile,
    imageUrl,
    setImageUrl,
    variants,
    addVariant,
    updateVariant,
    removeVariant,
    submitting,
    handleEdit,
    handleCreateNew,
    handleDelete,
    handleSubmit,
    setIsEditing,
    metaTitle,
    setMetaTitle,
    metaTitleEn,
    setMetaTitleEn,
    metaDescription,
    setMetaDescription,
    metaDescriptionEn,
    setMetaDescriptionEn,
    keywords,
    setKeywords,
    canonicalUrl,
    setCanonicalUrl,
    robotsIndex,
    setRobotsIndex,
    robotsFollow,
    setRobotsFollow,
    robotsNoarchive,
    setRobotsNoarchive,
    robotsNosnippet,
    setRobotsNosnippet,
    ogTitle,
    setOgTitle,
    ogDescription,
    setOgDescription,
    ogImage,
    setOgImage,
    twitterCard,
    setTwitterCard,
    imageAlt,
    setImageAlt,
  } = useAdminOffers()

  const getPriceRange = (itemVariants?: OfferVariant[] | null) => {
    if (!itemVariants || itemVariants.length === 0) return 'لا يوجد سعر'
    const validPrices = itemVariants.map(v => Number(v.price)).filter((p: number) => !isNaN(p) && p > 0)
    if (validPrices.length === 0) return '0 ر.س'
    const min = Math.min(...validPrices)
    const max = Math.max(...validPrices)
    if (min === max) return `${min.toLocaleString()} ر.س`
    return `${min.toLocaleString()} - ${max.toLocaleString()} ر.س`
  }

  const isOfferExpired = (dateStr?: string | null) => {
    if (!dateStr) return false
    const today = new Date().toISOString().split('T')[0]
    return dateStr < today
  }

  const setExpiryDays = (days: number) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    setValidUntil(d.toISOString().split('T')[0])
  }

  if (loading && !isEditing) return <PageLoading text="جار تحميل العروض الترويجية..." />

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141110]">
            {isEditing ? (currentOffer ? 'تعديل العرض والخصومات' : 'إنشاء عرض ترويجي جديد') : 'إدارة العروض والخصومات (Offers)'}
          </h1>
          <p className="text-xs text-[#8C7F75] mt-1">إنشاء عروض على منتجات محددة، باقات أثاث مخفضة، وإدارة أسعار المتغيرات الترويجية</p>
        </div>
        {!isEditing && (
          <Button onClick={handleCreateNew} icon={<FaPlus />}>
            إضافة عرض جديد
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Multilingual Tabs */}
          <AdminLanguageTabs
            activeLocale={activeLocale}
            onChange={setActiveLocale}
            hasEnglishContent={Boolean(titleEn || descriptionEn)}
          />

          {/* OPTIONAL: Select Existing Product */}
          <div className="bg-gradient-to-br from-[#141110] to-[#26211F] text-white rounded-2xl p-6 shadow-md space-y-3 border border-[#C4A070]/30">
            <div className="flex items-center gap-2 text-[#C4A070]">
              <FaCouch className="w-5 h-5" />
              <h3 className="font-bold text-sm">إنشاء العرض من منتج متوفر في المتجر (اختياري)</h3>
            </div>
            <p className="text-xs text-[#D6CDC4]">
              اختر أي منتج من القائمة ليتم ملء بيانات العرض تلقائياً (بالعربية والإنجليزية) ونسخ جميع متغيراته وأسعاره لتعديلها:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C4A070]"
                value={selectedProductId}
                onChange={(e) => handleSelectProduct(e.target.value)}
              >
                <option value="" className="text-[#141110]">-- اختر منتجاً لتطبيق العرض عليه --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} className="text-[#141110]">
                    {p.title} ({Array.isArray(p.variants) ? p.variants.length : 0} خيارات)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 1: Basic Info */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-3">
              <div className="flex items-center gap-2.5">
                <FaTag className="text-[#C4A070] w-5 h-5" />
                <h3 className="font-bold text-base text-[#141110]">
                  {activeLocale === 'ar' ? 'بيانات العرض الأساسية (العربية)' : 'Basic Offer Information (English)'}
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8C7F75] border border-[#E6E1DC]">
                {activeLocale === 'ar' ? '🇸🇦 العربية (الرئيسية)' : '🇬🇧 English (Optional)'}
              </span>
            </div>

            {/* Language-dependent fields */}
            {activeLocale === 'ar' ? (
              <div className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5">عنوان العرض الترويجي (بالعربية) *</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="عرض الصالونات الإيطالية VIP (خصم 20%)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5">نص شارة الخصم (Discount Label بالعربية)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                      value={discountLabel}
                      onChange={(e) => setDiscountLabel(e.target.value)}
                      placeholder="خصم 20% لفترة محدودة أو باقة كراسي مجاناً"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5">شارة مميزة (Badge بالعربية)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="عرض الصيف الحصري / باقة تأثيث كاملة"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">تفاصيل وشروط الاستفادة من العرض (بالعربية) *</label>
                  <textarea
                    rows={3}
                    required
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                    placeholder="شرح مميزات هذا العرض، الخصومات المتاحة، والتوصيل المجاني..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4" dir="ltr">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Offer Title (English)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="VIP Italian Salon Collection (20% Off)"
                    />
                    <p className="text-[11px] text-[#8C7F75] mt-1 text-left">Leave blank to use the Arabic title as fallback</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Discount Label (English)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                      value={discountLabelEn}
                      onChange={(e) => setDiscountLabelEn(e.target.value)}
                      placeholder="20% Off Limited Time / Complimentary Armchairs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Featured Badge (English)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                      value={badgeEn}
                      onChange={(e) => setBadgeEn(e.target.value)}
                      placeholder="Exclusive Summer Offer / Full Set"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Offer Details & Terms (English)</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                    placeholder="Details about the promotion, bundle discounts, delivery and assembly privileges..."
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Shared Settings */}
            <div className="pt-4 border-t border-[#E6E1DC] space-y-4">
              <h4 className="text-xs font-bold text-[#8C7F75] uppercase tracking-wider">الإعدادات العامة للعرض (مشتركة)</h4>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الرابط المخصص (Slug)</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                    placeholder="vip-italian-salons-exclusive-offer"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#5C544E]">تاريخ انتهاء صلاحية العرض</label>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setExpiryDays(30)}
                        className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E1DC] hover:bg-[#C4A070] hover:text-white transition-colors cursor-pointer"
                      >
                        +30 يوم
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpiryDays(60)}
                        className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E1DC] hover:bg-[#C4A070] hover:text-white transition-colors cursor-pointer"
                      >
                        +60 يوم
                      </button>
                      <button
                        type="button"
                        onClick={() => setValidUntil('')}
                        className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E1DC] hover:bg-[#C4A070] hover:text-white transition-colors cursor-pointer"
                      >
                        دائم
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium text-[#141110] focus:outline-none transition-all ${
                      validUntil && isOfferExpired(validUntil)
                        ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500'
                        : 'border-[#E6E1DC] bg-white focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070]'
                    }`}
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                  {validUntil && isOfferExpired(validUntil) && (
                    <div className="mt-1.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-start gap-1.5">
                      <FaCircleExclamation className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span>تنبيه: هذا التاريخ في الماضي (منتهي)، لذلك لن يظهر العرض في الموقع للعملاء حتى تمديده أو إزالته ليصبح دائماً.</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">حالة العرض</label>
                  <select
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all cursor-pointer"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="published">منشور وفعال في الموقع (Published)</option>
                    <option value="draft">مسودة / منتهي (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="pt-2">
                <ImagePicker
                  label="صورة / بانر العرض"
                  value={imageUrl}
                  onChange={setImageUrl}
                  file={imageFile}
                  onFileChange={setImageFile}
                  hint="بانر تسويقي جذاب يبرز خصومات ومزايا العرض الحصري"
                  title="اختر صورة للعرض من مكتبة الوسائط"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Dynamic Offer Variants Builder */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-4">
              <div className="flex items-center gap-2.5">
                <FaLayerGroup className="text-[#C4A070] w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base text-[#141110]">
                    خيارات ومتغيرات العرض (Offer Variants)
                  </h3>
                  <p className="text-xs text-[#8C7F75] mt-0.5">
                    حدد لكل خيار مسمياته بالعربية والإنجليزية مع سعر العرض المخفض والسعر الأصلي
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Bulk discount buttons */}
                <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E6E1DC]">
                  <span className="text-[10px] font-bold text-[#5C544E] px-1.5 flex items-center gap-1">
                    <FaPercent className="w-2.5 h-2.5 text-[#C4A070]" />
                    <span>تطبيق خصم موحد:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => applyBulkDiscount(10)}
                    className="px-2 py-1 text-[11px] font-bold bg-white border border-[#E6E1DC] hover:bg-[#C4A070] hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    10%
                  </button>
                  <button
                    type="button"
                    onClick={() => applyBulkDiscount(15)}
                    className="px-2 py-1 text-[11px] font-bold bg-white border border-[#E6E1DC] hover:bg-[#C4A070] hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    15%
                  </button>
                  <button
                    type="button"
                    onClick={() => applyBulkDiscount(20)}
                    className="px-2 py-1 text-[11px] font-bold bg-white border border-[#E6E1DC] hover:bg-[#C4A070] hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    20%
                  </button>
                  <button
                    type="button"
                    onClick={() => applyBulkDiscount(30)}
                    className="px-2 py-1 text-[11px] font-bold bg-white border border-[#E6E1DC] hover:bg-[#C4A070] hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    30%
                  </button>
                </div>

                <button
                  type="button"
                  onClick={addVariant}
                  className="px-4 py-2 bg-[#141110] text-white hover:bg-[#26211F] rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <FaPlus className="w-3 h-3 text-[#C4A070]" />
                  <span>إضافة خيار جديد</span>
                </button>
              </div>
            </div>
{/* Variants Cards */}
            <div className="space-y-4">
              {variants.map((v, index) => (
                <div
                  key={v.id || index}
                  className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E6E1DC] space-y-4 hover:border-[#C4A070]/60 transition-all relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#141110] bg-white px-2.5 py-1 rounded-lg border border-[#E6E1DC]">
                      {activeLocale === 'en' ? `Variant #${index + 1}` : `الخيار #${index + 1}`}
                    </span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(v.id || '')}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold p-1 rounded hover:bg-rose-50"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                        <span>{activeLocale === 'en' ? 'Remove' : 'حذف'}</span>
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {/* Variant Name Arabic or English based on activeLocale */}
                    {activeLocale === 'ar' ? (
                      <div>
                        <label className="block text-xs font-bold text-[#5C544E] mb-1">
                          اسم الخيار / الباقة (بالعربية) *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs text-[#141110] focus:border-[#C4A070] focus:outline-none font-medium"
                          placeholder="مثال: أزرق كحلي ملكي"
                          value={v.name}
                          onChange={(e) => updateVariant(v.id || '', 'name', e.target.value)}
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-[#5C544E] mb-1 text-left" dir="ltr">
                          Package / Variant Name (English) *
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs text-[#141110] focus:border-[#C4A070] focus:outline-none font-medium text-left"
                          dir="ltr"
                          placeholder="e.g. Royal Navy Blue Suite"
                          value={v.name_en || ''}
                          onChange={(e) => updateVariant(v.id || '', 'name_en', e.target.value)}
                        />
                      </div>
                    )}

                    {/* Original Price */}
                    <div>
                      <label className={`block text-xs font-bold text-[#8C7F75] mb-1 ${activeLocale === 'en' ? 'text-left' : ''}`}>
                        {activeLocale === 'en' ? 'Original Price (Before Discount)' : 'السعر الأصلي قبل الخصم (ر.س)'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        className={`w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs text-[#8C7F75] focus:border-[#C4A070] focus:outline-none ${activeLocale === 'en' ? 'text-left' : ''}`}
                        placeholder="18500"
                        value={v.original_price || ''}
                        onChange={(e) => updateVariant(v.id || '', 'original_price', e.target.value)}
                      />
                    </div>

                    {/* Offer Price */}
                    <div>
                      <label className={`block text-xs font-bold text-emerald-800 mb-1 ${activeLocale === 'en' ? 'text-left' : ''}`}>
                        {activeLocale === 'en' ? 'Promotional Offer Price (SAR) *' : 'سعر العرض بعد الخصم (ر.س) *'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min="0"
                          step="any"
                          className={`w-full rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs text-emerald-900 focus:border-[#C4A070] focus:outline-none font-bold ${activeLocale === 'en' ? 'text-left' : ''}`}
                          placeholder="14800"
                          value={v.price}
                          onChange={(e) => updateVariant(v.id || '', 'price', e.target.value)}
                        />
                        <span className={`absolute ${activeLocale === 'en' ? 'right-3' : 'left-3'} top-2 text-[10px] font-bold text-emerald-600`}>
                          {activeLocale === 'en' ? 'SAR' : 'ر.س'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Variant Image */}
                  <div className="pt-2 border-t border-[#E6E1DC]/60">
                    <ImagePicker
                      compact
                      label={activeLocale === 'en' ? 'Custom Variant Image' : 'صورة مخصصة لهذا الخيار أو الباقة'}
                      value={v.image || ''}
                      onChange={(url) => updateVariant(v.id || '', 'image', url)}
                      title={activeLocale === 'en' ? `Choose image for: ${v.name_en || v.name || 'Variant'}` : `اختر صورة للخيار: ${v.name || 'خيار العرض'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: SEO Section & Analyzer */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7">
              <SEOSection
                metaTitle={activeLocale === 'en' ? (metaTitleEn || '') : metaTitle}
                setMetaTitle={activeLocale === 'en' ? setMetaTitleEn : setMetaTitle}
                metaDescription={activeLocale === 'en' ? (metaDescriptionEn || '') : metaDescription}
                setMetaDescription={activeLocale === 'en' ? setMetaDescriptionEn : setMetaDescription}
                keywords={keywords}
                setKeywords={setKeywords}
                canonicalUrl={canonicalUrl}
                setCanonicalUrl={setCanonicalUrl}
                robotsIndex={robotsIndex}
                setRobotsIndex={setRobotsIndex}
                robotsFollow={robotsFollow}
                setRobotsFollow={setRobotsFollow}
                robotsNoarchive={robotsNoarchive}
                setRobotsNoarchive={setRobotsNoarchive}
                robotsNosnippet={robotsNosnippet}
                setRobotsNosnippet={setRobotsNosnippet}
                ogTitle={ogTitle}
                setOgTitle={setOgTitle}
                ogDescription={ogDescription}
                setOgDescription={setOgDescription}
                ogImage={ogImage}
                setOgImage={setOgImage}
                twitterCard={twitterCard}
                setTwitterCard={setTwitterCard}
                imageAlt={imageAlt}
                setImageAlt={setImageAlt}
                locale={activeLocale}
              />
            </div>

            <div className="lg:col-span-5 sticky top-6">
              <SEOAnalyzer
                title={activeLocale === 'en' ? (titleEn || title) : title}
                description={activeLocale === 'en' ? (metaDescriptionEn || descriptionEn || description) : (metaDescription || description)}
                content={activeLocale === 'en' ? (descriptionEn || description) : description}
                focusKeyword={keywords}
                imageAlt={imageAlt}
                canonicalUrl={canonicalUrl}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#E6E1DC]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-xl border border-[#E6E1DC] text-xs font-bold text-[#5C544E] hover:bg-[#FAF8F5]"
            >
              {activeLocale === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
            <Button type="submit" disabled={submitting} icon={<FaFloppyDisk />} size="lg">
              {submitting 
                ? (activeLocale === 'en' ? 'Saving...' : 'جار الحفظ والتحديث...') 
                : (activeLocale === 'en' ? 'Save & Publish Offer' : 'حفظ ونشر العرض')}
            </Button>
          </div>
        </form>
      ) : (
        /* Offers List */
        <div className="bg-white rounded-2xl border border-[#E6E1DC] shadow-sm overflow-hidden">
          {offers.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#8C7F75]">
              <FaTag className="w-10 h-10 mx-auto text-[#D6CDC4] mb-3" />
              لا توجد عروض مضافة حالياً.
            </div>
          ) : (
            <div className="divide-y divide-[#E6E1DC]">
              {offers.map((off) => (
                <div key={off.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors">
                  <div className="flex items-center gap-4">
                    {(off.cover_image || off.banner_image) && (
                      <img
                        src={off.cover_image || off.banner_image || ''}
                        alt={off.title}
                        className="w-18 h-18 rounded-xl object-cover border border-[#E6E1DC] shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#141110]">{off.title}</h4>
                        {(off.discount_label || off.discount_text) && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C4A070]/20 text-[#8C6A2D]">
                            {off.discount_label || off.discount_text}
                          </span>
                        )}
                        {off.title_en ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200" title={`English: ${off.title_en}`}>
                            🇬🇧 EN
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] text-[#8C7F75] bg-gray-100" title="بدون ترجمة إنجليزية">
                            عربي فقط
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-[#8C7F75] font-mono">/{off.slug}</p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                          {getPriceRange(off.variants)}
                        </span>

                        <span className="text-[11px] text-[#5C544E] bg-white px-2 py-0.5 rounded border border-[#E6E1DC]">
                          {Array.isArray(off.variants) ? off.variants.length : 0} خيارات / Variants
                        </span>

                        {off.status === 'published' ? (
                          isOfferExpired(off.valid_until) ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                              <span>منتهي (مخفي من الموقع)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>نشط وساري في الموقع</span>
                            </span>
                          )
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            مسودة
                          </span>
                        )}

                        {off.valid_until && (
                          <span className={`text-[10px] flex items-center gap-1 font-mono ${
                            isOfferExpired(off.valid_until) ? 'text-rose-600 font-bold' : 'text-[#8C7F75]'
                          }`}>
                            <FaCalendarDays className="w-2.5 h-2.5 text-[#C4A070]" />
                            <span>ينتهي: {off.valid_until}</span>
                            {isOfferExpired(off.valid_until) && <span>(انتهى)</span>}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/offers/${off.slug}`}
                      target="_blank"
                      className="p-2.5 text-[#5C544E] hover:bg-white rounded-xl border border-[#E6E1DC] hover:text-[#C4A070]"
                      title="معاينة"
                    >
                      <FaEye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEdit(off)}
                      className="p-2.5 text-[#5C544E] hover:bg-white rounded-xl border border-[#E6E1DC] hover:text-[#C4A070]"
                      title="تعديل"
                    >
                      <FaPen className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(off.id)}
                      className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200"
                      title="حذف"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
