import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { serviceService } from '../services/serviceService'
import { PageLoading } from '../../../components/ui/Loading'
import { FaCheck, FaArrowLeft, FaLayerGroup } from 'react-icons/fa6'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await serviceService.fetchPublishedServices()
        setServices(data)
      } catch (err) {
        console.warn('Failed to load services:', err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <PageLoading text="جار تحميل الخدمات..." />

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs text-[#C4A070] tracking-widest font-bold uppercase">حلول متكاملة</span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#F2EFE8]">الخدمات وتصنيع الأثاث الفاخر</h1>
        <p className="text-xs md:text-sm text-[#B3A9A3]">تصميم وتصنيع الأثاث بالطلب وحلول الهندسة المعمارية الداخلية</p>
      </div>

      {services.length === 0 ? (
        <div className="p-12 text-center text-[#827771] border border-white/5 rounded-3xl bg-[#141110]">
          لا توجد خدمات منشورة حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv) => {
            const imgSrc = srv.hero_image || srv.image
            return (
              <div key={srv.id} className="glass-panel-luxury rounded-2xl overflow-hidden flex flex-col justify-between">
                <div className="h-60 overflow-hidden bg-[#1C1816]">
                  {imgSrc ? (
                    <img src={imgSrc} alt={srv.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C4A070]/20">
                      <FaLayerGroup className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#F2EFE8] mb-2">{srv.title}</h3>
                    <p className="text-xs text-[#B3A9A3] leading-relaxed mb-4">{srv.description}</p>
                    {Array.isArray(srv.features) && srv.features.length > 0 && (
                      <ul className="space-y-1 text-xs text-[#D4B58C]">
                        {srv.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <FaCheck className="text-[#C4A070] w-3 h-3" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Link to={`/services/${srv.slug}`} className="gold-btn-primary w-full py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                    <span>طلب استشارة</span>
                    <FaArrowLeft className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

