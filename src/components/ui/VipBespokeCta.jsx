import React from 'react'
import { FaWhatsapp, FaPhone } from 'react-icons/fa6'

export default function VipBespokeCta({ settings }) {
  const whatsappNum = (settings?.whatsapp_number || '+966501234567').replace(/[^0-9]/g, '')
  const phoneNum = settings?.contact_phone || '+966501234567'

  return (
    <section className="max-w-7xl mx-auto px-6 w-full" aria-labelledby="vip-cta-heading">
      <div className="rounded-3xl bg-gradient-to-r from-[#7A5D2B] via-[#C4A070] to-[#E5C9A3] p-8 sm:p-10 md:p-14 text-[#1C1816] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center md:text-right max-w-xl">
          <span className="text-xs tracking-widest font-extrabold uppercase bg-black/10 px-3.5 py-1 rounded-full inline-block">
            VIP BESPOKE SERVICE
          </span>
          <h3 id="vip-cta-heading" className="text-2xl md:text-4xl font-serif font-bold leading-tight">
            هل تبحث عن تأثيث مخصص لقصرك أو فيلتك؟
          </h3>
          <p className="text-xs md:text-sm font-medium text-[#2B2623] leading-relaxed">
            تواصل مباشرة مع فريق كبار المصممين المعماريين لحجز جلسة استشارية ومعاينة خامات الأخشاب والرخام الطبيعي.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
          <a
            href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('مرحباً أتيليه، أرغب في حجز جلسة استشارة معمارية وتأثيث مخصص')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-2xl bg-[#1C1816] text-[#F2EFE8] font-bold text-xs flex items-center justify-center gap-2.5 shadow-xl hover:bg-black transition-all cursor-pointer"
          >
            <FaWhatsapp className="w-4 h-4 text-emerald-400" />
            <span>استشارة فورية عبر واتساب</span>
          </a>
          <a
            href={`tel:${phoneNum}`}
            className="px-6 py-4 rounded-2xl bg-white/30 backdrop-blur-md text-[#1C1816] font-bold text-xs flex items-center justify-center gap-2 border border-black/10 hover:bg-white/40 transition-all"
          >
            <FaPhone className="w-3.5 h-3.5" />
            <span>اتصال مباشر</span>
          </a>
        </div>
      </div>
    </section>
  )
}
