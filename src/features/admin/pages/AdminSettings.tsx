import { useState, useEffect } from 'react'
import { adminService } from '../services/adminService'
import { regenerateSitemapAndRobots } from '../../../lib/sitemapGenerator'
import { PageLoading } from '../../../components/ui/Loading'
import Button from '../../../components/ui/Button'
import ImagePicker from '../../../components/admin/ImagePicker'
import AdminLanguageTabs, { type AdminLocale } from '../../../components/admin/AdminLanguageTabs'
import { 
  FaFloppyDisk, 
  FaArrowsRotate, 
  FaPlus, 
  FaTrash, 
  FaRegFileCode, 
  FaCircleInfo, 
  FaSliders, 
  FaGlobe, 
  FaRobot, 
  FaCode, 
  FaCheck,
  FaPen,
  FaCopy,
  FaArrowUpRightFromSquare,
  FaCircleCheck,
  FaTriangleExclamation,
  FaBolt
} from 'react-icons/fa6'

import type { CustomScript } from '../../../types/database'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<string>('general')
  const [adminLocale, setAdminLocale] = useState<AdminLocale>('ar')
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)

  // Feedback Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev))
    }, 4000)
  }

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedLink(label)
      showToast(`تم نسخ ${label} إلى الحافظة!`)
      setTimeout(() => setCopiedLink(null), 2500)
    }
  }

  // 1. General Settings State
  const [siteName, setSiteName] = useState<string>('')
  const [siteNameEn, setSiteNameEn] = useState<string>('')
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [faviconUrl, setFaviconUrl] = useState<string>('')
  const [siteDescription, setSiteDescription] = useState<string>('')
  const [siteDescriptionEn, setSiteDescriptionEn] = useState<string>('')

  // 2. SEO & Verification Defaults State
  const [defaultMetaTitle, setDefaultMetaTitle] = useState<string>('')
  const [defaultMetaTitleEn, setDefaultMetaTitleEn] = useState<string>('')
  const [defaultMetaDescription, setDefaultMetaDescription] = useState<string>('')
  const [defaultMetaDescriptionEn, setDefaultMetaDescriptionEn] = useState<string>('')
  const [defaultCanonical, setDefaultCanonical] = useState<string>('')
  const [defaultRobots, setDefaultRobots] = useState<string>('index, follow')
  const [defaultOgImage, setDefaultOgImage] = useState<string>('')
  const [googleVerification, setGoogleVerification] = useState<string>('')
  const [bingVerification, setBingVerification] = useState<string>('')
  const [facebookVerification, setFacebookVerification] = useState<string>('')
  const [pinterestVerification, setPinterestVerification] = useState<string>('')
  const [yandexVerification, setYandexVerification] = useState<string>('')

  // 3. Robots.txt Settings State
  const [robotsSitemapUrl, setRobotsSitemapUrl] = useState<string>('')
  const [robotsCustomContent, setRobotsCustomContent] = useState<string>('')
  const [regenerating, setRegenerating] = useState<boolean>(false)

  // 4. Scripts Manager State
  const [scripts, setScripts] = useState<CustomScript[]>([])
  const [scriptName, setScriptName] = useState<string>('')
  const [scriptSrc, setScriptSrc] = useState<string>('')
  const [scriptLocation, setScriptLocation] = useState<string>('head')
  const [scriptIsActive, setScriptIsActive] = useState<boolean>(true)
  const [editingScriptId, setEditingScriptId] = useState<string | null>(null)
  const [scriptFormOpen, setScriptFormOpen] = useState<boolean>(false)

  const liveBaseUrl = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://atelier-neon-three.vercel.app'
  const liveSitemapUrl = `${liveBaseUrl}/sitemap.xml`
  const liveRobotsUrl = `${liveBaseUrl}/robots.txt`

  const cleanToken = (val: unknown): string => {
    if (!val) return ''
    let clean = String(val).trim()
    const contentMatch = clean.match(/content=["']([^"']+)["']/i)
    if (contentMatch) clean = contentMatch[1]
    if (clean.includes('=')) clean = clean.split('=').pop() || ''
    return clean.trim().replace(/[<>"'/]/g, '')
  }

  useEffect(() => {
    fetchSettingsAndScripts()
  }, [])

  const fetchSettingsAndScripts = async () => {
    setLoading(true)
    try {
      const [settings, robots, scriptList] = await Promise.all([
        adminService.fetchSettings().catch(() => null),
        adminService.fetchRobots().catch(() => null),
        adminService.fetchScripts().catch(() => []),
      ])

      if (settings) {
        setSiteName(settings.site_name || 'S&I Atelier')
        setSiteNameEn(settings.site_name_en || '')
        setLogoUrl(settings.logo_url || '/logo.png')
        setFaviconUrl(settings.favicon_url || '/logo.png')
        setSiteDescription(settings.site_description || 'دار أثاث فاخر متخصصة في ابتكار وتصنيع القطع الحصرية للقصور والفيلات العصرية بالطلب.')
        setSiteDescriptionEn(settings.site_description_en || '')
        setDefaultMetaTitle(settings.default_meta_title || 'ATELIER | صياغة الأثاث الفاخر والتصميم الداخلي')
        setDefaultMetaTitleEn(settings.default_meta_title_en || '')
        setDefaultMetaDescription(settings.default_meta_description || 'استكشف أرقى تشكيلات الأثاث الإيطالي المصنوع بالطلب من الصالونات وغرف الطعام والمجالس الملكية.')
        setDefaultMetaDescriptionEn(settings.default_meta_description_en || '')
        setDefaultCanonical(settings.default_canonical || '')
        setDefaultRobots(settings.default_robots || 'index, follow')
        setDefaultOgImage(settings.default_og_image || '/assets/hero-banner.jpg')
        setGoogleVerification(settings.google_verification || '')
        setBingVerification(settings.bing_verification || '')
        setFacebookVerification(settings.facebook_verification || '')
        setPinterestVerification(settings.pinterest_verification || '')
        setYandexVerification(settings.yandex_verification || '')
      }

      if (robots) {
        setRobotsSitemapUrl(robots.sitemap_url || liveSitemapUrl)
        setRobotsCustomContent(robots.custom_content || 'User-agent: *\nAllow: /\nDisallow: /admin/')
      } else {
        setRobotsSitemapUrl(liveSitemapUrl)
        setRobotsCustomContent('User-agent: *\nAllow: /\nDisallow: /admin/')
      }

      setScripts(scriptList || [])
    } catch (err: unknown) {
      console.warn('Settings load fallback:', (err as Error)?.message || err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGeneralOrSEO = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const cleanGoogle = cleanToken(googleVerification)
      const cleanBing = cleanToken(bingVerification)
      const cleanFacebook = cleanToken(facebookVerification)
      const cleanPinterest = cleanToken(pinterestVerification)
      const cleanYandex = cleanToken(yandexVerification)

      setGoogleVerification(cleanGoogle)
      setBingVerification(cleanBing)
      setFacebookVerification(cleanFacebook)
      setPinterestVerification(cleanPinterest)
      setYandexVerification(cleanYandex)

      await adminService.updateSettings({
        site_name: siteName,
        site_name_en: siteNameEn.trim() || null,
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        site_description: siteDescription,
        site_description_en: siteDescriptionEn.trim() || null,
        default_meta_title: defaultMetaTitle,
        default_meta_title_en: defaultMetaTitleEn.trim() || null,
        default_meta_description: defaultMetaDescription,
        default_meta_description_en: defaultMetaDescriptionEn.trim() || null,
        default_canonical: defaultCanonical,
        default_robots: defaultRobots,
        default_og_image: defaultOgImage,
        google_verification: cleanGoogle,
        bing_verification: cleanBing,
        facebook_verification: cleanFacebook,
        pinterest_verification: cleanPinterest,
        yandex_verification: cleanYandex,
      })
      showToast(adminLocale === 'en' ? 'Settings saved successfully!' : 'تم حفظ الإعدادات بنجاح!')
    } catch (err: unknown) {
      showToast('حدث خطأ أثناء الحفظ: ' + ((err as Error)?.message || String(err)), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveRobots = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await adminService.updateRobots({
        sitemap_url: robotsSitemapUrl,
        custom_content: robotsCustomContent,
      })
      showToast('تم تحديث إعدادات Robots.txt بنجاح!')
    } catch (err: unknown) {
      showToast('حدث خطأ أثناء الحفظ: ' + ((err as Error)?.message || String(err)), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleManualRegenerate = async () => {
    setRegenerating(true)
    try {
      await regenerateSitemapAndRobots()
      showToast('تم توليد وتحديث نسخة التخزين السحابي لملفات Sitemap و Robots بنجاح!')
    } catch (err: unknown) {
      showToast('فشل التوليد: ' + ((err as Error)?.message || String(err)), 'error')
    } finally {
      setRegenerating(false)
    }
  }

  const handleSaveScript = async (e: React.FormEvent) => {
    e.preventDefault()
    const scriptData = {
      name: scriptName.trim(),
      src_code: scriptSrc.trim(),
      location: scriptLocation,
      is_active: scriptIsActive,
    }

    try {
      if (editingScriptId) {
        await adminService.updateScript(editingScriptId, scriptData)
        showToast('تم تحديث السكريبت بنجاح!')
      } else {
        await adminService.insertScript(scriptData)
        showToast('تمت إضافة السكريبت وتفعيله بنجاح!')
      }

      setScriptFormOpen(false)
      setEditingScriptId(null)
      setScriptName('')
      setScriptSrc('')
      setScriptLocation('head')
      setScriptIsActive(true)

      const updatedScripts = await adminService.fetchScripts()
      setScripts(updatedScripts)
    } catch (err: unknown) {
      showToast('فشل حفظ السكريبت: ' + ((err as Error)?.message || String(err)), 'error')
    }
  }

  const handleDeleteScript = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا السكريبت نهائياً؟')) return
    try {
      await adminService.deleteScript(id)
      setScripts(scripts.filter((s) => s.id !== id))
      showToast('تم حذف السكريبت بنجاح')
    } catch (err: unknown) {
      showToast((err as Error)?.message || String(err), 'error')
    }
  }

  const handleToggleScript = async (script: CustomScript) => {
    try {
      await adminService.updateScript(script.id, { is_active: !script.is_active })
      setScripts(
        scripts.map((s) => (s.id === script.id ? { ...s, is_active: !s.is_active } : s))
      )
      showToast(script.is_active ? 'تم تعطيل السكريبت' : 'تم تفعيل السكريبت')
    } catch (err: unknown) {
      showToast((err as Error)?.message || String(err), 'error')
    }
  }

  // Script Presets
  const applyScriptPreset = (type: 'ga4' | 'gtm' | 'pixel') => {
    if (type === 'ga4') {
      setScriptName('Google Analytics 4')
      setScriptLocation('head')
      setScriptSrc(`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`)
    } else if (type === 'gtm') {
      setScriptName('Google Tag Manager')
      setScriptLocation('head')
      setScriptSrc(`<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->`)
    } else if (type === 'pixel') {
      setScriptName('Meta Pixel (Facebook)')
      setScriptLocation('head')
      setScriptSrc(`<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->`)
    }
  }

  if (loading) return <PageLoading text="جار تحميل الإعدادات المركزية..." />

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12" dir="rtl">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 animate-bounce-in">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 ${
            toast.type === 'error'
              ? 'bg-rose-900/90 text-white border-rose-700'
              : 'bg-[#1C1816] text-[#F2EFE8] border-[#C4A070]/50 shadow-[#C4A070]/10'
          }`}>
            {toast.type === 'error' ? (
              <FaTriangleExclamation className="text-rose-400 w-4 h-4 shrink-0" />
            ) : (
              <FaCircleCheck className="text-[#C4A070] w-4 h-4 shrink-0" />
            )}
            <p className="text-xs font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141110]">إعدادات النظام والـ SEO المركزي</h1>
          <p className="text-xs text-[#8C7F75] mt-1">التحكم في بيانات العلامة التجارية، أكواد التتبع، خريطة الموقع، ووسوم محركات البحث</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E6E1DC] pb-3">
        {[
          { id: 'general', label: 'عام وتوثيق العلامة', Icon: FaSliders },
          { id: 'seo', label: 'الـ SEO ومحركات البحث', Icon: FaGlobe },
          { id: 'robots', label: 'Robots.txt & Sitemap', Icon: FaRobot },
          { id: 'scripts', label: 'السكريبتات وأكواد التتبع', Icon: FaCode },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#C4A070] text-white shadow-md shadow-[#C4A070]/20'
                : 'bg-white border border-[#E6E1DC] text-[#5C544E] hover:bg-[#FAF8F5]'
            }`}
          >
            <tab.Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: General */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneralOrSEO} className="bg-white rounded-2xl border border-[#E6E1DC] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-3">
            <h3 className="font-bold text-base text-[#141110]">
              {adminLocale === 'en' ? 'Brand & Website Identity' : 'معلومات وهوية الموقع'}
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8C7F75] border border-[#E6E1DC]">
              {adminLocale === 'ar' ? '🇸🇦 العربية (الرئيسية)' : '🇬🇧 English (Optional)'}
            </span>
          </div>

          <AdminLanguageTabs
            activeLocale={adminLocale}
            onChange={setAdminLocale}
            hasEnglishContent={Boolean(siteNameEn || siteDescriptionEn)}
          />
          
          <div className="space-y-6">
            {adminLocale === 'ar' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">اسم الموقع / العلامة التجارية *</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="أتيليه للأثاث والتصميم الداخلي الفاخر"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الوصف العام للعلامة</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    placeholder="اكتب نبذة شاملة عن العلامة التجارية..."
                  />
                </div>
              </>
            ) : (
              <div className="space-y-6" dir="ltr">
                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Website / Brand Name (English)</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                    value={siteNameEn}
                    onChange={(e) => setSiteNameEn(e.target.value)}
                    placeholder="S&I Atelier Luxury Furniture"
                  />
                  <p className="text-[11px] text-[#8C7F75] mt-1 text-left">Leave blank to use Arabic brand name as fallback</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Brand Overview / Description (English)</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                    value={siteDescriptionEn}
                    onChange={(e) => setSiteDescriptionEn(e.target.value)}
                    placeholder="Comprehensive English description of the luxury atelier and bespoke commissions..."
                  />
                </div>
              </div>
            )}

            {/* Shared Visual Assets */}
            <div className="pt-4 border-t border-[#E6E1DC] space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <ImagePicker
                  label={adminLocale === 'en' ? 'Website Logo' : 'شعار الموقع (Logo)'}
                  value={logoUrl}
                  onChange={setLogoUrl}
                  hint={adminLocale === 'en' ? 'Primary brand logo (PNG or SVG with transparent background)' : 'الشعار الرئيسي للعلامة (PNG أو SVG بخلفية شفافة)'}
                  title={adminLocale === 'en' ? 'Select brand logo from Media Library' : 'اختر شعار الموقع من مكتبة الوسائط'}
                  placeholder="/assets/logo.png"
                />

                <ImagePicker
                  compact
                  label={adminLocale === 'en' ? 'Browser Tab Favicon' : 'أيقونة التبويب (Favicon)'}
                  value={faviconUrl}
                  onChange={setFaviconUrl}
                  hint={adminLocale === 'en' ? 'Square icon for browser tab (SVG or PNG)' : 'أيقونة مربعة صغيرة تظهر في تبويب المتصفح (SVG أو PNG)'}
                  title={adminLocale === 'en' ? 'Select favicon from Media Library' : 'اختر أيقونة التبويب من مكتبة الوسائط'}
                  placeholder="/favicon.svg"
                />
              </div>

              <div>
                <ImagePicker
                  label={adminLocale === 'en' ? 'Default Social Share Image (OG Image)' : 'صورة المشاركة الافتراضية (Default OG Image)'}
                  value={defaultOgImage}
                  onChange={setDefaultOgImage}
                  hint={adminLocale === 'en' ? 'Image preview when sharing website link on WhatsApp and social platforms' : 'الصورة التي تظهر عند مشاركة رابط الموقع على واتساب وشبكات التواصل'}
                  title={adminLocale === 'en' ? 'Select social share image from Media Library' : 'اختر صورة المشاركة الافتراضية من مكتبة الوسائط'}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E6E1DC]">
            <Button type="submit" disabled={submitting} icon={<FaFloppyDisk />}>
              {submitting ? (adminLocale === 'en' ? 'Saving...' : 'جار الحفظ...') : (adminLocale === 'en' ? 'Save Changes' : 'حفظ التغييرات')}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: SEO & Verifications */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveGeneralOrSEO} className="bg-white rounded-2xl border border-[#E6E1DC] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-3">
            <h3 className="font-bold text-base text-[#141110]">
              {adminLocale === 'en' ? 'Default SEO & Verification Settings' : 'إعدادات الـ SEO والتوثيق الافتراضية'}
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8C7F75] border border-[#E6E1DC]">
              {adminLocale === 'ar' ? '🇸🇦 العربية (الرئيسية)' : '🇬🇧 English (Optional)'}
            </span>
          </div>

          <AdminLanguageTabs
            activeLocale={adminLocale}
            onChange={setAdminLocale}
            hasEnglishContent={Boolean(defaultMetaTitleEn || defaultMetaDescriptionEn)}
          />

          {adminLocale === 'ar' ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">عنوان الميتا الافتراضي *</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                    value={defaultMetaTitle}
                    onChange={(e) => setDefaultMetaTitle(e.target.value)}
                    placeholder="ATELIER | صياغة الأثاث الفاخر والتصميم الداخلي"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الرابط النموذجي الافتراضي (Canonical URL)</label>
                  <input
                    type="url"
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                    placeholder="https://atelier-luxury.com"
                    value={defaultCanonical}
                    onChange={(e) => setDefaultCanonical(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الوصف التعريفي الافتراضي</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                  value={defaultMetaDescription}
                  onChange={(e) => setDefaultMetaDescription(e.target.value)}
                  placeholder="استكشف أرقى تشكيلات الأثاث الإيطالي المصنوع بالطلب من الصالونات وغرف الطعام والمجالس الملكية."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6" dir="ltr">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Default Meta Title (English)</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                    value={defaultMetaTitleEn}
                    onChange={(e) => setDefaultMetaTitleEn(e.target.value)}
                    placeholder="ATELIER | Haute Living & Bespoke Commissions"
                  />
                  <p className="text-[11px] text-[#8C7F75] mt-1 text-left">Leave blank to use Arabic meta title as fallback</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Default Canonical URL</label>
                  <input
                    type="url"
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                    placeholder="https://atelier-luxury.com"
                    value={defaultCanonical}
                    onChange={(e) => setDefaultCanonical(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Default Meta Description (English)</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                  value={defaultMetaDescriptionEn}
                  onChange={(e) => setDefaultMetaDescriptionEn(e.target.value)}
                  placeholder="Explore prestigious Italian furniture commissions tailored for royal villas and architectural sanctuaries."
                />
              </div>
            </div>
          )}

          {/* Verification Tokens */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E6E1DC] space-y-4">
            <h4 className="font-bold text-xs text-[#141110] flex items-center gap-2">
              <FaCircleInfo className="text-[#C4A070] w-4 h-4" />
              <span>
                {adminLocale === 'en' ? 'Search Engine & Webmaster Verification Tokens' : 'رموز توثيق محركات البحث وأدوات مشرفي المواقع (Webmaster Tokens)'}
              </span>
            </h4>
            <p className="text-[11px] text-[#8C7F75]">
              يمكنك وضع الرمز المباشر (Token) أو لصق وسم &lt;meta&gt; كاملاً، وسيتم استخلاص الرمز النظيف تلقائياً عند الحفظ.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">Google Site Verification</label>
                <input
                  type="text"
                  dir="ltr"
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none"
                  placeholder="مثال: JS6hq_ghV0o0Yy5... أو وسم <meta> كامل"
                  value={googleVerification}
                  onChange={(e) => setGoogleVerification(e.target.value)}
                />
                {googleVerification && cleanToken(googleVerification) !== googleVerification && (
                  <p className="text-[10px] text-emerald-700 mt-1 font-mono flex items-center gap-1">
                    <FaCheck className="w-3 h-3" />
                    <span>الرمز المستخرج: {cleanToken(googleVerification)}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">Bing Webmaster (msvalidate.01)</label>
                <input
                  type="text"
                  dir="ltr"
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none"
                  placeholder="Bing Token"
                  value={bingVerification}
                  onChange={(e) => setBingVerification(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">Facebook Domain Verification</label>
                <input
                  type="text"
                  dir="ltr"
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none"
                  placeholder="Facebook Token"
                  value={facebookVerification}
                  onChange={(e) => setFacebookVerification(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">Pinterest Verification</label>
                <input
                  type="text"
                  dir="ltr"
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none"
                  placeholder="Pinterest Token"
                  value={pinterestVerification}
                  onChange={(e) => setPinterestVerification(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">Yandex Verification</label>
                <input
                  type="text"
                  dir="ltr"
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none"
                  placeholder="Yandex Token"
                  value={yandexVerification}
                  onChange={(e) => setYandexVerification(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E6E1DC]">
            <Button type="submit" disabled={submitting} icon={<FaFloppyDisk />}>
              {submitting ? (adminLocale === 'en' ? 'Saving...' : 'جار الحفظ...') : (adminLocale === 'en' ? 'Save SEO Settings' : 'حفظ إعدادات الـ SEO')}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: Robots & Sitemap */}
      {activeTab === 'robots' && (
        <div className="space-y-6">
          {/* Live Dynamic Sitemap Status Card */}
          <div className="bg-gradient-to-br from-[#FAF8F5] to-white rounded-2xl border border-[#C4A070]/30 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    نظام حي ومباشر (Live Real-Time Dynamic API)
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#141110]">خريطة الموقع الآلية (Sitemap.xml)</h3>
                <p className="text-xs text-[#8C7F75] mt-0.5">
                  خريطة الموقع مربوطة مباشرة بقاعدة البيانات ويتم تحديثها تلقائياً عند إضافة أو تعديل أي منتج أو مقال أو عرض.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualRegenerate}
                  disabled={regenerating}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E6E1DC] text-[#5C544E] hover:bg-[#FAF8F5] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  title="توليد نسخة احتياطية على Supabase Storage"
                >
                  <FaArrowsRotate className={`w-3 h-3 ${regenerating ? 'animate-spin text-[#C4A070]' : ''}`} />
                  <span>{regenerating ? 'جار التوليد...' : 'توليد نسخة سحابية'}</span>
                </button>

                <a
                  href={liveSitemapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#C4A070] text-white hover:bg-[#B88F48] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>معاينة الـ XML</span>
                  <FaArrowUpRightFromSquare className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* URL Display & One-Click Copy */}
            <div className="bg-white rounded-xl border border-[#E6E1DC] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 rounded-lg bg-[#FAF8F5] text-[#C4A070] shrink-0">
                  <FaGlobe className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[#8C7F75] font-semibold">الرابط المباشر لخريطة الموقع:</p>
                  <p className="text-xs font-mono text-[#141110] truncate select-all" dir="ltr">
                    {liveSitemapUrl}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(liveSitemapUrl, 'رابط خريطة الموقع')}
                className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#E6E1DC] text-[#141110] text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {copiedLink === 'رابط خريطة الموقع' ? (
                  <>
                    <FaCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="w-3.5 h-3.5 text-[#8C7F75]" />
                    <span>نسخ الرابط</span>
                  </>
                )}
              </button>
            </div>

            {/* Search Console Tip */}
            <div className="bg-[#FAF8F5] rounded-xl p-3.5 text-xs text-[#5C544E] flex items-start gap-2.5 border border-[#E6E1DC]">
              <FaBolt className="w-4 h-4 text-[#C4A070] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#141110]">طريقة الربط في Google Search Console: </span>
                ادخل على قسم <strong>Sitemaps (خرائط المواقع)</strong>، وستجد رابط موقعك مكتوباً تلقائياً. اكتب في المربع فقط كلمة <code className="px-1.5 py-0.5 rounded bg-white border border-[#E6E1DC] font-mono text-[11px] text-[#C4A070] font-bold">sitemap.xml</code> ثم اضغط إرسال (Submit).
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveRobots} className="bg-white rounded-2xl border border-[#E6E1DC] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-3">
              <h3 className="font-bold text-base text-[#141110]">إعدادات ملف Robots.txt</h3>
              <a
                href={liveRobotsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#C4A070] hover:underline font-semibold flex items-center gap-1"
              >
                <span>معاينة robots.txt المباشر</span>
                <FaArrowUpRightFromSquare className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">رابط خريطة الموقع داخل Robots.txt</label>
              <input
                type="url"
                dir="ltr"
                className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                placeholder={liveSitemapUrl}
                value={robotsSitemapUrl}
                onChange={(e) => setRobotsSitemapUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">محتوى ملف Robots.txt المخصص</label>
              <textarea
                rows={6}
                dir="ltr"
                className="w-full rounded-xl border border-[#E6E1DC] bg-[#FAF8F5] px-4 py-2.5 text-xs font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                value={robotsCustomContent}
                onChange={(e) => setRobotsCustomContent(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E6E1DC]">
              <Button type="submit" disabled={submitting} icon={<FaFloppyDisk />}>
                {submitting ? 'جار الحفظ...' : 'حفظ Robots.txt'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: Custom Scripts */}
      {activeTab === 'scripts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-[#141110]">إدارة سكريبتات الرأس والذيل (Custom Scripts)</h3>
              <p className="text-xs text-[#8C7F75] mt-1">
                حقن أكواد التتبع مثل Google Tag Manager و Meta Pixel وإحصائيات الزوار بدون إعادة بناء الموقع
              </p>
            </div>
            <button
              onClick={() => {
                setEditingScriptId(null)
                setScriptName('')
                setScriptSrc('')
                setScriptLocation('head')
                setScriptIsActive(true)
                setScriptFormOpen(true)
              }}
              className="px-4 py-2 bg-[#C4A070] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#B88F48] cursor-pointer shrink-0"
            >
              <FaPlus className="w-3.5 h-3.5" />
              <span>إضافة كود جديد</span>
            </button>
          </div>

          {/* Guidance Banner */}
          <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E6E1DC] flex items-start gap-3">
            <FaCircleInfo className="text-[#C4A070] w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-xs text-[#5C544E] leading-relaxed">
              <strong>ملاحظة:</strong> تعمل هذه الأكواد تلقائياً لجميع الزوار على المتجر. لإثبات ملكية Google Search Console يرجى استخدام خانة <strong>Google Site Verification</strong> في تبويب (الـ SEO ومحركات البحث) أو التحقق عبر إعدادات الدومين DNS.
            </p>
          </div>

          {/* Script Form Modal */}
          {scriptFormOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-modal="light">
              <form onSubmit={handleSaveScript} className="bg-white rounded-2xl p-6 shadow-2xl max-w-xl w-full border border-[#E6E1DC] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-3">
                  <h4 className="font-bold text-base text-[#141110]">{editingScriptId ? 'تعديل السكريبت' : 'إضافة سكريبت جديد'}</h4>
                  <button
                    type="button"
                    onClick={() => setScriptFormOpen(false)}
                    className="text-[#8C7F75] hover:text-[#141110] text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Preset Quick Actions */}
                {!editingScriptId && (
                  <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#E6E1DC]">
                    <p className="text-[11px] font-bold text-[#5C544E] mb-2">قوالب جاهزة سريعة:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => applyScriptPreset('ga4')}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#E6E1DC] text-[11px] font-bold text-[#141110] hover:border-[#C4A070] cursor-pointer"
                      >
                        📊 Google Analytics (GA4)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyScriptPreset('gtm')}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#E6E1DC] text-[11px] font-bold text-[#141110] hover:border-[#C4A070] cursor-pointer"
                      >
                        🏷️ Google Tag Manager
                      </button>
                      <button
                        type="button"
                        onClick={() => applyScriptPreset('pixel')}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#E6E1DC] text-[11px] font-bold text-[#141110] hover:border-[#C4A070] cursor-pointer"
                      >
                        🎯 Meta Pixel
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#5C544E] mb-1">اسم السكريبت *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs text-[#141110] bg-white placeholder-[#8C7F75] focus:border-[#C4A070] focus:outline-none"
                    placeholder="مثال: Google Analytics 4 أو Hotjar"
                    value={scriptName}
                    onChange={(e) => setScriptName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5C544E] mb-1">موضع الحقن (Location)</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs text-[#141110] bg-white focus:border-[#C4A070] focus:outline-none cursor-pointer"
                    value={scriptLocation}
                    onChange={(e) => setScriptLocation(e.target.value)}
                  >
                    <option value="head">داخل الرأس (Head - موصى به لأكواد التتبع والبيكسل)</option>
                    <option value="body_end">نهاية الصفحة (Body End - موصى به لأدوات الشات)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5C544E] mb-1">كود HTML / JavaScript الكامل *</label>
                  <textarea
                    rows={6}
                    required
                    dir="ltr"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] font-mono text-xs text-[#141110] bg-[#FAF8F5] placeholder-[#8C7F75] focus:border-[#C4A070] focus:outline-none"
                    placeholder="<script>...</script>"
                    value={scriptSrc}
                    onChange={(e) => setScriptSrc(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="scriptActiveCheck"
                    checked={scriptIsActive}
                    onChange={(e) => setScriptIsActive(e.target.checked)}
                    className="rounded border-[#E6E1DC] text-[#C4A070] focus:ring-[#C4A070] cursor-pointer"
                  />
                  <label htmlFor="scriptActiveCheck" className="text-xs font-medium text-[#141110] cursor-pointer">
                    تفعيل هذا السكريبت فوراً بعد الحفظ
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[#E6E1DC]">
                  <button
                    type="button"
                    onClick={() => setScriptFormOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#5C544E] hover:bg-[#FAF8F5] rounded-xl cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-[#C4A070] text-white hover:bg-[#B88F48] rounded-xl cursor-pointer"
                  >
                    حفظ السكريبت
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Scripts List */}
          <div className="grid gap-4">
            {scripts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E6E1DC] p-8 text-center text-xs text-[#8C7F75]">
                لم يتم إضافة أي سكريبتات مخصصة بعد. انقر على &quot;إضافة كود جديد&quot; للبدء.
              </div>
            ) : (
              scripts.map((sc) => (
                <div key={sc.id} className="bg-white rounded-2xl border border-[#E6E1DC] p-4 flex items-center justify-between shadow-sm gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] text-[#C4A070] shrink-0">
                      <FaRegFileCode className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#141110] truncate">{sc.name}</h4>
                      <p className="text-[11px] text-[#8C7F75] mt-0.5 flex items-center gap-2">
                        <span>الموضع: {sc.location === 'head' ? 'داخل الرأس (Head)' : 'نهاية الصفحة (Body)'}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">
                          {sc.src_code.length} حرف
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(sc.src_code, `كود ${sc.name}`)}
                      title="نسخ الكود"
                      className="p-2 text-[#8C7F75] hover:text-[#141110] hover:bg-[#FAF8F5] rounded-lg cursor-pointer"
                    >
                      <FaCopy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleScript(sc)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        sc.is_active ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      {sc.is_active ? 'مفعل' : 'معطل'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingScriptId(sc.id)
                        setScriptName(sc.name)
                        setScriptSrc(sc.src_code)
                        setScriptLocation(sc.location)
                        setScriptIsActive(sc.is_active)
                        setScriptFormOpen(true)
                      }}
                      title="تعديل"
                      className="p-2 text-[#5C544E] hover:bg-[#FAF8F5] rounded-lg cursor-pointer"
                    >
                      <FaPen className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteScript(sc.id)}
                      title="حذف"
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
