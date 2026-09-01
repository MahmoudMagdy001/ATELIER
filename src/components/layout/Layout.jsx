import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { adminService } from '../../features/admin/services/adminService'
import BrandLogo from '../ui/BrandLogo'
import VipBespokeCta from '../ui/VipBespokeCta'
import ContactShowroomSection from '../../features/home/components/ContactShowroomSection'
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
        <div className="w-full px-6 md:px-8 lg:px-10 h-20 flex items-center justify-between">
          <Link to="/" className="group flex items-center shrink-0">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="ATELIER Logo" className="h-11 w-auto object-contain" />
            ) : (
              <BrandLogo size="md" />
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-[#C4A070] font-bold py-1.5 relative after:content-[""] after:absolute after:-bottom-1 after:right-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-[#C4A070] after:to-[#E3CAA9] after:rounded-full' 
                  : 'text-[#B3A9A3] hover:text-[#F2EFE8] py-1.5 transition-colors duration-200'
              }
            >
              الرئيسية
            </NavLink>
            <NavLink 
              to="/products" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-[#C4A070] font-bold py-1.5 relative after:content-[""] after:absolute after:-bottom-1 after:right-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-[#C4A070] after:to-[#E3CAA9] after:rounded-full' 
                  : 'text-[#B3A9A3] hover:text-[#F2EFE8] py-1.5 transition-colors duration-200'
              }
            >
              مجموعة الأثاث والمنتجات
            </NavLink>
            <NavLink 
              to="/offers" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-[#C4A070] font-bold py-1.5 relative after:content-[""] after:absolute after:-bottom-1 after:right-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-[#C4A070] after:to-[#E3CAA9] after:rounded-full' 
                  : 'text-[#B3A9A3] hover:text-[#F2EFE8] py-1.5 transition-colors duration-200'
              }
            >
              المجموعات الحصرية
            </NavLink>
            <NavLink 
              to="/blog" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-[#C4A070] font-bold py-1.5 relative after:content-[""] after:absolute after:-bottom-1 after:right-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-[#C4A070] after:to-[#E3CAA9] after:rounded-full' 
                  : 'text-[#B3A9A3] hover:text-[#F2EFE8] py-1.5 transition-colors duration-200'
              }
            >
              المجلة المعمارية
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-[#C4A070] font-bold py-1.5 relative after:content-[""] after:absolute after:-bottom-1 after:right-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-[#C4A070] after:to-[#E3CAA9] after:rounded-full' 
                  : 'text-[#B3A9A3] hover:text-[#F2EFE8] py-1.5 transition-colors duration-200'
              }
            >
              عن أتيليه
            </NavLink>
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${(settings?.whatsapp_number || '966501234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن تفصيل قطع أثاث خاصة من أتيليه')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#1C1816] bg-gradient-to-r from-[#C4A070] to-[#E3CAA9] hover:from-[#D4B58C] hover:to-[#C4A070] transition-all duration-300 shadow-md shadow-[#C4A070]/20 flex items-center gap-2"
            >
              <span>طلب استشارة تصميم</span>
            </a>
          </div>


        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Persistent Global Sections (VIP CTA & Contact Showroom) */}
      <div className="space-y-20 pt-12 pb-20 bg-[#1C1816]">
        <VipBespokeCta settings={settings} />
        <ContactShowroomSection settings={settings} />
      </div>

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
            {settings?.showroom_address && (
              <p className="text-xs text-[#827771] mb-2">{settings.showroom_address}</p>
            )}
            {settings?.contact_phone && (
              <a href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`} className="text-xs text-[#C4A070] font-mono hover:underline block">
                {settings.contact_phone}
              </a>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F2EFE8] mb-4 font-serif">تابعنا</h4>
            <div className="flex items-center gap-3 text-lg text-[#C4A070]">
              {settings?.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#C4A070] hover:text-[#1C1816] transition-colors" title="Instagram">
                  <FaInstagram />
                </a>
              )}
              {settings?.social_pinterest && (
                <a href={settings.social_pinterest} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#C4A070] hover:text-[#1C1816] transition-colors" title="Pinterest">
                  <FaPinterest />
                </a>
              )}
              {settings?.social_linkedin && (
                <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#C4A070] hover:text-[#1C1816] transition-colors" title="LinkedIn">
                  <FaLinkedin />
                </a>
              )}
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
