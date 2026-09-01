import React from 'react'
import { Link } from 'react-router-dom'
import { demoStore } from '../../../lib/supabase'
import { FaCalendar } from 'react-icons/fa6'

export default function Offers() {
  const offers = demoStore.getOffers().filter(o => o.is_active)

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs text-[#C4A070] tracking-widest font-bold uppercase">عروض حصرية</span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#F2EFE8]">المجموعات والباقات الخاصة</h1>
        <p className="text-xs md:text-sm text-[#B3A9A3]">استفد من باقات التصميم الحصرية والقطع ذات الإصدار المحدود</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {offers.map((off) => (
          <div key={off.id} className="glass-panel-luxury rounded-3xl overflow-hidden flex flex-col justify-between">
            <div className="relative h-64">
              <img src={off.banner_image} alt={off.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-[#C4A070] text-[#1C1816] text-xs font-bold px-3 py-1 rounded-full">
                {off.badge}
              </div>
            </div>
            <div className="p-8 space-y-4">
              <span className="text-xs font-bold text-[#D4B58C]">{off.discount_text}</span>
              <h3 className="text-xl font-bold text-[#F2EFE8]">{off.title}</h3>
              <p className="text-xs text-[#B3A9A3] leading-relaxed">{off.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs text-[#827771] flex items-center gap-1.5">
                  <FaCalendar className="text-[#C4A070]" /> ينتهي: {off.valid_until}
                </span>
                <Link to="/services" className="gold-btn-primary px-5 py-2 rounded-xl text-xs font-bold">
                  حجز العرض
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
