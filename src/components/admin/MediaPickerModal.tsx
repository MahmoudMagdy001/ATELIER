import React, { useState, useEffect } from 'react'
import { adminService } from '../../features/admin/services/adminService'
import type { MediaItem } from '../../types/database'
import { 
  FaMagnifyingGlass, 
  FaArrowUpFromBracket, 
  FaCheck, 
  FaXmark, 
  FaRegFileImage, 
  FaFloppyDisk,
  FaTrash,
  FaImage,
  FaPen
} from 'react-icons/fa6'

export interface SelectedMedia {
  url: string
  name: string
  alt: string
  title: string
  id: string
}

export interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (item: SelectedMedia) => void
  selectedUrl?: string
  title?: string
}

export default function MediaPickerModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedUrl = '',
  title = 'مكتبة الوسائط - اختر أو ارفع صورة'
}: MediaPickerModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const [uploading, setUploading] = useState<boolean>(false)
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null)
  
  // Quick metadata edit states for active item
  const [editName, setEditName] = useState<string>('')
  const [editAlt, setEditAlt] = useState<string>('')
  const [editTitle, setEditTitle] = useState<string>('')
  const [isEditingMeta, setIsEditingMeta] = useState<boolean>(false)
  const [savingMeta, setSavingMeta] = useState<boolean>(false)

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const data = await adminService.fetchMedia()
      setMedia(data)
      if (selectedUrl && data.length > 0) {
        const found = data.find(m => (m.file_url || (m as unknown as { url?: string }).url) === selectedUrl)
        if (found) {
          selectItem(found)
        }
      }
    } catch (err: unknown) {
      console.warn('Failed to load media in modal:', (err as Error)?.message || err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchMedia()
    }
  }, [isOpen, selectedUrl])

  useEffect(() => {
    const handleMediaUpdated = () => {
      adminService.fetchMedia().then(setMedia).catch(() => {})
    }
    window.addEventListener('atelier:media-updated', handleMediaUpdated)
    return () => window.removeEventListener('atelier:media-updated', handleMediaUpdated)
  }, [])

  const selectItem = (item: MediaItem) => {
    setActiveItem(item)
    setEditName(item.name || '')
    setEditAlt(item.alt_text || '')
    setEditTitle(item.title || '')
    setIsEditingMeta(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map((file) =>
        adminService.uploadMedia(file)
      )
      const uploaded = await Promise.all(uploadPromises)
      await fetchMedia()
      if (uploaded.length > 0) {
        selectItem(uploaded[0])
      }
    } catch (err: unknown) {
      alert('فشل رفع الصورة: ' + ((err as Error)?.message || String(err)))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSaveNameAndMeta = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    if (!activeItem) return

    setSavingMeta(true)
    try {
      const updated = await adminService.updateMediaMetadata(activeItem.id, {
        name: editName.trim() || activeItem.name,
        alt_text: editAlt,
        title: editTitle,
      })
      setMedia(prev => prev.map(m => m.id === activeItem.id ? { ...m, ...updated } : m))
      setActiveItem(prev => (prev ? { ...prev, ...updated } : updated))
      setIsEditingMeta(false)
    } catch (err: unknown) {
      alert('فشل تحديث اسم وبيانات الصورة: ' + ((err as Error)?.message || String(err)))
    } finally {
      setSavingMeta(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل تريد حذف هذه الصورة نهائياً من الوسائط؟')) return
    try {
      await adminService.deleteMedia(id)
      if (activeItem?.id === id) setActiveItem(null)
      fetchMedia()
    } catch (err: unknown) {
      alert('فشل الحذف: ' + ((err as Error)?.message || String(err)))
    }
  }

  const handleConfirmSelect = () => {
    if (!activeItem) return
    const url = activeItem.file_url || (activeItem as unknown as { url?: string }).url || ''
    onSelect({
      url,
      name: activeItem.name,
      alt: activeItem.alt_text || activeItem.name,
      title: activeItem.title || activeItem.name,
      id: activeItem.id
    })
    onClose()
  }

  const filteredMedia = media.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
      (item.alt_text && item.alt_text.toLowerCase().includes(search.toLowerCase())) ||
      (item.title && item.title.toLowerCase().includes(search.toLowerCase()))
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6" dir="rtl">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6E1DC] shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E1DC] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A880]/15 text-[#C5A880] flex items-center justify-center">
              <FaImage className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#14110F]">{title}</h3>
              <p className="text-[11px] text-[#8C7F75]">اختر من صور الموقع أو ارفع صورة جديدة مباشرة مع تحسين الجودة</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="px-4 py-2 rounded-xl bg-[#C5A880] text-white hover:bg-[#B59362] text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm">
              <FaArrowUpFromBracket className="w-3.5 h-3.5" />
              <span>{uploading ? 'جار الرفع...' : 'رفع صورة جديدة'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#E6E1DC] text-[#8C7F75] hover:text-[#14110F] transition-colors"
            >
              <FaXmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-[#E6E1DC] bg-white flex items-center gap-3">
          <FaMagnifyingGlass className="text-[#8C7F75] w-4 h-4" />
          <input
            type="text"
            placeholder="ابحث في الصور بالاسم أو النص البديل أو العنوان..."
            className="w-full text-xs text-[#14110F] focus:outline-none placeholder-[#8C7F75]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-[#8C7F75] hover:text-[#14110F]">
              مسح
            </button>
          )}
        </div>

        {/* Body: Media Grid + Details Panel */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Media Grid */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#FCFBF9]">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-xs text-[#8C7F75] py-12">
                <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mb-3"></div>
                <span>جار تحميل وسائط الموقع...</span>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#8C7F75]">
                <FaRegFileImage className="w-12 h-12 text-[#D6CDC4] mb-3" />
                <p className="font-bold text-sm text-[#14110F]">لم يتم العثور على صور</p>
                <p className="text-xs mt-1">ارفع صورة جديدة مباشرة من الزر في الأعلى لتظهر في مكتبتك.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5">
                {filteredMedia.map((item) => {
                  const url = item.file_url || (item as unknown as { url?: string }).url || ''
                  const isSelected = activeItem?.id === item.id || (!activeItem && selectedUrl === url)
                  return (
                    <div
                      key={item.id}
                      onClick={() => selectItem(item)}
                      className={`group relative bg-white rounded-xl sm:rounded-2xl border overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#C5A880] ring-2 ring-[#C5A880] shadow-md'
                          : 'border-[#E6E1DC] hover:border-[#C5A880]/60'
                      }`}
                    >
                      <div className="aspect-square bg-[#FAF8F5] relative overflow-hidden flex items-center justify-center">
                        <img
                          src={url}
                          alt={item.alt_text || item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#C5A880]/20 flex items-start justify-end p-2">
                            <span className="w-6 h-6 rounded-full bg-[#C5A880] text-white flex items-center justify-center shadow-md">
                              <FaCheck className="w-3 h-3" />
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 bg-white">
                        <p className="text-[11px] font-bold text-[#14110F] truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[#8C7F75] mt-0.5 truncate">
                          {item.alt_text || item.title || 'صورة وسائط'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Side Details Panel */}
          {activeItem ? (
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-r border-[#E6E1DC] bg-white p-5 flex flex-col justify-between overflow-y-auto space-y-4">
              <div className="space-y-4">
                <div className="aspect-video bg-[#FAF8F5] rounded-xl overflow-hidden border border-[#E6E1DC] flex items-center justify-center">
                  <img
                    src={activeItem.file_url || (activeItem as unknown as { url?: string }).url}
                    alt={activeItem.alt_text || activeItem.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Name & Quick Metadata */}
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-[#5C544E]">اسم الصورة (يتغير في كل مكان تلقائياً)</label>
                      <button
                        type="button"
                        onClick={() => setIsEditingMeta(!isEditingMeta)}
                        className="text-[10px] text-[#C5A880] hover:underline font-bold flex items-center gap-1"
                      >
                        <FaPen className="w-2.5 h-2.5" />
                        <span>{isEditingMeta ? 'إلغاء' : 'تعديل الاسم'}</span>
                      </button>
                    </div>

                    {isEditingMeta ? (
                      <form onSubmit={handleSaveNameAndMeta} className="space-y-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-[#E6E1DC]">
                        <div>
                          <label className="text-[10px] text-[#8C7F75] block mb-1">اسم الملف / الصورة:</label>
                          <input
                            type="text"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E6E1DC] text-xs text-[#14110F] bg-white focus:border-[#C5A880] focus:outline-none"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="اسم الصورة..."
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-[#8C7F75] block mb-1">النص البديل (Alt Text):</label>
                          <input
                            type="text"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E6E1DC] text-xs text-[#14110F] bg-white focus:border-[#C5A880] focus:outline-none"
                            value={editAlt}
                            onChange={(e) => setEditAlt(e.target.value)}
                            placeholder="وصف لمحركات البحث..."
                          />
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="submit"
                            disabled={savingMeta}
                            className="flex-1 py-1.5 bg-[#C5A880] text-white text-[11px] font-bold rounded-lg hover:bg-[#B59362] flex items-center justify-center gap-1"
                          >
                            <FaFloppyDisk className="w-3 h-3" />
                            <span>{savingMeta ? 'جار الحفظ...' : 'حفظ الاسم'}</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E6E1DC] space-y-1">
                        <p className="text-xs font-bold text-[#14110F] break-all">{activeItem.name}</p>
                        {activeItem.alt_text && (
                          <p className="text-[11px] text-[#8C7F75]">النص البديل: {activeItem.alt_text}</p>
                        )}
                        <p className="text-[10px] text-[#8C7F75] font-mono">
                          {activeItem.file_size ? `${(activeItem.file_size / 1024).toFixed(0)} KB` : 'WebP فاخر'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-3 border-t border-[#E6E1DC]">
                <button
                  type="button"
                  onClick={handleConfirmSelect}
                  className="w-full py-2.5 bg-[#14110F] hover:bg-[#2B2623] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <FaCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>تأكيد واختيار هذه الصورة</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(activeItem.id)}
                  className="w-full py-1.5 text-[11px] text-rose-600 hover:text-rose-800 font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <FaTrash className="w-2.5 h-2.5" />
                  <span>حذف الصورة من الوسائط</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-r border-[#E6E1DC] bg-[#FAF8F5] p-6 flex flex-col items-center justify-center text-center text-[#8C7F75] space-y-2">
              <FaRegFileImage className="w-8 h-8 text-[#D6CDC4]" />
              <p className="text-xs font-medium">انقر على أي صورة في المعرض لعرض تفاصيلها أو تعديل اسمها أو اختيارها.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
