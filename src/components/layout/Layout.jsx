import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { FaInstagram, FaPinterest, FaLinkedin } from 'react-icons/fa6'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#1C1816] text-[#F2EFE8] flex flex-col selection:bg-[#C4A070]/30 selection:text-[#F2EFE8]" dir="rtl">
      <header className="sticky top-0 z-40 bg-[#1C1816]/90 backdrop-blur-md border-b border-[#C4A070]/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C4A070] to-[#7A5D2B] flex items-center justify-center text-[#1C1816] font-serif font-bold text-2xl shadow-lg shadow-[#C4A070]/20 group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-[0.25em] text-lg font-bold text-[#F2EFE8]">ATELIER</span>
              <span className="text-[9px] tracking-[0.2em] text-[#C4A070] uppercase">Bespoke Luxury Interiors</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <NavLink to="/" className={({ isActive }) => isActive ? 'text-[#C4A070] font-semibold' : 'text-[#B3A9A3] hover:text-[#F2EFE8] transition-colors'}>الرئيسية</NavLink>
            <NavLink to="/services" className={({ isActive }) => isActive ? 'text-[#C4A070] font-semibold' : 'text-[#B3A9A3] hover:text-[#F2EFE8] transition-colors'}>الخدمات والأثاث</NavLink>
            <NavLink to="/offers" className={({ isActive }) => isActive ? 'text-[#C4A070] font-semibold' : 'text-[#B3A9A3] hover:text-[#F2EFE8] transition-colors'}>المجموعات الحصرية</NavLink>
            <NavLink to="/blog" className={({ isActive }) => isActive ? 'text-[#C4A070] font-semibold' : 'text-[#B3A9A3] hover:text-[#F2EFE8] transition-colors'}>المجلة المعمارية</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'text-[#C4A070] font-semibold' : 'text-[#B3A9A3] hover:text-[#F2EFE8] transition-colors'}>عن أتيليه</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#C4A070]/40 text-[#C4A070] hover:bg-[#C4A070] hover:text-[#1C1816] transition-all"
            >
              لوحة التحكم (Admin)
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#C4A070]/20 bg-[#141110] text-[#B3A9A3] py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-widest text-xl font-bold text-[#F2EFE8]">ATELIER</span>
            </div>
            <p className="text-xs leading-relaxed text-[#827771]">
              صياغة مساحات استثنائية وأثاث راقٍ مخصص يعكس الهوية الفاخرة للقصور والفيلات العصرية.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F2EFE8] mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/services" className="hover:text-[#C4A070]">خدمات التصميم والتأثيث</Link></li>
              <li><Link to="/offers" className="hover:text-[#C4A070]">المجموعات الخاصة</Link></li>
              <li><Link to="/blog" className="hover:text-[#C4A070]">أحدث المقالات</Link></li>
              <li><Link to="/admin" className="hover:text-[#C4A070]">بوابة الإدارة (Admin)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F2EFE8] mb-4">التواصل والمعرض</h4>
            <p className="text-xs text-[#827771] mb-2">طريق الملك فهد، الرياض، المملكة العربية السعودية</p>
            <p className="text-xs text-[#C4A070]">+966 50 123 4567</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F2EFE8] mb-4">تابعنا</h4>
            <div className="flex items-center gap-3 text-lg text-[#C4A070]">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-[#C4A070] hover:text-[#1C1816] transition-colors"><FaInstagram /></a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-[#C4A070] hover:text-[#1C1816] transition-colors"><FaPinterest /></a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-[#C4A070] hover:text-[#1C1816] transition-colors"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-[#5C534E]">
          <p>© {new Date().getFullYear()} ATELIER Bespoke Luxury Furniture. جميع الحقوق محفوظة.</p>
          <p className="mt-2 md:mt-0">Crafted with Bespoke Precision</p>
        </div>
      </footer>
    </div>
  )
}
