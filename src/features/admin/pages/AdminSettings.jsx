import { useState, useEffect } from 'react'
import { adminService } from '../services/adminService'
import { regenerateSitemapAndRobots } from '../../../lib/sitemapGenerator'
import { PageLoading } from '../../../components/ui/Loading'
import Button from '../../../components/ui/Button'
import ImagePicker from '../../../components/admin/ImagePicker'
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
  FaPen
} from 'react-icons/fa6'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // 1. General Settings State
  const [siteName, setSiteName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [faviconUrl, setFaviconUrl] = useState('')
  const [siteDescription, setSiteDescription] = useState('')

  // 2. SEO & Verification Defaults State
  const [defaultMetaTitle, setDefaultMetaTitle] = useState('')
  const [defaultMetaDescription, setDefaultMetaDescription] = useState('')
  const [defaultCanonical, setDefaultCanonical] = useState('')
  const [defaultRobots, setDefaultRobots] = useState('index, follow')
  const [defaultOgImage, setDefaultOgImage] = useState('')
  const [googleVerification, setGoogleVerification] = useState('')
  const [bingVerification, setBingVerification] = useState('')
  const [facebookVerification, setFacebookVerification] = useState('')
  const [pinterestVerification, setPinterestVerification] = useState('')
  const [yandexVerification, setYandexVerification] = useState('')

  // 3. Robots.txt Settings State
  const [robotsSitemapUrl, setRobotsSitemapUrl] = useState('')
  const [robotsCustomContent, setRobotsCustomContent] = useState('')
  const [regenerating, setRegenerating] = useState(false)

  // 4. Scripts Manager State
  const [scripts, setScripts] = useState([])
  const [scriptName, setScriptName] = useState('')
  const [scriptSrc, setScriptSrc] = useState('')
  const [scriptLocation, setScriptLocation] = useState('head')
  const [scriptIsActive, setScriptIsActive] = useState(true)
  const [editingScriptId, setEditingScriptId] = useState(null)
  const [scriptFormOpen, setScriptFormOpen] = useState(false)

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
        setLogoUrl(settings.logo_url || '/logo.png')
        setFaviconUrl(settings.favicon_url || '/logo.png')
        setSiteDescription(settings.site_description || 'دار أثاث فاخر متخصصة في ابتكار وتصنيع القطع الحصرية للقصور والفيلات العصرية بالطلب.')
        setDefaultMetaTitle(settings.default_meta_title || 'ATELIER | صياغة الأثاث الفاخر والتصميم الداخلي')
        setDefaultMetaDescription(settings.default_meta_description || 'استكشف أرقى تشكيلات الأثاث الإيطالي المصنوع بالطلب من الصالونات وغرف الطعام والمجالس الملكية.')
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
        setRobotsSitemapUrl(robots.sitemap_url || '')
        setRobotsCustomContent(robots.custom_content || 'User-agent: *\nAllow: /\nDisallow: /admin/')
      }

      setScripts(scriptList || [])
    } catch (err) {
      console.warn('Settings load fallback:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGeneralOrSEO = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const cleanToken = (val) => {
      if (!val) return ''
      let clean = String(val).trim()
      const contentMatch = clean.match(/content=["']([^"']+)["']/i)
      if (contentMatch) clean = contentMatch[1]
      if (clean.includes('=')) clean = clean.split('=').pop()
      return clean.trim()
    }

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
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        site_description: siteDescription,
        default_meta_title: defaultMetaTitle,
        default_meta_description: defaultMetaDescription,
        default_canonical: defaultCanonical,
        default_robots: defaultRobots,
        default_og_image: defaultOgImage,
        google_verification: cleanGoogle,
        bing_verification: cleanBing,
        facebook_verification: cleanFacebook,
        pinterest_verification: cleanPinterest,
        yandex_verification: cleanYandex,
      })
      alert('تم حفظ إعدادات الموقع بنجاح!')
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveRobots = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await adminService.updateRobots({
        sitemap_url: robotsSitemapUrl,
        custom_content: robotsCustomContent,
      })
      alert('تم تحديث إعدادات Robots.txt بنجاح!')
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleManualRegenerate = async () => {
    setRegenerating(true)
    try {
      await regenerateSitemapAndRobots()
      alert('تم إعادة توليد ملفات Sitemap.xml و Robots.txt وتحديثها بنجاح!')
    } catch (err) {
      alert('فشل التوليد: ' + err.message)
    } finally {
      setRegenerating(false)
    }
  }

  const handleSaveScript = async (e) => {
    e.preventDefault()
    const scriptData = {
      name: scriptName,
      src_code: scriptSrc,
      location: scriptLocation,
      is_active: scriptIsActive,
    }

    try {
      if (editingScriptId) {
        await adminService.updateScript(editingScriptId, scriptData)
      } else {
        await adminService.insertScript(scriptData)
      }

      setScriptFormOpen(false)
      setEditingScriptId(null)
      setScriptName('')
      setScriptSrc('')
      setScriptLocation('head')
      setScriptIsActive(true)

      const updatedScripts = await adminService.fetchScripts()
      setScripts(updatedScripts)
    } catch (err) {
      alert('فشل حفظ السكريبت: ' + err.message)
    }
  }

  const handleDeleteScript = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا السكريبت؟')) return
    try {
      await adminService.deleteScript(id)
      setScripts(scripts.filter((s) => s.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleToggleScript = async (script) => {
    try {
      await adminService.updateScript(script.id, { is_active: !script.is_active })
      setScripts(
        scripts.map((s) => (s.id === script.id ? { ...s, is_active: !s.is_active } : s))
      )
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <PageLoading text="جار تحميل الإعدادات المركزية..." />

  return (
    <div className="space-y-8 max-w-6xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#14110F]">إعدادات النظام والـ SEO المركزي</h1>
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
                ? 'bg-[#C5A880] text-white shadow-md shadow-[#C5A880]/20'
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
          <h3 className="font-bold text-base text-[#14110F] border-b border-[#E6E1DC] pb-3">معلومات وهوية الموقع</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">اسم الموقع / العلامة التجارية</label>
              <input
                type="text"
                className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="أتيليه للأثاث والتصميم الداخلي الفاخر"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <ImagePicker
                label="شعار الموقع (Logo)"
                value={logoUrl}
                onChange={setLogoUrl}
                hint="الشعار الرئيسي للعلامة (PNG أو SVG بخلفية شفافة)"
                title="اختر شعار الموقع من مكتبة الوسائط"
                placeholder="/assets/logo.png أو رابط مباشر..."
              />

              <ImagePicker
                compact
                label="أيقونة التبويب (Favicon)"
                value={faviconUrl}
                onChange={setFaviconUrl}
                hint="أيقونة مربعة صغيرة تظهر في تبويب المتصفح (SVG أو PNG)"
                title="اختر أيقونة التبويب من مكتبة الوسائط"
                placeholder="/favicon.svg أو رابط مباشر..."
              />
            </div>

            <div>
              <ImagePicker
                label="صورة المشاركة الافتراضية (Default OG Image)"
                value={defaultOgImage}
                onChange={setDefaultOgImage}
                hint="الصورة التي تظهر عند مشاركة رابط الموقع على واتساب وشبكات التواصل"
                title="اختر صورة المشاركة الافتراضية من مكتبة الوسائط"
                placeholder="https://... أو مسار صورة"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الوصف العام للعلامة</label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="اكتب نبذة شاملة عن العلامة التجارية..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E6E1DC]">
            <Button type="submit" disabled={submitting} icon={<FaFloppyDisk />}>
              {submitting ? 'جار الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: SEO & Verifications */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveGeneralOrSEO} className="bg-white rounded-2xl border border-[#E6E1DC] p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-base text-[#14110F] border-b border-[#E6E1DC] pb-3">إعدادات الـ SEO والتوثيق الافتراضية</h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">عنوان الميتا الافتراضي (Default Meta Title)</label>
              <input
                type="text"
                className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
                value={defaultMetaTitle}
                onChange={(e) => setDefaultMetaTitle(e.target.value)}
                placeholder="ATELIER | صياغة الأثاث الفاخر والتصميم الداخلي"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الرابط النموذجي الافتراضي (Canonical URL)</label>
              <input
                type="url"
                className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-mono text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
                placeholder="https://atelier-luxury.com"
                value={defaultCanonical}
                onChange={(e) => setDefaultCanonical(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الوصف التعريفي الافتراضي (Default Meta Description)</label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
              value={defaultMetaDescription}
              onChange={(e) => setDefaultMetaDescription(e.target.value)}
              placeholder="استكشف أرقى تشكيلات الأثاث الإيطالي المصنوع بالطلب من الصالونات وغرف الطعام والمجالس الملكية."
            />
          </div>

          {/* Verification Tokens */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E6E1DC] space-y-4">
            <h4 className="font-bold text-xs text-[#14110F] flex items-center gap-2">
              <FaCircleInfo className="text-[#C5A880] w-4 h-4" />
              <span>رموز توثيق محركات البحث وأدوات مشرفي المواقع (Webmaster Tokens)</span>
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">Google Site Verification</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs font-mono text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
                  placeholder="رمز جوجل أو وسم الميتا الكامل"
                  value={googleVerification}
                  onChange={(e) => setGoogleVerification(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">Bing Webmaster (msvalidate.01)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs font-mono text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
                  placeholder="رمز توثيق بينج"
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
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs font-mono text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
                  placeholder="Facebook Token"
                  value={facebookVerification}
                  onChange={(e) => setFacebookVerification(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">Pinterest Verification</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs font-mono text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
                  placeholder="Pinterest Token"
                  value={pinterestVerification}
                  onChange={(e) => setPinterestVerification(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5C544E] mb-1">Yandex Verification</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E6E1DC] bg-white px-3.5 py-2 text-xs font-mono text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
                  placeholder="Yandex Token"
                  value={yandexVerification}
                  onChange={(e) => setYandexVerification(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E6E1DC]">
            <Button type="submit" disabled={submitting} icon={<FaFloppyDisk />}>
              {submitting ? 'جار الحفظ...' : 'حفظ إعدادات الـ SEO'}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: Robots & Sitemap */}
      {activeTab === 'robots' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6E1DC] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-[#14110F]">توليد خريطة الموقع الآلية (Sitemap.xml Generator)</h3>
              <p className="text-xs text-[#8C7F75] mt-1">إنشاء ملف Sitemap.xml محدث يضم كافة المقالات، الخدمات، والعروض ورفعه للتخزين السحابي</p>
            </div>
            <button
              type="button"
              onClick={handleManualRegenerate}
              disabled={regenerating}
              className="px-5 py-2.5 rounded-xl bg-[#2B2623] text-white hover:bg-[#14110F] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <FaArrowsRotate className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
              <span>{regenerating ? 'جار التوليد والرفع...' : 'تحديث Sitemap.xml الآن'}</span>
            </button>
          </div>

          <form onSubmit={handleSaveRobots} className="bg-white rounded-2xl border border-[#E6E1DC] p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-base text-[#14110F] border-b border-[#E6E1DC] pb-3">إعدادات ملف Robots.txt</h3>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">رابط خريطة الموقع داخل Robots.txt</label>
              <input
                type="url"
                className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-mono text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
                placeholder="https://atelier-luxury.com/sitemap.xml"
                value={robotsSitemapUrl}
                onChange={(e) => setRobotsSitemapUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C544E] mb-1.5">محتوى ملف Robots.txt المخصص</label>
              <textarea
                rows={6}
                className="w-full rounded-xl border border-[#E6E1DC] bg-[#FAF8F5] px-4 py-2.5 text-xs font-mono text-[#14110F] placeholder-[#8C7F75] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none transition-all"
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#14110F]">إدارة سكريبتات الرأس والذيل (Custom Scripts)</h3>
              <p className="text-xs text-[#8C7F75] mt-1">حقن أكواد التتبع مثل Google Tag Manager و Meta Pixel بدون تعديل الكود المصدري</p>
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
              className="px-4 py-2 bg-[#C5A880] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#B59362] cursor-pointer"
            >
              <FaPlus className="w-3.5 h-3.5" />
              <span>إضافة كود جديد</span>
            </button>
          </div>

          {/* Script Form Modal */}
          {scriptFormOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <form onSubmit={handleSaveScript} className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full border border-[#E6E1DC] space-y-4">
                <h4 className="font-bold text-base text-[#14110F]">{editingScriptId ? 'تعديل السكريبت' : 'إضافة سكريبت جديد'}</h4>
                <div>
                  <label className="block text-xs font-semibold text-[#5C544E] mb-1">اسم السكريبت</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs text-[#14110F] bg-white placeholder-[#8C7F75] focus:border-[#C5A880] focus:outline-none"
                    placeholder="مثال: Google Analytics 4"
                    value={scriptName}
                    onChange={(e) => setScriptName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5C544E] mb-1">موضع الحقن (Location)</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] text-xs text-[#14110F] bg-white focus:border-[#C5A880] focus:outline-none cursor-pointer"
                    value={scriptLocation}
                    onChange={(e) => setScriptLocation(e.target.value)}
                  >
                    <option value="head">داخل الرأس (Head)</option>
                    <option value="body_end">نهاية الصفحة (Body End)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5C544E] mb-1">كود HTML / JavaScript الكامل</label>
                  <textarea
                    rows={5}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E1DC] font-mono text-xs text-[#14110F] bg-[#FAF8F5] placeholder-[#8C7F75] focus:border-[#C5A880] focus:outline-none"
                    placeholder="<script>...</script>"
                    value={scriptSrc}
                    onChange={(e) => setScriptSrc(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setScriptFormOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#5C544E]"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-[#C5A880] text-white rounded-xl"
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
                لم يتم إضافة أي سكريبتات مخصصة بعد.
              </div>
            ) : (
              scripts.map((sc) => (
                <div key={sc.id} className="bg-white rounded-2xl border border-[#E6E1DC] p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] text-[#C5A880]">
                      <FaRegFileCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#14110F]">{sc.name}</h4>
                      <p className="text-[11px] text-[#8C7F75] mt-0.5">
                        الموضع: {sc.location === 'head' ? 'داخل الرأس (Head)' : 'نهاية الصفحة (Body)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleScript(sc)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        sc.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
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
                      className="p-2 text-[#5C544E] hover:bg-[#FAF8F5] rounded-lg cursor-pointer"
                    >
                      <FaPen className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteScript(sc.id)}
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
