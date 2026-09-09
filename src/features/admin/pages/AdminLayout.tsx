import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import type { IconType } from 'react-icons'
import { supabase } from '../../../lib/supabase'
import { AtelierMonogram } from '../../../components/ui/BrandLogo'
import { 
  FaPenToSquare, 
  FaCouch, 
  FaTag, 
  FaImages, 
  FaFolderOpen, 
  FaRegEnvelope,
  FaArrowRightArrowLeft, 
  FaGear, 
  FaRightFromBracket,
  FaArrowUpRightFromSquare,
  FaBars,
  FaXmark
} from 'react-icons/fa6'

interface AdminNavLinkItem {
  to: string
  label: string
  Icon: IconType
}

const MAIN_ADMIN_LINKS: AdminNavLinkItem[] = [
  { to: '/admin/products', label: 'قطع الإصدار المحدود (Limited)', Icon: FaCouch },
  { to: '/admin/offers', label: 'العروض الترويجية (Offers)', Icon: FaTag },
  { to: '/admin/portfolio', label: 'معرض الأعمال (Portfolio)', Icon: FaImages },
  { to: '/admin/posts', label: 'المقالات والمدونة (Blog)', Icon: FaPenToSquare },
  { to: '/admin/categories', label: 'التصنيفات (Categories)', Icon: FaFolderOpen },
  { to: '/admin/media', label: 'مكتبة الوسائط (Media)', Icon: FaImages },
  { to: '/admin/inquiries', label: 'استفسارات العملاء (Inquiries)', Icon: FaRegEnvelope },
  { to: '/admin/redirects', label: 'التحويلات (Redirects)', Icon: FaArrowRightArrowLeft },
  { to: '/admin/settings', label: 'الإعدادات العامة (Settings)', Icon: FaGear },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const mainRef = useRef<HTMLElement | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false)
  const [prevPathname, setPrevPathname] = useState<string>(location.pathname)

  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname)
    setMobileSidebarOpen(false)
  }

  // Scroll to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [location.pathname])

  // Escape key handler for mobile sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileSidebarOpen])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin-scope h-screen bg-[#FAF8F5] text-[#141110] flex flex-col md:flex-row overflow-hidden font-sans" dir="rtl">
      {/* Mobile Top App Bar */}
      <header className="md:hidden flex items-center justify-between px-5 py-3.5 bg-[#141110] text-white border-b border-white/10 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl text-[#C4A070] hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none cursor-pointer"
            aria-label="قائمة لوحة التحكم"
            aria-expanded={mobileSidebarOpen}
            aria-controls="admin-sidebar"
          >
            {mobileSidebarOpen ? <FaXmark className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <AtelierMonogram className="w-7 h-7" />
            <span className="font-bold text-xs tracking-wide text-white font-serif">S&I ATELIER</span>
          </div>
        </div>

        <Link 
          to="/" 
          target="_blank"
          className="text-xs text-[#C4A070] hover:text-white flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-lg bg-white/5 border border-white/10"
          title="معاينة المتجر"
        >
          <span>المتجر</span>
          <FaArrowUpRightFromSquare className="w-2.5 h-2.5" />
        </Link>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop fixed, Mobile off-canvas drawer) */}
      <aside 
        id="admin-sidebar"
        className={`
          fixed md:static inset-y-0 right-0 z-50 w-72 md:w-64 bg-[#141110] text-white shrink-0 shadow-2xl flex flex-col border-l border-white/5
          transform transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AtelierMonogram className="w-9 h-9" />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide text-white font-serif">S&I ATELIER</span>
              <span className="text-[9px] text-[#C4A070] tracking-widest uppercase font-semibold">CONTROL PANEL</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              target="_blank"
              className="text-xs text-[#C4A070] hover:text-white hidden md:flex items-center gap-1 transition-colors"
              title="معاينة المتجر"
            >
              <span>المتجر</span>
              <FaArrowUpRightFromSquare className="w-2.5 h-2.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="إغلاق القائمة"
            >
              <FaXmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto" aria-label="روابط لوحة التحكم">
          {MAIN_ADMIN_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none ${
                  isActive
                    ? 'bg-[#C4A070] text-[#141110] font-bold shadow-lg shadow-[#C4A070]/25'
                    : 'text-[#D6CDC4] hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <link.Icon className="w-4.5 h-4.5 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 text-red-300 hover:bg-red-600 hover:text-white transition-all text-sm font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
          >
            <FaRightFromBracket className="w-4 h-4 shrink-0" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main ref={mainRef} className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto overflow-x-hidden bg-[#FAF8F5] text-[#141110]">
        <Outlet />
      </main>
    </div>
  )
}
