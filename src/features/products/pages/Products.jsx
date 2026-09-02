import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { productService } from '../services/productService'
import { adminService } from '../../admin/services/adminService'
import SEO from '../../../components/ui/SEO'
import { PageLoading, GridSkeleton } from '../../../components/ui/Loading'
import { 
  fadeUp, 
  heroStagger, 
  staggerContainer, 
  viewportOnce, 
  springHover, 
  cardHover, 
  hoverScale 
} from '../../../constants/animations'
import { FaCouch, FaArrowLeft, FaLayerGroup } from 'react-icons/fa6'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, cats] = await Promise.all([
          productService.fetchPublishedProducts(),
          adminService.fetchCategories('products').catch(() => []),
        ])
        setProducts(prods)
        setCategories(cats)
      } catch (err) {
        console.warn('Failed to load products:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      const matched = categories.find((c) => c.slug === categoryParam || c.id === categoryParam)
      if (matched) {
        setSelectedCategory(matched.id)
      }
    } else if (!categoryParam) {
      setSelectedCategory('all')
    }
  }, [categoryParam, categories])

  const handleCategorySelect = (catId, catSlug) => {
    setSelectedCategory(catId)
    if (catId === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: catSlug || catId })
    }
  }

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCategory)

  const getStartingPrice = (variants) => {
    if (!variants || variants.length === 0) return null
    const validPrices = variants.map(v => Number(v.price)).filter(p => !isNaN(p) && p > 0)
    if (validPrices.length === 0) return null
    return Math.min(...validPrices)
  }

  return (
    <div className="bg-transparent text-[#F2EFE8] min-h-screen font-sans" dir="rtl">
      <SEO
        title="قطع ذات إصدار محدود | S&I Atelier"
        description="استكشف تشكيلات الأثاث الحصرية ذات الإصدار المحدود المصنوعة يدوياً بأندر الخامات الأوروبية الطبيعية."
        slug="limited-edition"
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
            قطع ذات <span className="gold-gradient-text">إصدار محدود</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-[#DEDAD6] max-w-2xl mx-auto leading-relaxed md:leading-8 font-light">
            قطع نحتية حصرية تُصنع بأعداد قليلة ومعدودة لأرقى القصور والمساحات الخاصة، من أجود أخشاب الجوز المعتق والرخام النادر.
          </motion.p>
        </motion.div>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="max-w-7xl mx-auto px-6 pt-10"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#C4A070] text-[#1C1816] font-bold shadow-lg shadow-[#C4A070]/20 scale-105'
                  : 'bg-white/5 text-[#B3A9A3] hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              الكل
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategorySelect(c.id, c.slug)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-[#C4A070] text-[#1C1816] font-bold shadow-lg shadow-[#C4A070]/20 scale-105'
                    : 'bg-white/5 text-[#B3A9A3] hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Products Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <GridSkeleton count={6} />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#827771]">
            <FaCouch className="w-12 h-12 mx-auto text-[#C4A070]/30 mb-3" />
            لا توجد منتجات ضمن هذا القسم حالياً.
          </div>
        ) : (
          <motion.div 
            key={selectedCategory}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product, idx) => {
              const startPrice = getStartingPrice(product.variants)
              return (
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                  custom={idx}
                  whileHover={cardHover}
                  transition={springHover}
                >
                  <Link
                    to={`/limited-edition/${product.slug}`}
                    className="group rounded-3xl bg-[#141110] border border-[#C4A070]/20 overflow-hidden hover:border-[#C4A070] transition-all duration-300 flex flex-col shadow-xl block h-full hover:shadow-[#C4A070]/10"
                  >
                    <div className="relative aspect-[4/3] bg-[#1C1816] overflow-hidden">
                      <img
                        src={product.main_image || product.variants?.[0]?.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {product.badge && (
                        <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-bold bg-[#C4A070] text-[#1C1816] shadow-md">
                          {product.badge}
                        </span>
                      )}
                      {Array.isArray(product.variants) && product.variants.length > 0 && (
                        <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                          <FaLayerGroup className="w-3 h-3 text-[#C4A070]" />
                          <span>{product.variants.length} خيارات</span>
                        </span>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold font-serif text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug">
                          {product.title}
                        </h3>
                        <p className="text-xs text-[#827771] mt-2 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#827771] block font-medium">السعر</span>
                          {startPrice ? (
                            <div className="text-base font-extrabold font-serif text-[#E3CAA9] tracking-wide">
                              يبدأ من {startPrice.toLocaleString()} <span className="text-xs text-[#C4A070] font-sans font-normal">ر.س</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#C4A070] font-bold">حسب التخصيص</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#C4A070] group-hover:translate-x-[-4px] transition-transform">
                          <span>التفاصيل</span>
                          <FaArrowLeft className="w-3 h-3" />
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
