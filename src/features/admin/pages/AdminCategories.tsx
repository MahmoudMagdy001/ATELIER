import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../services/adminService'
import { PageLoading } from '../../../components/ui/Loading'
import Button from '../../../components/ui/Button'
import ImagePicker from '../../../components/admin/ImagePicker'
import { 
  FaPen, 
  FaTrash, 
  FaPlus, 
  FaFloppyDisk, 
  FaFolderOpen, 
  FaXmark, 
  FaImage 
} from 'react-icons/fa6'

import AdminLanguageTabs, { AdminLocale } from '../../../components/admin/AdminLanguageTabs'

import type { Category } from '../../../types/database'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filterType, setFilterType] = useState<string>('products')
  
  // Form State
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [adminLocale, setAdminLocale] = useState<AdminLocale>('ar')
  const [name, setName] = useState<string>('')
  const [nameEn, setNameEn] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [descriptionEn, setDescriptionEn] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [type, setType] = useState<string>('products')
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [metaTitle, setMetaTitle] = useState<string>('')
  const [metaDescription, setMetaDescription] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminService.fetchCategories(filterType)
      setCategories(data)
    } catch (err: unknown) {
      console.warn('Fetch categories fallback:', (err as Error)?.message || err)
    } finally {
      setLoading(false)
    }
  }, [filterType])

  useEffect(() => {
    let isMounted = true
    adminService.fetchCategories(filterType)
      .then(data => {
        if (isMounted) {
          setCategories(data)
          setLoading(false)
        }
      })
      .catch(err => {
        console.warn('Fetch categories fallback:', (err as Error)?.message || err)
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [filterType])

  const handleEdit = (cat: Category) => {
    setCurrentId(cat.id)
    setName(cat.name || '')
    setNameEn(cat.name_en || '')
    setSlug(cat.slug || '')
    setDescription(cat.description || '')
    setDescriptionEn(cat.description_en || '')
    setImageUrl(cat.image_url || '')
    setType(cat.type || 'products')
    setDisplayOrder(cat.display_order || 0)
    setMetaTitle(cat.meta_title || '')
    setMetaDescription(cat.meta_description || '')
    setAdminLocale('ar')
    setIsEditing(true)
  }

  const handleCreateNew = () => {
    setCurrentId(null)
    setName('')
    setNameEn('')
    setSlug('')
    setDescription('')
    setDescriptionEn('')
    setImageUrl('')
    setType(filterType)
    setDisplayOrder(categories.length + 1)
    setMetaTitle('')
    setMetaDescription('')
    setAdminLocale('ar')
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return
    try {
      await adminService.deleteCategory(id)
      fetchCategories()
    } catch (err: unknown) {
      alert('فشل الحذف: ' + ((err as Error)?.message || String(err)))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const targetSlug = slug || name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)/g, '')

      const catData = {
        name,
        name_en: nameEn.trim() || null,
        slug: targetSlug,
        description,
        description_en: descriptionEn.trim() || null,
        image_url: imageUrl.trim() || null,
        type,
        display_order: Number(displayOrder),
        meta_title: metaTitle,
        meta_description: metaDescription,
      }

      if (currentId) {
        await adminService.updateCategory(currentId, catData)
      } else {
        await adminService.insertCategory(catData)
      }
      setIsEditing(false)
      fetchCategories()
    } catch (err: unknown) {
      alert('حدث خطأ أثناء الحفظ: ' + ((err as Error)?.message || String(err)))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageLoading text="جار تحميل التصنيفات..." />

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141110]">إدارة التصنيفات (Categories)</h1>
          <p className="text-xs text-[#8C7F75] mt-1">
            إضافة صور مميزة وتعديل أقسام الأثاث الفاخر وتصنيفات المقالات المعمارية
          </p>
        </div>

        <Button onClick={handleCreateNew} icon={<FaPlus />}>
          إضافة تصنيف جديد
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterType === 'products'
              ? 'bg-[#C4A070] text-white shadow-md shadow-[#C4A070]/20'
              : 'bg-white border border-[#E6E1DC] text-[#5C544E] hover:bg-[#FAF8F5]'
          }`}
        >
          تصنيفات الأثاث والمنتجات (Products)
        </button>
        <button
          onClick={() => setFilterType('blog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterType === 'blog'
              ? 'bg-[#C4A070] text-white shadow-md shadow-[#C4A070]/20'
              : 'bg-white border border-[#E6E1DC] text-[#5C544E] hover:bg-[#FAF8F5]'
          }`}
        >
          تصنيفات المدونة (Blog)
        </button>
      </div>

      {/* Categories Grid List */}
      <div className="grid gap-4">
        {categories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6E1DC] p-12 text-center text-xs text-[#8C7F75]">
            <FaFolderOpen className="w-8 h-8 mx-auto text-[#D6CDC4] mb-2" />
            لا توجد تصنيفات ضمن هذا النوع حالياً.
          </div>
        ) : (
          categories.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-white rounded-2xl border border-[#E6E1DC] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-[#C4A070]/50 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Category Image Preview */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E6E1DC] shrink-0 flex items-center justify-center">
                  {cat.image_url ? (
                    <img 
                      src={cat.image_url} 
                      alt={cat.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-[#C4A070] flex flex-col items-center justify-center p-2 text-center">
                      <FaImage className="w-6 h-6 mb-1 opacity-50" />
                      <span className="text-[9px] text-[#8C7F75]">بدون صورة</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm sm:text-base text-[#141110]">{cat.name}</h4>
                    {cat.name_en && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans">
                        EN: {cat.name_en}
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#8C7F75] border border-[#E6E1DC] font-mono">
                      ترتيب: {cat.display_order || 0}
                    </span>
                  </div>
                  <p className="text-xs text-[#8C7F75] font-mono">/{cat.slug}</p>
                  {cat.description && (
                    <p className="text-xs text-[#5C544E] line-clamp-1 max-w-xl">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleEdit(cat)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F5] text-[#5C544E] hover:bg-[#C4A070] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  title="تعديل"
                >
                  <FaPen className="w-3 h-3" />
                  <span>تعديل</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id)}
                  className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  title="حذف"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" data-modal="light">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-xl w-full border border-[#E6E1DC] space-y-5 my-8" 
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#141110]">
                  {adminLocale === 'en' 
                    ? (currentId ? 'Edit Category' : 'Create New Category') 
                    : (currentId ? 'تعديل بيانات التصنيف' : 'إنشاء تصنيف جديد')}
                </h3>
                <p className="text-xs text-[#8C7F75] mt-0.5">
                  {adminLocale === 'en'
                    ? 'Configure category details and featured visual presentation'
                    : 'خصص اسم التصنيف وصورته الرئيسية ليظهر بشكل جذاب في الصفحة الرئيسية'}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="p-2 text-[#8C7F75] hover:bg-[#FAF8F5] rounded-xl cursor-pointer"
              >
                <FaXmark className="w-5 h-5" />
              </button>
            </div>

            {/* Category Image Upload & Preview */}
            <ImagePicker
              label={adminLocale === 'en' ? 'Category Image (Homepage Showcase)' : 'صورة التصنيف (للعرض في الصفحة الرئيسية)'}
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl('')}
              aspectRatio="square"
              title={adminLocale === 'en' ? 'Select category image from Media Library' : 'اختر صورة للتصنيف من مكتبة الوسائط'}
            />

            {/* Multilingual Tabs */}
            <AdminLanguageTabs
              activeLocale={adminLocale}
              onChange={setAdminLocale}
              hasEnglishContent={Boolean(nameEn.trim())}
            />

            {/* Localized Form Fields */}
            {adminLocale === 'ar' ? (
              <>
                {/* Name and Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1">اسم التصنيف *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DC] text-xs font-medium text-[#141110] bg-white placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                      placeholder="مثال: أطقم الصالونات والمجالس"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1">الرابط المخصص (Slug)</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DC] text-xs font-mono text-[#141110] bg-white placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                      placeholder="living-room-majlis"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1">وصف التصنيف</label>
                  <textarea
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DC] text-xs font-medium text-[#141110] bg-white placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none leading-relaxed transition-all"
                    placeholder="أطقم صالونات ومجالس فاخرة مكسوة بأفخم الأقمشة الإيطالية والجلد الطبيعي..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4" dir="ltr">
                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1 text-left">Category Name</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DC] text-xs font-medium text-[#141110] bg-white placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                    placeholder="e.g. Salons & Royal Majlis Suites"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                  />
                  <p className="text-[10px] text-[#8C7F75] mt-1 text-left">
                    Leave blank to use Arabic name as fallback
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1 text-left">Category Description</label>
                  <textarea
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DC] text-xs font-medium text-[#141110] bg-white placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none leading-relaxed transition-all text-left"
                    placeholder="e.g. Luxurious salons and majlis suites upholstered in fine Italian textiles and natural leather..."
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Category Image */}
            <div>
              <ImagePicker
                label={adminLocale === 'en' ? 'Category Image (Optional)' : 'صورة التصنيف (اختياري)'}
                value={imageUrl}
                onChange={(val) => setImageUrl(val)}
              />
            </div>

            {/* Type and Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1">
                  {adminLocale === 'en' ? 'Category Type' : 'نوع التصنيف'}
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DC] text-xs font-medium text-[#141110] bg-white focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all cursor-pointer"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="products">{adminLocale === 'en' ? 'Furniture & Products' : 'منتجات وأثاث (Products)'}</option>
                  <option value="blog">{adminLocale === 'en' ? 'Blog & Articles' : 'مقالات المدونة (Blog)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1">
                  {adminLocale === 'en' ? 'Display Order' : 'ترتيب الظهور'}
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DC] text-xs font-bold text-[#141110] bg-white placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end items-center gap-3 pt-4 border-t border-[#E6E1DC]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 text-xs font-semibold text-[#5C544E] hover:bg-[#FAF8F5] rounded-xl transition-all cursor-pointer"
              >
                {adminLocale === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              <Button 
                type="submit" 
                disabled={submitting} 
                icon={<FaFloppyDisk />} 
                size="md"
              >
                {submitting
                  ? (adminLocale === 'en' ? 'Saving...' : 'جار الحفظ...') 
                  : (adminLocale === 'en' ? 'Save Category' : 'حفظ التصنيف')}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

