import React from 'react'
import { Link } from 'react-router-dom'
import { demoStore } from '../../../lib/supabase'
import { FaArrowLeft, FaGem } from 'react-icons/fa6'

export default function Home() {
  const services = demoStore.getServices()

  return (
    <div className="space-y-24 pb-20">
      <section className="relative min-h-[85vh] flex items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85" 
            alt="Atelier Luxury Furniture" 
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1816] via-[#1C1816]/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C4A070]/30 bg-[#C4A070]/10 text-xs font-semibold text-[#D4B58C] tracking-widest uppercase">
            <FaGem className="w-3 h-3 text-[#C4A070]" />
            <span>Bespoke Luxury Furniture & Interiors</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-[#F2EFE8] leading-tight">
            أناقة خالدة، <br />
            <span className="gold-gradient-text">مصممة خصيصاً لمساحتك</span>
          </h1>

          <p className="text-sm md:text-base text-[#B3A9A3] max-w-2xl mx-auto leading-relaxed">
            نبتكر قطع أثاث فريدة وتصاميم داخلية استثنائية تعكس الفخامة المطلقة للقصور والمساحات الراقية بأيدي أمهر الحرفيين الإيطاليين والعالميين.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/services" className="gold-btn-primary px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2">
              <span>استكشف الخدمات والقطع</span>
              <FaArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin" className="px-8 py-3.5 rounded-xl text-sm font-bold border border-[#C4A070]/40 text-[#F2EFE8] hover:bg-white/5 transition-all">
              دخول لوحة التحكم
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold">حرفية لا تضاهى</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8] mt-2">خدماتنا المخصصة</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.slice(0, 3).map((srv) => (
            <div key={srv.id} className="glass-panel-luxury rounded-2xl overflow-hidden group hover:border-[#C4A070]/60 transition-all duration-300">
              <div className="h-56 overflow-hidden">
                <img src={srv.hero_image} alt={srv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-base font-bold text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors">{srv.title}</h3>
                <p className="text-xs text-[#B3A9A3] leading-relaxed line-clamp-2">{srv.description}</p>
                <Link to={`/services/${srv.slug}`} className="inline-flex items-center gap-2 text-xs text-[#C4A070] font-semibold pt-2">
                  <span>تفاصيل الخدمة</span>
                  <FaArrowLeft className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
