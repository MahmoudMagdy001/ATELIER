import { useState, useEffect } from 'react'
import { adminService } from '../services/adminService'
import { PageLoading } from '../../../components/ui/Loading'
import Button from '../../../components/ui/Button'
import { FaPen, FaTrash, FaPlus, FaFloppyDisk, FaFolderOpen, FaXmark } from 'react-icons/fa6'

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
  const [type, setType] = useState('products')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
    setType(filterType)
    setDisplayOrder(0)
    setMetaTitle('')
    setMetaDescription('')
    setIsEditing(true)
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

    const targetSlug = slug || name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)/g, '')

    const catData = {
      name,
      slug: targetSlug,
      description,
      type,
      display_order: Number(displayOrder),
      meta_title: metaTitle,
      meta_description: metaDescription,
    }

    try {
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
    }
  }

  if (loading) return <PageLoading text="جار تحميل التصنيفات..." />

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#14110F]">إدارة التصنيفات (Categories)</h1>
          <p className="text-xs text-[#8C7F75] mt-1">تنظيم أقسام الأثاث والمنتجات وتصنيفات المقالات المعمارية</p>
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

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6E1DC] p-12 text-center text-xs text-[#8C7F75]">
            <FaFolderOpen className="w-8 h-8 mx-auto text-[#D6CDC4] mb-2" />
            لا توجد تصنيفات ضمن هذا النوع حالياً.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-[#E6E1DC] p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#FAF8F5] text-[#C5A880]">
                  <FaFolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#14110F]">{cat.name}</h4>
                  <p className="text-xs text-[#8C7F75] mt-0.5 font-mono">/{cat.slug}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(cat)}
                  className="p-2 text-[#5C544E] hover:bg-[#FAF8F5] rounded-lg cursor-pointer"
                  title="تعديل"
                >
                  <FaPen className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full border border-[#E6E1DC] space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-3">
              <h3 className="font-bold text-base text-[#14110F]">{currentId ? 'تعديل التصنيف' : 'إنشاء تصنيف جديد'}</h3>
              <button type="button" onClick={() => setIsEditing(false)} className="text-[#8C7F75]">
                <FaXmark className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C544E] mb-1">اسم التصنيف</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs focus:border-[#C5A880] focus:outline-none"
                placeholder="مثال: غرف معيشة فاخرة"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">الاسم اللطيف (Slug)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs font-mono"
                  placeholder="luxury-living-rooms"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">نوع التصنيف</label>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="products">منتجات وأثاث (Products)</option>
                  <option value="blog">مقالات المدونة (Blog)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C544E] mb-1">الوصف</label>
              <textarea
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#E6E1DC]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-medium text-[#5C544E]"
              >
                إلغاء
              </button>
              <Button type="submit" disabled={submitting} icon={<FaFloppyDisk />} size="sm">
                {submitting ? 'جار الحفظ...' : 'حفظ التصنيف'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
