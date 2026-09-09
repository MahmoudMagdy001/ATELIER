import { useEffect, useMemo, useState } from 'react'
import { FaCalendarDays, FaMagnifyingGlass, FaPhone, FaRegEnvelope, FaTrash } from 'react-icons/fa6'
import { PageLoading } from '../../../components/ui/Loading'
import { adminService } from '../services/adminService'
import type { Inquiry } from '../../../types/database'

function formatInquiryDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    void adminService.fetchInquiries()
      .then((data) => {
        if (active) setInquiries(data)
      })
      .catch(() => {
        if (active) setError('تعذر تحميل الاستفسارات. حدّث الصفحة وحاول مرة أخرى.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const visibleInquiries = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return inquiries
    return inquiries.filter((inquiry) =>
      [inquiry.name, inquiry.phone, inquiry.service_type, inquiry.preferred_time, inquiry.message]
        .some((value) => value.toLowerCase().includes(query))
    )
  }, [inquiries, search])

  const handleDelete = async (inquiry: Inquiry) => {
    if (!window.confirm(`هل تريد حذف استفسار ${inquiry.name} نهائياً؟`)) return

    setDeletingId(inquiry.id)
    try {
      await adminService.deleteInquiry(inquiry.id)
      setInquiries((current) => current.filter(({ id }) => id !== inquiry.id))
    } catch {
      window.alert('تعذر حذف الاستفسار. حاول مرة أخرى.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <PageLoading text="جار تحميل استفسارات العملاء..." />

  return (
    <div className="space-y-8 max-w-6xl mx-auto" dir="rtl">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#C4A070] mb-2">
            <FaRegEnvelope className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wide">CUSTOMER INQUIRIES</span>
          </div>
          <h1 className="text-2xl font-bold text-[#141110]">استفسارات العملاء</h1>
          <p className="text-xs text-[#8C7F75] mt-1">طلبات التواصل وخدمة التنفيذ حسب الطلب الواردة من الموقع.</p>
        </div>
        <div className="rounded-xl border border-[#C4A070]/25 bg-[#C4A070]/10 px-4 py-2 text-center">
          <span className="block text-lg leading-none font-bold text-[#141110]">{inquiries.length}</span>
          <span className="text-[10px] font-bold text-[#8C7F75]">إجمالي الاستفسارات</span>
        </div>
      </header>

      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E6E1DC] shadow-sm">
        <FaMagnifyingGlass className="text-[#8C7F75] w-4 h-4 ms-2 shrink-0" />
        <input
          type="search"
          placeholder="ابحث بالاسم، الهاتف، الخدمة أو محتوى الرسالة..."
          className="w-full text-xs text-[#141110] focus:outline-none"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="البحث في الاستفسارات"
        />
      </div>

      {error ? (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : visibleInquiries.length === 0 ? (
        <div className="rounded-2xl border border-[#E6E1DC] bg-white p-12 text-center">
          <FaRegEnvelope className="w-10 h-10 mx-auto text-[#D6CDC4] mb-3" />
          <p className="text-sm font-bold text-[#141110]">لا توجد استفسارات مطابقة</p>
          <p className="text-xs text-[#8C7F75] mt-1">ستظهر هنا رسائل نموذج التواصل فور وصولها.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E6E1DC] bg-white shadow-sm divide-y divide-[#E6E1DC]">
          {visibleInquiries.map((inquiry) => (
            <article key={inquiry.id} className="p-5 sm:p-6 hover:bg-[#FAF8F5] transition-colors">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <h2 className="font-bold text-[#141110]">{inquiry.name}</h2>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#5C544E]" dir="ltr">
                      <FaPhone className="w-3 h-3 text-[#C4A070]" />
                      {inquiry.phone}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                    <span className="rounded-full border border-[#C4A070]/25 bg-[#C4A070]/10 px-2.5 py-1 text-[#8A6736]">{inquiry.service_type}</span>
                    <span className="rounded-full border border-[#E6E1DC] bg-[#FAF8F5] px-2.5 py-1 text-[#8C7F75]">{inquiry.preferred_time}</span>
                  </div>
                  {inquiry.message && <p className="max-w-3xl whitespace-pre-wrap text-xs leading-6 text-[#5C544E]">{inquiry.message}</p>}
                </div>
                <div className="flex items-center justify-between gap-3 shrink-0 sm:flex-col sm:items-end">
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-[#8C7F75]">
                    <FaCalendarDays className="w-3 h-3" />
                    {formatInquiryDate(inquiry.created_at)}
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleDelete(inquiry)}
                    disabled={deletingId === inquiry.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 py-1.5 text-[10px] font-bold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  >
                    <FaTrash className="w-3 h-3" />
                    {deletingId === inquiry.id ? 'جار الحذف...' : 'حذف'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
