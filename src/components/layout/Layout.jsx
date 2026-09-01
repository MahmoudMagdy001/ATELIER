import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { adminService } from '../../features/admin/services/adminService'
import BrandLogo from '../ui/BrandLogo'
import { FaInstagram, FaPinterest, FaLinkedin } from 'react-icons/fa6'

export default function Layout() {
  const [settings, setSettings] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    adminService.fetchSettings().then(data => {
      if (data) setSettings(data)
    }).catch(() => {})

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#1C1816] text-[#F2EFE8] flex flex-col selection:bg-[#C4A070]/30 selection:text-[#F2EFE8] font-sans relative" dir="rtl">
      {/* Dynamic Transparent / Solid Navbar */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-[#1C1816]/95 backdrop-blur-md border-b border-[#C4A070]/20 shadow-xl shadow-black/50 py-0'
            : 'bg-transparent border-b border-transparent py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="group flex items-center">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="ATELIER Logo" className="h-11 w-auto object-contain" />
            ) : (
              <BrandLogo size="md" />
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <NavLink to="/" className={({ isActive }) => isActive ? 'text-[#C4A070] font-bold' : 'text-[#B3A9A3] hover:text-[#F2EFE8] transition-colors'}>الرئيسية</NavLink>
            <NavLink to="/products" className={({ isActive }) => isActive ? 'text-[#C4A070] font-bold' : 'text-[#B3A9A3] hover:text-[#F2EFE8] transition-colors'}>مجموعة الأثاث والمنتجات</NavLink>
            <NavLink to="/offers" className={({ isActive }) => isActive ? 'text-[#C4A070] font-bold' : 'text-[#B3A9A3] hover:text-[#F2EFE8] transition-colors'}>المجموعات الحصرية</NavLink>
            <NavLink to="/blog" className={({ isActive }) => isActive ? 'text-[#C4A070] font-bold' : 'text-[#B3A9A3] hover:text-[#F2EFE8] transition-colors'}>المجلة المعمارية</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'text-[#C4A070] font-bold' : 'text-[#B3A9A3] hover:text-[#F2EFE8] transition-colors'}>عن أتيليه</NavLink>
          </nav>


        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#C4A070]/20 bg-[#141110] text-[#B3A9A3] py-14 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs leading-relaxed text-[#827771] pt-2">
              {settings?.site_description || 'صياغة مساحات استثنائية وأثاث راقٍ مخصص يعكس الهوية الفاخرة للقصور والفيلات العصرية بأيدي كبار الحرفيين.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F2EFE8] mb-4 font-serif">روابط سريعة</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/products" className="hover:text-[#C4A070] transition-colors">كتالوج الأثاث الفاخر</Link></li>
              <li><Link to="/offers" className="hover:text-[#C4A070] transition-colors">المجموعات الخاصة والعروض</Link></li>
              <li><Link to="/blog" className="hover:text-[#C4A070] transition-colors">المجلة المعمارية</Link></li>
              <li><Link to="/admin" className="hover:text-[#C4A070] transition-colors">بوابة الإدارة (Admin)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F2EFE8] mb-4 font-serif">التواصل والمعرض</h4>
            <p className="text-xs text-[#827771] mb-2">طريق الملك فهد، الرياض، المملكة العربية السعودية</p>
            <p className="text-xs text-[#C4A070] font-mono">+966 50 123 4567</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F2EFE8] mb-4 font-serif">تابعنا</h4>
            <div className="flex items-center gap-3 text-lg text-[#C4A070]">
              <a href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#C4A070] hover:text-[#1C1816] transition-colors"><FaInstagram /></a>
              <a href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#C4A070] hover:text-[#1C1816] transition-colors"><FaPinterest /></a>
              <a href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#C4A070] hover:text-[#1C1816] transition-colors"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        {/* Brand Values Ribbon (from PDF: LUXURY - MINIMAL - TIMELESS - BESPOKE) */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-[#827771] gap-4">
          <div className="flex items-center gap-4 text-[11px] tracking-[0.25em] text-[#C4A070] uppercase font-bold">
            <span>LUXURY</span>
            <span>—</span>
            <span>MINIMAL</span>
            <span>—</span>
            <span>TIMELESS</span>
            <span>—</span>
            <span>BESPOKE</span>
          </div>

          <p>© {new Date().getFullYear()} {settings?.site_name || 'ATELIER Bespoke Luxury Furniture'}. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}
