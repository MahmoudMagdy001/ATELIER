import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blogService } from '../services/blogService'
import { adminService } from '../../admin/services/adminService'
import SEO from '../../../components/ui/SEO'
import { PageLoading } from '../../../components/ui/Loading'
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

  if (loading) return <PageLoading text="جار تحميل المجلة المعمارية..." />

  return (
    <div className="bg-[#1C1816] text-[#F2EFE8] min-h-screen font-sans pt-20" dir="rtl">
      <SEO
        title="المجلة المعمارية وفنون الأثاث الفاخر | ATELIER"
        description="استكشف مقالات متخصصة في العمارة المعاصرة، أسرار الأثاث الإيطالي المصنوع بالطلب، واتجاهات التصميم الداخلي."
        slug="blog"
      />

      {/* Hero Header */}
      <div className="relative py-16 px-6 border-b border-[#C4A070]/20 bg-gradient-to-b from-[#141110] to-[#1C1816]">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-xs tracking-[0.25em] text-[#C4A070] uppercase font-bold flex items-center justify-center gap-2">
            <FaBookOpen className="w-3 h-3" /> ATELIER ARCHITECTURAL JOURNAL
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#F2EFE8]">
            المجلة المعمارية وفنون التأثيث الراقي
          </h1>
          <p className="text-sm md:text-base text-[#B3A9A3] max-w-2xl mx-auto leading-relaxed">
            مقالات حصرية وإلهام معماري يومي من قلب استوديوهات التصميم في ميلانو والرياض.
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
              جميع المقالات
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

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#827771]">
            <FaBookOpen className="w-12 h-12 mx-auto text-[#C4A070]/30 mb-3" />
            لا توجد مقالات منشورة ضمن هذا التصنيف حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group rounded-3xl bg-[#141110] border border-[#C4A070]/20 overflow-hidden hover:border-[#C4A070] transition-all duration-300 flex flex-col shadow-xl hover:-translate-y-1"
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
