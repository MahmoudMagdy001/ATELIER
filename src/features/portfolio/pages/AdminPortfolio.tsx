import React, { useState } from 'react'
import { useAdminPortfolio } from '../hooks/useAdminPortfolio'
import { PageLoading } from '../../../components/ui/Loading'
import Button from '../../../components/ui/Button'
import ImagePicker from '../../../components/admin/ImagePicker'
import { 
  FaImages, 
  FaPlus, 
  FaTrashCan, 
  FaPenToSquare, 
  FaEye, 
  FaEyeSlash,
  FaArrowLeft,
  FaCheck
} from 'react-icons/fa6'

export default function AdminPortfolio() {
  const {
    items,
    loading,
    isEditing,
    currentItem,
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    displayOrder,
    setDisplayOrder,
    isVisible,
    setIsVisible,
    imageUrl,
    setImageUrl,
    imageFile,
    setImageFile,
    submitting,
    handleEdit,
    handleCreateNew,
    handleDelete,
    handleSubmit,
    setIsEditing,
  } = useAdminPortfolio()

  const [previewUrl, setPreviewUrl] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  if (loading && !isEditing) return <PageLoading text="جار تحميل معرض الأعمال..." />

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#14110F]">
            {isEditing ? (currentItem ? 'تعديل عمل سابق' : 'إضافة عمل جديد للمعرض') : 'معرض أسبقيات الأعمال (Portfolio Manager)'}
          </h1>
          <p className="text-xs text-[#8C7F75] mt-1">
            إدارة صور ومشاريع الأعمال المنفذة المعروضة في الصفحة الرئيسية
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleCreateNew} icon={<FaPlus />}>
            إضافة عمل جديد
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl p-6 md:p-8 border border-[#E6E1DC] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#14110F] mb-1.5">
                  عنوان العمل / المشروع *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: صالون قصر العليا الفاخر - خشب جوز معتق"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D6CDC4] text-xs font-bold text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14110F] mb-1.5">
                  التصنيف / القسم
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="مثال: صالونات، مجالس، غرف طعام، أجنحة خاصة"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D6CDC4] text-xs font-medium text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14110F] mb-1.5">
                  الوصف والتفاصيل
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="تفاصيل الخامات المنفذة ونوع الرخام والخشب..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D6CDC4] text-xs leading-relaxed font-medium text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#14110F] mb-1.5">
                    ترتيب الظهور
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D6CDC4] text-xs font-bold text-[#14110F] bg-white focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14110F] mb-1.5">
                    الحالة في المعرض
                  </label>
                  <select
                    value={isVisible ? 'true' : 'false'}
                    onChange={(e) => setIsVisible(e.target.value === 'true')}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D6CDC4] text-xs font-bold text-[#14110F] bg-white focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="true">ظاهر في الموقع</option>
                    <option value="false">مخفي مؤقتاً</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload Column with ImagePicker */}
            <div className="space-y-4">
              <ImagePicker
                label="صورة العمل المنفذ *"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url)
                  setPreviewUrl(url)
                }}
                file={imageFile}
                onFileChange={(file) => {
                  setImageFile(file)
                  if (file) setPreviewUrl(URL.createObjectURL(file))
                }}
                onRemove={() => {
                  setImageUrl('')
                  setImageFile(null)
                  setPreviewUrl('')
                }}
                hint="صورة فوتوغرافية واضحة للعمل المنفذ"
                title="اختر صورة من مكتبة الوسائط لمعرض الأعمال"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E6E1DC]">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditing(false)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              icon={<FaCheck />}
            >
              {submitting ? 'جار الحفظ...' : (currentItem ? 'تحديث العمل' : 'حفظ ونشر العمل')}
            </Button>
          </div>
        </form>
      ) : (
        /* Items Grid */
        <div>
          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E6E1DC] p-8 space-y-3">
              <FaImages className="w-12 h-12 text-[#C5A880]/40 mx-auto" />
              <h3 className="text-sm font-bold text-[#14110F]">لا توجد أعمال في المعرض حالياً</h3>
              <p className="text-xs text-[#8C7F75]">أضف صور مشاريعك وقصور عملائك لتظهر في الصفحة الرئيسية لموقعك</p>
              <div className="pt-2">
                <Button onClick={handleCreateNew} icon={<FaPlus />}>
                  إضافة أول عمل
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E6E1DC] overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-[#F5F2EB] overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#14110F]/80 backdrop-blur-md text-white">
                        {item.category || 'عام'}
                      </span>
                    </div>

                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${item.is_visible ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {item.is_visible ? 'ظاهر' : 'مخفي'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#14110F]">{item.title}</h3>
                      {item.description && (
                        <p className="text-xs text-[#8C7F75] line-clamp-2 mt-1">{item.description}</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#E6E1DC] flex items-center justify-between">
                      <span className="text-[10px] text-[#8C7F75]">الترتيب: {item.display_order}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg text-[#C5A880] hover:bg-[#C5A880]/10 transition-colors"
                          title="تعديل"
                        >
                          <FaPenToSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="حذف"
                        >
                          <FaTrashCan className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
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
