import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { PageLoading } from '../../../components/ui/Loading'
import { useAdminOffers } from '../hooks/useAdminOffers'
import { FaPen, FaTrash, FaPlus, FaUpload, FaEye, FaFloppyDisk, FaTag } from 'react-icons/fa6'
import SEOSection from '../../../components/admin/SEOSection'
import SEOAnalyzer from '../../../components/admin/SEOAnalyzer'

export default function AdminOffers() {
  const {
    offers,
    loading,
    isEditing,
    currentOffer,
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

  if (loading && !isEditing) return <PageLoading text="جار تحميل العروض..." />

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#14110F]">
            {isEditing ? (currentOffer ? 'تعديل العرض الحصري' : 'إضافة عرض حصري جديد') : 'إدارة العروض والخصومات (Offers)'}
          </h1>
          <p className="text-xs text-[#8C7F75] mt-1">إدارة الباقات الاستشارية، خصومات التأثيث الشامل، والإصدارات المحدودة</p>
        </div>
        {!isEditing && (
          <Button onClick={handleCreateNew} icon={<FaPlus />}>
            إضافة عرض جديد
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-6">
            <h3 className="font-bold text-base text-[#14110F] border-b border-[#E6E1DC] pb-3">بيانات العرض الأساسية</h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">عنوان العرض *</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="جلسة استشارية VIP + تصميم 3D مجاني"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الرابط المخصص (Slug)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none font-mono"
                  placeholder="exclusive-villa-design-consultation"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">نص الخصم / الميزة (Discount Label)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={discountLabel}
                  onChange={(e) => setDiscountLabel(e.target.value)}
                  placeholder="خصم 15% أو استشارة مجانية"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">تاريخ انتهاء الصلاحية</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">شارة العرض (Badge)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Special VIP / Limited Edition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">حالة العرض</label>
                <select
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="published">منشور وفعال (Published)</option>
                  <option value="draft">مسودة / منتهي (Draft)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">تفاصيل وشروط العرض *</label>
              <textarea
                rows={4}
                required
                className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                placeholder="شرح العرض وكيفية الاستفادة منه والشروط والأحكام..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Offer Cover Image Upload */}
            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">بانر / صورة العرض</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {imagePreview && (
                  <div className="w-36 h-24 rounded-xl overflow-hidden border border-[#E6E1DC] bg-[#FAF8F5] shrink-0">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E6E1DC] hover:bg-[#F3EFEA] text-xs font-bold text-[#5C544E] cursor-pointer">
                    <FaUpload className="w-3.5 h-3.5" />
                    <span>اختر ملف صورة للعرض (WebP تلقائي)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </label>
                  <input
                    type="url"
                    placeholder="أو أدخل رابط صورة مباشر..."
                    className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2 text-xs text-[#14110F]"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEO Section & Analyzer */}
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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#E6E1DC]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-xl border border-[#E6E1DC] text-xs font-bold text-[#5C544E]"
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
              <FaTag className="w-8 h-8 mx-auto text-[#D6CDC4] mb-2" />
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
                        className="w-16 h-16 rounded-xl object-cover border border-[#E6E1DC] shrink-0"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#14110F]">{off.title}</h4>
                        {(off.discount_label || off.discount_text) && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C5A880]/15 text-[#8C6A2D]">
                            {off.discount_label || off.discount_text}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8C7F75] mt-1 font-mono">/{off.slug}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          off.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {off.status === 'published' ? 'نشط' : 'مسودة'}
                        </span>
                        {off.valid_until && (
                          <span className="text-[10px] text-[#8C7F75]">
                            ينتهي في: {off.valid_until}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/offers/${off.slug}`}
                      target="_blank"
                      className="p-2 text-[#5C544E] hover:bg-white rounded-lg border border-[#E6E1DC]"
                      title="معاينة"
                    >
                      <FaEye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEdit(off)}
                      className="p-2 text-[#5C544E] hover:bg-white rounded-lg border border-[#E6E1DC]"
                      title="تعديل"
                    >
                      <FaPen className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(off.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200"
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
