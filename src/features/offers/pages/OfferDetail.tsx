import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { offerService } from '../services/offerService'
import { adminService } from '../../admin/services/adminService'
import SEO from '../../../components/ui/SEO'
import { PageLoading } from '../../../components/ui/Loading'
import { CONTACT_INFO } from '../../../constants/contactInfo'
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

import type { Offer, OfferVariant, SiteSettings } from '../../../types/database'

export interface OfferGalleryImageItem {
  url: string
  label: string
  variant?: OfferVariant | null
}

export default function OfferDetail() {
  const { t, i18n } = useTranslation('offers')
  const isEn = i18n.language?.startsWith('en')

  const { slug } = useParams<{ slug: string }>()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedVariant, setSelectedVariant] = useState<OfferVariant | null>(null)
  const [activeImage, setActiveImage] = useState<string>('')

  useEffect(() => {
    async function loadOffer() {
      if (!slug) {
        setLoading(false)
        return
      }
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
          setActiveImage(first.image || oData.cover_image || oData.banner_image || '')
        } else {
          setActiveImage(oData?.cover_image || oData?.banner_image || '')
        }
      } catch (err: unknown) {
        console.warn('Failed to load offer:', (err as Error)?.message || err)
      } finally {
        setLoading(false)
      }
    }
    loadOffer()
  }, [slug])

  // Deduplicate gallery images across cover image and variants, linking each to its variant
  const galleryImages = useMemo<OfferGalleryImageItem[]>(() => {
    if (!offer) return []
    const seen = new Set<string>()
    const list: OfferGalleryImageItem[] = []

    const findVariantForImage = (imgUrl: string): OfferVariant | null => {
      if (!Array.isArray(offer.variants) || offer.variants.length === 0) return null
      return offer.variants.find((v) => v.image === imgUrl) || offer.variants[0]
    }

    const primaryImg = offer.cover_image || offer.banner_image
    if (primaryImg && !seen.has(primaryImg)) {
      seen.add(primaryImg)
      const matchedVariant = findVariantForImage(primaryImg)
      const variantName = matchedVariant ? (isEn ? (matchedVariant.name_en || matchedVariant.name) : matchedVariant.name) : null
      list.push({
        url: primaryImg,
        label: variantName || (isEn ? (offer.title_en || offer.title) : offer.title) || t('main_image_label'),
        variant: matchedVariant
      })
    }

    if (Array.isArray(offer.variants)) {
      offer.variants.forEach((v) => {
        if (v.image && !seen.has(v.image)) {
          seen.add(v.image)
          const vName = isEn ? (v.name_en || v.name) : v.name
          list.push({
            url: v.image,
            label: vName || t('variant_option_label'),
            variant: v
          })
        }
      })
    }

    return list
  }, [offer, t, isEn])

  const handleSelectVariant = (variant: OfferVariant) => {
    setSelectedVariant(variant)
    if (variant.image) {
      setActiveImage(variant.image)
    } else if (offer?.cover_image || offer?.banner_image) {
      setActiveImage(offer.cover_image || offer.banner_image || '')
    }
  }

  const handleSelectGalleryImage = (item: OfferGalleryImageItem) => {
    setActiveImage(item.url)
    const targetVariant = 
      offer?.variants?.find((v) => v.image === item.url) || 
      item.variant || 
      offer?.variants?.[0]

    if (targetVariant) {
      setSelectedVariant(targetVariant)
    }
  }

  if (loading) return <PageLoading text={t('loading_offer')} />

  if (!offer) {
    return (
      <div className="min-h-screen bg-[#1C1816] text-[#F2EFE8] flex items-center justify-center p-6 text-center pt-20">
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-[#C4A070]">{t('offer_not_found')}</h2>
          <p className="text-xs text-[#827771]">{t('offer_not_found_desc')}</p>
          <Link to="/offers" className="inline-block px-5 py-2 rounded-xl bg-[#C4A070] text-[#1C1816] text-xs font-bold">
            {t('back_to_offers')}
          </Link>
        </div>
      </div>
    )
  }

  const offerTitle = isEn ? (offer.title_en || offer.title) : offer.title
  const offerDesc = isEn ? (offer.description_en || offer.description) : offer.description
  const offerDiscount = isEn ? (offer.discount_label_en || offer.discount_label) : offer.discount_label
  const offerBadge = isEn ? (offer.badge_en || offer.badge) : offer.badge
  const offerMetaTitle = isEn ? (offer.meta_title_en || offer.meta_title || `${offerTitle} | ${t('meta_title')}`) : (offer.meta_title || `${offer.title} | ${t('meta_title')}`)
  const offerMetaDesc = isEn ? (offer.meta_description_en || offer.meta_description || offerDesc) : (offer.meta_description || offer.description)

  const currentPrice = Number(selectedVariant?.price) || 0
  const originalPrice = Number(selectedVariant?.original_price) || 0
  const savings = originalPrice > currentPrice ? originalPrice - currentPrice : 0
  const selectedVariantName = selectedVariant ? (isEn ? (selectedVariant.name_en || selectedVariant.name) : selectedVariant.name) : ''

  const rawWhatsapp = CONTACT_INFO.whatsappRaw
  const whatsappMessage = encodeURIComponent(
    (isEn
      ? `Hello S&I Atelier, I would like to book and benefit from the exclusive offer: "${offerTitle}"`
      : `مرحباً أتيليه، أرغب في حجز والاستفادة من العرض الحصري: "${offerTitle}"`) +
    (selectedVariant 
      ? `\n${isEn ? 'Selected option:' : 'الخيار المختار:'} ${selectedVariantName}\n${isEn ? 'Offer price:' : 'سعر العرض:'} ${currentPrice.toLocaleString(isEn ? 'en-US' : 'ar-SA')} ${t('sar')}` 
      : '') +
    (offerDiscount ? `\n${isEn ? 'Promo badge:' : 'كود/شارة الخصم:'} ${offerDiscount}` : '') +
    `\n${isEn ? 'Link:' : 'الرابط:'} ${typeof window !== 'undefined' ? window.location.href : ''}`
  )
  const whatsappUrl = `https://wa.me/${rawWhatsapp}?text=${whatsappMessage}`
  const contactPhone = CONTACT_INFO.phone

  return (
    <div className="bg-transparent text-[#F2EFE8] min-h-screen font-sans pt-28 md:pt-32">
      <SEO
        title={offerMetaTitle}
        description={offerMetaDesc}
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
          <Link to="/" className="hover:text-[#C4A070]">{t('breadcrumb_home')}</Link>
          <span>/</span>
          <Link to="/offers" className="hover:text-[#C4A070]">{t('breadcrumb_offers')}</Link>
          <span>/</span>
          <span className="text-[#F2EFE8] font-bold truncate max-w-xs">{offerTitle}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Gallery View */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="relative aspect-[4/3] rounded-3xl bg-[#141110] border border-[#C4A070]/30 overflow-hidden shadow-2xl">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0.8, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                src={activeImage || offer.cover_image || offer.banner_image || ''}
                alt={offerTitle}
                className="w-full h-full object-cover"
              />
              
              {offerDiscount && (
                <span className="absolute top-5 end-5 px-4 py-2 rounded-full text-xs font-extrabold bg-[#C4A070] text-[#1C1816] shadow-xl">
                  {offerDiscount}
                </span>
              )}

              {offer.valid_until && (
                <span className="absolute bottom-5 end-5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/75 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                  <FaCalendarDays className="text-[#C4A070] w-3.5 h-3.5" />
                  <span>{t('ends_at', { date: offer.valid_until })}</span>
                </span>
              )}
            </div>

            {/* Thumbnail switcher for unique gallery images */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((item, idx) => {
                  const isActive = activeImage === item.url
                  return (
                    <button
                      key={`${item.url}-${idx}`}
                      onClick={() => handleSelectGalleryImage(item)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#C4A070] scale-105 shadow-md shadow-[#C4A070]/20 ring-1 ring-[#C4A070]'
                          : 'border-white/10 hover:border-white/30 opacity-70'
                      }`}
                      title={item.label}
                    >
                      <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Details & Interactive Offer Variant Selector */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-5 space-y-6 bg-[#141110] p-8 rounded-3xl border border-[#C4A070]/20 shadow-xl text-start"
          >
            
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#C4A070] uppercase flex items-center gap-1.5">
                <FaPercent className="w-3 h-3" /> {t('badge_promotional')}
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#F2EFE8] mt-1 leading-snug">
                {offerTitle}
              </h1>
            </div>

            {/* Dynamic Active Price & Savings Box */}
            <div className="p-4 rounded-2xl bg-[#1C1816] border border-[#C4A070]/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#827771] block font-medium">{t('selected_option_price')}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-serif font-black text-[#E3CAA9] tracking-wide">
                      {currentPrice > 0 ? (
                        <>
                          {currentPrice.toLocaleString(isEn ? 'en-US' : 'ar-SA')} <span className="text-sm text-[#C4A070] font-sans font-normal">{t('sar')}</span>
                        </>
                      ) : (
                        <span className="text-base text-[#B3A9A3]">{t('by_package')}</span>
                      )}
                    </span>
                    {originalPrice > currentPrice && (
                      <span className="text-sm text-[#827771] line-through font-serif">
                        {originalPrice.toLocaleString(isEn ? 'en-US' : 'ar-SA')} {t('sar')}
                      </span>
                    )}
                  </div>
                </div>

                {savings > 0 && (
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#C4A070]/20 text-[#F0DEC8] border border-[#C4A070]/40 shadow-md">
                    {t('save_amount', {
                      amount: savings.toLocaleString(isEn ? 'en-US' : 'ar-SA'),
                      currency: t('sar'),
                    })}
                  </span>
                )}
              </div>
            </div>

            {/* Offer Description */}
            <p className="text-xs md:text-sm text-[#B3A9A3] leading-relaxed">
              {offerDesc}
            </p>

            {/* Interactive Variants Selector */}
            {Array.isArray(offer.variants) && offer.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                  <FaLayerGroup className="text-[#C4A070] w-3.5 h-3.5" />
                  <span>{t('select_package_label')}</span>
                </label>

                <div className="grid gap-2.5">
                  {offer.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id
                    const vPrice = Number(variant.price) || 0
                    const vOrig = Number(variant.original_price) || 0
                    const vName = isEn ? (variant.name_en || variant.name) : variant.name

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => handleSelectVariant(variant)}
                        className={`w-full p-3.5 rounded-2xl border text-start transition-all flex items-center justify-between cursor-pointer ${
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
                            <span className="text-xs font-bold block text-[#F2EFE8]">{vName}</span>
                            {variant.sku && <span className="text-[10px] text-[#827771] font-mono">SKU: {variant.sku}</span>}
                          </div>
                        </div>

                        <div className="text-end">
                          <span className="text-sm font-black font-serif text-[#E3CAA9] block">
                            {vPrice.toLocaleString(isEn ? 'en-US' : 'ar-SA')} <span className="text-[10px] text-[#C4A070] font-sans font-normal">{t('sar')}</span>
                          </span>
                          {vOrig > vPrice && (
                            <span className="text-[10px] text-[#827771] line-through block font-serif">
                              {vOrig.toLocaleString(isEn ? 'en-US' : 'ar-SA')} {t('sar')}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Bespoke Customization Notice Banner */}
            <div className="p-4 rounded-2xl bg-[#1C1816]/90 border border-[#C4A070]/25 space-y-1">
              <span className="text-[11px] font-bold text-[#C4A070] flex items-center gap-1.5 uppercase tracking-wider">
                <FaGem className="w-3 h-3" />
                <span>{t('custom_design_notice_title')}</span>
              </span>
              <p className="text-[11px] text-[#B3A9A3] leading-relaxed">
                {t('custom_design_notice_desc')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-full gold-btn-primary text-[#1C1816] font-bold text-xs flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>{t('book_whatsapp')}</span>
              </a>

              <a
                href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                className="w-full py-3.5 rounded-full gold-btn-secondary text-[#F2EFE8] font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaPhone className="w-3.5 h-3.5 text-[#C4A070]" />
                <span>{t('phone_inquiry')}</span>
              </a>
            </div>

            {/* Atelier Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-white/5 text-[10px] text-[#B3A9A3]">
              <div className="space-y-1">
                <FaGem className="w-4 h-4 mx-auto text-[#C4A070]" />
                <p>{t('guarantee_matching')}</p>
              </div>
              <div className="space-y-1">
                <FaShieldHalved className="w-4 h-4 mx-auto text-[#C4A070]" />
                <p>{t('guarantee_consult')}</p>
              </div>
              <div className="space-y-1">
                <FaTruckFast className="w-4 h-4 mx-auto text-[#C4A070]" />
                <p>{t('guarantee_vip_delivery')}</p>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  )
}
