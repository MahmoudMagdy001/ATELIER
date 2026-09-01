import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { 
  FaPenToSquare, 
  FaBellConcierge, 
  FaTag, 
  FaImages, 
  FaFolderOpen, 
  FaArrowRightArrowLeft, 
  FaGear, 
  FaRightFromBracket,
  FaArrowUpRightFromSquare,
  FaCrown
} from 'react-icons/fa6'

const ADMIN_LINKS = [
  { to: '/admin/posts', label: 'المقالات (Posts)', Icon: FaPenToSquare },
  { to: '/admin/services', label: 'الخدمات (Services)', Icon: FaBellConcierge },
  { to: '/admin/offers', label: 'العروض (Offers)', Icon: FaTag },
  { to: '/admin/media', label: 'الوسائط (Media)', Icon: FaImages },
  { to: '/admin/categories', label: 'التصنيفات (Categories)', Icon: FaFolderOpen },
  { to: '/admin/redirects', label: 'التحويلات (Redirects)', Icon: FaArrowRightArrowLeft },
  { to: '/admin/settings', label: 'الإعدادات (Settings)', Icon: FaGear },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      // quiet logout
    }
    localStorage.removeItem('atelier_user')
    navigate('/admin/login')
  }

  return (
    <div className="h-screen bg-[#FAF8F5] flex flex-col md:flex-row overflow-hidden font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#14110F] text-white shrink-0 shadow-2xl flex flex-col border-l border-white/5">
        {/* Brand */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C5A880] to-[#E5C9A3] flex items-center justify-center text-[#14110F] shadow-lg shadow-[#C5A880]/20">
              <FaCrown className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide text-white">لوحة تحكم أتيليه</span>
              <span className="text-[10px] text-[#C5A880] tracking-widest uppercase font-semibold">ATELIER CONTROL</span>
            </div>
          </div>
          <Link 
            to="/" 
            target="_blank"
            className="text-xs text-[#C5A880] hover:text-white flex items-center gap-1 transition-colors"
            title="معاينة الموقع"
          >
            <span>الموقع</span>
            <FaArrowUpRightFromSquare className="w-2.5 h-2.5" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {ADMIN_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C5A880] text-[#14110F] font-bold shadow-lg shadow-[#C5A880]/25'
                    : 'text-[#D6CDC4] hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <link.Icon className="w-4.5 h-4.5 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 text-red-300 hover:bg-red-600 hover:text-white transition-all text-sm font-semibold cursor-pointer"
          >
            <FaRightFromBracket className="w-4 h-4 shrink-0" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto overflow-x-hidden bg-[#FAF8F5]">
        <Outlet />
      </main>
    </div>
  )
}
