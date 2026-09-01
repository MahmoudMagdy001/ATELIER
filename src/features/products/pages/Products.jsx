import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/productService'
import { adminService } from '../../admin/services/adminService'
import SEO from '../../../components/ui/SEO'
import { PageLoading } from '../../../components/ui/Loading'
import { FaCouch, FaArrowLeft, FaLayerGroup } from 'react-icons/fa6'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

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

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCategory)

  const getStartingPrice = (variants) => {
    if (!variants || variants.length === 0) return null
    const validPrices = variants.map(v => Number(v.price)).filter(p => !isNaN(p) && p > 0)
    if (validPrices.length === 0) return null
    return Math.min(...validPrices)
  }

  if (loading) return <PageLoading text="جار تحميل تشكيلة الأثاث الفاخر..." />

  return (
    <div className="bg-[#1C1816] text-[#F2EFE8] min-h-screen font-sans pt-20" dir="rtl">
      <SEO
        title="مجموعة الأثاث الفاخر والتصميم المخصص | ATELIER"
        description="استكشف أرقى تشكيلات الأثاث الإيطالي المصنوع بالطلب من الصالونات وغرف الطعام والمجالس الفاخرة."
        slug="products"
      />

      {/* Hero Header */}
      <div className="relative py-16 px-6 border-b border-[#C4A070]/20 bg-gradient-to-b from-[#141110] to-[#1C1816]">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-xs tracking-[0.25em] text-[#C4A070] uppercase font-bold">
            BESPOKE LUXURY COLLECTION
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#F2EFE8]">
            مجموعة الأثاث والقطع المصممة بالطلب
          </h1>
          <p className="text-sm md:text-base text-[#B3A9A3] max-w-2xl mx-auto leading-relaxed">
            قطع استثنائية تصنع يدوياً بأرقى الخامات الطبيعية من خشب الجوز الإيطالي والرخام النادر مع خيارات متعددة للألوان والمقاسات.
          </p>
        </div>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pt-10">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#C4A070] text-[#1C1816] font-bold shadow-lg shadow-[#C4A070]/20'
                  : 'bg-white/5 text-[#B3A9A3] hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              الكل
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-[#C4A070] text-[#1C1816] font-bold shadow-lg shadow-[#C4A070]/20'
                    : 'bg-white/5 text-[#B3A9A3] hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#827771]">
            <FaCouch className="w-12 h-12 mx-auto text-[#C4A070]/30 mb-3" />
            لا توجد منتجات ضمن هذا القسم حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const startPrice = getStartingPrice(product.variants)
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group rounded-3xl bg-[#141110] border border-[#C4A070]/20 overflow-hidden hover:border-[#C4A070] transition-all duration-300 flex flex-col shadow-xl hover:-translate-y-1"
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
                        <span>{product.variants.length} خيارات متاحة</span>
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold font-serif text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug">
                        {product.title}
                      </h3>
                      <p className="text-xs text-[#827771] line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#827771] block">السعر</span>
                        {startPrice ? (
                          <div className="text-sm font-bold text-[#C4A070]">
                            يبدأ من {startPrice.toLocaleString()} <span className="text-[10px] text-[#B3A9A3]">ر.س</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#B3A9A3]">حسب التخصيص</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#C4A070] group-hover:translate-x-[-4px] transition-transform">
                        <span>عرض التفاصيل</span>
                        <FaArrowLeft className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
