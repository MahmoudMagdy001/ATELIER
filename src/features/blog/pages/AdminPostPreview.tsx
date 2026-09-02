import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { blogService } from '../services/blogService'
import { PageLoading } from '../../../components/ui/Loading'
import { FaArrowRight, FaCalendar } from 'react-icons/fa6'
import DOMPurify from 'dompurify'
import type { Article } from '../../../types/database'
import '../../../styles/article.css'

export default function AdminPostPreview() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Article | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadPost() {
      if (!id) {
        setLoading(false)
        return
      }
      try {
        const data = await blogService.fetchPostById(id)
        setPost(data)
      } catch (err: unknown) {
        console.warn('Failed to load post preview:', (err as Error)?.message || err)
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [id])

  if (loading) return <PageLoading text="جار تحميل المعاينة..." />

  if (!post) {
    return (
      <div className="p-12 text-center text-xs text-[#8C7F75] bg-white rounded-2xl border border-[#E6E1DC]" dir="rtl">
        المقال المطلوب غير موجود أو تم حذفه.
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/posts"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#C5A880] hover:underline"
        >
          <FaArrowRight className="w-3 h-3" />
          <span>العودة لقائمة المقالات</span>
        </Link>
        <span className="text-xs px-3 py-1 rounded-full bg-[#C5A880]/15 text-[#8C6A2D] font-bold">
          وضع المعاينة (Preview Mode)
        </span>
      </div>

      <article className="bg-white rounded-3xl p-8 md:p-12 space-y-8 border border-[#E6E1DC] shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-[#C5A880]">
            <span className="flex items-center gap-1 font-bold">
              <FaCalendar className="w-3 h-3" /> {new Date(post.created_at || Date.now()).toLocaleDateString('ar-SA')}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#14110F] leading-tight">
            {post.title}
          </h1>

          <p className="text-sm text-[#5C544E] leading-relaxed border-r-2 border-[#C5A880] pr-4">
            {post.excerpt}
          </p>
        </div>

        {post.cover_image && (
          <div className="rounded-2xl overflow-hidden border border-[#E6E1DC]">
            <img src={post.cover_image} alt={post.title} className="w-full max-h-[450px] object-cover" />
          </div>
        )}

        <div 
          className="article-content article-theme-light pt-4 border-t border-[#E6E1DC]"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }}
        />
      </article>
    </div>
  )
}
