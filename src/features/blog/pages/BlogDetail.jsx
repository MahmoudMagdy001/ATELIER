import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { blogService } from '../services/blogService'
import SEO from '../../../components/ui/SEO'
import { PageLoading } from '../../../components/ui/Loading'
import { FaArrowRight, FaCalendarDays, FaClock } from 'react-icons/fa6'
import DOMPurify from 'dompurify'
import '../../../styles/article.css'

export default function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      setLoading(true)
      try {
        const data = await blogService.fetchPostBySlug(slug)
        setPost(data)
      } catch (err) {
        console.warn('Failed to load post:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [slug])

  if (loading) return <PageLoading text="جار تحميل المقال..." />

  if (!post) {
    return (
      <div className="min-h-screen bg-[#1C1816] text-[#F2EFE8] flex items-center justify-center p-6 text-center pt-20" dir="rtl">
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-[#C4A070]">المقال غير متوفر أو تم حذفه</h2>
          <p className="text-xs text-[#827771]">تفضل بزيارة المجلة المعمارية لمشاهدة أحدث المقالات المنشورة.</p>
          <Link to="/blog" className="inline-block px-5 py-2 rounded-xl bg-[#C4A070] text-[#1C1816] text-xs font-bold">
            العودة للمجلة
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1C1816] text-[#F2EFE8] min-h-screen font-sans pt-20" dir="rtl">
      <SEO
        title={post.meta_title || `${post.title} | ATELIER`}
        description={post.meta_description || post.excerpt}
        image={post.cover_image || post.og_image}
        slug={`blog/${post.slug}`}
        keywords={post.keywords}
        canonicalUrl={post.canonical_url}
        ogTitle={post.og_title}
        ogDescription={post.og_description}
        ogImage={post.og_image}
        twitterCard={post.twitter_card}
        robotsIndex={post.robots_index}
        robotsFollow={post.robots_follow}
      />

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-xs font-bold text-[#C4A070] hover:text-[#E5C9A3] transition-colors"
        >
          <FaArrowRight className="w-3 h-3" />
          <span>العودة لقائمة المقالات</span>
        </Link>

        <article className="rounded-3xl bg-[#141110] border border-[#C4A070]/20 p-6 sm:p-10 md:p-14 space-y-8 shadow-2xl">
          <header className="space-y-4 border-b border-white/10 pb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#C4A070]">
              <span className="flex items-center gap-1.5 font-bold">
                <FaCalendarDays className="w-3 h-3" />
                {new Date(post.published_at || post.created_at || Date.now()).toLocaleDateString('ar-SA')}
              </span>
              {post.reading_time && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    قراءة {post.reading_time} دقيقة
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#F2EFE8] leading-snug">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-sm text-[#D4B58C] leading-relaxed border-r-2 border-[#C4A070] pr-4">
                {post.excerpt}
              </p>
            )}
          </header>

          {post.cover_image && (
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full max-h-[480px] object-cover" 
              />
            </div>
          )}

          <div 
            className="article-content text-[#DEDAD6] leading-loose pt-4"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }}
          />

          {post.author && (
            <footer className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#827771]">
              <span>بقلم: <strong className="text-[#F2EFE8]">{post.author}</strong></span>
              <span>دار أتيليه للنشر والتصميم المعماري</span>
            </footer>
          )}
        </article>
      </div>
    </div>
  )
}
