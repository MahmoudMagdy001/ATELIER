import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useHomeData } from '../hooks/useHomeData'
import SEO from '../../../components/ui/SEO'
import LuxuryStatsSection from '../components/LuxuryStatsSection'
import heroBannerImg from '../../../assets/hero-banner.jpg'
import { 
  fadeUp, 
  staggerContainer, 
  heroStagger, 
  viewportOnce, 
  springHover,
  cardHover,
  hoverScale,
  tapScale
} from '../../../constants/animations'
import { CONTACT_INFO } from '../../../constants/contactInfo'
import { 
  FaArrowLeft, 
  FaGem, 
  FaCouch, 
  FaShieldHalved, 
  FaTruckFast,
  FaWhatsapp,
  FaPhone,
  FaCompass,
  FaAward,
  FaTimeline,
  FaXmark,
  FaImages,
  FaArrowUpRightFromSquare,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaLayerGroup
} from 'react-icons/fa6'

export default function Home() {
  const { products, portfolio, categories: rawProductCategories, settings } = useHomeData()
  const [selectedImage, setSelectedImage] = useState(null)
  const [activePortfolioCategory, setActivePortfolioCategory] = useState('all')
  const [portfolioPage, setPortfolioPage] = useState(0)
  const ITEMS_PER_PAGE = 6

  const rawWhatsapp = CONTACT_INFO.whatsappRaw
  const primaryPhone = CONTACT_INFO.phone

  // Filter portfolio
  const categories = ['all', ...new Set(portfolio.map(item => item.category?.trim()).filter(Boolean))]
  const filteredPortfolio = activePortfolioCategory === 'all'
    ? portfolio
    : portfolio.filter(item => item.category?.trim() === activePortfolioCategory.trim())

  const totalPages = Math.ceil(filteredPortfolio.length / ITEMS_PER_PAGE)
  const paginatedPortfolio = filteredPortfolio.slice(
    portfolioPage * ITEMS_PER_PAGE,
    (portfolioPage + 1) * ITEMS_PER_PAGE
  )

  const handleCategoryChange = (cat) => {
    setActivePortfolioCategory(cat)
    setPortfolioPage(0)
  }

  // Categories for Limited Edition pieces
  const displayProductCategories = [...(rawProductCategories || [])]
    .filter(cat => !cat.type || cat.type === 'products')
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))

  return (
    <div className="space-y-24 pb-20 bg-transparent text-[#F2EFE8] font-sans" dir="rtl">
      <SEO
        title={settings?.default_meta_title || 'S&I Atelier | قطع حصرية وتنفيذ حسب الطلب'}
        description={settings?.default_meta_description || 'دار أثاث فاخر متخصصة في ابتكار وتصنيع القطع الحصرية ذات الإصدار المحدود وتنفيذ التصاميم حسب الطلب لأرقى القصور والفيلات.'}
        image={settings?.default_og_image || heroBannerImg}
      />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[94vh] flex items-center justify-center text-center px-6 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.12, opacity: 0.8 }}
          animate={{ scale: 1.03, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={heroBannerImg} 
            alt="S&I Atelier Luxury Bespoke Furniture" 
            className="w-full h-full object-cover object-center brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1816] via-[#1C1816]/70 to-black/35"></div>
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.8px]"></div>
        </motion.div>

        <motion.div 
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl mx-auto space-y-7 pt-28 pb-12"
        >
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#F2EFE8] leading-[1.15] drop-shadow-2xl">
            أناقة معمارية خالدة، <br />
            <span className="gold-gradient-text">مصممة خصيصاً لذوقك الرفيع</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-[#E3CAA9]/90 max-w-2xl mx-auto leading-relaxed md:leading-8 drop-shadow-md font-light">
            دار متخصصة في ابتكار وتصنيع القطع الحصرية ذات الإصدار المحدود، وخدمة تنفيذ التصاميم المخصصة للقصور والفيلات العصرية بأيدي كبار الحرفيين.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/limited-edition"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full gold-btn-primary text-xs font-bold flex items-center justify-center gap-2.5 shadow-xl transition-all"
            >
              <span>استكشف قطع الإصدار المحدود</span>
              <FaArrowLeft className="w-3 h-3" />
            </Link>

            <Link
              to="/bespoke"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full gold-btn-secondary text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>خدمة التنفيذ حسب الطلب</span>
              <FaArrowLeft className="w-3 h-3 text-[#C4A070]" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. BRAND VALUES RIBBON */}
      <section className="border-y border-[#C4A070]/20 bg-gradient-to-r from-[#141110] via-[#1C1816] to-[#141110] py-6 shadow-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x md:divide-x-reverse divide-[#C4A070]/15">
            <div className="space-y-1">
              <span className="font-serif text-sm md:text-base font-extrabold tracking-[0.25em] text-[#C4A070] block uppercase" dir="ltr">
                LUXURY
              </span>
              <p className="text-[11px] text-[#B3A9A3]">فخامة أرستقراطية نقية بلا تكلف</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-sm md:text-base font-extrabold tracking-[0.25em] text-[#C4A070] block uppercase" dir="ltr">
                MINIMAL
              </span>
              <p className="text-[11px] text-[#B3A9A3]">خطوط معمارية هادئة ومتزنة</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-sm md:text-base font-extrabold tracking-[0.25em] text-[#C4A070] block uppercase" dir="ltr">
                TIMELESS
              </span>
              <p className="text-[11px] text-[#B3A9A3]">أصالة تتجاوز الصيحات العابرة</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-sm md:text-base font-extrabold tracking-[0.25em] text-[#C4A070] block uppercase" dir="ltr">
                BESPOKE
              </span>
              <p className="text-[11px] text-[#B3A9A3]">تفصيل دقيق يطابق رؤيتك 100%</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US & PHILOSOPHY (من نحن) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6"
      >
        <div className="rounded-3xl bg-[#141110] border border-[#C4A070]/20 p-8 sm:p-12 md:p-16 space-y-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <motion.div variants={fadeUp} className="lg:col-span-7 space-y-6">
              <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
                <FaCompass className="w-3.5 h-3.5" /> عن الدار ورؤيتنا
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F2EFE8] leading-tight">
                دار <span className="gold-gradient-text">S&I Atelier</span> صياغة الفخامة الخالدة
              </h2>
              <div className="space-y-4 text-sm md:text-base text-[#DEDAD6] leading-loose font-light">
                <p>
                  تأسست <strong className="text-[#C4A070] font-bold">S&I Atelier</strong> كدار رائدة في مجال الأثاث الفاخر والتصميم الداخلي المعماري، نجمع بين عراقة الحرفية اليدوية وأحدث خطوط التصميم الإيطالي المعاصر.
                </p>
                <p>
                  نؤمن بأن كل قصر وفيلا تمثل عملاً معمارياً فريداً؛ لذا لا نعتمد الإنتاج التجاري النمطي المتكرر، بل نبتكر لكل عميل قطعاً استثنائية تُصنع يدوياً من أندر أنواع خشب الجوز المعتق والرخام الأوروبي الطبيعي وأفخر أنواع الجلود والأقمشة.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/bespoke"
                  className="px-6 py-3 rounded-full gold-btn-primary text-xs font-bold inline-flex items-center gap-2"
                >
                  <span>تعرّف على خدمة التنفيذ حسب الطلب</span>
                  <FaArrowLeft className="w-3 h-3" />
                </Link>
                <a
                  href={`https://wa.me/${rawWhatsapp}?text=${encodeURIComponent('مرحباً S&I Atelier، أود الاستفسار عن تفصيل أثاث خاص لقصر أو فيلا')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full gold-btn-secondary text-xs font-bold inline-flex items-center gap-2"
                >
                  <FaWhatsapp className="w-4 h-4 text-[#C4A070]" />
                  <span>تواصل عبر واتساب</span>
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#C4A070]/20 space-y-2">
                <span className="text-3xl font-serif font-bold text-[#C4A070]">100%</span>
                <h4 className="text-sm font-bold text-[#F2EFE8]">صناعة يدوية</h4>
                <p className="text-xs text-[#827771] leading-relaxed">تشكيل ونحت يدوي بأيدي كبار الحرفيين المحترفين.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#C4A070]/20 space-y-2">
                <span className="text-3xl font-serif font-bold text-[#C4A070]">10+</span>
                <h4 className="text-sm font-bold text-[#F2EFE8]">سنوات ضمان</h4>
                <p className="text-xs text-[#827771] leading-relaxed">ضمان شامل معتمد على جودة الهياكل ومتانة الأقمشة.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#C4A070]/20 space-y-2">
                <span className="text-3xl font-serif font-bold text-[#C4A070]">VIP</span>
                <h4 className="text-sm font-bold text-[#F2EFE8]">خدمة القصور</h4>
                <p className="text-xs text-[#827771] leading-relaxed">فريق استشاري وهندسي متخصص يتولى التركيب والتنسيق.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#C4A070]/20 space-y-2">
                <span className="text-3xl font-serif font-bold text-[#C4A070]">01/01</span>
                <h4 className="text-sm font-bold text-[#F2EFE8]">قطع حصرية</h4>
                <p className="text-xs text-[#827771] leading-relaxed">إصدارات محدودة تمنح مساحتك تفرداً لا يتكرر في مكان آخر.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 4. VISION & BRAND STORY (الرؤية وتاريخ العلامة) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 space-y-12"
      >
        <motion.div variants={fadeUp} className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center justify-center gap-2">
            <FaAward className="w-3.5 h-3.5" /> الرؤية ومسيرة التميز
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
            تاريخ العلامة ورؤيتنا للمستقبل
          </h2>
          <p className="text-sm text-[#DEDAD6]/80 leading-relaxed font-light">
            انطلقت S&I Atelier برؤية واضحة: إعادة تعريف مفهوم التأثيث الفاخر من مجرد شراء أثاث إلى ابتكار أعمال فنية معمارية تحاكي روح المكان.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] font-serif font-bold text-lg">
              01
            </div>
            <h3 className="font-serif text-xl font-bold text-[#F2EFE8]">النشأة والشغف</h3>
            <p className="text-xs text-[#827771] leading-relaxed">
              بدأت رحلتنا من شغف عائلي بالتصاميم الإيطالية والحرفية اليدوية، لنؤسس صرحاً يلبي تطلعات أصحاب الذوق الرفيع والباحثين عن التميز الحقيقي.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] font-serif font-bold text-lg">
              02
            </div>
            <h3 className="font-serif text-xl font-bold text-[#F2EFE8]">التطوير والابتكار</h3>
            <p className="text-xs text-[#827771] leading-relaxed">
              طوّرنا شراكات مباشرة مع أشهر مقالع الرخام الأوروبي وأعرق ورش النجارة بإيطاليا، مع توظيف أحدث التقنيات الهندسية في دمج الخامات الطبيعية.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] font-serif font-bold text-lg">
              03
            </div>
            <h3 className="font-serif text-xl font-bold text-[#F2EFE8]">الريادة والحصرية</h3>
            <p className="text-xs text-[#827771] leading-relaxed">
              نقف اليوم كوجهة أولى لتأثيث أرقى القصور والفيلات، مقدمين حلولاً استشارية متكاملة تبدأ من المخطط المعماري وحتى تسليم المفتاح.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* 5. SERVICES DUAL CARDS (الخدمتان الأساسيتان) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 space-y-10"
      >
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6">
          <div className="space-y-2">
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
              <FaGem className="w-3.5 h-3.5" /> المنتجات والخدمات
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
              ركائز S&I Atelier الرئيسية
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Limited Edition */}
          <motion.div 
            variants={fadeUp}
            whileHover={cardHover}
            transition={springHover}
            className="rounded-3xl bg-[#141110] border border-[#C4A070]/25 overflow-hidden p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-2xl relative group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] text-xl">
                <FaCouch />
              </div>
              <span className="text-[11px] font-bold text-[#C4A070] uppercase tracking-widest block">01 • LIMITED EDITION</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors">
                مجموعة قطع ذات إصدار محدود
              </h3>
              <p className="text-xs sm:text-sm text-[#DEDAD6]/80 leading-relaxed font-light">
                تشكيلات متفردة تُصنع بأعداد محدودة جداً حول العالم. كل قطعة تحمل بصمة حرفية استثنائية وتعتبر استثماراً جمالياً فاخراً يضفي على مساحتك هيبة معمارية لا نظير لها.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#827771]">تصفح التشكيلة الحالية ({products?.length || 0} قطع)</span>
              <Link
                to="/limited-edition"
                className="px-5 py-2.5 rounded-full gold-btn-primary text-xs font-bold flex items-center gap-2"
              >
                <span>استعراض القطع</span>
                <FaArrowLeft className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Bespoke Service */}
          <motion.div 
            variants={fadeUp}
            whileHover={cardHover}
            transition={springHover}
            className="rounded-3xl bg-[#141110] border border-[#C4A070]/25 overflow-hidden p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-2xl relative group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] text-xl">
                <FaGem />
              </div>
              <span className="text-[11px] font-bold text-[#C4A070] uppercase tracking-widest block">02 • BESPOKE CREATION</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors">
                تنفيذ التصاميم حسب الطلب
              </h3>
              <p className="text-xs sm:text-sm text-[#DEDAD6]/80 leading-relaxed font-light">
                خدمة حصرية مخصصة لأصحاب القصور والفيلات؛ نقوم بتنفيذ أثاثك بمقاسات وألوان وخامات يتم اختيارها بالمليمتر وفقاً للمخططات المعمارية مع استشارات خاصة في موقعك.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#827771]">تفصيل خاص 100%</span>
              <Link
                to="/bespoke"
                className="px-5 py-2.5 rounded-full gold-btn-secondary text-xs font-bold flex items-center gap-2"
              >
                <span>تفاصيل الخدمة والطلب</span>
                <FaArrowLeft className="w-3 h-3 text-[#C4A070]" />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 6. LIMITED EDITION CATEGORIES (أقسام وتصنيفات الإصدار المحدود) */}
      {displayProductCategories.length > 0 && (
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 space-y-10"
        >
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6">
            <div className="space-y-2">
              <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
                <FaLayerGroup className="w-3.5 h-3.5" /> أقسام وتصنيفات الدار
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
                مجموعات <span className="gold-gradient-text">الإصدار المحدود</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#DEDAD6]/80 max-w-2xl font-light">
                استكشف تشكيلات الأثاث المعماري المصنفة بعناية فائقة لتلبي أرقى متطلبات القصور والفيلات العصرية.
              </p>
            </div>

            <Link
              to="/limited-edition"
              className="text-xs font-bold text-[#C4A070] hover:text-[#E5C9A3] flex items-center gap-1.5 transition-colors group shrink-0 self-start sm:self-auto pb-1"
            >
              <span>استعراض كافة القطع</span>
              <FaArrowLeft className="w-3 h-3 group-hover:translate-x-[-4px] transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProductCategories.map((cat, idx) => {
              const prodCount = products.filter(p => p.category_id === cat.id).length
              const catImage = cat.image_url || products.find(p => p.category_id === cat.id && p.main_image)?.main_image || heroBannerImg

              return (
                <motion.div
                  key={cat.id || idx}
                  variants={fadeUp}
                  whileHover={cardHover}
                  transition={springHover}
                  className="group relative rounded-3xl overflow-hidden border border-[#C4A070]/20 bg-[#141110] shadow-2xl flex flex-col justify-end min-h-[380px] sm:min-h-[420px] transition-all duration-500 hover:border-[#C4A070]/60 hover:shadow-[0_20px_50px_rgba(196,160,112,0.15)]"
                >
                  {/* Background Category Image with Vignette & Hover Zoom */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img 
                      src={catImage} 
                      alt={cat.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out brightness-[0.75] group-hover:brightness-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141110] via-[#141110]/60 to-black/25 group-hover:via-[#141110]/40 transition-colors duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Bottom Content Information */}
                  <div className="relative z-10 p-6 sm:p-7 space-y-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug">
                      {cat.name}
                    </h3>

                    {cat.description && (
                      <p className="text-xs text-[#DEDAD6]/80 leading-relaxed font-light line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  {/* Invisible Overlay Link to Category Filter */}
                  <Link 
                    to={`/limited-edition?category=${cat.slug || cat.id}`} 
                    className="absolute inset-0 z-20"
                    aria-label={`تصفح قسم ${cat.name}`}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.section>
      )}

      {/* 7. PORTFOLIO GALLERY (معرض أسبقيات الأعمال) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 space-y-8"
      >
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6">
          <div className="space-y-2">
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
              <FaImages className="w-3.5 h-3.5" /> أسبقيات الأعمال
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
              معرض المشاريع والأعمال السابقة
            </h2>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activePortfolioCategory === cat
                      ? 'bg-[#C4A070] text-[#1C1816]'
                      : 'bg-white/5 text-[#B3A9A3] hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'كافة الأعمال' : cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {filteredPortfolio.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#141110] border border-[#C4A070]/20 text-center space-y-3">
            <FaImages className="w-10 h-10 text-[#C4A070]/30 mx-auto" />
            <h4 className="text-sm font-bold text-[#F2EFE8]">لا توجد أعمال ضمن هذا القسم حالياً</h4>
            <p className="text-xs text-[#827771]">اختر تصنيفاً آخر أو استعرض كافة الأعمال.</p>
          </div>
        ) : (
          <div className="space-y-6 relative px-2 sm:px-12 lg:px-16">
            {/* Relative wrapper for Grid and Side Floating Arrows */}
            <div className="relative">
              {/* Right Side Arrow */}
              {totalPages > 1 && (
                <button
                  onClick={() => setPortfolioPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={portfolioPage >= totalPages - 1}
                  className="absolute -right-2 sm:-right-10 lg:-right-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#C4A070]/40 bg-[#141110]/95 backdrop-blur-md text-[#C4A070] flex items-center justify-center hover:bg-[#C4A070] hover:text-[#141110] transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer shadow-2xl hover:scale-105"
                  aria-label="الصفحة التالية"
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Left Side Arrow */}
              {totalPages > 1 && (
                <button
                  onClick={() => setPortfolioPage(prev => Math.max(0, prev - 1))}
                  disabled={portfolioPage === 0}
                  className="absolute -left-2 sm:-left-10 lg:-left-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#C4A070]/40 bg-[#141110]/95 backdrop-blur-md text-[#C4A070] flex items-center justify-center hover:bg-[#C4A070] hover:text-[#141110] transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer shadow-2xl hover:scale-105"
                  aria-label="الصفحة السابقة"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>
              )}

              <motion.div 
                key={`${activePortfolioCategory}-${portfolioPage}`}
                variants={staggerContainer} 
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedPortfolio.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    variants={fadeUp}
                    custom={idx}
                    whileHover={{ y: -6 }}
                    transition={springHover}
                    className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#141110] border border-[#C4A070]/20 hover:border-[#C4A070] cursor-pointer shadow-xl"
                    onClick={() => setSelectedImage(item)}
                  >
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141110] via-[#141110]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute bottom-0 inset-x-0 p-6 space-y-1">
                      {item.category && (
                        <span className="text-[10px] font-bold text-[#C4A070] uppercase tracking-wider block">
                          {item.category}
                        </span>
                      )}
                      <h3 className="font-serif text-lg font-bold text-[#F2EFE8] leading-snug">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-[#DEDAD6]/80 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#C4A070] opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaArrowUpRightFromSquare className="w-3 h-3" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Pagination Indicators centered below */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                {Array.from({ length: totalPages }).map((_, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setPortfolioPage(pIdx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      portfolioPage === pIdx
                        ? 'w-8 bg-[#C4A070]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`الانتقال إلى الصفحة ${pIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </motion.section>

      {/* Lightbox Modal for Portfolio Image (Rendered in Portal to center in viewport) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full max-h-[90vh] bg-[#141110] border border-[#C4A070]/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto"
              >
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#C4A070] hover:text-[#1C1816] transition-colors cursor-pointer"
                  aria-label="إغلاق"
                >
                  <FaXmark className="w-4 h-4" />
                </button>
                <div className="flex-1 overflow-hidden flex items-center justify-center bg-black/60 p-2">
                  <img 
                    src={selectedImage.image_url} 
                    alt={selectedImage.title}
                    className="max-w-full max-h-[65vh] object-contain"
                  />
                </div>
                <div className="p-6 space-y-2 border-t border-white/10 bg-[#141110] shrink-0 text-right" dir="rtl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-[#F2EFE8]">{selectedImage.title}</h3>
                    {selectedImage.category && (
                      <span className="text-xs px-3 py-1 rounded-full bg-[#C4A070]/20 text-[#C4A070] font-bold">
                        {selectedImage.category}
                      </span>
                    )}
                  </div>
                  {selectedImage.description && (
                    <p className="text-xs text-[#DEDAD6]/80 leading-relaxed">{selectedImage.description}</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* 7. CRAFTSMANSHIP & TRUST GUARANTEES */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="max-w-7xl mx-auto px-6"
      >
        <div className="glass-panel-luxury rounded-3xl p-8 md:p-12 border border-[#C4A070]/20 bg-gradient-to-br from-[#141110] to-[#1C1816]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] mx-auto text-2xl">
                <FaGem />
              </div>
              <h4 className="font-bold text-base text-[#F2EFE8] font-serif">خامات نادرة ومستوردة</h4>
              <p className="text-xs text-[#B3A9A3] leading-relaxed">
                انتقاء دقيق لأخشاب الجوز الإيطالي، الرخام الإسباني الطبيعي، وأفخر أنواع الجلود والمخمل المعالج.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] mx-auto text-2xl">
                <FaShieldHalved />
              </div>
              <h4 className="font-bold text-base text-[#F2EFE8] font-serif">ضمان شامل 10 سنوات</h4>
              <p className="text-xs text-[#B3A9A3] leading-relaxed">
                ضمان متكامل على الهياكل الداخلية، متانة الأقمشة، ومقاومة التشطيبات لعوامل الزمن والاستخدام اليومي.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] mx-auto text-2xl">
                <FaTruckFast />
              </div>
              <h4 className="font-bold text-base text-[#F2EFE8] font-serif">توصيل وتركيب VIP</h4>
              <p className="text-xs text-[#B3A9A3] leading-relaxed">
                فريق هندسي متخصص يتولى نقل وتركيب وتنسيق القطع داخل قصركم بأعلى درجات العناية والاحترافية.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 8. LUXURY STATS & ACHIEVEMENTS */}
      <LuxuryStatsSection />
    </div>
  )
}
