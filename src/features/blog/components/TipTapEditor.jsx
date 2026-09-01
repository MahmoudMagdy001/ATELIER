import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import { Youtube } from '@tiptap/extension-youtube'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { TextAlign } from '@tiptap/extension-text-align'
import { FontSize, LineHeight, LetterSpacing, Iframe, CustomImage } from './TipTapExtensions'
import { blogService } from '../services/blogService'
import { useState, useEffect } from 'react'
import { 
  FaArrowRotateLeft, FaArrowRotateRight, FaBold, FaItalic, FaUnderline, FaStrikethrough, FaHighlighter, 
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, 
  FaListUl, FaListOl, FaSquareCheck, FaQuoteRight, FaCode, 
  FaLink, FaImage, FaYoutube, FaMinus, FaTable, FaEraser, FaUpload, FaXmark 
} from 'react-icons/fa6'
import '../../../styles/article.css'

export default function TipTapEditor({ value = '', onChange }) {
  const [activeModal, setActiveModal] = useState(null)
  const [modalData, setModalData] = useState({})
  const [imageUploadLoading, setImageUploadLoading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: true,
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-lg bg-[#1F1B18] text-[#F8FAF7] p-4 font-mono text-sm my-4'
          }
        }
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#C5A880] underline cursor-pointer hover:text-[#D8B788]',
          rel: 'noopener noreferrer',
          target: '_blank'
        }
      }),
      CustomImage,
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: 'responsive-iframe-container rounded-xl shadow-md my-4'
        }
      }),
      Iframe,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-[#E6E1DC] my-4 w-full text-right'
        }
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      LineHeight,
      LetterSpacing,
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify']
      })
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none article-content min-h-[420px] p-4',
        dir: 'auto'
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0]
          if (file.type.startsWith('image/')) {
            event.preventDefault()
            uploadAndInsertImage(file)
            return true
          }
        }
        return false
      },
      handlePaste: (view, event, slice) => {
        if (event.clipboardData?.files?.length) {
          const file = event.clipboardData.files[0]
          if (file.type.startsWith('image/')) {
            event.preventDefault()
            uploadAndInsertImage(file)
            return true
          }
        }
        return false
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  const uploadAndInsertImage = async (file) => {
    setImageUploadLoading(true)
    try {
      const url = await blogService.uploadEditorImage(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch (err) {
      alert('فشل رفع الصورة: ' + err.message)
    } finally {
      setImageUploadLoading(false)
    }
  }

  if (!editor) return null

  const openLinkModal = () => {
    const isLink = editor.isActive('link')
    const currentAttrs = isLink ? editor.getAttributes('link') : {}
    setModalData({
      url: currentAttrs.href || '',
      target: currentAttrs.target === '_blank'
    })
    setActiveModal('link')
  }

  const saveLinkModal = (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    const { url, target } = modalData
    if (!url) {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ 
        href: url, 
        target: target ? '_blank' : '_self' 
      }).run()
    }
    setActiveModal(null)
  }

  const openImageModal = () => {
    const isImg = editor.isActive('image')
    const currentAttrs = isImg ? editor.getAttributes('image') : {}
    setModalData({
      isEdit: isImg,
      src: currentAttrs.src || '',
      alt: currentAttrs.alt || '',
      title: currentAttrs.title || '',
      caption: currentAttrs.caption || '',
      width: currentAttrs.width || '100%',
      align: currentAttrs.align || 'center',
      uploadType: 'url'
    })
    setActiveModal('image')
  }

  const saveImageModal = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    const { src, alt, title, caption, width, align } = modalData
    if (!src) return

    if (modalData.isEdit) {
      editor.chain().focus().updateAttributes('image', {
        src, alt, title, caption, width, align
      }).run()
    } else {
      editor.chain().focus().setImage({
        src, alt, title, caption, width, align
      }).run()
    }
    setActiveModal(null)
  }

  const handleModalImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploadLoading(true)
    try {
      const url = await blogService.uploadEditorImage(file)
      setModalData(prev => ({ ...prev, src: url }))
    } catch (err) {
      alert('فشل رفع الصورة: ' + err.message)
    } finally {
      setImageUploadLoading(false)
    }
  }

  const openYoutubeModal = () => {
    setActiveModal('youtube')
    setModalData({ url: '', width: 640, height: 360 })
  }

  const saveYoutubeModal = (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    const { url, width, height } = modalData
    if (url) {
      editor.chain().focus().setYoutubeVideo({
        src: url,
        width: Number(width),
        height: Number(height)
      }).run()
    }
    setActiveModal(null)
  }

  const openIframeModal = () => {
    setActiveModal('iframe')
    setModalData({ src: '', width: '100%', height: '450' })
  }

  const saveIframeModal = (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    let { src, width, height } = modalData
    if (!src) return

    if (src.includes('<iframe')) {
      const match = src.match(/src="([^"]+)"/)
      if (match) src = match[1]
    }

    editor.chain().focus().setIframe({
      src,
      width: width.toString(),
      height: height.toString()
    }).run()
    setActiveModal(null)
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const fonts = [
    { label: 'الافتراضي (Almarai / Cairo)', value: 'Almarai' },
    { label: 'تاهوماس (Tahoma)', value: 'Tahoma' },
    { label: 'إنتر (Inter)', value: 'Inter' },
    { label: 'جورجيا (Georgia)', value: 'Georgia' },
    { label: 'بلاي فير (Playfair)', value: 'Playfair Display' }
  ]

  const sizes = [
    { label: '14 بكسل', value: '14px' },
    { label: '16 بكسل', value: '16px' },
    { label: '18 بكسل', value: '18px' },
    { label: '20 بكسل', value: '20px' },
    { label: '24 بكسل', value: '24px' },
    { label: '32 بكسل', value: '32px' }
  ]

  const colors = [
    { name: 'الافتراضي الداكن', value: '#14110F' },
    { name: 'الذهبي الأتيليه', value: '#C5A880' },
    { name: 'برونزي فاخر', value: '#795E40' },
    { name: 'رمادي حجري', value: '#5C544E' },
    { name: 'أحمر تنبيه', value: '#EF4444' },
    { name: 'أخضر نجاح', value: '#10B981' }
  ]

  return (
    <div className="border border-[#E6E1DC] rounded-2xl overflow-hidden bg-white shadow-sm transition-all focus-within:border-[#C5A880]">
      {/* Toolbar Header */}
      <div className="bg-[#FAF8F5] p-3 border-b border-[#E6E1DC] flex flex-wrap items-center gap-1.5 text-xs select-none">
        
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E6E1DC]">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded hover:bg-[#F3EFEA] text-[#5C544E] disabled:opacity-30 cursor-pointer"
            title="تراجع (Ctrl+Z)"
          >
            <FaArrowRotateLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded hover:bg-[#F3EFEA] text-[#5C544E] disabled:opacity-30 cursor-pointer"
            title="إعادة (Ctrl+Y)"
          >
            <FaArrowRotateRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E6E1DC]">
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`px-2 py-1 rounded font-medium ${editor.isActive('paragraph') ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
          >
            نص
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 rounded font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
          >
            H3
          </button>
        </div>

        {/* Formatting Marks */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E6E1DC]">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="عريض (Ctrl+B)"
          >
            <FaBold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="مائل (Ctrl+I)"
          >
            <FaItalic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded ${editor.isActive('underline') ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="تسطير (Ctrl+U)"
          >
            <FaUnderline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded ${editor.isActive('strike') ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="يتوسطه خط"
          >
            <FaStrikethrough className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-1.5 rounded ${editor.isActive('highlight') ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="تمييز النص"
          >
            <FaHighlighter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E6E1DC]">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1.5 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="محاذاة لليمين"
          >
            <FaAlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1.5 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="توسيط"
          >
            <FaAlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1.5 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="محاذاة لليسار"
          >
            <FaAlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-1.5 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="ضبط النص"
          >
            <FaAlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists & Blocks */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E6E1DC]">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="قائمة نقطية"
          >
            <FaListUl className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="قائمة رقمية"
          >
            <FaListOl className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`p-1.5 rounded ${editor.isActive('taskList') ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="قائمة مهام"
          >
            <FaSquareCheck className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded ${editor.isActive('blockquote') ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="اقتباس فاخر"
          >
            <FaQuoteRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded ${editor.isActive('codeBlock') ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="كتلة كود"
          >
            <FaCode className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded text-[#5C544E] hover:bg-[#F3EFEA]"
            title="خط فاصل"
          >
            <FaMinus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Media & Embeds */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E6E1DC]">
          <button
            type="button"
            onClick={openLinkModal}
            className={`p-1.5 rounded ${editor.isActive('link') ? 'bg-[#C5A880] text-white' : 'text-[#5C544E] hover:bg-[#F3EFEA]'}`}
            title="رابط"
          >
            <FaLink className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={openImageModal}
            className="p-1.5 rounded text-[#5C544E] hover:bg-[#F3EFEA]"
            title="إدراج صورة"
          >
            <FaImage className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={openYoutubeModal}
            className="p-1.5 rounded text-[#5C544E] hover:bg-[#F3EFEA]"
            title="تضمين يوتيوب"
          >
            <FaYoutube className="w-3.5 h-3.5 text-red-500" />
          </button>
          <button
            type="button"
            onClick={insertTable}
            className="p-1.5 rounded text-[#5C544E] hover:bg-[#F3EFEA]"
            title="إدراج جدول"
          >
            <FaTable className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="p-2 rounded-lg bg-white border border-[#E6E1DC] text-[#5C544E] hover:bg-[#F3EFEA] hover:text-red-500 transition-colors"
          title="مسح التنسيقات"
        >
          <FaEraser className="w-3.5 h-3.5" />
        </button>

      </div>

      {/* Editor Content Area */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Word & Character Count Bar */}
      <div className="bg-[#FAF8F5] border-t border-[#E6E1DC] px-4 py-2 flex items-center justify-between text-xs text-[#8C7F75]">
        <div className="flex gap-4">
          <span>الكلمات: <strong>{editor.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0}</strong></span>
          <span>الحروف: <strong>{editor.getText().length}</strong></span>
          <span>وقت القراءة المقدر: <strong>{Math.ceil((editor.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0) / 200)} دقيقة</strong></span>
        </div>
        <span className="text-[11px] text-[#A6998E]">محرر أتيليه المتقدم مع دعم WebP التلقائي</span>
      </div>

      {/* MODALS */}
      {/* 1. Link Modal */}
      {activeModal === 'link' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-[#E6E1DC]" dir="rtl">
            <h3 className="text-base font-bold text-[#14110F] mb-4">إدراج / تعديل الرابط</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">عنوان الويب (URL)</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-sm focus:outline-none focus:border-[#C5A880]"
                  placeholder="https://example.com"
                  value={modalData.url}
                  onChange={(e) => setModalData(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-[#5C544E] cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-[#C5A880]"
                  checked={modalData.target}
                  onChange={(e) => setModalData(prev => ({ ...prev, target: e.target.checked }))}
                />
                فتح الرابط في نافذة جديدة
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#5C544E] hover:bg-[#FAF8F5]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={saveLinkModal}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C5A880] text-white hover:bg-[#B59362]"
              >
                تطبيق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Image Modal */}
      {activeModal === 'image' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-[#E6E1DC]" dir="rtl">
            <h3 className="text-base font-bold text-[#14110F] mb-4">إدراج صورة مقال متطورة</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">رفع صورة أو رابط مباشر</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E6E1DC] text-sm focus:outline-none focus:border-[#C5A880]"
                    placeholder="https://..."
                    value={modalData.src}
                    onChange={(e) => setModalData(prev => ({ ...prev, src: e.target.value }))}
                  />
                  <label className="px-3 py-2 bg-[#FAF8F5] border border-[#E6E1DC] hover:bg-[#F3EFEA] rounded-xl text-xs font-bold text-[#5C544E] cursor-pointer flex items-center gap-1.5">
                    <FaUpload className="w-3.5 h-3.5" />
                    <span>{imageUploadLoading ? 'جار الرفع...' : 'رفع'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleModalImageUpload} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5C544E] mb-1">النص البديل (Alt)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs"
                    value={modalData.alt}
                    onChange={(e) => setModalData(prev => ({ ...prev, alt: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5C544E] mb-1">عنوان الصورة (Title)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs"
                    value={modalData.title}
                    onChange={(e) => setModalData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">شرح الصورة (Caption)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs"
                  placeholder="وصف اختياري يظهر أسفل الصورة"
                  value={modalData.caption}
                  onChange={(e) => setModalData(prev => ({ ...prev, caption: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5C544E] mb-1">العرض</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs"
                    value={modalData.width}
                    onChange={(e) => setModalData(prev => ({ ...prev, width: e.target.value }))}
                  >
                    <option value="100%">كامل العرض (100%)</option>
                    <option value="75%">كبير (75%)</option>
                    <option value="50%">متوسط (50%)</option>
                    <option value="300px">صغير (300px)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5C544E] mb-1">المحاذاة</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs"
                    value={modalData.align}
                    onChange={(e) => setModalData(prev => ({ ...prev, align: e.target.value }))}
                  >
                    <option value="center">وسط</option>
                    <option value="right">يمين</option>
                    <option value="left">يسار</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#5C544E] hover:bg-[#FAF8F5]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={saveImageModal}
                disabled={imageUploadLoading || !modalData.src}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C5A880] text-white hover:bg-[#B59362] disabled:opacity-50"
              >
                إدراج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. YouTube Modal */}
      {activeModal === 'youtube' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-[#E6E1DC]" dir="rtl">
            <h3 className="text-base font-bold text-[#14110F] mb-4">تضمين فيديو YouTube</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">رابط الفيديو</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-sm"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={modalData.url}
                  onChange={(e) => setModalData(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#5C544E]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={saveYoutubeModal}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C5A880] text-white"
              >
                تضمين
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
