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

export default function AdminProducts() {
  const {
    products,
    categories,
    loading,
    isEditing,
    currentProduct,
    title,
    setTitle,
    slug,
    setSlug,
    description,
    setDescription,
    badge,
    setBadge,
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

  const getPriceRange = (itemVariants) => {
    if (!itemVariants || itemVariants.length === 0) return 'لا يوجد سعر محدد'
    const validPrices = itemVariants.map(v => Number(v.price)).filter(p => !isNaN(p) && p > 0)
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
          <h1 className="text-2xl font-bold text-[#14110F]">
            {isEditing ? (currentProduct ? 'تعديل المنتج والخيارات' : 'إضافة قطعة أثاث جديدة') : 'إدارة المنتجات والأثاث الفاخر (Products)'}
          </h1>
          <p className="text-xs text-[#8C7F75] mt-1">التحكم في قطع الأثاث، المتغيرات (الألوان والمقاسات)، الأسعار، وصور العرض</p>
        </div>
        {!isEditing && (
          <Button onClick={handleCreateNew} icon={<FaPlus />}>
            إضافة منتج جديد
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: Basic Info */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-[#E6E1DC] pb-3">
              <FaCouch className="text-[#C5A880] w-5 h-5" />
              <h3 className="font-bold text-base text-[#14110F]">بيانات المنتج الأساسية</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">اسم القطعة / المنتج *</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="طقم صالون Milano Velvet الملكي"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الرابط المخصص (Slug)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none font-mono"
                  placeholder="milano-velvet-royal-living-set"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">التصنيف / القسم</label>
                <select
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">-- اختر التصنيف --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">شارة مميزة (Badge)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="الأكثر طلباً / Bespoke Edition / إصدار محدود"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">ترتيب الظهور</label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">حالة المنتج</label>
                <select
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="published">منشور ومتاح في المعرض (Published)</option>
                  <option value="draft">مسودة مخفية (Draft)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">وصف تفصيلي للقطعة وخاماتها *</label>
              <textarea
                rows={3}
                required
                className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                placeholder="تفاصيل نوع الخشب، الأقمشة، الأبعاد، ونوعية التشطيب الإيطالي..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Main Image Upload */}
            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الصورة الرئيسية للمنتج (الغلاف)</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {mainImagePreview && (
                  <div className="w-36 h-28 rounded-xl overflow-hidden border border-[#E6E1DC] bg-[#FAF8F5] shrink-0">
                    <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E6E1DC] hover:bg-[#F3EFEA] text-xs font-bold text-[#5C544E] cursor-pointer">
                    <FaUpload className="w-3.5 h-3.5" />
                    <span>اختر ملف صورة رئيسية (ضغط WebP تلقائي)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setMainImageFile(e.target.files[0])}
                    />
                  </label>
                  <input
                    type="url"
                    placeholder="أو أدخل رابط صورة خارجي مباشر..."
                    className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2 text-xs text-[#14110F]"
                    value={mainImageUrl}
                    onChange={(e) => setMainImageUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Dynamic Variants Builder */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-4">
              <div className="flex items-center gap-2.5">
                <FaLayerGroup className="text-[#C5A880] w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base text-[#14110F]">خيارات ومتغيرات المنتج (Product Variants)</h3>
                  <p className="text-xs text-[#8C7F75] mt-0.5">أضف الألوان، المقاسات، أو الخامات؛ وحدد لكل خيار سعره وصورته الخاصة</p>
                </div>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="px-4 py-2 bg-[#14110F] text-white hover:bg-[#2B2623] rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <FaPlus className="w-3 h-3 text-[#C5A880]" />
                <span>إضافة خيار جديد (Add Variant)</span>
              </button>
            </div>

            {/* Variants List */}
            <div className="space-y-4">
              {variants.map((v, index) => (
                <div
                  key={v.id || index}
                  className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E6E1DC] space-y-4 transition-all hover:border-[#C5A880]/60 relative"
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

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {/* Variant Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#5C544E] mb-1">
                        اسم ومواصفة الخيار (مثل: اللون / الحجم / الخامة) *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs text-[#14110F] focus:border-[#C5A880] focus:outline-none font-medium"
                        placeholder="مثال: أزرق كحلي ملكي (مقاس 240 سم) أو جلد كونياك إيطالي"
                        value={v.name}
                        onChange={(e) => updateVariant(v.id, 'name', e.target.value)}
                      />
                    </div>

                    {/* Variant Price */}
                    <div>
                      <label className="block text-xs font-bold text-[#5C544E] mb-1">
                        السعر الخاص بهذا الخيار (ر.س / SAR) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min="0"
                          step="any"
                          className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs text-[#14110F] focus:border-[#C5A880] focus:outline-none font-bold"
                          placeholder="مثال: 18500"
                          value={v.price}
                          onChange={(e) => updateVariant(v.id, 'price', e.target.value)}
                        />
                        <span className="absolute left-3 top-2 text-[10px] font-bold text-[#8C7F75]">ر.س</span>
                      </div>
                    </div>
                  </div>

                  {/* Variant Image & SKU */}
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 items-center pt-2 border-t border-[#E6E1DC]/60">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-[#5C544E]">
                        صورة مخصصة لهذا الخيار (تتغير تلقائياً عند اختيار العميل لهذا اللون/المقاس)
                      </label>
                      <div className="flex items-center gap-3">
                        {v.image && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#E6E1DC] bg-white shrink-0">
                            <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <label className="px-3 py-1.5 bg-white border border-[#E6E1DC] hover:bg-[#FAF8F5] rounded-xl text-xs font-bold text-[#5C544E] cursor-pointer flex items-center gap-1.5">
                          <FaUpload className="w-3 h-3 text-[#C5A880]" />
                          <span>رفع صورة الخيار</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleVariantImageUpload(v.id, e.target.files[0])}
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="أو ضع رابط صورة مباشر..."
                          className="flex-1 rounded-xl border border-[#E6E1DC] bg-white px-3 py-1.5 text-xs text-[#14110F]"
                          value={v.image || ''}
                          onChange={(e) => updateVariant(v.id, 'image', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5C544E] mb-1">
                        رمز المنتج (SKU / كود اختياري)
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-1.5 text-xs text-[#14110F] font-mono"
                        placeholder="MILANO-NVY-240"
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
              {submitting ? 'جار حفظ المنتج والخيارات...' : 'حفظ ونشر القطعة'}
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
                        <h4 className="font-bold text-sm text-[#14110F]">{prod.title}</h4>
                        {prod.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C5A880]/15 text-[#8C6A2D]">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-[#8C7F75] font-mono">/{prod.slug}</p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {/* Price from Variants */}
                        <span className="text-xs font-bold text-[#14110F] bg-[#FAF8F5] px-2.5 py-0.5 rounded-lg border border-[#E6E1DC]">
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
                      to={`/products/${prod.slug}`}
                      target="_blank"
                      className="p-2.5 text-[#5C544E] hover:bg-white rounded-xl border border-[#E6E1DC] hover:text-[#C5A880]"
                      title="معاينة في المتجر"
                    >
                      <FaEye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEdit(prod)}
                      className="p-2.5 text-[#5C544E] hover:bg-white rounded-xl border border-[#E6E1DC] hover:text-[#C5A880]"
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
