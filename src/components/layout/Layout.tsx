import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { adminService } from '../../features/admin/services/adminService'
import { CONTACT_INFO } from '../../constants/contactInfo'
import BrandLogo from '../ui/BrandLogo'
import CrCertificateBadge from '../ui/CrCertificateBadge'
import ContactShowroomSection from '../../features/home/components/ContactShowroomSection'
import ScrollToTop from './ScrollToTop'
import FloatingWhatsApp from './FloatingWhatsApp'
import type { SiteSettings } from '../../types/database'
import { 
  FaInstagram, 
  FaPinterest, 
  FaLinkedin, 
  FaTiktok, 
  FaSnapchat, 
  FaXTwitter, 
  FaFacebookF, 
  FaYoutube, 
  FaBars, 
  FaXmark, 
  FaWhatsapp, 
} from 'react-icons/fa6'

const NAV_LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/limited-edition', label: 'قطع ذات إصدار محدود' },
  { to: '/bespoke', label: 'تنفيذ حسب الطلب' },
  { to: '/offers', label: 'العروض الحصرية' },
]

const SOCIAL_LINKS = [
  { name: 'Instagram', icon: FaInstagram, url: CONTACT_INFO.instagramUrl },
  { name: 'Snapchat', icon: FaSnapchat, url: CONTACT_INFO.snapchatUrl },
  { name: 'TikTok', icon: FaTiktok, url: CONTACT_INFO.tiktokUrl },
  { name: 'X (Twitter)', icon: FaXTwitter, url: CONTACT_INFO.twitterUrl },
  { name: 'Pinterest', icon: FaPinterest, url: CONTACT_INFO.pinterestUrl },
  { name: 'LinkedIn', icon: FaLinkedin, url: CONTACT_INFO.linkedinUrl },
  { name: 'Facebook', icon: FaFacebookF, url: CONTACT_INFO.facebookUrl },
  { name: 'YouTube', icon: FaYoutube, url: CONTACT_INFO.youtubeUrl },
  { name: 'WhatsApp', icon: FaWhatsapp, url: `https://wa.me/${CONTACT_INFO.whatsappRaw}` },
]

export default function Layout() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const location = useLocation()

  // Reset scroll to top on route change (like Milaf)
  useEffect(() => {
    window.scrollTo(0, 0)
    setMobileMenuOpen(false)
  }, [location.pathname])

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

  const handleNavClick = (e: React.MouseEvent, to: string) => {
    if (to === '/' && location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-transparent text-[#F2EFE8] flex flex-col selection:bg-[#C4A070]/30 selection:text-[#F2EFE8] font-sans relative" dir="rtl">
      {/* Dynamic Transparent / Solid Navbar */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled || mobileMenuOpen
            ? 'bg-[#1C1816]/95 backdrop-blur-md border-b border-[#C4A070]/20 shadow-xl shadow-black/50 py-0'
            : 'bg-transparent border-b border-transparent py-2'
        }`}
      >
        <div className="w-full px-6 md:px-8 lg:px-10 h-20 flex items-center justify-between">
          <Link to="/" className="group flex items-center shrink-0" onClick={(e) => handleNavClick(e, '/')}>
            <BrandLogo size="md" customLogo={settings?.logo_url} />
          </Link>

          {/* Desktop Navigation with Framer Motion Layout Transition */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <NavLink 
                key={link.to}
                to={link.to} 
                end={link.to === '/'}
                onClick={(e) => handleNavClick(e, link.to)}
                className={({ isActive }) => 
                  `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'text-[#C4A070] font-bold' 
                      : 'text-[#B3A9A3] hover:text-[#F2EFE8]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 inset-x-2 h-0.5 bg-gradient-to-r from-[#C4A070] via-[#E3CAA9] to-[#C4A070] rounded-full shadow-[0_0_10px_rgba(196,160,112,0.7)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent('مرحباً S&I Atelier، أود الاستفسار عن تفصيل قطع أثاث خاصة')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full text-xs font-bold gold-btn-primary transition-all duration-300 shadow-lg flex items-center gap-2"
              >
                <span>طلب استشارة تصميم</span>
              </a>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#C4A070] hover:text-[#F2EFE8] hover:bg-white/5 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <FaXmark className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden border-t border-[#C4A070]/15 bg-[#141110] px-6 py-4 space-y-1.5 overflow-hidden"
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={(e) => handleNavClick(e, link.to)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#C4A070]/15 text-[#C4A070] font-bold border-r-2 border-[#C4A070]'
                        : 'text-[#B3A9A3] hover:text-[#F2EFE8] hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Unified VIP Bespoke Concierge & Showroom Contact Section */}
      <div className="pt-8 pb-20 bg-transparent">
        <ContactShowroomSection settings={settings} />
      </div>

      {/* Footer */}
      <footer className="border-t border-[#C4A070]/20 bg-[#141110] text-[#B3A9A3] py-14 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-5">
            <BrandLogo size="md" customLogo={settings?.logo_url} />
            <p className="text-xs leading-relaxed text-[#B3A9A3] pt-1">
              صياغة مساحات استثنائية وأثاث راقٍ مخصص يعكس الهوية الفاخرة للقصور والفيلات العصرية بأيدي كبار الحرفيين.
            </p>
            <div className="pt-2">
              <CrCertificateBadge />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F2EFE8] mb-4 font-serif">روابط سريعة</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/limited-edition" className="hover:text-[#C4A070] transition-colors">قطع ذات إصدار محدود</Link></li>
              <li><Link to="/bespoke" className="hover:text-[#C4A070] transition-colors">التنفيذ حسب الطلب</Link></li>
              <li><Link to="/offers" className="hover:text-[#C4A070] transition-colors">العروض الحصرية</Link></li>
              <li><Link to="/blog" className="hover:text-[#C4A070] transition-colors">المدونة</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F2EFE8] mb-4 font-serif">التواصل والمعرض</h4>
            <p className="text-xs text-[#B3A9A3] mb-2">{CONTACT_INFO.address}</p>
            <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="text-xs text-[#C4A070] font-mono hover:underline block">
              {CONTACT_INFO.phone}
            </a>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F2EFE8] mb-4 font-serif">تابعنا على وسائل التواصل</h4>
            <div className="flex flex-wrap items-center gap-2.5 text-base text-[#C4A070]">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-[#C4A070]/60 hover:bg-[#C4A070] hover:text-[#1C1816] transition-all duration-300 flex items-center justify-center shadow-sm group"
                  title={social.name}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Values Ribbon */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-[#B3A9A3] gap-4">
          <div className="flex items-center gap-4 text-[11px] tracking-[0.28em] text-[#C4A070] uppercase font-extrabold font-serif" dir="ltr">
            <span>LUXURY</span>
            <span>•</span>
            <span>MINIMAL</span>
            <span>•</span>
            <span>TIMELESS</span>
            <span>•</span>
            <span>BESPOKE</span>
          </div>

          <p>© {new Date().getFullYear()} {settings?.site_name || 'ATELIER Bespoke Luxury Furniture'}. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      {/* Floating Action Buttons: Scroll to Top (Bottom-Left) & WhatsApp (Bottom-Right) */}
      <ScrollToTop />
      <FloatingWhatsApp />
    </div>
  )
}
