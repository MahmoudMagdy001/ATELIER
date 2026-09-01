import { useState, useEffect } from 'react'
import { adminService } from '../services/adminService'
import { PageLoading } from '../../../components/ui/Loading'
import Button from '../../../components/ui/Button'
import { 
  FaCopy, 
  FaTrash, 
  FaMagnifyingGlass, 
  FaPlus, 
  FaRegFileImage, 
  FaFloppyDisk, 
  FaCheck,
  FaArrowUpFromBracket,
  FaXmark
} from 'react-icons/fa6'

export default function AdminMedia() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  
  // Metadata edit modal state
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [metaAlt, setMetaAlt] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaCaption, setMetaCaption] = useState('')
  const [savingMeta, setSavingMeta] = useState(false)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const data = await adminService.fetchMedia()
      setMedia(data)
    } catch (err) {
      console.warn('Media fetch fallback:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map((file) =>
        adminService.uploadMedia(file)
      )
      await Promise.all(uploadPromises)
      fetchMedia()
    } catch (err) {
      alert('فشل رفع الملفات: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الملف نهائياً؟')) return
    try {
      await adminService.deleteMedia(id)
      if (selectedMedia?.id === id) setSelectedMedia(null)
      fetchMedia()
    } catch (err) {
      alert('فشل الحذف: ' + err.message)
    }
  }

  const handleSelectMedia = (item) => {
    setSelectedMedia(item)
    setMetaAlt(item.alt_text || '')
    setMetaTitle(item.title || '')
    setMetaCaption(item.caption || '')
  }

  const handleSaveMetadata = async (e) => {
    e.preventDefault()
    if (!selectedMedia) return

    setSavingMeta(true)
    try {
      await adminService.updateMediaMetadata(selectedMedia.id, {
        alt_text: metaAlt,
        title: metaTitle,
        caption: metaCaption,
      })
      alert('تم تحديث بيانات الصورة بنجاح')
      fetchMedia()
    } catch (err) {
      alert('فشل تحديث البيانات: ' + err.message)
    } finally {
      setSavingMeta(false)
    }
  }

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredMedia = media.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
      (item.alt_text && item.alt_text.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) return <PageLoading text="جار فتح مكتبة الوسائط..." />

  return (
    <div className="space-y-8 max-w-6xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#14110F]">مكتبة الوسائط السحابية (Media Library)</h1>
          <p className="text-xs text-[#8C7F75] mt-1">تخزين، ضغط WebP تلقائي، وإدارة صور ومستندات أتيليه</p>
        </div>

        {/* Upload Button */}
        <div>
          <label className="px-5 py-2.5 rounded-xl bg-[#C5A880] text-white hover:bg-[#B59362] text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-[#C5A880]/20">
            <FaArrowUpFromBracket className="w-3.5 h-3.5" />
            <span>{uploading ? 'جار الرفع والضغط...' : 'رفع وسائط جديدة'}</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              className="hidden"
              onChange={handleBulkUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E6E1DC] shadow-sm">
        <FaMagnifyingGlass className="text-[#8C7F75] w-4 h-4 ml-2" />
        <input
          type="text"
          placeholder="ابحث عن الصور بالاسم أو النص البديل..."
          className="w-full text-xs text-[#14110F] focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E6E1DC] p-12 text-center text-xs text-[#8C7F75]">
          <FaRegFileImage className="w-10 h-10 mx-auto text-[#D6CDC4] mb-3" />
          <p>لا توجد وسائط مطابقة. ارفع أول صورة لمكتبتك الآن.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectMedia(item)}
              className={`group relative bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all ${
                selectedMedia?.id === item.id
                  ? 'border-[#C5A880] ring-2 ring-[#C5A880]/20 shadow-md'
                  : 'border-[#E6E1DC] hover:border-[#C5A880]/50'
              }`}
            >
              <div className="aspect-square bg-[#FAF8F5] relative overflow-hidden flex items-center justify-center">
                {item.file_type?.startsWith('image/') || item.file_url ? (
                  <img
                    src={item.file_url}
                    alt={item.alt_text || item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <FaRegFileImage className="w-8 h-8 text-[#8C7F75]" />
                )}
              </div>

              <div className="p-2.5">
                <p className="text-[11px] font-bold text-[#14110F] truncate" title={item.name}>
                  {item.name}
                </p>
                <p className="text-[10px] text-[#8C7F75] mt-0.5">
                  {item.file_size ? `${(item.file_size / 1024).toFixed(0)} KB` : 'WebP'}
                </p>
              </div>

              {/* Quick action buttons on hover */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopyUrl(item.file_url, item.id)
                  }}
                  className="p-1.5 bg-black/70 hover:bg-[#C5A880] text-white rounded-lg text-[10px]"
                  title="نسخ الرابط"
                >
                  {copiedId === item.id ? <FaCheck className="w-3 h-3 text-emerald-400" /> : <FaCopy className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(item.id)
                  }}
                  className="p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-lg text-[10px]"
                  title="حذف الصورة"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Media Metadata Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-2xl w-full border border-[#E6E1DC] space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-3">
              <h3 className="font-bold text-base text-[#14110F]">تفاصيل ومعلومات الصورة</h3>
              <button onClick={() => setSelectedMedia(null)} className="text-[#8C7F75] hover:text-[#14110F]">
                <FaXmark className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square bg-[#FAF8F5] rounded-xl overflow-hidden border border-[#E6E1DC] flex items-center justify-center">
                <img src={selectedMedia.file_url} alt={metaAlt} className="w-full h-full object-contain" />
              </div>

              <form onSubmit={handleSaveMetadata} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5C544E] mb-1">الرابط المباشر (URL)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E6E1DC] text-xs bg-[#FAF8F5]"
                      value={selectedMedia.file_url}
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(selectedMedia.file_url, selectedMedia.id)}
                      className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E6E1DC] hover:bg-[#E6E1DC] rounded-lg text-xs font-bold"
                    >
                      {copiedId === selectedMedia.id ? 'تم!' : 'نسخ'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5C544E] mb-1">النص البديل (Alt Text - لمحركات البحث)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs"
                    value={metaAlt}
                    onChange={(e) => setMetaAlt(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5C544E] mb-1">عنوان الصورة (Title)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5C544E] mb-1">الشرح التوضيحي (Caption)</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs"
                    value={metaCaption}
                    onChange={(e) => setMetaCaption(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMedia.id)}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    حذف الصورة نهائياً
                  </button>
                  <Button type="submit" disabled={savingMeta} icon={<FaFloppyDisk />} size="sm">
                    {savingMeta ? 'جار الحفظ...' : 'حفظ البيانات'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
