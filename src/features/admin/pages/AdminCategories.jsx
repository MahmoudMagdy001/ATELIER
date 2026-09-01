import { useState, useEffect, useRef } from 'react'
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
  FaImage, 
  FaUpload, 
  FaArrowUpFromBracket,
  FaLink
} from 'react-icons/fa6'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('products')
  
  // Form State
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [type, setType] = useState('products')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchCategories()
  }, [filterType])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await adminService.fetchCategories(filterType)
      setCategories(data)
    } catch (err) {
      console.warn('Fetch categories fallback:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (cat) => {
    setCurrentId(cat.id)
    setName(cat.name || '')
    setSlug(cat.slug || '')
    setDescription(cat.description || '')
    setImageUrl(cat.image_url || '')
    setImagePreview(cat.image_url || '')
    setImageFile(null)
    setType(cat.type || 'products')
    setDisplayOrder(cat.display_order || 0)
    setMetaTitle(cat.meta_title || '')
    setMetaDescription(cat.meta_description || '')
    setIsEditing(true)
  }

  const handleCreateNew = () => {
    setCurrentId(null)
    setName('')
    setSlug('')
    setDescription('')
    setImageUrl('')
    setImagePreview('')
    setImageFile(null)
    setType(filterType)
    setDisplayOrder(categories.length + 1)
    setMetaTitle('')
    setMetaDescription('')
    setIsEditing(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImageUrl('')
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return
    try {
      await adminService.deleteCategory(id)
      fetchCategories()
    } catch (err) {
      alert('فشل الحذف: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let finalImageUrl = imageUrl
      if (imageFile) {
        setUploadingImage(true)
        finalImageUrl = await adminService.uploadCategoryImage(imageFile)
        setUploadingImage(false)
      }

      const targetSlug = slug || name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)/g, '')

      const catData = {
        name,
        slug: targetSlug,
        description,
        image_url: finalImageUrl,
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
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ: ' + err.message)
    } finally {
      setSubmitting(false)
      setUploadingImage(false)
    }
  }

  if (loading) return <PageLoading text="جار تحميل التصنيفات..." />

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#14110F]">إدارة التصنيفات (Categories)</h1>
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
              ? 'bg-[#C5A880] text-white shadow-md shadow-[#C5A880]/20'
              : 'bg-white border border-[#E6E1DC] text-[#5C544E] hover:bg-[#FAF8F5]'
          }`}
        >
          تصنيفات الأثاث والمنتجات (Products)
        </button>
        <button
          onClick={() => setFilterType('blog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterType === 'blog'
              ? 'bg-[#C5A880] text-white shadow-md shadow-[#C5A880]/20'
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
              className="bg-white rounded-2xl border border-[#E6E1DC] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-[#C5A880]/50 transition-all"
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
                    <div className="text-[#C5A880] flex flex-col items-center justify-center p-2 text-center">
                      <FaImage className="w-6 h-6 mb-1 opacity-50" />
                      <span className="text-[9px] text-[#8C7F75]">بدون صورة</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm sm:text-base text-[#14110F]">{cat.name}</h4>
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
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F5] text-[#5C544E] hover:bg-[#C5A880] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-xl w-full border border-[#E6E1DC] space-y-5 my-8" 
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#14110F]">
                  {currentId ? 'تعديل بيانات التصنيف' : 'إنشاء تصنيف جديد'}
                </h3>
                <p className="text-xs text-[#8C7F75] mt-0.5">
                  خصص اسم التصنيف وصورته الرئيسية ليظهر بشكل جذاب في الصفحة الرئيسية
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
              label="صورة التصنيف (للعرض الفاخر في الصفحة الرئيسية)"
              value={imageUrl}
              onChange={(url) => {
                setImageUrl(url)
                setImagePreview(url)
              }}
              file={imageFile}
              onFileChange={(file) => {
                setImageFile(file)
                if (file) {
                  setImagePreview(URL.createObjectURL(file))
                }
              }}
              onRemove={() => {
                setImageFile(null)
                setImageUrl('')
                setImagePreview('')
              }}
              aspectRatio="square"
              title="اختر صورة للتصنيف من مكتبة الوسائط"
            />

            {/* Name and Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1">اسم التصنيف *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DC] text-xs text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:outline-none"
                  placeholder="مثال: أطقم الصالونات والمجالس"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1">الاسم اللطيف (Slug)</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DC] text-xs font-mono text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:outline-none"
                  placeholder="living-room-majlis"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
            </div>

            {/* Type and Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1">نوع التصنيف</label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DC] text-xs text-[#14110F] bg-white focus:border-[#C5A880] focus:outline-none cursor-pointer"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="products">منتجات وأثاث (Products)</option>
                  <option value="blog">مقالات المدونة (Blog)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1">ترتيب الظهور (Display Order)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DC] text-xs text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:outline-none"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1">وصف مختصر للتصنيف</label>
              <textarea
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DC] text-xs text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:outline-none leading-relaxed"
                placeholder="أطقم صالونات ومجالس فاخرة مكسوة بأفخم الأقمشة الإيطالية والجلد الطبيعي..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end items-center gap-3 pt-4 border-t border-[#E6E1DC]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 text-xs font-semibold text-[#5C544E] hover:bg-[#FAF8F5] rounded-xl transition-all cursor-pointer"
              >
                إلغاء
              </button>
              <Button 
                type="submit" 
                disabled={submitting || uploadingImage} 
                icon={<FaFloppyDisk />} 
                size="md"
              >
                {submitting || uploadingImage ? 'جار الحفظ والرفع...' : 'حفظ التصنيف'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

