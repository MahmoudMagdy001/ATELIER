import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { offerService } from '../services/offerService'
import { adminService } from '../../admin/services/adminService'
import SEO from '../../../components/ui/SEO'
import { PageLoading } from '../../../components/ui/Loading'
import { 
  FaArrowRight, 
  FaWhatsapp, 
  FaCheck, 
  FaCalendarDays, 
  FaPercent, 
  FaShieldHalved, 
  FaTruckFast, 
  FaGem, 
  FaLayerGroup,
  FaPhone
} from 'react-icons/fa6'

export default function OfferDetail() {
  const { slug } = useParams()
  const [offer, setOffer] = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [activeImage, setActiveImage] = useState('')

  useEffect(() => {
    async function loadOffer() {
      setLoading(true)
      try {
        const [oData, sData] = await Promise.all([
          offerService.fetchOfferBySlug(slug),
          adminService.fetchSettings().catch(() => null)
        ])
        setOffer(oData)
        if (sData) setSettings(sData)
        if (Array.isArray(oData?.variants) && oData.variants.length > 0) {
          const first = oData.variants[0]
          setSelectedVariant(first)
          setActiveImage(first.image || oData.cover_image || oData.banner_image)
        } else {
          setActiveImage(oData?.cover_image || oData?.banner_image || '')
        }
      } catch (err) {
        console.warn('Failed to load offer:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadOffer()
  }, [slug])

  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant)
    if (variant.image) {
      setActiveImage(variant.image)
    }
  }

  if (loading) return <PageLoading text="جار تحميل تفاصيل العرض..." />

  if (!offer) {
    return (
      <div className="min-h-screen bg-[#1C1816] text-[#F2EFE8] flex items-center justify-center p-6 text-center pt-20" dir="rtl">
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-[#C4A070]">العرض غير متوفر أو قد انتهت صلاحيته</h2>
          <p className="text-xs text-[#827771]">تفضل بزيارة صفحة العروض للاطلاع على أحدث الباقات الحالية.</p>
          <Link to="/offers" className="inline-block px-5 py-2 rounded-xl bg-[#C4A070] text-[#1C1816] text-xs font-bold">
            العودة لقائمة العروض
          </Link>
        </div>
      </div>
    )
  }

  const currentPrice = Number(selectedVariant?.price) || 0
  const originalPrice = Number(selectedVariant?.original_price) || 0
  const savings = originalPrice > currentPrice ? originalPrice - currentPrice : 0

  const rawWhatsapp = (settings?.whatsapp_number || settings?.contact_whatsapp || '966501234567').replace(/[^0-9]/g, '')
  const whatsappMessage = encodeURIComponent(
    `مرحباً أتيليه، أرغب في حجز والاستفادة من العرض الحصري: "${offer.title}"` +
    (selectedVariant ? `\nالخيار المختار: ${selectedVariant.name}\nسعر العرض: ${currentPrice.toLocaleString()} ر.س` : '') +
    (offer.discount_label ? `\nكود/شارة الخصم: ${offer.discount_label}` : '') +
    `\nالرابط: ${typeof window !== 'undefined' ? window.location.href : ''}`
  )
  const whatsappUrl = `https://wa.me/${rawWhatsapp}?text=${whatsappMessage}`
  const contactPhone = settings?.contact_phone || '+966501234567'

  return (
    <div className="bg-[#1C1816] text-[#F2EFE8] min-h-screen font-sans pt-28 md:pt-32" dir="rtl">
      <SEO
        title={offer.meta_title || `${offer.title} | تخفيضات ATELIER`}
        description={offer.meta_description || offer.description}
        image={activeImage || offer.cover_image}
        slug={`offers/${offer.slug}`}
        keywords={offer.keywords}
        canonicalUrl={offer.canonical_url}
        ogTitle={offer.og_title}
        ogDescription={offer.og_description}
        ogImage={offer.og_image}
        twitterCard={offer.twitter_card}
        robotsIndex={offer.robots_index}
        robotsFollow={offer.robots_follow}
      />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#827771]">
          <Link to="/" className="hover:text-[#C4A070]">الرئيسية</Link>
          <span>/</span>
          <Link to="/offers" className="hover:text-[#C4A070]">العروض الحصرية</Link>
          <span>/</span>
          <span className="text-[#F2EFE8] font-bold truncate max-w-xs">{offer.title}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Gallery View */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl bg-[#141110] border border-[#C4A070]/30 overflow-hidden shadow-2xl">
              <img
                src={activeImage || offer.cover_image || offer.banner_image}
                alt={offer.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              
              {offer.discount_label && (
                <span className="absolute top-5 right-5 px-4 py-2 rounded-full text-xs font-extrabold bg-[#C4A070] text-[#1C1816] shadow-xl">
                  {offer.discount_label}
                </span>
              )}

              {offer.valid_until && (
                <span className="absolute bottom-5 right-5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/75 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                  <FaCalendarDays className="text-[#C4A070] w-3.5 h-3.5" />
                  <span>ينتهي العرض في: {offer.valid_until}</span>
                </span>
              )}
            </div>

            {/* Thumbnail switcher */}
            {Array.isArray(offer.variants) && offer.variants.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {(offer.cover_image || offer.banner_image) && (
                  <button
                    onClick={() => setActiveImage(offer.cover_image || offer.banner_image)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImage === (offer.cover_image || offer.banner_image) ? 'border-[#C4A070] scale-105 shadow-md shadow-[#C4A070]/20' : 'border-white/10 hover:border-white/30 opacity-70'
                    }`}
                  >
                    <img src={offer.cover_image || offer.banner_image} alt="Main" className="w-full h-full object-cover" />
                  </button>
                )}
                {offer.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelectVariant(v)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedVariant?.id === v.id ? 'border-[#C4A070] scale-105 shadow-md shadow-[#C4A070]/20' : 'border-white/10 hover:border-white/30 opacity-70'
                    }`}
                  >
                    <img src={v.image || offer.cover_image} alt={v.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Interactive Offer Variant Selector */}
          <div className="lg:col-span-5 space-y-6 bg-[#141110] p-8 rounded-3xl border border-[#C4A070]/20 shadow-xl">
            
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#C4A070] uppercase flex items-center gap-1.5">
                <FaPercent className="w-3 h-3" /> ATELIER PROMOTIONAL OFFER
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#F2EFE8] mt-1 leading-snug">
                {offer.title}
              </h1>
            </div>

            {/* Dynamic Active Price & Savings Box */}
            <div className="p-4 rounded-2xl bg-[#1C1816] border border-[#C4A070]/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#827771] block font-medium">سعر العرض للخيار المحدد</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-serif font-black text-[#E3CAA9] tracking-wide">
                      {currentPrice > 0 ? (
                        <>
                          {currentPrice.toLocaleString()} <span className="text-sm text-[#C4A070] font-sans font-normal">ر.س</span>
                        </>
                      ) : (
                        <span className="text-base text-[#B3A9A3]">حسب الباقة</span>
                      )}
                    </span>
                    {originalPrice > currentPrice && (
                      <span className="text-sm text-[#827771] line-through font-mono">
                        {originalPrice.toLocaleString()} ر.س
                      </span>
                    )}
                  </div>
                </div>

                {savings > 0 && (
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#C4A070]/20 text-[#F0DEC8] border border-[#C4A070]/40 shadow-md">
                    وفر {savings.toLocaleString()} ر.س
                  </span>
                )}
              </div>
            </div>

            {/* Offer Description */}
            <p className="text-xs md:text-sm text-[#B3A9A3] leading-relaxed">
              {offer.description}
            </p>

            {/* Interactive Variants Selector */}
            {Array.isArray(offer.variants) && offer.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                  <FaLayerGroup className="text-[#C4A070] w-3.5 h-3.5" />
                  <span>اختر الباقة / المقاس المشمول بالعرض:</span>
                </label>

                <div className="grid gap-2.5">
                  {offer.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id
                    const vPrice = Number(variant.price) || 0
                    const vOrig = Number(variant.original_price) || 0

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

                        <div className="text-left">
                          <span className="text-sm font-black font-serif text-[#E3CAA9] block">
                            {vPrice.toLocaleString()} <span className="text-[10px] text-[#C4A070] font-sans font-normal">ر.س</span>
                          </span>
                          {vOrig > vPrice && (
                            <span className="text-[10px] text-[#827771] line-through block font-mono">
                              {vOrig.toLocaleString()} ر.س
                            </span>
                          )}
                        </div>
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
                <span>حجز العرض وتثبيت الخصم عبر واتساب</span>
              </a>

              <a
                href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[#F2EFE8] border border-white/10 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <FaPhone className="w-3.5 h-3.5 text-[#C4A070]" />
                <span>استفسار هاتفي فوري</span>
              </a>
            </div>

            {/* Atelier Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-white/5 text-[10px] text-[#827771]">
              <div className="space-y-1">
                <FaGem className="w-4 h-4 mx-auto text-[#C4A070]" />
                <p>ضمان شامل ومطابقة</p>
              </div>
              <div className="space-y-1">
                <FaShieldHalved className="w-4 h-4 mx-auto text-[#C4A070]" />
                <p>استشارة 3D مجانية</p>
              </div>
              <div className="space-y-1">
                <FaTruckFast className="w-4 h-4 mx-auto text-[#C4A070]" />
                <p>شحن وتوصيل فوري</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
