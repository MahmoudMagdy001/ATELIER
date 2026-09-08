import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { blogService } from '../services/blogService'
import { adminService } from '../../admin/services/adminService'
import SEO from '../../../components/ui/SEO'
import { GridSkeleton } from '../../../components/ui/Loading'
import { 
  fadeUp, 
  heroStagger, 
  staggerContainer, 
  springHover, 
  cardHover 
} from '../../../constants/animations'
import { FaArrowLeft, FaCalendarDays, FaBookOpen } from 'react-icons/fa6'

import type { Article, Category } from '../../../types/database'

export default function Blog() {
  const { t, i18n } = useTranslation('blog')
  const isEn = i18n.language?.startsWith('en')

  const [posts, setPosts] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [pData, cData] = await Promise.all([
          blogService.fetchPublishedPosts(),
          adminService.fetchCategories('blog').catch(() => []),
        ])
        setPosts(pData)
        setCategories(cData)
      } catch (err: unknown) {
        console.warn('Failed to load blog posts:', (err as Error)?.message || err)
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
    <div className="bg-transparent text-[#F2EFE8] min-h-screen font-sans">
      <SEO
        title={t('meta_title')}
        description={t('meta_description')}
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
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight tracking-normal">
            <span className="gold-gradient-text inline-block">
              {t('hero_title_pre')}{t('hero_title_highlight')}
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-[#DEDAD6] max-w-2xl mx-auto leading-relaxed md:leading-8 font-light">
            {t('hero_desc')}
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
              {t('filter_all')}
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
                {isEn ? (c.name_en || c.name) : c.name}
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
            {t('empty_state')}
          </div>
        ) : (
          <motion.div 
            key={selectedCategory}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-start"
          >
            {filteredPosts.map((post, idx) => {
              const postTitle = isEn ? (post.title_en || post.title) : post.title
              const postExcerpt = isEn ? (post.excerpt_en || post.excerpt) : post.excerpt

              return (
                <motion.div
                  key={post.id}
                  variants={fadeUp}
                  custom={idx}
                  whileHover={cardHover}
                  transition={springHover}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group rounded-3xl bg-[#141110] border border-[#C4A070]/20 overflow-hidden hover:border-[#C4A070] transition-all duration-300 flex flex-col shadow-xl block h-full hover:shadow-[#C4A070]/10 text-start"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#1C1816]">
                      {post.cover_image ? (
                        <img
                          src={post.cover_image}
                          alt={postTitle}
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
                          <span>{new Date(post.published_at || post.created_at || '').toLocaleDateString(isEn ? 'en-US' : 'ar-SA')}</span>
                          {post.reading_time && (
                            <>
                              <span>•</span>
                              <span>{t('read_time', { time: post.reading_time })}</span>
                            </>
                          )}
                        </div>

                        <h3 className="text-lg font-bold font-serif text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug">
                          {postTitle}
                        </h3>

                        <p className="text-xs text-[#827771] line-clamp-2 leading-relaxed">
                          {postExcerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#C4A070]">
                        <span>{t('read_article')}</span>
                        <FaArrowLeft className="w-3 h-3 ltr:rotate-180 group-hover:ltr:translate-x-1 group-hover:rtl:translate-x-[-4px] transition-transform" />
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
