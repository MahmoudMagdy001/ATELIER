import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
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

import type { PortfolioItem } from '../../../types/database'

export default function Home() {
  const { t, i18n } = useTranslation('home')
  const isEn = i18n.language?.startsWith('en')
  const isRtl = i18n.dir() === 'rtl'

  const { products, portfolio, categories: rawProductCategories, settings } = useHomeData()
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null)
  const [activePortfolioCategory, setActivePortfolioCategory] = useState<string>('all')
  const [portfolioPage, setPortfolioPage] = useState<number>(0)
  const ITEMS_PER_PAGE = 6

  // Lock body scroll and handle Escape key when lightbox modal is open
  useEffect(() => {
    if (!selectedImage) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

  const rawWhatsapp = CONTACT_INFO.whatsappRaw
  const primaryPhone = CONTACT_INFO.phone

  // Filter portfolio with bilingual category labels
  const portfolioCategories = React.useMemo(() => {
    const map = new Map<string, string>()
    portfolio.forEach(item => {
      if (item.category) {
        map.set(item.category.trim(), (item as any).category_en?.trim() || item.category.trim())
      }
    })
    return [
      { key: 'all', label: t('portfolio_all') },
      ...Array.from(map.entries()).map(([ar, en]) => ({
        key: ar,
        label: isEn ? (en || ar) : ar
      }))
    ]
  }, [portfolio, isEn, t])

  const filteredPortfolio = activePortfolioCategory === 'all'
    ? portfolio
    : portfolio.filter(item => item.category?.trim() === activePortfolioCategory.trim())

  const totalPages = Math.ceil(filteredPortfolio.length / ITEMS_PER_PAGE)
  const paginatedPortfolio = filteredPortfolio.slice(
    portfolioPage * ITEMS_PER_PAGE,
    (portfolioPage + 1) * ITEMS_PER_PAGE
  )

  const handleCategoryChange = (catKey: string) => {
    setActivePortfolioCategory(catKey)
    setPortfolioPage(0)
  }

  // Categories for Limited Edition pieces
  const displayProductCategories = [...(rawProductCategories || [])]
    .filter(cat => !cat.type || cat.type === 'products')
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))

  const homeMetaTitle = isEn
    ? (settings?.default_meta_title_en || t('meta_title'))
    : (settings?.default_meta_title || t('meta_title'))

  const homeMetaDesc = isEn
    ? (settings?.default_meta_description_en || t('meta_description'))
    : (settings?.default_meta_description || t('meta_description'))

  return (
    <div className="space-y-24 pb-20 bg-transparent text-[#F2EFE8] font-sans">
      <SEO
        title={homeMetaTitle}
        description={homeMetaDesc}
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
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.15] drop-shadow-2xl">
            <span className="gold-gradient-text inline-block">
              {t('hero_title_part1')} <br />
              {t('hero_title_highlight')}
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-[#E3CAA9]/90 max-w-2xl mx-auto leading-relaxed md:leading-8 drop-shadow-md font-light">
            {t('hero_subtitle')}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/limited-edition"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full gold-btn-primary text-xs font-bold flex items-center justify-center gap-2.5 shadow-xl transition-all"
            >
              <span>{t('hero_cta_limited')}</span>
              <FaArrowLeft className="w-3 h-3 ltr:rotate-180 transition-transform" />
            </Link>

            <Link
              to="/bespoke"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full gold-btn-secondary text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>{t('hero_cta_bespoke')}</span>
              <FaArrowLeft className="w-3 h-3 text-[#C4A070] ltr:rotate-180 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. BRAND VALUES RIBBON */}
      <section className="border-y border-[#C4A070]/20 bg-gradient-to-r from-[#141110] via-[#1C1816] to-[#141110] py-6 shadow-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x rtl:md:divide-x-reverse divide-[#C4A070]/15">
            <div className="space-y-1">
              <span className="font-serif text-sm md:text-base font-extrabold tracking-[0.25em] text-[#C4A070] block uppercase" dir="ltr">
                LUXURY
              </span>
              <p className="text-[11px] text-[#B3A9A3]">{t('ribbon.luxury')}</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-sm md:text-base font-extrabold tracking-[0.25em] text-[#C4A070] block uppercase" dir="ltr">
                MINIMAL
              </span>
              <p className="text-[11px] text-[#B3A9A3]">{t('ribbon.minimal')}</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-sm md:text-base font-extrabold tracking-[0.25em] text-[#C4A070] block uppercase" dir="ltr">
                TIMELESS
              </span>
              <p className="text-[11px] text-[#B3A9A3]">{t('ribbon.timeless')}</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-sm md:text-base font-extrabold tracking-[0.25em] text-[#C4A070] block uppercase" dir="ltr">
                BESPOKE
              </span>
              <p className="text-[11px] text-[#B3A9A3]">{t('ribbon.bespoke')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US & PHILOSOPHY */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6"
      >
        <div className="rounded-3xl bg-[#141110] border border-[#C4A070]/20 p-8 sm:p-12 md:p-16 space-y-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <motion.div variants={fadeUp} className="lg:col-span-7 space-y-6 text-start">
              <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
                <FaCompass className="w-3.5 h-3.5" /> {t('about_badge')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F2EFE8] leading-tight">
                {t('about_title_pre')} <span className="gold-gradient-text">S&I Atelier</span> {t('about_title_post')}
              </h2>
              <div className="space-y-4 text-sm md:text-base text-[#DEDAD6] leading-loose font-light">
                <p>
                  <Trans 
                    i18nKey="home:about_p1"
                    components={{
                      date: <strong className="text-[#C4A070] font-semibold" />,
                      strong: <strong className="text-[#C4A070] font-bold" />,
                      gold: <strong className="gold-gradient-text font-bold font-serif text-sm md:text-base drop-shadow-[0_0_12px_rgba(196,160,112,0.55)] border-b border-[#C4A070]/60 pb-0.5" />
                    }}
                  />
                </p>
                <p>
                  {t('about_p2')}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/bespoke"
                  className="px-6 py-3 rounded-full gold-btn-primary text-xs font-bold inline-flex items-center gap-2"
                >
                  <span>{t('about_cta_bespoke')}</span>
                  <FaArrowLeft className="w-3 h-3 ltr:rotate-180 transition-transform" />
                </Link>
                <a
                  href={`https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(isEn ? 'Hello S&I Atelier, I would like to inquire about bespoke furniture for a palace or villa' : 'مرحباً S&I Atelier، أود الاستفسار عن تفصيل أثاث خاص لقصر أو فيلا')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full gold-btn-secondary text-xs font-bold inline-flex items-center gap-2"
                >
                  <FaWhatsapp className="w-4 h-4 text-[#C4A070]" />
                  <span>{t('about_cta_whatsapp')}</span>
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-5 grid grid-cols-2 gap-4 text-start">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#C4A070]/20 space-y-2">
                <span className="text-3xl font-serif font-bold text-[#C4A070]">{t('about_features.handmade_val')}</span>
                <h4 className="text-sm font-bold text-[#F2EFE8]">{t('about_features.handmade_title')}</h4>
                <p className="text-xs text-[#827771] leading-relaxed">{t('about_features.handmade_desc')}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#C4A070]/20 space-y-2">
                <span className="text-3xl font-serif font-bold text-[#C4A070]">{t('about_features.warranty_val')}</span>
                <h4 className="text-sm font-bold text-[#F2EFE8]">{t('about_features.warranty_title')}</h4>
                <p className="text-xs text-[#827771] leading-relaxed">{t('about_features.warranty_desc')}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#C4A070]/20 space-y-2">
                <span className="text-3xl font-serif font-bold text-[#C4A070]">{t('about_features.vip_val')}</span>
                <h4 className="text-sm font-bold text-[#F2EFE8]">{t('about_features.vip_title')}</h4>
                <p className="text-xs text-[#827771] leading-relaxed">{t('about_features.vip_desc')}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#C4A070]/20 space-y-2">
                <span className="text-3xl font-serif font-bold text-[#C4A070]">{t('about_features.exclusive_val')}</span>
                <h4 className="text-sm font-bold text-[#F2EFE8]">{t('about_features.exclusive_title')}</h4>
                <p className="text-xs text-[#827771] leading-relaxed">{t('about_features.exclusive_desc')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 4. VISION & BRAND STORY */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 space-y-12"
      >
        <motion.div variants={fadeUp} className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center justify-center gap-2">
            <FaAward className="w-3.5 h-3.5" /> {t('history_badge')}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
            {t('history_title')}
          </h2>
          <p className="text-sm text-[#DEDAD6]/80 leading-relaxed font-light">
            {t('history_desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
          <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] font-serif font-bold text-lg">
              01
            </div>
            <h3 className="font-serif text-xl font-bold text-[#F2EFE8]">{t('history_step1_title')}</h3>
            <p className="text-xs text-[#827771] leading-relaxed">
              <Trans
                i18nKey="home:history_step1_desc"
                components={{
                  date: <strong className="text-[#C4A070] font-semibold" />,
                  gold: <strong className="gold-gradient-text font-bold font-serif text-[13px] drop-shadow-[0_0_10px_rgba(196,160,112,0.55)] border-b border-[#C4A070]/60 pb-0.5" />
                }}
              />
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] font-serif font-bold text-lg">
              02
            </div>
            <h3 className="font-serif text-xl font-bold text-[#F2EFE8]">{t('history_step2_title')}</h3>
            <p className="text-xs text-[#827771] leading-relaxed">
              {t('history_step2_desc')}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] font-serif font-bold text-lg">
              03
            </div>
            <h3 className="font-serif text-xl font-bold text-[#F2EFE8]">{t('history_step3_title')}</h3>
            <p className="text-xs text-[#827771] leading-relaxed">
              {t('history_step3_desc')}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* 5. SERVICES DUAL CARDS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 space-y-10"
      >
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6">
          <div className="space-y-2 text-start">
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
              <FaGem className="w-3.5 h-3.5" /> {t('services_badge')}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
              {t('services_title')}
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
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
              <span className="text-[11px] font-bold text-[#C4A070] uppercase tracking-widest block" dir="ltr">
                {t('service_card1_num')}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors">
                {t('service_card1_title')}
              </h3>
              <p className="text-xs sm:text-sm text-[#DEDAD6]/80 leading-relaxed font-light">
                {t('service_card1_desc')}
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#827771]">
                {t('service_card1_count', { count: products?.length || 0 })}
              </span>
              <Link
                to="/limited-edition"
                className="px-5 py-2.5 rounded-full gold-btn-primary text-xs font-bold flex items-center gap-2"
              >
                <span>{t('service_card1_cta')}</span>
                <FaArrowLeft className="w-3 h-3 ltr:rotate-180 transition-transform" />
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
              <span className="text-[11px] font-bold text-[#C4A070] uppercase tracking-widest block" dir="ltr">
                {t('service_card2_num')}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors">
                {t('service_card2_title')}
              </h3>
              <p className="text-xs sm:text-sm text-[#DEDAD6]/80 leading-relaxed font-light">
                {t('service_card2_desc')}
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#827771]">{t('service_card2_highlight')}</span>
              <Link
                to="/bespoke"
                className="px-5 py-2.5 rounded-full gold-btn-secondary text-xs font-bold flex items-center gap-2"
              >
                <span>{t('service_card2_cta')}</span>
                <FaArrowLeft className="w-3 h-3 text-[#C4A070] ltr:rotate-180 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 6. LIMITED EDITION CATEGORIES */}
      {displayProductCategories.length > 0 && (
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 space-y-10"
        >
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6">
            <div className="space-y-2 text-start">
              <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
                <FaLayerGroup className="w-3.5 h-3.5" /> {t('categories_badge')}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
                {t('categories_title_pre')} <span className="gold-gradient-text">{t('categories_title_highlight')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#DEDAD6]/80 max-w-2xl font-light">
                {t('categories_desc')}
              </p>
            </div>

            <Link
              to="/limited-edition"
              className="text-xs font-bold text-[#C4A070] hover:text-[#E5C9A3] flex items-center gap-1.5 transition-colors group shrink-0 self-start sm:self-auto pb-1"
            >
              <span>{t('categories_view_all')}</span>
              <FaArrowLeft className="w-3 h-3 ltr:rotate-180 group-hover:ltr:translate-x-1 group-hover:rtl:translate-x-[-4px] transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProductCategories.map((cat, idx) => {
              const catImage = cat.image_url || products.find(p => p.category_id === cat.id && p.main_image)?.main_image || heroBannerImg

              return (
                <motion.div
                  key={cat.id || idx}
                  variants={fadeUp}
                  whileHover={cardHover}
                  transition={springHover}
                  className="group relative rounded-3xl overflow-hidden border border-[#C4A070]/20 bg-[#141110] shadow-2xl flex flex-col justify-end min-h-[380px] sm:min-h-[420px] transition-all duration-500 hover:border-[#C4A070]/60 hover:shadow-[0_20px_50px_rgba(196,160,112,0.15)] text-start"
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
                      {isEn ? (cat.name_en || cat.name) : cat.name}
                    </h3>

                    {(cat.description || cat.description_en) && (
                      <p className="text-xs text-[#DEDAD6]/80 leading-relaxed font-light line-clamp-2">
                        {isEn ? (cat.description_en || cat.description) : (cat.description || cat.description_en)}
                      </p>
                    )}
                  </div>

                  {/* Invisible Overlay Link to Category Filter */}
                  <Link 
                    to={`/limited-edition?category=${cat.slug || cat.id}`} 
                    className="absolute inset-0 z-20"
                    aria-label={t('browse_category_aria', { name: cat.name })}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.section>
      )}

      {/* 7. PORTFOLIO GALLERY */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 space-y-8"
      >
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C4A070]/20 pb-6">
          <div className="space-y-2 text-start">
            <span className="text-xs text-[#C4A070] tracking-widest uppercase font-bold flex items-center gap-2">
              <FaImages className="w-3.5 h-3.5" /> {t('portfolio_badge')}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F2EFE8]">
              {t('portfolio_title')}
            </h2>
          </div>

          {/* Category Filter Pills */}
          {portfolioCategories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {portfolioCategories.map((catObj) => (
                <button
                  key={catObj.key}
                  onClick={() => handleCategoryChange(catObj.key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activePortfolioCategory === catObj.key
                      ? 'bg-[#C4A070] text-[#1C1816]'
                      : 'bg-white/5 text-[#B3A9A3] hover:text-white'
                  }`}
                >
                  {catObj.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {filteredPortfolio.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#141110] border border-[#C4A070]/20 text-center space-y-3">
            <FaImages className="w-10 h-10 text-[#C4A070]/30 mx-auto" />
            <h4 className="text-sm font-bold text-[#F2EFE8]">{t('portfolio_empty_title')}</h4>
            <p className="text-xs text-[#827771]">{t('portfolio_empty_desc')}</p>
          </div>
        ) : (
          <div className="space-y-6 relative px-2 sm:px-12 lg:px-16">
            {/* Relative wrapper for Grid and Side Floating Arrows */}
            <div className="relative">
              {/* Start Side Arrow (Previous Page) */}
              {totalPages > 1 && (
                <button
                  onClick={() => setPortfolioPage(prev => Math.max(0, prev - 1))}
                  disabled={portfolioPage === 0}
                  className="absolute -start-2 sm:-start-10 lg:-start-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#C4A070]/40 bg-[#141110]/95 backdrop-blur-md text-[#C4A070] flex items-center justify-center hover:bg-[#C4A070] hover:text-[#141110] transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer shadow-2xl hover:scale-105"
                  aria-label={t('portfolio_prev_page')}
                >
                  {isRtl ? <FaChevronRight className="w-4 h-4" /> : <FaChevronLeft className="w-4 h-4" />}
                </button>
              )}

              {/* End Side Arrow (Next Page) */}
              {totalPages > 1 && (
                <button
                  onClick={() => setPortfolioPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={portfolioPage >= totalPages - 1}
                  className="absolute -end-2 sm:-end-10 lg:-end-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#C4A070]/40 bg-[#141110]/95 backdrop-blur-md text-[#C4A070] flex items-center justify-center hover:bg-[#C4A070] hover:text-[#141110] transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer shadow-2xl hover:scale-105"
                  aria-label={t('portfolio_next_page')}
                >
                  {isRtl ? <FaChevronLeft className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
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
                    className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#141110] border border-[#C4A070]/20 hover:border-[#C4A070] cursor-pointer shadow-xl text-start"
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
                          {isEn ? (item.category_en || item.category) : item.category}
                        </span>
                      )}
                      <h3 className="font-serif text-lg font-bold text-[#F2EFE8] leading-snug">
                        {isEn ? (item.title_en || item.title) : item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-[#DEDAD6]/80 line-clamp-2 leading-relaxed">
                          {isEn ? (item.description_en || item.description) : item.description}
                        </p>
                      )}
                    </div>

                    <div className="absolute top-4 start-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#C4A070] opacity-0 group-hover:opacity-100 transition-opacity">
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
                    aria-label={t('portfolio_goto_page', { page: pIdx + 1 })}
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
                  className="absolute top-4 start-4 z-20 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#C4A070] hover:text-[#1C1816] transition-colors cursor-pointer"
                  aria-label={t('lightbox_close')}
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
                <div className="p-6 space-y-2 border-t border-white/10 bg-[#141110] shrink-0 text-start">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-[#F2EFE8]">
                      {isEn ? (selectedImage.title_en || selectedImage.title) : selectedImage.title}
                    </h3>
                    {selectedImage.category && (
                      <span className="text-xs px-3 py-1 rounded-full bg-[#C4A070]/20 text-[#C4A070] font-bold">
                        {isEn ? (selectedImage.category_en || selectedImage.category) : selectedImage.category}
                      </span>
                    )}
                  </div>
                  {selectedImage.description && (
                    <p className="text-xs text-[#DEDAD6]/80 leading-relaxed">
                      {isEn ? (selectedImage.description_en || selectedImage.description) : selectedImage.description}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* 8. CRAFTSMANSHIP & TRUST GUARANTEES */}
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
              <h4 className="font-bold text-base text-[#F2EFE8] font-serif">{t('guarantees_rare_title')}</h4>
              <p className="text-xs text-[#B3A9A3] leading-relaxed">
                {t('guarantees_rare_desc')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] mx-auto text-2xl">
                <FaShieldHalved />
              </div>
              <h4 className="font-bold text-base text-[#F2EFE8] font-serif">{t('guarantees_warranty_title')}</h4>
              <p className="text-xs text-[#B3A9A3] leading-relaxed">
                {t('guarantees_warranty_desc')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#C4A070]/15 flex items-center justify-center text-[#C4A070] mx-auto text-2xl">
                <FaTruckFast />
              </div>
              <h4 className="font-bold text-base text-[#F2EFE8] font-serif">{t('guarantees_vip_title')}</h4>
              <p className="text-xs text-[#B3A9A3] leading-relaxed">
                {t('guarantees_vip_desc')}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 9. LUXURY STATS & ACHIEVEMENTS */}
      <LuxuryStatsSection />
    </div>
  )
}
