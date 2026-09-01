import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productService } from '../services/productService'
import SEO from '../../../components/ui/SEO'
import { PageLoading } from '../../../components/ui/Loading'
import { 
  FaArrowRight, 
  FaWhatsapp, 
  FaCheck, 
  FaShieldHalved, 
  FaTruckFast, 
  FaGem, 
  FaShareNodes, 
  FaLayerGroup,
  FaPhone
} from 'react-icons/fa6'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [activeImage, setActiveImage] = useState('')

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        const data = await productService.fetchProductBySlug(slug)
        setProduct(data)
        if (Array.isArray(data?.variants) && data.variants.length > 0) {
          const first = data.variants[0]
          setSelectedVariant(first)
          setActiveImage(first.image || data.main_image)
        } else {
          setActiveImage(data?.main_image || '')
        }
      } catch (err) {
        console.warn('Failed to load product:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [slug])

  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant)
    if (variant.image) {
      setActiveImage(variant.image)
    }
  }

  if (loading) return <PageLoading text="جار تحميل مواصفات القطعة..." />

  if (!product) {
    return (
      <div className="min-h-screen bg-[#1C1816] text-[#F2EFE8] flex items-center justify-center p-6 text-center pt-20" dir="rtl">
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-[#C4A070]">المنتج غير متوفر</h2>
          <p className="text-xs text-[#827771]">قد يكون تم نقل القطعة أو تعديل رابطها.</p>
          <Link to="/products" className="inline-block px-5 py-2 rounded-xl bg-[#C4A070] text-[#1C1816] text-xs font-bold">
            العودة لكتالوج المنتجات
          </Link>
        </div>
      </div>
    )
  }

  const currentPrice = selectedVariant?.price || 0
  const whatsappNumber = '966501234567'
  const whatsappMessage = encodeURIComponent(
    `مرحباً أتيليه، أود الاستفسار وحجز القطعة الفاخرة: "${product.title}"` +
    (selectedVariant ? `\nالخيار المحدد: ${selectedVariant.name}\nالسعر: ${currentPrice.toLocaleString()} ر.س` : '') +
    `\nالرابط: ${typeof window !== 'undefined' ? window.location.href : ''}`
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div className="bg-[#1C1816] text-[#F2EFE8] min-h-screen font-sans pt-20" dir="rtl">
      <SEO
        title={product.meta_title || `${product.title} | ATELIER`}
        description={product.meta_description || product.description}
        image={activeImage || product.main_image}
        slug={`products/${product.slug}`}
        keywords={product.keywords}
        canonicalUrl={product.canonical_url}
        ogTitle={product.og_title}
        ogDescription={product.og_description}
        ogImage={product.og_image}
        twitterCard={product.twitter_card}
        robotsIndex={product.robots_index}
        robotsFollow={product.robots_follow}
      />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#827771]">
          <Link to="/" className="hover:text-[#C4A070]">الرئيسية</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#C4A070]">المنتجات</Link>
          <span>/</span>
          <span className="text-[#F2EFE8] font-bold truncate max-w-xs">{product.title}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Gallery View */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl bg-[#141110] border border-[#C4A070]/30 overflow-hidden shadow-2xl">
              <img
                src={activeImage || product.main_image}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {product.badge && (
                <span className="absolute top-5 right-5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#C4A070] text-[#1C1816] shadow-lg">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail switcher for all variants and main image */}
            {Array.isArray(product.variants) && product.variants.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.main_image && (
                  <button
                    onClick={() => setActiveImage(product.main_image)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImage === product.main_image ? 'border-[#C4A070] scale-105 shadow-md shadow-[#C4A070]/20' : 'border-white/10 hover:border-white/30 opacity-70'
                    }`}
                  >
                    <img src={product.main_image} alt="Main" className="w-full h-full object-cover" />
                  </button>
                )}
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelectVariant(v)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedVariant?.id === v.id ? 'border-[#C4A070] scale-105 shadow-md shadow-[#C4A070]/20' : 'border-white/10 hover:border-white/30 opacity-70'
                    }`}
                  >
                    <img src={v.image || product.main_image} alt={v.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Interactive Variant Selector */}
          <div className="lg:col-span-5 space-y-6 bg-[#141110] p-8 rounded-3xl border border-[#C4A070]/20 shadow-xl">
            
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#C4A070] uppercase">
                ATELIER BESPOKE CREATION
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#F2EFE8] mt-1 leading-snug">
                {product.title}
              </h1>
            </div>

            {/* Dynamic Active Price */}
            <div className="p-4 rounded-2xl bg-[#1C1816] border border-[#C4A070]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#827771] block">السعر للخيارات المحددة</span>
                <div className="text-2xl font-serif font-bold text-[#C4A070]">
                  {currentPrice > 0 ? (
                    <>
                      {Number(currentPrice).toLocaleString()} <span className="text-sm text-[#B3A9A3] font-sans">ر.س</span>
                    </>
                  ) : (
                    <span className="text-base text-[#B3A9A3]">حسب التخصيص والمقاس</span>
                  )}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                شامل التصنيع والضمان
              </span>
            </div>

            {/* Product Description */}
            <p className="text-xs md:text-sm text-[#B3A9A3] leading-relaxed">
              {product.description}
            </p>

            {/* Interactive Variants Selector */}
            {Array.isArray(product.variants) && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                  <FaLayerGroup className="text-[#C4A070] w-3.5 h-3.5" />
                  <span>اختر المقاس / اللون / الخامة:</span>
                </label>

                <div className="grid gap-2.5">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => handleSelectVariant(variant)}
                        className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#C4A070]/15 border-[#C4A070] text-[#F2EFE8] shadow-lg shadow-[#C4A070]/10 ring-1 ring-[#C4A070]'
                            : 'bg-[#1C1816]/60 border-white/5 text-[#B3A9A3] hover:border-[#C4A070]/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-[#C4A070] bg-[#C4A070]' : 'border-white/30'
                          }`}>
                            {isSelected && <FaCheck className="w-2.5 h-2.5 text-[#1C1816]" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold block text-[#F2EFE8]">{variant.name}</span>
                            {variant.sku && <span className="text-[10px] text-[#827771] font-mono">SKU: {variant.sku}</span>}
                          </div>
                        </div>

                        <span className="text-xs font-bold text-[#C4A070]">
                          {Number(variant.price).toLocaleString()} ر.س
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>طلب القطعة عبر واتساب مباشرة</span>
              </a>

              <a
                href="tel:+966501234567"
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[#F2EFE8] border border-white/10 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <FaPhone className="w-3.5 h-3.5 text-[#C4A070]" />
                <span>استشارة مع كبير المصممين</span>
              </a>
            </div>

            {/* Atelier Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-white/5 text-[10px] text-[#827771]">
              <div className="space-y-1">
                <FaGem className="w-4 h-4 mx-auto text-[#C4A070]" />
                <p>خامات إيطالية طبيعية</p>
              </div>
              <div className="space-y-1">
                <FaShieldHalved className="w-4 h-4 mx-auto text-[#C4A070]" />
                <p>ضمان شامل 10 سنوات</p>
              </div>
              <div className="space-y-1">
                <FaTruckFast className="w-4 h-4 mx-auto text-[#C4A070]" />
                <p>توصيل وتركيب VIP</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
