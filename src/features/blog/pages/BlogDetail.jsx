import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogService } from '../services/blogService'
import SEO from '../../../components/ui/SEO'
import { PageLoading } from '../../../components/ui/Loading'
import { fadeUp, staggerContainer, viewportOnce, springHover, cardHover } from '../../../constants/animations'
import { 
  FaArrowRight, 
  FaArrowLeft, 
  FaCalendarDays, 
  FaClock, 
  FaShareNodes, 
  FaWhatsapp, 
  FaXTwitter, 
  FaLinkedinIn, 
  FaLink, 
  FaCheck, 
  FaBookOpen, 
  FaGem, 
  FaUserTie,
  FaChevronLeft
} from 'react-icons/fa6'
import DOMPurify from 'dompurify'
import '../../../styles/article.css'

export default function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [copied, setCopied] = useState(false)

  // Scroll reading progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (windowHeight > 0) {
        const scroll = (totalScroll / windowHeight) * 100
        setScrollProgress(Number(scroll.toFixed(2)))
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load article and related posts
  useEffect(() => {
    async function loadPostAndRelated() {
      setLoading(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      try {
        const data = await blogService.fetchPostBySlug(slug)
        setPost(data)

        // Load related articles
        const allPosts = await blogService.fetchPublishedPosts()
        const others = allPosts.filter(p => p.slug !== slug).slice(0, 3)
        setRelatedPosts(others)
      } catch (err) {
        console.warn('Failed to load post:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadPostAndRelated()
  }, [slug])

  const copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (loading) return <PageLoading text="جار تحميل المقال المعماري..." />

  if (!post) {
    return (
      <div className="min-h-screen bg-[#1C1816] text-[#F2EFE8] flex items-center justify-center p-6 text-center pt-24" dir="rtl">
        <div className="max-w-md space-y-6 bg-[#141110] border border-[#C4A070]/20 p-8 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#C4A070]/10 border border-[#C4A070]/30 flex items-center justify-center mx-auto text-[#C4A070]">
            <FaBookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#F2EFE8]">المقال غير متوفر أو تم نقله</h2>
          <p className="text-sm text-[#827771] leading-relaxed">
            لم نتمكن من العثور على المقال المطلوب، يمكنك تصفح المقالات الأخرى في المجلة المعمارية.
          </p>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C4A070] text-[#1C1816] text-xs font-bold hover:bg-[#D4B58C] transition-all shadow-lg shadow-[#C4A070]/20"
          >
            <FaArrowRight className="w-3.5 h-3.5" />
            <span>العودة للمجلة المعمارية</span>
          </Link>
        </div>
      </div>
    )
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = encodeURIComponent(post.title)
  const shareUrl = encodeURIComponent(currentUrl)

  const tagsList = Array.isArray(post.tags) 
    ? post.tags 
    : (post.keywords ? post.keywords.split(',').map(k => k.trim()) : [])

  return (
    <div className="bg-[#1C1816] text-[#F2EFE8] min-h-screen font-sans relative selection:bg-[#C4A070]/30 selection:text-[#F2EFE8]" dir="rtl">
      {/* Dynamic Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-gradient-to-r from-[#9E7939] via-[#C4A070] to-[#F0DEC8] transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

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

      {/* Top Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(196,160,112,0.15),transparent)] pointer-events-none" />

      <main className="relative pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Navigation & Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2 text-[#827771]">
              <Link to="/" className="hover:text-[#C4A070] transition-colors">الرئيسية</Link>
              <FaChevronLeft className="w-2.5 h-2.5 opacity-40" />
              <Link to="/blog" className="hover:text-[#C4A070] transition-colors">المجلة المعمارية</Link>
              <FaChevronLeft className="w-2.5 h-2.5 opacity-40" />
              <span className="text-[#C4A070] font-medium truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
            </div>

            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#C4A070] hover:bg-[#C4A070]/10 hover:border-[#C4A070]/30 transition-all group"
            >
              <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              <span>جميع المقالات</span>
            </Link>
          </div>

          {/* Editorial Article Header */}
          <header className="space-y-6">
            {/* Category / Journal Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C4A070]/10 border border-[#C4A070]/30 text-[#C4A070] text-xs font-bold tracking-wider">
              <FaGem className="w-3 h-3" />
              <span>دراسات معمارية وفنون الأثاث</span>
            </div>

            {/* Main Article Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F2EFE8] leading-tight md:leading-[1.25] tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt Lead Card */}
            {post.excerpt && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#141110] border-r-4 border-r-[#C4A070] border border-white/5 shadow-xl">
                <p className="text-base sm:text-lg text-[#D4B58C] font-light leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            )}

            {/* Author & Meta Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-b border-white/10 py-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C4A070] to-[#7A5D2B] p-[2px] shadow-md">
                  <div className="w-full h-full rounded-full bg-[#1C1816] flex items-center justify-center text-[#C4A070]">
                    <FaUserTie className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#F2EFE8] flex items-center gap-1.5">
                    <span>{post.author || 'دار أتيليه للنشر والتصميم'}</span>
                  </div>
                  <div className="text-xs text-[#827771]">
                    فريق العمارة والتأثيث الحصري
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 text-xs text-[#827771]">
                <span className="flex items-center gap-1.5 font-medium text-[#C4A070]">
                  <FaCalendarDays className="w-3.5 h-3.5" />
                  {new Date(post.published_at || post.created_at || Date.now()).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>

                {post.reading_time && (
                  <span className="flex items-center gap-1.5">
                    <FaClock className="w-3.5 h-3.5 text-[#827771]" />
                    <span>قراءة {post.reading_time} دقائق</span>
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* Featured Cover Image */}
          {post.cover_image && (
            <div className="relative rounded-3xl overflow-hidden border border-[#C4A070]/20 shadow-2xl group">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full max-h-[540px] object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141110]/60 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* Article Rich Content Body */}
          <article className="rounded-3xl bg-[#141110] border border-[#C4A070]/15 p-6 sm:p-10 md:p-14 shadow-2xl">
            <div 
              className="article-content article-theme-dark"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }}
            />

            {/* Tags / Keywords Section */}
            {tagsList.length > 0 && (
              <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#827771] ml-2">المواضيع والوسوم:</span>
                {tagsList.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#D4B58C] hover:bg-[#C4A070]/10 hover:border-[#C4A070]/30 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Interactive Share Box */}
          <div className="rounded-2xl bg-[#141110] border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-right">
              <h3 className="text-base font-serif font-bold text-[#F2EFE8] flex items-center justify-center sm:justify-start gap-2">
                <FaShareNodes className="w-4 h-4 text-[#C4A070]" />
                <span>مشاركة المقال المعماري</span>
              </h3>
              <p className="text-xs text-[#827771]">
                شارك هذا المحتوى الملهم مع المهتمين بالعمارة والتصميم الداخلي الفاخر.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-md"
                title="مشاركة عبر واتساب"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-[#F2EFE8] flex items-center justify-center hover:bg-white/20 transition-all shadow-md"
                title="مشاركة على منصة X"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all shadow-md"
                title="مشاركة على لينكد إن"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>

              <button
                onClick={copyArticleLink}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#C4A070] hover:bg-[#C4A070]/10 hover:border-[#C4A070]/30 transition-all cursor-pointer"
                title="نسخ الرابط"
              >
                {copied ? (
                  <>
                    <FaCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <FaLink className="w-3.5 h-3.5" />
                    <span>نسخ الرابط</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Author Editorial Signature Box */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1C1816] to-[#141110] border border-[#C4A070]/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#C4A070]/10 border border-[#C4A070]/30 flex items-center justify-center text-[#C4A070] shrink-0">
              <FaBookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-2 text-center sm:text-right flex-1">
              <div className="text-xs uppercase tracking-widest text-[#C4A070] font-bold">
                عن دار النشر المعماري
              </div>
              <h4 className="text-lg font-serif font-bold text-[#F2EFE8]">
                {post.author || 'فريق التصميم والأبحاث المعمارية | ATELIER'}
              </h4>
              <p className="text-xs text-[#827771] leading-relaxed">
                تصدر مقالات المجلة المعمارية عن استوديو أتيليه للتصميم وتأثيث القصور والمساحات الفاخرة، بالتعاون مع نخبة من كبار المعماريين والحرفيين في إيطاليا والشرق الأوسط.
              </p>
            </div>
          </div>

          {/* Bespoke Furniture Consultation CTA */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2B2117] via-[#1C1816] to-[#141110] border border-[#C4A070]/40 p-8 sm:p-12 shadow-2xl text-center space-y-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,160,112,0.15),transparent)] pointer-events-none" />
            <div className="relative space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-[0.2em] text-[#C4A070] uppercase">
                BESPOKE ARCHITECTURAL FURNITURE
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F2EFE8]">
                هل ترغب في صياغة قطع أثاث خاصة بمساحتك المعمارية؟
              </h3>
              <p className="text-xs sm:text-sm text-[#DEDAD6] leading-relaxed">
                استشر مهندسي ومصممي أتيليه لبدء دراسة أبعاد وتصميم قطع حصرية تليق بفخامة قصرك أو منزلك.
              </p>
            </div>

            <div className="relative pt-2">
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#C4A070] text-[#1C1816] text-xs font-bold hover:bg-[#D4B58C] transition-all shadow-xl shadow-[#C4A070]/20 hover:scale-105"
              >
                <span>طلب استشارة تصميم معمارية</span>
                <FaArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="space-y-6 pt-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#F2EFE8]">مقالات معمارية ذات صلة</h3>
                  <p className="text-xs text-[#827771] mt-1">استكشف المزيد من الإلهام والتصاميم الفاخرة</p>
                </div>
                <Link 
                  to="/blog" 
                  className="text-xs text-[#C4A070] hover:text-[#E5C9A3] flex items-center gap-1 font-bold"
                >
                  <span>عرض الكل</span>
                  <FaArrowLeft className="w-2.5 h-2.5" />
                </Link>
              </div>

              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {relatedPosts.map((rPost, idx) => (
                  <motion.div
                    key={rPost.id}
                    variants={fadeUp}
                    custom={idx}
                    whileHover={cardHover}
                    transition={springHover}
                  >
                    <Link
                      to={`/blog/${rPost.slug}`}
                      className="group rounded-2xl bg-[#141110] border border-[#C4A070]/20 overflow-hidden hover:border-[#C4A070] transition-all duration-300 flex flex-col shadow-lg block h-full hover:shadow-[#C4A070]/10"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#1C1816]">
                        {rPost.cover_image ? (
                          <img
                            src={rPost.cover_image}
                            alt={rPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#C4A070]/30">
                            <FaBookOpen className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] text-[#C4A070]">
                            <FaCalendarDays className="w-2.5 h-2.5" />
                            <span>{new Date(rPost.published_at || rPost.created_at || Date.now()).toLocaleDateString('ar-SA')}</span>
                            {rPost.reading_time && (
                              <>
                                <span>•</span>
                                <span>{rPost.reading_time} د</span>
                              </>
                            )}
                          </div>

                          <h4 className="text-sm font-bold font-serif text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors leading-snug line-clamp-2">
                            {rPost.title}
                          </h4>

                          <p className="text-[11px] text-[#827771] line-clamp-2 leading-relaxed">
                            {rPost.excerpt}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-bold text-[#C4A070]">
                          <span>قراءة المقال</span>
                          <FaArrowLeft className="w-2.5 h-2.5 group-hover:translate-x-[-3px] transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
