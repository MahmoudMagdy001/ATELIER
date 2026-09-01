import React from 'react'
import { Link } from 'react-router-dom'
import { demoStore } from '../../../lib/supabase'
import { FaCheck, FaArrowLeft } from 'react-icons/fa6'

export default function Services() {
  const services = demoStore.getServices().filter(s => s.is_active)

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs text-[#C4A070] tracking-widest font-bold uppercase">حلول متكاملة</span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#F2EFE8]">الخدمات وتصنيع الأثاث الفاخر</h1>
        <p className="text-xs md:text-sm text-[#B3A9A3]">تصميم وتصنيع الأثاث بالطلب وحلول الهندسة المعمارية الداخلية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((srv) => (
          <div key={srv.id} className="glass-panel-luxury rounded-2xl overflow-hidden flex flex-col justify-between">
            <div className="h-60 overflow-hidden">
              <img src={srv.hero_image} alt={srv.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#F2EFE8] mb-2">{srv.title}</h3>
                <p className="text-xs text-[#B3A9A3] leading-relaxed mb-4">{srv.description}</p>
                {srv.features && (
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
        ))}
      </div>
    </div>
  )
}
