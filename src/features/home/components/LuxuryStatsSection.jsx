import React from 'react'
import { 
  FaHeadset, 
  FaCouch, 
  FaLandmark, 
  FaGem, 
  FaAward,
  FaArrowTrendUp
} from 'react-icons/fa6'

export default function LuxuryStatsSection() {
  const stats = [
    {
      id: 'support-24-7',
      number: '24/7',
      label: 'خدمة كونسيرج واستشارات',
      description: 'فريق استشاري معماري متاح على مدار الساعة لتلبية متطلباتكم',
      icon: FaHeadset,
      highlight: true
    },
    {
      id: 'crafted-pieces',
      number: '+1,500',
      label: 'قطعة أثاث حصرية ومخصصة',
      description: 'صُممت ونُفذت بالطلب لأفخم القصور والمساحات الملكية',
      icon: FaCouch,
      highlight: false
    },
    {
      id: 'luxury-villas',
      number: '+420',
      label: 'قصر وفيلا تم تأثيثها',
      description: 'ثقة متجددة من نخبة العملاء في المملكة والخليج العربي',
      icon: FaLandmark,
      highlight: false
    },
    {
      id: 'natural-materials',
      number: '100%',
      label: 'خامات أوروبية طبيعية',
      description: 'أخشاب جوز إيطالي، رخام طبيعي وأفخر أنواع الجلود والمخمل',
      icon: FaGem,
      highlight: false
    },
    {
      id: 'years-experience',
      number: '+15',
      label: 'عاماً من الريادة والإتقان',
      description: 'إرث عريق في صياغة الأثاث الفاخر وتصميم المساحات الراقية',
      icon: FaAward,
      highlight: false
    }
  ]

  return (
    <section className="w-full space-y-8" aria-labelledby="luxury-stats-heading">
      {/* 1. Header with exact same standard padding as other home sections */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6">
          <div className="space-y-2">
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
              <FaArrowTrendUp className="w-3.5 h-3.5" /> معايير الفخامة والريادة
            </span>
            <h2 id="luxury-stats-heading" className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
              أرقام تحكي مسيرة الإتقان والإبداع
            </h2>
          </div>
          <p className="text-xs text-[#B3A9A3] max-w-sm leading-relaxed">
            نلتزم بأعلى مقاييس الجودة العالمية في صياغة وتوريد أرقى قطع الأثاث الحصري.
          </p>
        </div>
      </div>

      {/* 2. Full-bleed Stats Grid without any outer horizontal padding */}
      <div className="w-full px-0">
        <div className="w-full bg-gradient-to-b from-[#141110] via-[#171312] to-[#141110] border-y border-[#C4A070]/20 shadow-2xl relative overflow-hidden">
          {/* Subtle luxury ambient glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C4A070]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#7A5D2B]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#C4A070]/15 relative z-10">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div 
                  key={stat.id}
                  className="group relative p-8 md:p-10 flex flex-col justify-between items-center text-center hover:bg-white/[0.02] transition-all duration-300"
                >
                  {/* Top Icon Badge */}
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-[#C4A070]/10 border border-[#C4A070]/25 group-hover:border-[#C4A070] group-hover:bg-[#C4A070]/20 flex items-center justify-center text-[#C4A070] text-2xl transition-all duration-300 group-hover:scale-110 shadow-lg shadow-black/40">
                    <Icon />
                  </div>

                  {/* Big Stat Number */}
                  <div className="space-y-2 mb-4">
                    <div className="font-serif text-4xl sm:text-5xl font-black tracking-tight gold-gradient-text drop-shadow-md">
                      {stat.number}
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug">
                      {stat.label}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#827771] group-hover:text-[#B3A9A3] leading-relaxed transition-colors line-clamp-3">
                    {stat.description}
                  </p>

                  {/* Bottom Accent line on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C4A070]/0 to-transparent group-hover:via-[#C4A070] transition-all duration-500" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
