import { useState, useEffect, useRef } from 'react'
import { 
  FaUpload, 
  FaPhotoFilm, 
  FaTrash, 
  FaLink, 
  FaImage, 
  FaXmark,
  FaCheck,
  FaArrowUpFromBracket
} from 'react-icons/fa6'
import MediaPickerModal from './MediaPickerModal'

export default function ImagePicker({
  label,
  value = '',
  onChange,
  file = null,
  onFileChange,
  onRemove,
  aspectRatio = 'auto',
  compact = false,
  placeholder = 'أو أدخل رابط صورة مباشر (URL)...',
  hint,
  title = 'اختر صورة من مكتبة الوسائط أو ارفع صورة جديدة'
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [preview, setPreview] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    } else {
      setPreview(value || '')
    }
  }, [file, value])

  const handleLocalFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (onFileChange) {
      onFileChange(selectedFile)
    } else {
      // If parent only handles url via onChange
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)
      onChange?.(objectUrl)
    }
    e.target.value = ''
  }

  const handleMediaSelect = (mediaItem) => {
    if (onFileChange) onFileChange(null)
    onChange?.(mediaItem.url)
    setPreview(mediaItem.url)
  }

  const handleClear = () => {
    if (onFileChange) onFileChange(null)
    if (onChange) onChange('')
    if (onRemove) onRemove()
    setPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // COMPACT MODE (for Variant Rows / Table rows / Compact forms)
  if (compact) {
    return (
      <div className="space-y-1.5" dir="rtl">
        {label && <label className="block text-xs font-bold text-[#5C544E]">{label}</label>}
        <div className="flex flex-wrap items-center gap-2">
          {preview ? (
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#E6E1DC] bg-[#FAF8F5] shrink-0 group">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                title="إزالة"
              >
                <FaXmark className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl border border-dashed border-[#D6CDC4] bg-[#FAF8F5] flex items-center justify-center text-[#8C7F75] shrink-0">
              <FaImage className="w-4 h-4 opacity-40" />
            </div>
          )}

          {/* Upload Button */}
          <label className="px-3 py-1.5 bg-white border border-[#E6E1DC] hover:bg-[#FAF8F5] hover:border-[#C5A880] rounded-xl text-xs font-bold text-[#5C544E] cursor-pointer flex items-center gap-1.5 transition-all shadow-sm">
            <FaUpload className="w-3 h-3 text-[#C5A880]" />
            <span>رفع</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLocalFileSelect}
            />
          </label>

          {/* Media Library Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-[#FAF8F5] border border-[#C5A880]/60 hover:bg-[#C5A880] hover:text-white rounded-xl text-xs font-bold text-[#14110F] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <FaPhotoFilm className="w-3 h-3 text-[#C5A880] group-hover:text-white" />
            <span>من الوسائط</span>
          </button>

          {/* Direct URL input */}
          <input
            type="url"
            placeholder="أو رابط مباشر..."
            className="flex-1 min-w-[140px] rounded-xl border border-[#E6E1DC] bg-white px-3 py-1.5 text-xs text-[#14110F] focus:border-[#C5A880] focus:outline-none"
            value={value || ''}
            onChange={(e) => {
              if (onFileChange) onFileChange(null)
              onChange?.(e.target.value)
            }}
          />
        </div>

        <MediaPickerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleMediaSelect}
          selectedUrl={value}
          title={title}
        />
      </div>
    )
  }

  // STANDARD MODE (Large card preview, buttons, direct URL)
  return (
    <div className="space-y-2" dir="rtl">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#5C544E]">{label}</label>
          {hint && <span className="text-[11px] text-[#8C7F75]">{hint}</span>}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-start bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E6E1DC]">
        {/* Preview Thumbnail */}
        {preview ? (
          <div className={`relative rounded-xl overflow-hidden border border-[#E6E1DC] bg-white shrink-0 group ${
            aspectRatio === 'square' ? 'w-28 h-28' : 'w-36 h-24 sm:w-40 sm:h-28'
          }`}>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/70 text-white hover:bg-rose-600 transition-colors shadow-md cursor-pointer"
              title="إزالة الصورة"
            >
              <FaXmark className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className={`rounded-xl border-2 border-dashed border-[#D6CDC4] bg-white flex flex-col items-center justify-center text-[#8C7F75] shrink-0 p-3 text-center ${
            aspectRatio === 'square' ? 'w-28 h-28' : 'w-36 h-24 sm:w-40 sm:h-28'
          }`}>
            <FaImage className="w-6 h-6 text-[#C5A880]/40 mb-1" />
            <span className="text-[10px] text-[#8C7F75] font-medium">لا توجد صورة</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex-1 w-full space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Upload From Device */}
            <label className="px-4 py-2 rounded-xl bg-white border border-[#E6E1DC] hover:border-[#C5A880] hover:bg-[#F3EFEA] text-xs font-bold text-[#5C544E] cursor-pointer flex items-center gap-2 transition-all shadow-sm">
              <FaUpload className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>رفع من الجهاز</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLocalFileSelect}
              />
            </label>

            {/* Choose From Media Library */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#C5A880] text-white hover:bg-[#B59362] text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <FaPhotoFilm className="w-3.5 h-3.5" />
              <span>اختيار من مكتبة الوسائط</span>
            </button>

            {/* Toggle Direct URL */}
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E6E1DC] text-[#8C7F75] hover:text-[#14110F] text-xs font-medium flex items-center gap-1.5 transition-all"
              title="إدخال رابط مباشر"
            >
              <FaLink className="w-3 h-3" />
              <span>{showUrlInput ? 'إخفاء الرابط' : 'رابط URL'}</span>
            </button>
          </div>

          {/* URL Input (always show if value exists or toggled) */}
          {(showUrlInput || (value && !file)) && (
            <div className="relative">
              <input
                type="url"
                placeholder={placeholder}
                className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:outline-none"
                value={value || ''}
                onChange={(e) => {
                  if (onFileChange) onFileChange(null)
                  onChange?.(e.target.value)
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleMediaSelect}
        selectedUrl={value}
        title={title}
      />
    </div>
  )
}
