import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
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

import type { Offer, OfferVariant } from '../../../types/database'

export default function Offers() {
  const { t, i18n } = useTranslation('offers')
  const isEn = i18n.language?.startsWith('en')

  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadOffers() {
      try {
        const data = await offerService.fetchPublishedOffers()
        setOffers(data)
      } catch (err: unknown) {
        console.warn('Failed to load offers:', (err as Error)?.message || err)
      } finally {
        setLoading(false)
      }
    }
    loadOffers()
  }, [])

  const getStartingPrice = (variants?: OfferVariant[]) => {
    if (!variants || variants.length === 0) return null
    const validPrices = variants.map(v => Number(v.price)).filter(p => !isNaN(p) && p > 0)
    if (validPrices.length === 0) return null
    return Math.min(...validPrices)
  }

  const getStartingOriginalPrice = (variants?: OfferVariant[]) => {
    if (!variants || variants.length === 0) return null
    const validPrices = variants.map(v => Number(v.original_price)).filter(p => !isNaN(p) && p > 0)
    if (validPrices.length === 0) return null
    return Math.min(...validPrices)
  }

  return (
    <div className="bg-transparent text-[#F2EFE8] min-h-screen font-sans">
      <SEO
        title={t('meta_title')}
        description={t('meta_description')}
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
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight tracking-normal">
            <span className="gold-gradient-text inline-block">
              {t('hero_title_pre')} {t('hero_title_highlight')}{t('hero_title_post') ? ` ${t('hero_title_post')}` : ''}
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-[#DEDAD6] max-w-2xl mx-auto leading-relaxed md:leading-8 font-light">
            {t('hero_desc')}
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
            {t('empty_state')}
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start"
          >
            {offers.map((offer, idx) => {
              const startPrice = getStartingPrice(offer.variants)
              const startOrigPrice = getStartingOriginalPrice(offer.variants)
              const oTitle = isEn ? (offer.title_en || offer.title) : offer.title
              const oDesc = isEn ? (offer.description_en || offer.description) : offer.description
              const oDiscount = isEn ? (offer.discount_label_en || offer.discount_label) : offer.discount_label
              const oBadge = isEn ? (offer.badge_en || offer.badge) : offer.badge

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
                    className="group rounded-3xl bg-[#141110] border border-[#C4A070]/20 overflow-hidden hover:border-[#C4A070] transition-all duration-300 flex flex-col shadow-2xl block h-full hover:shadow-[#C4A070]/10 text-start"
                  >
                    {/* Banner Image */}
                    <div className="relative aspect-[16/9] bg-[#1C1816] overflow-hidden">
                      <img
                        src={offer.cover_image || offer.banner_image || offer.variants?.[0]?.image || ''}
                        alt={oTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {oDiscount && (
                        <span className="absolute top-4 end-4 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#C4A070] text-[#1C1816] shadow-xl">
                          {oDiscount}
                        </span>
                      )}

                      {oBadge && (
                        <span className="absolute top-4 start-4 px-3 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
                          {oBadge}
                        </span>
                      )}

                      {Array.isArray(offer.variants) && offer.variants.length > 0 && (
                        <span className="absolute bottom-4 start-4 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                          <FaLayerGroup className="w-3 h-3 text-[#C4A070]" />
                          <span>{t('options_count', { count: offer.variants.length })}</span>
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold font-serif text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug">
                          {oTitle}
                        </h3>
                        <p className="text-xs text-[#827771] line-clamp-2 leading-relaxed">
                          {oDesc}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          {startPrice ? (
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-[#827771] block font-medium">{t('starts_from')}</span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-black font-serif text-[#E3CAA9] tracking-wide">
                                  {startPrice.toLocaleString(isEn ? 'en-US' : 'ar-SA')} <span className="text-xs text-[#C4A070] font-sans font-normal">{t('sar')}</span>
                                </span>
                                {startOrigPrice && startOrigPrice > startPrice && (
                                  <span className="text-xs text-[#827771] line-through font-serif">
                                    {startOrigPrice.toLocaleString(isEn ? 'en-US' : 'ar-SA')} {t('sar')}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-[#C4A070] font-bold">{t('special_promo')}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {offer.valid_until && (
                            <span className="text-[10px] text-[#827771] hidden sm:flex items-center gap-1">
                              <FaCalendarDays className="text-[#C4A070] w-3 h-3" /> {t('until')} {offer.valid_until}
                            </span>
                          )}
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#C4A070] group-hover:ltr:translate-x-1 group-hover:rtl:translate-x-[-4px] transition-transform">
                            <span>{t('details_cta')}</span>
                            <FaArrowLeft className="w-3 h-3 ltr:rotate-180 transition-transform" />
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
