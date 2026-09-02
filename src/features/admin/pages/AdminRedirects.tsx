import { useState, useEffect } from 'react'
import { adminService } from '../services/adminService'
import { PageLoading } from '../../../components/ui/Loading'
import Button from '../../../components/ui/Button'
import { FaPen, FaTrash, FaPlus, FaFloppyDisk, FaMagnifyingGlass, FaArrowRightArrowLeft, FaXmark } from 'react-icons/fa6'

import type { RedirectRule } from '../../../types/database'

export default function AdminRedirects() {
  const [redirects, setRedirects] = useState<RedirectRule[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')

  // Form State
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [sourcePath, setSourcePath] = useState<string>('')
  const [targetPath, setTargetPath] = useState<string>('')
  const [statusCode, setStatusCode] = useState<number>(301)
  const [submitting, setSubmitting] = useState<boolean>(false)

  useEffect(() => {
    fetchRedirects()
  }, [])

  const fetchRedirects = async () => {
    setLoading(true)
    try {
      const data = await adminService.fetchRedirects()
      setRedirects(data)
    } catch (err: unknown) {
      console.warn('Fetch redirects fallback:', (err as Error)?.message || err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (redir: RedirectRule) => {
    setCurrentId(redir.id)
    setSourcePath(redir.source_path || '')
    setTargetPath(redir.target_path || '')
    setStatusCode(redir.status_code || 301)
    setIsEditing(true)
  }

  const handleCreateNew = () => {
    setCurrentId(null)
    setSourcePath('')
    setTargetPath('')
    setStatusCode(301)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف قاعدة إعادة التوجيه هذه؟')) return
    try {
      await adminService.deleteRedirect(id)
      fetchRedirects()
    } catch (err: unknown) {
      alert('فشل الحذف: ' + ((err as Error)?.message || String(err)))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    let formattedSource = sourcePath.trim()
    if (!formattedSource.startsWith('/') && !formattedSource.startsWith('http')) {
      formattedSource = '/' + formattedSource
    }

    let formattedTarget = targetPath.trim()
    if (!formattedTarget.startsWith('/') && !formattedTarget.startsWith('http')) {
      formattedTarget = '/' + formattedTarget
    }

    const redirectData = {
      source_path: formattedSource,
      target_path: formattedTarget,
      status_code: Number(statusCode),
    }

    try {
      if (currentId) {
        await adminService.updateRedirect(currentId, redirectData)
      } else {
        await adminService.insertRedirect(redirectData)
      }
      setIsEditing(false)
      fetchRedirects()
    } catch (err: unknown) {
      alert('حدث خطأ أثناء الحفظ: ' + ((err as Error)?.message || String(err)))
    } finally {
      setSubmitting(false)
    }
  }

  const filteredRedirects = redirects.filter(
    (r) =>
      (r.source_path && r.source_path.toLowerCase().includes(search.toLowerCase())) ||
      (r.target_path && r.target_path.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) return <PageLoading text="جار تحميل التحويلات..." />

  return (
    <div className="space-y-8 max-w-6xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#14110F]">إدارة التحويلات والروابط البديلة (301 / 302 Redirects)</h1>
          <p className="text-xs text-[#8C7F75] mt-1">توجيه الروابط القديمة أو المحذوفة تلقائياً للحفاظ على قوة السيو وتفادي أخطاء 404</p>
        </div>

        <Button onClick={handleCreateNew} icon={<FaPlus />}>
          إضافة تحويل جديد
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E6E1DC] shadow-sm">
        <FaMagnifyingGlass className="text-[#8C7F75] w-4 h-4 ml-2" />
        <input
          type="text"
          placeholder="ابحث بالرابط القديم أو المسار المستهدف..."
          className="w-full text-xs text-[#14110F] focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Redirects List */}
      <div className="bg-white rounded-2xl border border-[#E6E1DC] shadow-sm overflow-hidden">
        {filteredRedirects.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8C7F75]">
            <FaArrowRightArrowLeft className="w-8 h-8 mx-auto text-[#D6CDC4] mb-2" />
            لا توجد قواعد تحويل مطابقة.
          </div>
        ) : (
          <div className="divide-y divide-[#E6E1DC]">
            {filteredRedirects.map((r) => (
              <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-[#14110F] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E6E1DC]">
                      {r.source_path}
                    </span>
                    <span className="text-[#C5A880] font-bold">←</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {r.target_path}
                    </span>
                  </div>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8C7F75] border border-[#E6E1DC]">
                    كود {r.status_code || 301} ({r.status_code === 302 ? 'مؤقت' : 'دائم'})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(r)}
                    className="p-2 text-[#5C544E] hover:bg-white rounded-lg border border-[#E6E1DC] cursor-pointer"
                  >
                    <FaPen className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 cursor-pointer"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full border border-[#E6E1DC] space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-3">
              <h3 className="font-bold text-base text-[#14110F]">{currentId ? 'تعديل مسار التحويل' : 'إنشاء تحويل جديد'}</h3>
              <button type="button" onClick={() => setIsEditing(false)} className="text-[#8C7F75]">
                <FaXmark className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C544E] mb-1">الرابط القديم / المصدر (Source Path)</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs font-mono text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:outline-none"
                placeholder="/old-luxury-villa-offer"
                value={sourcePath}
                onChange={(e) => setSourcePath(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C544E] mb-1">الرابط الجديد / الوجهة (Target Path)</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs font-mono text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:outline-none"
                placeholder="/offers/exclusive-villa-design-consultation"
                value={targetPath}
                onChange={(e) => setTargetPath(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C544E] mb-1">نوع كود التحويل (Status Code)</label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs text-[#14110F] bg-white focus:border-[#C5A880] focus:outline-none"
                value={statusCode}
                onChange={(e) => setStatusCode(Number(e.target.value))}
              >
                <option value={301}>301 - تحويل دائم (Permanent Redirect - موصى به للـ SEO)</option>
                <option value={302}>302 - تحويل مؤقت (Temporary Redirect)</option>
              </select>
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
                {submitting ? 'جار الحفظ...' : 'حفظ التحويل'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
