import React from 'react'
import { Link } from 'react-router-dom'
import { useHomeData } from '../hooks/useHomeData'
import SEO from '../../../components/ui/SEO'
import { PageLoading } from '../../../components/ui/Loading'
import { AtelierMonogram } from '../../../components/ui/BrandLogo'
import heroBannerImg from '../../../assets/hero-banner.jpg'
import { 
  FaArrowLeft, 
  FaGem, 
  FaCouch, 
  FaTag, 
  FaBookOpen, 
  FaWhatsapp, 
  FaLayerGroup, 
  FaCalendarDays, 
  FaShieldHalved, 
  FaTruckFast,
  FaPhone
} from 'react-icons/fa6'

export default function Home() {
  const { products, offers, posts, categories, settings, loading } = useHomeData()

  if (loading) return <PageLoading text="جار تحميل المعرض والقطع الفاخرة..." />

  const getStartingPrice = (variants) => {
    if (!variants || variants.length === 0) return null
    const validPrices = variants.map((v) => Number(v.price)).filter((p) => !isNaN(p) && p > 0)
    if (validPrices.length === 0) return null
    return Math.min(...validPrices)
  }

  return (
    <div className="space-y-24 pb-20 bg-[#1C1816] text-[#F2EFE8] font-sans" dir="rtl">
      <SEO
        title={settings?.default_meta_title || `${settings?.site_name || 'ATELIER'} | صياغة الأثاث الفاخر والتصميم الداخلي`}
        description={settings?.default_meta_description || settings?.site_description || 'دار أثاث فاخر متخصصة في ابتكار وتصنيع القطع الحصرية للقصور والفيلات العصرية بالطلب.'}
        image={settings?.default_og_image || heroBannerImg}
      />

      {/* 1. HERO SECTION (Matching PDF Moodboard & Architecture) */}
      <section className="relative min-h-[92vh] flex items-center justify-center text-center px-6 overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBannerImg} 
            alt="ATELIER Luxury Bespoke Interior" 
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 brightness-90"
          />
          {/* Subtle Luxury Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1816] via-[#1C1816]/65 to-transparent"></div>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-7 pt-20">


          {/* Headline with Brand Serif */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#F2EFE8] leading-[1.15] drop-shadow-2xl">
            أناقة خالدة، <br />
            <span className="gold-gradient-text">مصممة خصيصاً لمساحتك</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#D6CDC4] max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            {settings?.site_description || 'نبتكر قطع أثاث فريدة وتصاميم داخلية استثنائية تعكس الفخامة المطلقة للقصور والمساحات الراقية بأيدي أمهر الحرفيين الإيطاليين والعالميين.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link to="/products" className="gold-btn-primary px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2.5 shadow-2xl">
              <span>استكشف مجموعة الأثاث</span>
              <FaArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <Link to="/offers" className="px-8 py-3.5 rounded-xl text-sm font-bold border border-[#C4A070]/50 bg-black/40 backdrop-blur-md text-[#F2EFE8] hover:bg-[#C4A070] hover:text-[#1C1816] transition-all">
              العروض الحصرية
            </Link>
          </div>
        </div>
      </section>



      {/* 3. CATEGORIES RIBBON */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="px-5 py-2.5 rounded-2xl bg-[#141110] border border-[#C4A070]/20 text-xs font-semibold text-[#D6CDC4] hover:text-[#C4A070] hover:border-[#C4A070] transition-all cursor-pointer shadow-md"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. FEATURED PRODUCTS SECTION */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6">
            <div className="space-y-2">
              <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
                <FaCouch className="w-3.5 h-3.5" /> قطع مخصصة بالطلب
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
                تشكيلة الأثاث الفاخر
              </h2>
            </div>
            <Link to="/products" className="text-xs font-bold text-[#C4A070] hover:text-[#E5C9A3] flex items-center gap-1.5">
              <span>عرض كل المنتجات ({products.length})</span>
              <FaArrowLeft className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 6).map((product) => {
              const startPrice = getStartingPrice(product.variants)

              return (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group rounded-3xl bg-[#141110] border border-[#C4A070]/20 overflow-hidden hover:border-[#C4A070] transition-all duration-300 flex flex-col shadow-xl hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] bg-[#1C1816] overflow-hidden">
                    <img
                      src={product.main_image || product.variants?.[0]?.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-[#C4A070] text-[#1C1816] shadow-md">
                        {product.badge}
                      </span>
                    )}
                    {Array.isArray(product.variants) && product.variants.length > 0 && (
                      <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                        <FaLayerGroup className="w-3 h-3 text-[#C4A070]" />
                        <span>{product.variants.length} خيارات</span>
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold font-serif text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug">
                        {product.title}
                      </h3>
                      <p className="text-xs text-[#827771] mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#827771] block">السعر</span>
                        {startPrice ? (
                          <div className="text-sm font-bold text-[#C4A070]">
                            يبدأ من {startPrice.toLocaleString()} <span className="text-[10px] text-[#B3A9A3]">ر.س</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#B3A9A3]">حسب التخصيص</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#C4A070] group-hover:translate-x-[-4px] transition-transform">
                        <span>التفاصيل</span>
                        <FaArrowLeft className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* 5. FEATURED OFFERS SECTION */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6">
            <div className="space-y-2">
              <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
                <FaTag className="w-3.5 h-3.5" /> فرص حصرية
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
                العروض والباقات المخفضة
              </h2>
            </div>
            <Link to="/offers" className="text-xs font-bold text-[#C4A070] hover:text-[#E5C9A3] flex items-center gap-1.5">
              <span>عرض كل العروض ({offers.length})</span>
              <FaArrowLeft className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.slice(0, 2).map((offer) => {
              const startPrice = getStartingPrice(offer.variants)

              return (
                <Link
                  key={offer.id}
                  to={`/offers/${offer.slug}`}
                  className="group rounded-3xl bg-[#141110] border border-[#C4A070]/20 overflow-hidden hover:border-[#C4A070] transition-all duration-300 flex flex-col shadow-2xl hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/9] bg-[#1C1816] overflow-hidden">
                    <img
                      src={offer.cover_image || offer.banner_image || offer.variants?.[0]?.image}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {offer.discount_label && (
                      <span className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#C4A070] text-[#1C1816] shadow-xl">
                        {offer.discount_label}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold font-serif text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug">
                        {offer.title}
                      </h3>
                      <p className="text-xs text-[#827771] mt-2 line-clamp-2 leading-relaxed">
                        {offer.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div>
                        {startPrice ? (
                          <div className="text-sm font-bold text-emerald-400">
                            سعر العرض يبدأ من {startPrice.toLocaleString()} <span className="text-[10px] text-[#B3A9A3]">ر.س</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#C4A070] font-bold">باقة خاصة</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#C4A070] group-hover:translate-x-[-4px] transition-transform">
                        <span>حجز العرض</span>
                        <FaArrowLeft className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* 6. CRAFTSMANSHIP & TRUST GUARANTEES */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="glass-panel-luxury rounded-3xl p-8 md:p-12 border border-[#C4A070]/20 bg-gradient-to-br from-[#141110] to-[#1C1816]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] mx-auto text-2xl">
                <FaGem />
              </div>
              <h4 className="font-bold text-base text-[#F2EFE8] font-serif">خامات نادرة ومستوردة</h4>
              <p className="text-xs text-[#827771] leading-relaxed">
                انتقاء دقيق لأخشاب الجوز الإيطالي، الرخام الإسباني الطبيعي، وأفخر أنواع الجلود والمخمل المعالج.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] mx-auto text-2xl">
                <FaShieldHalved />
              </div>
              <h4 className="font-bold text-base text-[#F2EFE8] font-serif">ضمان شامل 10 سنوات</h4>
              <p className="text-xs text-[#827771] leading-relaxed">
                ضمان متكامل على الهياكل الداخلية، متانة الأقمشة، ومقاومة التشطيبات لعوامل الزمن والاستخدام اليومي.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] mx-auto text-2xl">
                <FaTruckFast />
              </div>
              <h4 className="font-bold text-base text-[#F2EFE8] font-serif">توصيل وتركيب VIP</h4>
              <p className="text-xs text-[#827771] leading-relaxed">
                فريق هندسي متخصص يتولى نقل وتركيب وتنسيق القطع داخل قصركم بأعلى درجات العناية والاحترافية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LATEST ARCHITECTURAL BLOG POSTS */}
      {posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6">
            <div className="space-y-2">
              <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
                <FaBookOpen className="w-3.5 h-3.5" /> المجلة المعمارية
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
                أحدث الرؤى والمقالات المعمارية
              </h2>
            </div>
            <Link to="/blog" className="text-xs font-bold text-[#C4A070] hover:text-[#E5C9A3] flex items-center gap-1.5">
              <span>عرض كل المقالات ({posts.length})</span>
              <FaArrowLeft className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group rounded-3xl bg-[#141110] border border-[#C4A070]/20 overflow-hidden hover:border-[#C4A070] transition-all duration-300 flex flex-col shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#1C1816]">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C4A070]/30">
                      <FaBookOpen className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-[#C4A070]">
                      <FaCalendarDays className="w-2.5 h-2.5" />
                      <span>{new Date(post.published_at || post.created_at || Date.now()).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <h3 className="text-base font-bold font-serif text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#827771] line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#C4A070]">
                    <span>قراءة المقال</span>
                    <FaArrowLeft className="w-3 h-3 group-hover:translate-x-[-4px] transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 8. VIP BESPOKE CONSULTATION CTA */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#7A5D2B] via-[#C4A070] to-[#E5C9A3] p-10 md:p-16 text-[#1C1816] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-right max-w-xl">
            <span className="text-xs tracking-widest font-extrabold uppercase bg-black/10 px-3 py-1 rounded-full inline-block">
              VIP BESPOKE SERVICE
            </span>
            <h3 className="text-2xl md:text-4xl font-serif font-bold leading-tight">
              هل تبحث عن تأثيث مخصص لقصرك أو فيلتك؟
            </h3>
            <p className="text-xs md:text-sm font-medium text-[#2B2623] leading-relaxed">
              تواصل مباشرة مع فريق كبار المصممين المعماريين لحجز جلسة استشارية ومعاينة خامات الأخشاب والرخام الطبيعي.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="https://wa.me/966501234567?text=مرحباً%20أتيليه،%20أرغب%20في%20حجز%20جلسة%20استشارة%20معمارية%20وتأثيث%20مخصص"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl bg-[#1C1816] text-[#F2EFE8] font-bold text-xs flex items-center justify-center gap-2.5 shadow-xl hover:bg-black transition-all cursor-pointer"
            >
              <FaWhatsapp className="w-4 h-4 text-emerald-400" />
              <span>استشارة فورية عبر واتساب</span>
            </a>
            <a
              href="tel:+966501234567"
              className="px-6 py-4 rounded-2xl bg-white/30 backdrop-blur-md text-[#1C1816] font-bold text-xs flex items-center justify-center gap-2 border border-black/10 hover:bg-white/40 transition-all"
            >
              <FaPhone className="w-3.5 h-3.5" />
              <span>اتصال مباشر</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
