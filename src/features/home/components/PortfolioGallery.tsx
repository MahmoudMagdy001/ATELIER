import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  FaImages, 
  FaArrowUpRightFromSquare, 
  FaChevronLeft, 
  FaChevronRight 
} from 'react-icons/fa6'
import { fadeUp, staggerContainer, viewportOnce, springHover } from '../../../constants/animations'
import type { PortfolioItem } from '../../../types/database'

export interface PortfolioCategoryTab {
  key: string
  label: string
}

interface PortfolioGalleryProps {
  portfolioCategories: PortfolioCategoryTab[]
  activeCategory: string
  onCategoryChange: (catKey: string) => void
  paginatedPortfolio: PortfolioItem[]
  totalItemsCount: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onSelectImage: (item: PortfolioItem) => void
  isEn: boolean
  isRtl: boolean
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  portfolioCategories,
  activeCategory,
  onCategoryChange,
  paginatedPortfolio,
  totalItemsCount,
  currentPage,
  totalPages,
  onPageChange,
  onSelectImage,
  isEn,
  isRtl,
}) => {
  const { t } = useTranslation('home')

  const handleCardKeyDown = (e: React.KeyboardEvent, item: PortfolioItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelectImage(item)
    }
  }

  return (
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
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('portfolio_title')}>
            {portfolioCategories.map((catObj) => {
              const isSelected = activeCategory === catObj.key
              return (
                <button
                  key={catObj.key}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onCategoryChange(catObj.key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none ${
                    isSelected
                      ? 'bg-[#C4A070] text-[#1C1816]'
                      : 'bg-white/5 text-[#B3A9A3] hover:text-white'
                  }`}
                >
                  {catObj.label}
                </button>
              )
            })}
          </div>
        )}
      </motion.div>

      {totalItemsCount === 0 ? (
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
                type="button"
                onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="absolute -start-2 sm:-start-10 lg:-start-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#C4A070]/40 bg-[#141110]/95 backdrop-blur-md text-[#C4A070] flex items-center justify-center hover:bg-[#C4A070] hover:text-[#141110] transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer shadow-2xl hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none"
                aria-label={t('portfolio_prev_page')}
              >
                {isRtl ? <FaChevronRight className="w-4 h-4" /> : <FaChevronLeft className="w-4 h-4" />}
              </button>
            )}

            {/* End Side Arrow (Next Page) */}
            {totalPages > 1 && (
              <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="absolute -end-2 sm:-end-10 lg:-end-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#C4A070]/40 bg-[#141110]/95 backdrop-blur-md text-[#C4A070] flex items-center justify-center hover:bg-[#C4A070] hover:text-[#141110] transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer shadow-2xl hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none"
                aria-label={t('portfolio_next_page')}
              >
                {isRtl ? <FaChevronLeft className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
              </button>
            )}

            <motion.div 
              key={`${activeCategory}-${currentPage}`}
              variants={staggerContainer} 
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedPortfolio.map((item, idx) => {
                const titleText = isEn ? (item.title_en || item.title) : item.title
                const categoryText = isEn ? (item.category_en || item.category) : item.category
                const descText = isEn ? (item.description_en || item.description) : item.description

                return (
                  <motion.div
                    key={item.id}
                    variants={fadeUp}
                    custom={idx}
                    whileHover={{ y: -6 }}
                    transition={springHover}
                    role="button"
                    tabIndex={0}
                    aria-label={titleText}
                    onKeyDown={(e) => handleCardKeyDown(e, item)}
                    onClick={() => onSelectImage(item)}
                    className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#141110] border border-[#C4A070]/20 hover:border-[#C4A070] cursor-pointer shadow-xl text-start focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none"
                  >
                    <img 
                      src={item.image_url} 
                      alt={titleText} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141110] via-[#141110]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute bottom-0 inset-x-0 p-6 space-y-1">
                      {categoryText && (
                        <span className="text-[10px] font-bold text-[#C4A070] uppercase tracking-wider block">
                          {categoryText}
                        </span>
                      )}
                      <h3 className="font-serif text-lg font-bold text-[#F2EFE8] leading-snug">
                        {titleText}
                      </h3>
                      {descText && (
                        <p className="text-xs text-[#DEDAD6]/80 line-clamp-2 leading-relaxed">
                          {descText}
                        </p>
                      )}
                    </div>

                    <div className="absolute top-4 start-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#C4A070] opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaArrowUpRightFromSquare className="w-3 h-3" />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Pagination Indicators centered below */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4" role="navigation" aria-label={t('portfolio_pagination_aria', 'تصفح صفحات المعرض')}>
              {Array.from({ length: totalPages }).map((_, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => onPageChange(pIdx)}
                  className={`h-2 rounded-full transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none ${
                    currentPage === pIdx
                      ? 'w-8 bg-[#C4A070]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={t('portfolio_goto_page', { page: pIdx + 1 })}
                  aria-current={currentPage === pIdx ? 'page' : undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.section>
  )
}

export default PortfolioGallery
