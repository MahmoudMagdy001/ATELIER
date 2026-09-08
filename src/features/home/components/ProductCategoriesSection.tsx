import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaLayerGroup, FaArrowLeft } from 'react-icons/fa6'
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
        {categories.map((cat, idx) => {
          const catImage = cat.image_url || products.find(p => p.category_id === cat.id && p.main_image)?.main_image || fallbackImage

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
                  decoding="async"
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
  )
}

export default ProductCategoriesSection
