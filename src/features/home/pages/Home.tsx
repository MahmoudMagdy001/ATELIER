import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHomeData } from '../hooks/useHomeData'
import SEO from '../../../components/ui/SEO'
import HeroSection from '../components/HeroSection'
import BrandValuesRibbon from '../components/BrandValuesRibbon'
import AboutPhilosophySection from '../components/AboutPhilosophySection'
import VisionStorySection from '../components/VisionStorySection'
import ServicesDualCards from '../components/ServicesDualCards'
import ProductCategoriesSection from '../components/ProductCategoriesSection'
import PortfolioGallery from '../components/PortfolioGallery'
import PortfolioLightbox from '../components/PortfolioLightbox'
import CraftsmanshipSection from '../components/CraftsmanshipSection'
import LuxuryStatsSection from '../components/LuxuryStatsSection'
import heroBannerImg from '../../../assets/hero-banner.jpg'
import { CONTACT_INFO } from '../../../constants/contactInfo'
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

  const rawWhatsapp = CONTACT_INFO.whatsappRaw

  // Filter portfolio with bilingual category labels
  const portfolioCategories = useMemo(() => {
    const map = new Map<string, string>()
    portfolio.forEach(item => {
      if (item.category) {
        map.set(item.category.trim(), item.category_en?.trim() || item.category.trim())
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
  const displayProductCategories = useMemo(() => {
    return [...(rawProductCategories || [])]
      .filter(cat => !cat.type || cat.type === 'products')
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
  }, [rawProductCategories])

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
        siteSettings={settings}
      />

      {/* 1. HERO SECTION */}
      <HeroSection heroImage="/hero-banner.jpg" />

      {/* 2. BRAND VALUES RIBBON */}
      <BrandValuesRibbon />

      {/* 3. ABOUT US & PHILOSOPHY */}
      <AboutPhilosophySection rawWhatsapp={rawWhatsapp} isEn={isEn} />

      {/* 4. VISION & BRAND STORY */}
      <VisionStorySection />

      {/* 5. SERVICES DUAL CARDS */}
      <ServicesDualCards productsCount={products?.length || 0} />

      {/* 6. LIMITED EDITION CATEGORIES */}
      <ProductCategoriesSection
        categories={displayProductCategories}
        products={products}
        fallbackImage={heroBannerImg}
        isEn={isEn}
      />

      {/* 7. PORTFOLIO GALLERY */}
      <PortfolioGallery
        portfolioCategories={portfolioCategories}
        activeCategory={activePortfolioCategory}
        onCategoryChange={handleCategoryChange}
        paginatedPortfolio={paginatedPortfolio}
        totalItemsCount={filteredPortfolio.length}
        currentPage={portfolioPage}
        totalPages={totalPages}
        onPageChange={setPortfolioPage}
        onSelectImage={setSelectedImage}
        isEn={isEn}
        isRtl={isRtl}
      />

      {/* Lightbox Modal for Portfolio Image */}
      <PortfolioLightbox
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
        isEn={isEn}
      />

      {/* 8. CRAFTSMANSHIP & TRUST GUARANTEES */}
      <CraftsmanshipSection />

      {/* 9. LUXURY STATS & ACHIEVEMENTS */}
      <LuxuryStatsSection />
    </div>
  )
}
