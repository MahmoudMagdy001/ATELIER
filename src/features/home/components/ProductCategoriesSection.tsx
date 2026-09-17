import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { fadeUp, staggerContainer, viewportOnce, cardHover, springHover } from '../../../constants/animations'
import type { Category, LimitedEdition } from '../../../types/database'

interface ProductCategoriesSectionProps {
  categories: Category[]
  products: LimitedEdition[]
  fallbackImage: string
  isEn: boolean
}

export const ProductCategoriesSection: React.FC<ProductCategoriesSectionProps> = ({
  categories,
  products,
  fallbackImage,
  isEn,
}) => {
  const { t } = useTranslation('home')

  if (categories.length === 0) return null

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8"
    >
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#C4A070]/20 pb-4 sm:pb-6">
        <div className="text-start">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#F2EFE8]">
            {t('categories_title_pre')} <span className="gold-gradient-text">{t('categories_title_highlight')}</span>
          </h2>
        </div>

        <Link
          to="/limited-edition"
          className="text-xs font-bold text-[#C4A070] hover:text-[#E5C9A3] transition-colors shrink-0 self-start sm:self-auto pb-1"
        >
          <span>{t('categories_view_all')}</span>
        </Link>
      </motion.div>

      {/* 2-column on mobile, 4-column on desktop (App Catalog View) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {categories.map((cat, idx) => {
          const catImage = cat.image_url || products.find(p => p.category_id === cat.id && p.main_image)?.main_image || fallbackImage

          return (
            <motion.div
              key={cat.id || idx}
              variants={fadeUp}
              whileHover={cardHover}
              transition={springHover}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C4A070]/20 bg-[#141110] shadow-xl flex flex-col justify-end min-h-[220px] sm:min-h-[340px] md:min-h-[400px] transition-all duration-500 hover:border-[#C4A070]/60 hover:shadow-[0_20px_50px_rgba(196,160,112,0.15)] text-start cursor-pointer"
            >
              {/* Background Category Image with Vignette & Hover Zoom */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                  src={catImage} 
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out brightness-[0.75] group-hover:brightness-90"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141110] via-[#141110]/50 to-black/20 group-hover:via-[#141110]/35 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Bottom Category Label */}
              <div className="relative z-10 p-3.5 sm:p-6 space-y-1">
                <h3 className="font-serif text-sm sm:text-xl md:text-2xl font-bold text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug">
                  {isEn ? (cat.name_en || cat.name) : cat.name}
                </h3>
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
  )
}

export default ProductCategoriesSection
