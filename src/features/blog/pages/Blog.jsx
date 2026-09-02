import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogService } from '../services/blogService'
import { adminService } from '../../admin/services/adminService'
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
import { FaArrowLeft, FaCalendarDays, FaBookOpen } from 'react-icons/fa6'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [pData, cData] = await Promise.all([
          blogService.fetchPublishedPosts(),
          adminService.fetchCategories('blog').catch(() => []),
        ])
        setPosts(pData)
        setCategories(cData)
      } catch (err) {
        console.warn('Failed to load blog posts:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.category_id === selectedCategory)

  return (
    <div className="bg-transparent text-[#F2EFE8] min-h-screen font-sans" dir="rtl">
      <SEO
        title="المجلة المعمارية وفنون الأثاث الفاخر | ATELIER"
        description="استكشف مقالات متخصصة في العمارة المعاصرة، أسرار الأثاث الإيطالي المصنوع بالطلب، واتجاهات التصميم الداخلي."
        slug="blog"
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
            المجلة المعمارية و<span className="gold-gradient-text">فنون التأثيث الراقي</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-[#DEDAD6] max-w-2xl mx-auto leading-relaxed md:leading-8 font-light">
            مقالات حصرية وإلهام معماري يومي من قلب استوديوهات التصميم في ميلانو والرياض.
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
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#C4A070] text-[#1C1816] font-bold shadow-lg shadow-[#C4A070]/20 scale-105'
                  : 'bg-white/5 text-[#B3A9A3] hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              جميع المقالات
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
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

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <GridSkeleton count={6} cols="md:grid-cols-2 lg:grid-cols-3" />
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#827771]">
            <FaBookOpen className="w-12 h-12 mx-auto text-[#C4A070]/30 mb-3" />
            لا توجد مقالات منشورة ضمن هذا التصنيف حالياً.
          </div>
        ) : (
          <motion.div 
            key={selectedCategory}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                variants={fadeUp}
                custom={idx}
                whileHover={cardHover}
                transition={springHover}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group rounded-3xl bg-[#141110] border border-[#C4A070]/20 overflow-hidden hover:border-[#C4A070] transition-all duration-300 flex flex-col shadow-xl block h-full hover:shadow-[#C4A070]/10"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#1C1816]">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#C4A070]/30">
                        <FaBookOpen className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-[#C4A070]">
                        <FaCalendarDays className="w-2.5 h-2.5" />
                        <span>{new Date(post.published_at || post.created_at || Date.now()).toLocaleDateString('ar-SA')}</span>
                        {post.reading_time && (
                          <>
                            <span>•</span>
                            <span>قراءة {post.reading_time} د</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-lg font-bold font-serif text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-[#827771] line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#C4A070]">
                      <span>قراءة المقال بالكامل</span>
                      <FaArrowLeft className="w-3 h-3 group-hover:translate-x-[-4px] transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
