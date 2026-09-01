import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { demoStore } from '../../../lib/supabase'
import { FaArrowRight, FaCheck } from 'react-icons/fa6'

export default function ServiceDetail() {
  const { slug } = useParams()
  const services = demoStore.getServices()
  const srv = services.find(s => s.slug === slug) || services[0]

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <Link to="/services" className="inline-flex items-center gap-2 text-xs text-[#C4A070]">
        <FaArrowRight /> <span>العودة للخدمات</span>
      </Link>

      <div className="glass-panel-luxury rounded-3xl p-8 md:p-12 space-y-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">{srv.title}</h1>
        <img src={srv.hero_image} alt={srv.title} className="w-full h-80 object-cover rounded-2xl border border-[#C4A070]/20" />
        <p className="text-sm md:text-base text-[#B3A9A3] leading-relaxed">{srv.description}</p>
        
        {srv.features && (
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
