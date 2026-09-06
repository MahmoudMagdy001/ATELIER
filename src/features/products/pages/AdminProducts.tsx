import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { PageLoading } from '../../../components/ui/Loading'
import { useAdminProducts } from '../hooks/useAdminProducts'
import { 
  FaPen, 
  FaTrash, 
  FaPlus, 
  FaUpload, 
  FaEye, 
  FaFloppyDisk, 
  FaCouch, 
  FaTags, 
  FaLayerGroup, 
  FaImage,
  FaCheck,
  FaXmark,
  FaCircleInfo
} from 'react-icons/fa6'
import SEOSection from '../../../components/admin/SEOSection'
import SEOAnalyzer from '../../../components/admin/SEOAnalyzer'
import ImagePicker from '../../../components/admin/ImagePicker'
import AdminLanguageTabs, { type AdminLocale } from '../../../components/admin/AdminLanguageTabs'
import type { ProductVariant } from '../../../types/database'

export default function AdminProducts() {
  const [activeLocale, setActiveLocale] = useState<AdminLocale>('ar')
  const {
    products,
    categories,
    loading,
    isEditing,
    currentProduct,
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
    badge,
    setBadge,
    badgeEn,
    setBadgeEn,
    categoryId,
    setCategoryId,
    displayOrder,
    setDisplayOrder,
    status,
    setStatus,
    mainImageFile,
    setMainImageFile,
    mainImageUrl,
    setMainImageUrl,
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
    imageTitle,
    setImageTitle,
  } = useAdminProducts()

  const [mainImagePreview, setMainImagePreview] = useState('')

  useEffect(() => {
    if (mainImageFile) {
      const objectUrl = URL.createObjectURL(mainImageFile)
      setMainImagePreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    } else {
      setMainImagePreview(mainImageUrl || '')
    }
  }, [mainImageFile, mainImageUrl])

  const getPriceRange = (itemVariants?: ProductVariant[] | null) => {
    if (!itemVariants || itemVariants.length === 0) return 'لا يوجد سعر محدد'
    const validPrices = itemVariants.map(v => Number(v.price)).filter((p: number) => !isNaN(p) && p > 0)
    if (validPrices.length === 0) return '0 ر.س'
    const min = Math.min(...validPrices)
    const max = Math.max(...validPrices)
    if (min === max) return `${min.toLocaleString()} ر.س`
    return `${min.toLocaleString()} - ${max.toLocaleString()} ر.س`
  }

  if (loading && !isEditing) return <PageLoading text="جار تحميل المنتجات الفاخرة..." />

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141110]">
            {isEditing ? (currentProduct ? 'تعديل قطعة الإصدار المحدود' : 'إضافة قطعة جديدة') : 'إدارة قطع الإصدار المحدود (Limited Editions)'}
          </h1>
          <p className="text-xs text-[#8C7F75] mt-1">التحكم في القطع الحصرية، المتغيرات (الألوان والمقاسات)، الأسعار، وصور العرض</p>
        </div>
        {!isEditing && (
          <Button onClick={handleCreateNew} icon={<FaPlus />}>
            إضافة قطعة جديدة
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

          {/* SECTION 1: Basic Info */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-3">
              <div className="flex items-center gap-2.5">
                <FaCouch className="text-[#C4A070] w-5 h-5" />
                <h3 className="font-bold text-base text-[#141110]">
                  {activeLocale === 'ar' ? 'بيانات المنتج الأساسية (العربية)' : 'Basic Product Information (English)'}
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
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5">اسم القطعة / المنتج (بالعربية) *</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="طقم صالون Milano Velvet الملكي"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5">شارة مميزة (Badge بالعربية)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="الأكثر طلباً / Bespoke Edition / إصدار محدود"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">وصف تفصيلي للقطعة وخاماتها (بالعربية) *</label>
                  <textarea
                    rows={3}
                    required
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                    placeholder="تفاصيل نوع الخشب، الأقمشة، الأبعاد، ونوعية التشطيب الإيطالي..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4" dir="ltr">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Product Title (English)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="Milano Velvet Royal Living Set"
                    />
                    <p className="text-[11px] text-[#8C7F75] mt-1 text-left">Leave blank to use the Arabic title as fallback</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Featured Badge (English)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                      value={badgeEn}
                      onChange={(e) => setBadgeEn(e.target.value)}
                      placeholder="Best Seller / Limited Edition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Detailed Description & Materials (English)</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                    placeholder="Handcrafted Italian velvet, solid walnut frame, bespoke bronze accents..."
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Shared Settings (Category, Slug, Order, Status) */}
            <div className="pt-4 border-t border-[#E6E1DC] space-y-4">
              <h4 className="text-xs font-bold text-[#8C7F75] uppercase tracking-wider">
                {activeLocale === 'en' ? 'General Product Settings' : 'الإعدادات العامة للقطعة (مشتركة)'}
              </h4>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">
                    {activeLocale === 'en' ? 'Custom URL (Slug)' : 'الرابط المخصص (Slug)'}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                    placeholder="milano-velvet-royal-living-set"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">
                    {activeLocale === 'en' ? 'Category' : 'التصنيف / القسم'}
                  </label>
                  <select
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all cursor-pointer"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">{activeLocale === 'en' ? '-- Select Category --' : '-- اختر التصنيف --'}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {activeLocale === 'en' ? (c.name_en || c.name) : c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">
                    {activeLocale === 'en' ? 'Display Order' : 'ترتيب الظهور'}
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-bold text-[#141110] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">
                    {activeLocale === 'en' ? 'Product Status' : 'حالة المنتج'}
                  </label>
                  <select
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all cursor-pointer"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="published">{activeLocale === 'en' ? 'Published' : 'منشور ومتاح في المعرض (Published)'}</option>
                    <option value="draft">{activeLocale === 'en' ? 'Draft' : 'مسودة مخفية (Draft)'}</option>
                  </select>
                </div>
              </div>

              {/* Main Image Upload */}
              <div className="pt-2">
                <ImagePicker
                  label={activeLocale === 'en' ? 'Main Product Image (Cover)' : 'الصورة الرئيسية للمنتج (الغلاف)'}
                  value={mainImageUrl}
                  onChange={setMainImageUrl}
                  file={mainImageFile}
                  onFileChange={setMainImageFile}
                  hint={activeLocale === 'en' ? 'Prominent cover photo shown across storefront & details' : 'صورة بارزة تظهر في واجهة المتجر وتفاصيل المنتج'}
                  title={activeLocale === 'en' ? 'Choose product image from media library' : 'اختر صورة للمنتج من مكتبة الوسائط'}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Dynamic Variants Builder */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-4">
              <div className="flex items-center gap-2.5">
                <FaLayerGroup className="text-[#C4A070] w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base text-[#141110]">
                    {activeLocale === 'en' ? 'Product Variants (English)' : 'خيارات ومتغيرات المنتج (Product Variants)'}
                  </h3>
                  <p className="text-xs text-[#8C7F75] mt-0.5">
                    {activeLocale === 'en' 
                      ? 'Configure dimensions, colors, and prices in English for international clients'
                      : 'أدخل خيارات المنتج وأسعاره باللغة العربية'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="px-4 py-2 bg-[#141110] text-white hover:bg-[#26211F] rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <FaPlus className="w-3 h-3 text-[#C4A070]" />
                <span>{activeLocale === 'en' ? 'Add Variant' : 'إضافة خيار جديد'}</span>
              </button>
            </div>

            {/* Variants List */}
            <div className="space-y-4">
              {variants.map((v, index) => (
                <div
                  key={v.id || index}
                  className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E6E1DC] space-y-4 transition-all hover:border-[#C4A070]/60 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#141110] bg-white px-2.5 py-1 rounded-lg border border-[#E6E1DC]">
                      {activeLocale === 'en' ? `Variant #${index + 1}` : `الخيار #${index + 1}`}
                    </span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(v.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold p-1 rounded hover:bg-rose-50 cursor-pointer"
                      >
                        <FaTrash className="w-3 h-3" />
                        <span>{activeLocale === 'en' ? 'Delete' : 'حذف الخيار'}</span>
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {/* Variant Name based on activeLocale */}
                    {activeLocale === 'ar' ? (
                      <div>
                        <label className="block text-xs font-bold text-[#5C544E] mb-1">
                          اسم الخيار (بالعربية) *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs text-[#141110] focus:border-[#C4A070] focus:outline-none font-medium"
                          placeholder="أزرق كحلي ملكي (240 سم)"
                          value={v.name}
                          onChange={(e) => updateVariant(v.id, 'name', e.target.value)}
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-[#5C544E] mb-1 text-left" dir="ltr">
                          Variant Name (English)
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs text-[#141110] focus:border-[#C4A070] focus:outline-none font-medium text-left"
                          dir="ltr"
                          placeholder="Royal Navy Blue (240 cm)"
                          value={v.name_en || ''}
                          onChange={(e) => updateVariant(v.id, 'name_en', e.target.value)}
                        />
                      </div>
                    )}

                    {/* Variant Price */}
                    <div>
                      <label className={`block text-xs font-bold text-[#5C544E] mb-1 ${activeLocale === 'en' ? 'text-left' : ''}`}>
                        {activeLocale === 'en' ? 'Price (SAR) *' : 'السعر الخاص بهذا الخيار (ر.س) *'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min="0"
                          step="any"
                          className={`w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs text-[#141110] focus:border-[#C4A070] focus:outline-none font-bold ${activeLocale === 'en' ? 'text-left' : ''}`}
                          placeholder="18500"
                          value={v.price}
                          onChange={(e) => updateVariant(v.id, 'price', e.target.value)}
                        />
                        <span className={`absolute ${activeLocale === 'en' ? 'right-3' : 'left-3'} top-2 text-[10px] font-bold text-[#8C7F75]`}>
                          {activeLocale === 'en' ? 'SAR' : 'ر.س'}
                        </span>
                      </div>
                    </div>

                    {/* Variant SKU */}
                    <div>
                      <label className={`block text-xs font-bold text-[#5C544E] mb-1 ${activeLocale === 'en' ? 'text-left' : ''}`}>
                        {activeLocale === 'en' ? 'SKU / Model Code' : 'رمز المنتج (SKU اختياري)'}
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs text-[#141110] font-mono text-left"
                        placeholder="MILANO-NVY-240"
                        value={v.sku || ''}
                        onChange={(e) => updateVariant(v.id, 'sku', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Variant Image */}
                  <div className="pt-2 border-t border-[#E6E1DC]/60">
                    <ImagePicker
                      compact
                      label={activeLocale === 'en' ? 'Custom Variant Image' : 'صورة مخصصة لهذا الخيار (تتغير عند اختيار العميل لهذا اللون/المقاس)'}
                      value={v.image || ''}
                      onChange={(url) => updateVariant(v.id, 'image', url)}
                      title={activeLocale === 'en' ? `Choose image for: ${v.name_en || v.name || 'Variant'}` : `اختر صورة للخيار: ${v.name || 'خيار المنتج'}`}
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
              className="px-6 py-3 rounded-xl border border-[#E6E1DC] text-xs font-bold text-[#5C544E] hover:bg-[#FAF8F5] cursor-pointer"
            >
              {activeLocale === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
            <Button type="submit" disabled={submitting} icon={<FaFloppyDisk />} size="lg">
              {submitting 
                ? (activeLocale === 'en' ? 'Saving Product...' : 'جار حفظ المنتج والخيارات...') 
                : (activeLocale === 'en' ? 'Save & Publish Product' : 'حفظ ونشر القطعة')}
            </Button>
          </div>
        </form>
      ) : (
        /* Products Table List */
        <div className="bg-white rounded-2xl border border-[#E6E1DC] shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#8C7F75]">
              <FaCouch className="w-10 h-10 mx-auto text-[#D6CDC4] mb-3" />
              لا توجد منتجات مضافة حالياً. اضغط على "إضافة منتج جديد" للبدء.
            </div>
          ) : (
            <div className="divide-y divide-[#E6E1DC]">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {prod.main_image && (
                      <img
                        src={prod.main_image}
                        alt={prod.title}
                        className="w-18 h-18 rounded-xl object-cover border border-[#E6E1DC] shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#141110]">{prod.title}</h4>
                        {prod.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C4A070]/15 text-[#8C6A2D]">
                            {prod.badge}
                          </span>
                        )}
                        {prod.title_en ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200" title={`English: ${prod.title_en}`}>
                            🇬🇧 EN
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] text-[#8C7F75] bg-gray-100" title="بدون ترجمة إنجليزية (سيتم استخدام العربية تلقائياً)">
                            عربي فقط
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-[#8C7F75] font-mono">/{prod.slug}</p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {/* Price from Variants */}
                        <span className="text-xs font-bold text-[#141110] bg-[#FAF8F5] px-2.5 py-0.5 rounded-lg border border-[#E6E1DC]">
                          {getPriceRange(prod.variants)}
                        </span>

                        {/* Variants Count */}
                        <span className="text-[11px] text-[#5C544E] bg-white px-2 py-0.5 rounded border border-[#E6E1DC]">
                          {Array.isArray(prod.variants) ? prod.variants.length : 0} خيارات / Variants
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            prod.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {prod.status === 'published' ? 'منشور' : 'مسودة'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/limited-edition/${prod.slug}`}
                      target="_blank"
                      className="p-2.5 text-[#5C544E] hover:bg-white rounded-xl border border-[#E6E1DC] hover:text-[#C4A070]"
                      title="معاينة في المتجر"
                    >
                      <FaEye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEdit(prod)}
                      className="p-2.5 text-[#5C544E] hover:bg-white rounded-xl border border-[#E6E1DC] hover:text-[#C4A070]"
                      title="تعديل"
                    >
                      <FaPen className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(prod.id)}
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
