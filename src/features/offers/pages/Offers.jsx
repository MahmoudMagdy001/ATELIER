import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { offerService } from '../services/offerService'
import SEO from '../../../components/ui/SEO'
import { PageLoading, GridSkeleton } from '../../../components/ui/Loading'
import { 
  fadeUp, 
  heroStagger, 
  staggerContainer, 
  viewportOnce, 
  springHover, 
  cardHover 
} from '../../../constants/animations'
import { FaTag, FaArrowLeft, FaLayerGroup, FaCalendarDays, FaPercent } from 'react-icons/fa6'

export default function Offers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOffers() {
      try {
        const data = await offerService.fetchPublishedOffers()
        setOffers(data)
      } catch (err) {
        console.warn('Failed to load offers:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadOffers()
  }, [])

  const getStartingPrice = (variants) => {
    if (!variants || variants.length === 0) return null
    const validPrices = variants.map(v => Number(v.price)).filter(p => !isNaN(p) && p > 0)
    if (validPrices.length === 0) return null
    return Math.min(...validPrices)
  }

  const getStartingOriginalPrice = (variants) => {
    if (!variants || variants.length === 0) return null
    const validPrices = variants.map(v => Number(v.original_price)).filter(p => !isNaN(p) && p > 0)
    if (validPrices.length === 0) return null
    return Math.min(...validPrices)
  }

  return (
    <div className="bg-transparent text-[#F2EFE8] min-h-screen font-sans" dir="rtl">
      <SEO
        title="العروض والتخفيضات الحصرية للأثاث الفاخر | ATELIER"
        description="استفد من باقات الأثاث المخفضة والخصومات الحصرية لفترة محدودة على أطقم الصالونات وغرف الطعام."
        slug="offers"
      />

      {/* Hero Header */}
      <div className="relative pt-32 pb-16 md:pt-36 md:pb-20 px-6 border-b border-[#C4A070]/20 bg-[#141110] overflow-hidden">
        {/* Ambient Brand Identity Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(196,160,112,0.15),rgba(20,17,16,0))] pointer-events-none" />

        <motion.div 
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="relative max-w-4xl mx-auto text-center space-y-6"
        >
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F2EFE8] leading-tight tracking-normal">
            العروض و<span className="gold-gradient-text">الباقات الحصرية</span> لفترة محدودة
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-[#DEDAD6] max-w-2xl mx-auto leading-relaxed md:leading-8 font-light">
            فرص استثنائية لاقتناء أفخر قطع الأثاث الإيطالي بأسعار ترويجية وباقات تأثيث متكاملة مع استشارة تصميم مجانية.
          </motion.p>
        </motion.div>
      </div>

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <GridSkeleton count={4} cols="md:grid-cols-2" />
        ) : offers.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#827771]">
            <FaTag className="w-12 h-12 mx-auto text-[#C4A070]/30 mb-3" />
            لا توجد عروض ترويجية نشطة حالياً. يرجى متابعتنا قريباً!
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {offers.map((offer, idx) => {
              const startPrice = getStartingPrice(offer.variants)
              const startOrigPrice = getStartingOriginalPrice(offer.variants)

              return (
                <motion.div
                  key={offer.id}
                  variants={fadeUp}
                  custom={idx}
                  whileHover={cardHover}
                  transition={springHover}
                >
                  <Link
                    to={`/offers/${offer.slug}`}
                    className="group rounded-3xl bg-[#141110] border border-[#C4A070]/20 overflow-hidden hover:border-[#C4A070] transition-all duration-300 flex flex-col shadow-2xl block h-full hover:shadow-[#C4A070]/10"
                  >
                    {/* Banner Image */}
                    <div className="relative aspect-[16/9] bg-[#1C1816] overflow-hidden">
                      <img
                        src={offer.cover_image || offer.banner_image || offer.variants?.[0]?.image}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {offer.discount_label && (
                        <span className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#C4A070] text-[#1C1816] shadow-xl">
                          {offer.discount_label}
                        </span>
                      )}

                      {offer.badge && (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
                          {offer.badge}
                        </span>
                      )}

                      {Array.isArray(offer.variants) && offer.variants.length > 0 && (
                        <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                          <FaLayerGroup className="w-3 h-3 text-[#C4A070]" />
                          <span>{offer.variants.length} خيارات بالعرض</span>
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold font-serif text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug">
                          {offer.title}
                        </h3>
                        <p className="text-xs text-[#827771] line-clamp-2 leading-relaxed">
                          {offer.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          {startPrice ? (
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-[#827771] block font-medium">سعر العرض يبدأ من</span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-black font-serif text-[#E3CAA9] tracking-wide">
                                  {startPrice.toLocaleString()} <span className="text-xs text-[#C4A070] font-sans font-normal">ر.س</span>
                                </span>
                                {startOrigPrice && startOrigPrice > startPrice && (
                                  <span className="text-xs text-[#827771] line-through font-mono">
                                    {startOrigPrice.toLocaleString()} ر.س
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-[#C4A070] font-bold">باقة ترويجية خاصة</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {offer.valid_until && (
                            <span className="text-[10px] text-[#827771] hidden sm:flex items-center gap-1">
                              <FaCalendarDays className="text-[#C4A070] w-3 h-3" /> حتى {offer.valid_until}
                            </span>
                          )}
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#C4A070] group-hover:translate-x-[-4px] transition-transform">
                            <span>تفاصيل العرض</span>
                            <FaArrowLeft className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
