import React from 'react'
import { FaGem, FaAward, FaBuildingColumns } from 'react-icons/fa6'

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs text-[#C4A070] tracking-widest font-bold uppercase">عن الدار</span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#F2EFE8]">أتيليه (ATELIER)</h1>
        <p className="text-xs md:text-sm text-[#B3A9A3]">حيث تلتقي الرؤية المعمارية بالأثاث المصنوع بالطلب</p>
      </div>

      <div className="glass-panel-luxury rounded-3xl p-8 md:p-12 space-y-6">
        <p className="text-sm md:text-base text-[#DEDAD6] leading-relaxed">
          تأسست **ATELIER** لتكون الوجهة الأولى لعشاق الفخامة الخالدة والتصاميم الحصرية. نجمع بين الخبرات الإيطالية العريقة وأحدث خطوط الموضة المعمارية لتقديم قطع أثاث وتصاميم داخلية مصممة خصيصاً لكل عميل.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
          <div className="p-6 rounded-2xl bg-white/5 space-y-2 text-center">
            <FaGem className="text-2xl text-[#C4A070] mx-auto" />
            <h4 className="font-bold text-sm text-[#F2EFE8]">حرفية استثنائية</h4>
            <p className="text-xs text-[#827771]">انتقاء لأندر الأخشاب والرخام الطبيعي</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 space-y-2 text-center">
            <FaBuildingColumns className="text-2xl text-[#C4A070] mx-auto" />
            <h4 className="font-bold text-sm text-[#F2EFE8]">تصميم مخصص 100%</h4>
            <p className="text-xs text-[#827771]">كل قطعة تروي قصة صاحبها</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 space-y-2 text-center">
            <FaAward className="text-2xl text-[#C4A070] mx-auto" />
            <h4 className="font-bold text-sm text-[#F2EFE8]">ضمان واهتمام دائم</h4>
            <p className="text-xs text-[#827771]">خدمة كونسيرج خاصة لعملائنا</p>
          </div>
        </div>
      </div>
    </div>
  )
}
