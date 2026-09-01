import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { serviceService } from '../services/serviceService'
import { PageLoading } from '../../../components/ui/Loading'
import { FaArrowRight, FaCheck, FaLayerGroup } from 'react-icons/fa6'

export default function ServiceDetail() {
  const { slug } = useParams()
  const [srv, setSrv] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await serviceService.fetchServiceBySlug(slug)
        setSrv(data)
      } catch (err) {
        console.warn('Failed to load service detail:', err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) return <PageLoading text="جار تحميل تفاصيل الخدمة..." />

  if (!srv) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#C4A070]">الخدمة غير متوفرة</h2>
        <Link to="/services" className="inline-block px-5 py-2 rounded-xl bg-[#C4A070] text-[#1C1816] text-xs font-bold">
          العودة للخدمات
        </Link>
      </div>
    )
  }

  const imgSrc = srv.hero_image || srv.image

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8" dir="rtl">
      <Link to="/services" className="inline-flex items-center gap-2 text-xs text-[#C4A070] hover:underline">
        <FaArrowRight /> <span>العودة للخدمات</span>
      </Link>

      <div className="glass-panel-luxury rounded-3xl p-8 md:p-12 space-y-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">{srv.title}</h1>
        {imgSrc ? (
          <img src={imgSrc} alt={srv.title} className="w-full h-80 object-cover rounded-2xl border border-[#C4A070]/20" />
        ) : (
          <div className="w-full h-80 bg-[#1C1816] rounded-2xl border border-[#C4A070]/20 flex items-center justify-center">
            <FaLayerGroup className="w-16 h-16 text-[#C4A070]/20" />
          </div>
        )}
        <p className="text-sm md:text-base text-[#B3A9A3] leading-relaxed">{srv.description}</p>
        
        {Array.isArray(srv.features) && srv.features.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-white/10">
            <h3 className="text-sm font-bold text-[#C4A070]">أبرز المواصفات الحرفية:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {srv.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#F2EFE8] p-3 rounded-xl bg-white/5">
                  <FaCheck className="text-[#C4A070]" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

