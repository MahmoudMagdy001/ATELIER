import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { PageLoading } from '../../../components/ui/Loading'
import { useAdminOffers } from '../hooks/useAdminOffers'
import { 
  FaPen, 
  FaTrash, 
  FaPlus, 
  FaUpload, 
  FaEye, 
  FaFloppyDisk, 
  FaTag, 
  FaLayerGroup, 
  FaCouch, 
  FaPercent,
  FaArrowDownLong,
  FaCalendarDays,
  FaCircleExclamation,
  FaClockRotateLeft
} from 'react-icons/fa6'
import SEOSection from '../../../components/admin/SEOSection'
import SEOAnalyzer from '../../../components/admin/SEOAnalyzer'
import ImagePicker from '../../../components/admin/ImagePicker'

export default function AdminOffers() {
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
    slug,
    setSlug,
    description,
    setDescription,
    discountLabel,
    setDiscountLabel,
    validUntil,
    setValidUntil,
    badge,
    setBadge,
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
    handleVariantImageUpload,
    submitting,
    handleEdit,
    handleCreateNew,
    handleDelete,
    handleSubmit,
    setIsEditing,
    metaTitle,
    setMetaTitle,
    metaDescription,
    setMetaDescription,
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
    imageTitle,
    setImageTitle,
  } = useAdminOffers()

  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile)
      setImagePreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    } else {
      setImagePreview(imageUrl || '')
    }
  }, [imageFile, imageUrl])

  const getPriceRange = (itemVariants) => {
    if (!itemVariants || itemVariants.length === 0) return 'لا يوجد سعر'
    const validPrices = itemVariants.map(v => Number(v.price)).filter(p => !isNaN(p) && p > 0)
    if (validPrices.length === 0) return '0 ر.س'
    const min = Math.min(...validPrices)
    const max = Math.max(...validPrices)
    if (min === max) return `${min.toLocaleString()} ر.س`
    return `${min.toLocaleString()} - ${max.toLocaleString()} ر.س`
  }

  const isOfferExpired = (dateStr) => {
    if (!dateStr) return false
    const today = new Date().toISOString().split('T')[0]
    return dateStr < today
  }

  const setExpiryDays = (days) => {
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
          <h1 className="text-2xl font-bold text-[#14110F]">
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

          {/* OPTIONAL: Select Existing Product */}
          <div className="bg-gradient-to-br from-[#14110F] to-[#2B2623] text-white rounded-2xl p-6 shadow-md space-y-3 border border-[#C5A880]/30">
            <div className="flex items-center gap-2 text-[#C5A880]">
              <FaCouch className="w-5 h-5" />
              <h3 className="font-bold text-sm">إنشاء العرض من منتج متوفر في المتجر (اختياري)</h3>
            </div>
            <p className="text-xs text-[#D6CDC4]">
              اختر أي منتج من القائمة ليتم ملء بيانات العرض تلقائياً ونسخ جميع متغيراته وأسعاره لتعديلها:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                value={selectedProductId}
                onChange={(e) => handleSelectProduct(e.target.value)}
              >
                <option value="" className="text-[#14110F]">-- اختر منتجاً لتطبيق العرض عليه --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} className="text-[#14110F]">
                    {p.title} ({Array.isArray(p.variants) ? p.variants.length : 0} خيارات)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 1: Basic Info */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-[#E6E1DC] pb-3">
              <FaTag className="text-[#C5A880] w-5 h-5" />
              <h3 className="font-bold text-base text-[#14110F]">بيانات العرض الأساسية</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">عنوان العرض الترويجي *</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عرض الصالونات الإيطالية VIP (خصم 20%)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الرابط المخصص (Slug)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none font-mono"
                  placeholder="vip-italian-salons-exclusive-offer"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">نص شارة الخصم (Discount Label)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={discountLabel}
                  onChange={(e) => setDiscountLabel(e.target.value)}
                  placeholder="خصم 20% لفترة محدودة أو باقة كراسي مجاناً"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#5C544E]">تاريخ انتهاء صلاحية العرض</label>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setExpiryDays(30)}
                      className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E1DC] hover:bg-[#C5A880] hover:text-white transition-colors"
                    >
                      +30 يوم
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpiryDays(60)}
                      className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E1DC] hover:bg-[#C5A880] hover:text-white transition-colors"
                    >
                      +60 يوم
                    </button>
                    <button
                      type="button"
                      onClick={() => setValidUntil('')}
                      className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E1DC] hover:bg-[#C5A880] hover:text-white transition-colors"
                    >
                      دائم
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#14110F] focus:outline-none ${
                    validUntil && isOfferExpired(validUntil)
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500'
                      : 'border-[#E6E1DC] focus:border-[#C5A880]'
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
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">شارة مميزة (Badge)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="عرض الصيف الحصري / باقة تأثيث كاملة"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">حالة العرض</label>
                <select
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="published">منشور وفعال في الموقع (Published)</option>
                  <option value="draft">مسودة / منتهي (Draft)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">تفاصيل وشروط الاستفادة من العرض *</label>
              <textarea
                rows={3}
                required
                className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                placeholder="شرح مميزات هذا العرض، الخصومات المتاحة، والتوصيل المجاني..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Cover Image Upload */}
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

          {/* SECTION 2: Dynamic Offer Variants Builder */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-4">
              <div className="flex items-center gap-2.5">
                <FaLayerGroup className="text-[#C5A880] w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base text-[#14110F]">خيارات ومتغيرات العرض (Offer Variants)</h3>
                  <p className="text-xs text-[#8C7F75] mt-0.5">حدد لكل خيار سعر العرض المخفض والسعر الأصلي قبل الخصم والصورة الخاصة به</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Bulk discount buttons */}
                <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E6E1DC]">
                  <span className="text-[10px] font-bold text-[#5C544E] px-1.5 flex items-center gap-1">
                    <FaPercent className="w-2.5 h-2.5 text-[#C5A880]" /> خصم سريع:
                  </span>
                  <button
                    type="button"
                    onClick={() => applyBulkDiscount(10)}
                    className="px-2 py-1 text-[11px] font-bold bg-white border border-[#E6E1DC] hover:bg-[#C5A880] hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    10%
                  </button>
                  <button
                    type="button"
                    onClick={() => applyBulkDiscount(15)}
                    className="px-2 py-1 text-[11px] font-bold bg-white border border-[#E6E1DC] hover:bg-[#C5A880] hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    15%
                  </button>
                  <button
                    type="button"
                    onClick={() => applyBulkDiscount(20)}
                    className="px-2 py-1 text-[11px] font-bold bg-white border border-[#E6E1DC] hover:bg-[#C5A880] hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    20%
                  </button>
                  <button
                    type="button"
                    onClick={() => applyBulkDiscount(30)}
                    className="px-2 py-1 text-[11px] font-bold bg-white border border-[#E6E1DC] hover:bg-[#C5A880] hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    30%
                  </button>
                </div>

                <button
                  type="button"
                  onClick={addVariant}
                  className="px-4 py-2 bg-[#14110F] text-white hover:bg-[#2B2623] rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <FaPlus className="w-3 h-3 text-[#C5A880]" />
                  <span>إضافة خيار جديد</span>
                </button>
              </div>
            </div>

            {/* Variants Cards */}
            <div className="space-y-4">
              {variants.map((v, index) => (
                <div
                  key={v.id || index}
                  className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E6E1DC] space-y-4 hover:border-[#C5A880]/60 transition-all relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#14110F] bg-white px-2.5 py-1 rounded-lg border border-[#E6E1DC]">
                      الخيار #{index + 1}
                    </span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(v.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold p-1 rounded hover:bg-rose-50"
                      >
                        <FaTrash className="w-3 h-3" />
                        <span>حذف الخيار</span>
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {/* Variant Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#5C544E] mb-1">
                        اسم ومواصفة الخيار (اللون / الحجم / الباقة) *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs text-[#14110F] focus:border-[#C5A880] focus:outline-none font-medium"
                        placeholder="مثال: أزرق كحلي ملكي (3 مقاعد - 240 سم)"
                        value={v.name}
                        onChange={(e) => updateVariant(v.id, 'name', e.target.value)}
                      />
                    </div>

                    {/* Original Price */}
                    <div>
                      <label className="block text-xs font-bold text-[#8C7F75] mb-1">
                        السعر الأصلي قبل الخصم (ر.س)
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs text-[#8C7F75] focus:border-[#C5A880] focus:outline-none"
                        placeholder="مثال: 18500"
                        value={v.original_price || ''}
                        onChange={(e) => updateVariant(v.id, 'original_price', e.target.value)}
                      />
                    </div>

                    {/* Offer Price */}
                    <div>
                      <label className="block text-xs font-bold text-emerald-800 mb-1">
                        سعر العرض بعد الخصم (ر.س) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min="0"
                          step="any"
                          className="w-full rounded-xl border border-emerald-300 bg-emerald-50/40 px-3.5 py-2 text-xs text-emerald-900 focus:border-emerald-500 focus:outline-none font-bold"
                          placeholder="مثال: 14800"
                          value={v.price}
                          onChange={(e) => updateVariant(v.id, 'price', e.target.value)}
                        />
                        <span className="absolute left-3 top-2 text-[10px] font-bold text-emerald-700">ر.س</span>
                      </div>
                    </div>
                  </div>

                  {/* Variant Image & SKU */}
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 items-center pt-2 border-t border-[#E6E1DC]/60">
                    <div className="sm:col-span-2">
                      <ImagePicker
                        compact
                        label="صورة مخصصة لهذا الخيار"
                        value={v.image || ''}
                        onChange={(url) => updateVariant(v.id, 'image', url)}
                        title={`اختر صورة لخيار العرض: ${v.name || 'خيار العرض'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5C544E] mb-1">
                        رمز الخيار (SKU)
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-1.5 text-xs text-[#14110F] font-mono"
                        placeholder="OFF-MILANO-NVY"
                        value={v.sku || ''}
                        onChange={(e) => updateVariant(v.id, 'sku', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: SEO Section & Analyzer */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7">
              <SEOSection
                metaTitle={metaTitle}
                setMetaTitle={setMetaTitle}
                metaDescription={metaDescription}
                setMetaDescription={setMetaDescription}
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
              />
            </div>

            <div className="lg:col-span-5 sticky top-6">
              <SEOAnalyzer
                title={title}
                description={metaDescription || description}
                content={description}
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
              إلغاء
            </button>
            <Button type="submit" disabled={submitting} icon={<FaFloppyDisk />} size="lg">
              {submitting ? 'جار الحفظ والتحديث...' : 'حفظ ونشر العرض'}
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
                        src={off.cover_image || off.banner_image}
                        alt={off.title}
                        className="w-18 h-18 rounded-xl object-cover border border-[#E6E1DC] shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#14110F]">{off.title}</h4>
                        {(off.discount_label || off.discount_text) && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A880]/20 text-[#8C6A2D]">
                            {off.discount_label || off.discount_text}
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
                            <FaCalendarDays className="w-2.5 h-2.5 text-[#C5A880]" />
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
                      className="p-2.5 text-[#5C544E] hover:bg-white rounded-xl border border-[#E6E1DC] hover:text-[#C5A880]"
                      title="معاينة"
                    >
                      <FaEye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEdit(off)}
                      className="p-2.5 text-[#5C544E] hover:bg-white rounded-xl border border-[#E6E1DC] hover:text-[#C5A880]"
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
