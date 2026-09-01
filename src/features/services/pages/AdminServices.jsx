import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { PageLoading } from '../../../components/ui/Loading'
import { useAdminServices } from '../hooks/useAdminServices'
import { FaPen, FaTrash, FaPlus, FaUpload, FaEye, FaFloppyDisk, FaBellConcierge } from 'react-icons/fa6'
import SEOSection from '../../../components/admin/SEOSection'
import SEOAnalyzer from '../../../components/admin/SEOAnalyzer'
import ImagePicker from '../../../components/admin/ImagePicker'

export default function AdminServices() {
  const {
    services,
    loading,
    isEditing,
    currentService,
    title,
    setTitle,
    slug,
    setSlug,
    description,
    setDescription,
    subtitle,
    setSubtitle,
    badge,
    setBadge,
    features,
    setFeatures,
    displayOrder,
    setDisplayOrder,
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
  } = useAdminServices()

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

  if (loading && !isEditing) return <PageLoading text="جار تحميل الخدمات..." />

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#14110F]">
            {isEditing ? (currentService ? 'تعديل الخدمة' : 'إضافة خدمة فاخرة جديدة') : 'إدارة الخدمات (Services)'}
          </h1>
          <p className="text-xs text-[#8C7F75] mt-1">إدارة خدمات التصميم المعماري، تفصيل الأثاث، والكسوات الخشبية</p>
        </div>
        {!isEditing && (
          <Button onClick={handleCreateNew} icon={<FaPlus />}>
            إضافة خدمة جديدة
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-6">
            <h3 className="font-bold text-base text-[#14110F] border-b border-[#E6E1DC] pb-3">بيانات الخدمة الأساسية</h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">عنوان الخدمة *</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="تصنيع الأثاث الفاخر بالطلب (Bespoke)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الرابط المخصص (Slug)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none font-mono"
                  placeholder="bespoke-furniture-manufacturing"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">العنوان الفرعي (Subtitle)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="صناعة إيطالية يدوية بأخشاب طبيعية"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">شارة مميزة (Badge)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Bespoke Luxury"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">ترتيب الظهور (Display Order)</label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">حالة الخدمة</label>
                <select
                  className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="published">منشورة ومتاحة (Published)</option>
                  <option value="draft">مسودة مخفية (Draft)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">وصف تفصيلي للخدمة *</label>
              <textarea
                rows={4}
                required
                className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                placeholder="شرح كامل لمراحل تنفيذ الخدمة والمزايا المقدمة للعميل..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">أبرز مميزات الخدمة (ميزة في كل سطر)</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-[#E6E1DC] px-4 py-2.5 text-sm text-[#14110F] focus:border-[#C5A880] focus:outline-none"
                placeholder="أخشاب جوز وسنديان طبيعية معالجة&#10;تفصيل مقاسات دقيقة بالسنتيمتر&#10;ضمان شامل على الهياكل"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </div>

            {/* Service Image Upload */}
            <ImagePicker
              label="صورة الخدمة الرئيسية"
              value={imageUrl}
              onChange={setImageUrl}
              file={imageFile}
              onFileChange={setImageFile}
              hint="صورة جذابة تبرز معايير وفخامة هذه الخدمة"
              title="اختر صورة للخدمة من مكتبة الوسائط"
            />
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
              {submitting ? 'جار الحفظ والتحديث...' : 'حفظ بيانات الخدمة'}
            </Button>
          </div>
        </form>
      ) : (
        /* Services List */
        <div className="bg-white rounded-2xl border border-[#E6E1DC] shadow-sm overflow-hidden">
          {services.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#8C7F75]">
              <FaBellConcierge className="w-8 h-8 mx-auto text-[#D6CDC4] mb-2" />
              لا توجد خدمات مضافة حالياً.
            </div>
          ) : (
            <div className="divide-y divide-[#E6E1DC]">
              {services.map((srv) => (
                <div key={srv.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors">
                  <div className="flex items-center gap-4">
                    {(srv.image || srv.hero_image) && (
                      <img
                        src={srv.image || srv.hero_image}
                        alt={srv.title}
                        className="w-16 h-16 rounded-xl object-cover border border-[#E6E1DC] shrink-0"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#14110F]">{srv.title}</h4>
                        {srv.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C5A880]/15 text-[#8C6A2D]">
                            {srv.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8C7F75] mt-1 font-mono">/{srv.slug}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                        srv.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {srv.status === 'published' ? 'منشورة' : 'مسودة'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/services/${srv.slug}`}
                      target="_blank"
                      className="p-2 text-[#5C544E] hover:bg-white rounded-lg border border-[#E6E1DC]"
                      title="معاينة"
                    >
                      <FaEye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEdit(srv)}
                      className="p-2 text-[#5C544E] hover:bg-white rounded-lg border border-[#E6E1DC]"
                      title="تعديل"
                    >
                      <FaPen className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(srv.id)}
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
