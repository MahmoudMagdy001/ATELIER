import { useState, useEffect, type FormEvent } from 'react'
import { blogService } from '../services/blogService'
import { adminService } from '../../admin/services/adminService'
import { regenerateSitemapAndRobots } from '../../../lib/sitemapGenerator'
import { supabase } from '../../../lib/supabase'
import type { Article, Category } from '../../../types/database'

export function useAdminPosts() {
  const [posts, setPosts] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentPost, setCurrentPost] = useState<Article | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  // Basic Form fields
  const [title, setTitle] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [excerpt, setExcerpt] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [author, setAuthor] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [status, setStatus] = useState<string>('draft')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState<string>('')

  // Advanced SEO fields
  const [metaTitle, setMetaTitle] = useState<string>('')
  const [metaDescription, setMetaDescription] = useState<string>('')
  const [keywords, setKeywords] = useState<string>('')
  const [canonicalUrl, setCanonicalUrl] = useState<string>('')
  const [robotsIndex, setRobotsIndex] = useState<boolean>(true)
  const [robotsFollow, setRobotsFollow] = useState<boolean>(true)
  const [robotsNoarchive, setRobotsNoarchive] = useState<boolean>(false)
  const [robotsNosnippet, setRobotsNosnippet] = useState<boolean>(false)
  const [ogTitle, setOgTitle] = useState<string>('')
  const [ogDescription, setOgDescription] = useState<string>('')
  const [ogImage, setOgImage] = useState<string>('')
  const [twitterCard, setTwitterCard] = useState<string>('summary_large_image')
  const [imageAlt, setImageAlt] = useState<string>('')
  const [imageTitle, setImageTitle] = useState<string>('')
  const [caption, setCaption] = useState<string>('')

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const data = await blogService.fetchAllPosts()
      setPosts(data)
    } catch (err: unknown) {
      console.warn('Posts fetch:', (err as Error)?.message || err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await adminService.fetchCategories('blog')
      setCategories(data)
    } catch (err: unknown) {
      console.warn('Categories fetch:', (err as Error)?.message || err)
    }
  }

  const handleEdit = (post: Article) => {
    setCurrentPost(post)
    setTitle(post.title || '')
    setSlug(post.slug || '')
    setExcerpt(post.excerpt || '')
    setContent(post.content || '')
    setAuthor(post.author || '')
    setTags(post.tags ? (Array.isArray(post.tags) ? post.tags.join(', ') : String(post.tags)) : '')
    setStatus(post.status || 'draft')
    setImageUrl(post.cover_image || '')
    setImageFile(null)
    setCategoryId(post.category_id || '')

    setMetaTitle(post.meta_title || '')
    setMetaDescription(post.meta_description || '')
    setKeywords(post.keywords || '')
    setCanonicalUrl(post.canonical_url || '')
    setRobotsIndex(post.robots_index ?? true)
    setRobotsFollow(post.robots_follow ?? true)
    setRobotsNoarchive(post.robots_noarchive ?? false)
    setRobotsNosnippet(post.robots_nosnippet ?? false)
    setOgTitle(post.og_title || '')
    setOgDescription(post.og_description || '')
    setOgImage(post.og_image || '')
    setTwitterCard(post.twitter_card || 'summary_large_image')
    setImageAlt(post.image_alt || '')
    setImageTitle(post.image_title || '')
    setCaption(post.caption || '')

    setIsEditing(true)
  }

  const handleCreateNew = () => {
    setCurrentPost(null)
    setTitle('')
    setSlug('')
    setExcerpt('')
    setContent('')
    setAuthor('')
    setTags('')
    setStatus('draft')
    setImageUrl('')
    setImageFile(null)
    setCategoryId('')

    setMetaTitle('')
    setMetaDescription('')
    setKeywords('')
    setCanonicalUrl('')
    setRobotsIndex(true)
    setRobotsFollow(true)
    setRobotsNoarchive(false)
    setRobotsNosnippet(false)
    setOgTitle('')
    setOgDescription('')
    setOgImage('')
    setTwitterCard('summary_large_image')
    setImageAlt('')
    setImageTitle('')
    setCaption('')

    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا المقال نهائياً؟')) return
    try {
      await blogService.deletePost(id)
      fetchPosts()
      regenerateSitemapAndRobots()
    } catch (err: unknown) {
      alert('فشل الحذف: ' + ((err as Error)?.message || String(err)))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let finalImageUrl = imageUrl
      if (imageFile) {
        finalImageUrl = await blogService.uploadImage(imageFile)
      }

      const postTags = tags
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []

      const targetSlug = slug || title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)/g, '')

      if (currentPost && currentPost.slug !== targetSlug) {
        const oldPath = `/blog/${currentPost.slug}`
        const newPath = `/blog/${targetSlug}`
        try {
          await supabase.from('redirects').insert([
            {
              source_path: oldPath,
              target_path: newPath,
              status_code: 301,
            },
          ])
        } catch {
          // ignore
        }
      }

      const textContent = content ? content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : ''
      const wordCount = textContent ? textContent.split(/\s+/).length : 0
      const readingTime = Math.max(1, Math.ceil(wordCount / 200))

      let publishedAt = currentPost?.published_at || null
      if (status === 'published' && !publishedAt) {
        publishedAt = new Date().toISOString()
      } else if (status !== 'published') {
        publishedAt = null
      }

      const postData: Partial<Article> = {
        title,
        slug: targetSlug,
        excerpt,
        content,
        author,
        tags: postTags,
        status,
        cover_image: finalImageUrl,
        published_at: publishedAt,
        category_id: categoryId || null,
        word_count: wordCount,
        reading_time: readingTime,
        meta_title: metaTitle,
        meta_description: metaDescription,
        keywords,
        canonical_url: canonicalUrl,
        robots_index: robotsIndex,
        robots_follow: robotsFollow,
        robots_noarchive: robotsNoarchive,
        robots_nosnippet: robotsNosnippet,
        og_title: ogTitle,
        og_description: ogDescription,
        og_image: ogImage,
        twitter_card: twitterCard,
        image_alt: imageAlt,
        image_title: imageTitle,
        caption,
      }

      if (!currentPost) {
        postData.views = 0
      }

      if (currentPost) {
        await blogService.updatePost(currentPost.id, postData)
      } else {
        await blogService.insertPost(postData)
      }

      setIsEditing(false)
      fetchPosts()
      regenerateSitemapAndRobots()
    } catch (err: unknown) {
      alert('حدث خطأ أثناء الحفظ: ' + ((err as Error)?.message || String(err)))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    posts,
    loading,
    isEditing,
    currentPost,
    title,
    setTitle,
    slug,
    setSlug,
    excerpt,
    setExcerpt,
    content,
    setContent,
    author,
    setAuthor,
    tags,
    setTags,
    status,
    setStatus,
    imageFile,
    setImageFile,
    imageUrl,
    setImageUrl,
    submitting,
    handleEdit,
    handleCreateNew,
    handleDelete,
    handleSubmit,
    setIsEditing,
    categoryId,
    setCategoryId,
    categories,
    metaTitle,
    setMetaTitle,
    metaDescription,
    setMetaDescription,
    keywords,
    setKeywords,
    canonicalUrl,
    setCanonicalUrl,
    robotsIndex,
    setRobotsIndex,
    robotsFollow,
    setRobotsFollow,
    robotsNoarchive,
    setRobotsNoarchive,
    robotsNosnippet,
    setRobotsNosnippet,
    ogTitle,
    setOgTitle,
    ogDescription,
    setOgDescription,
    ogImage,
    setOgImage,
    twitterCard,
    setTwitterCard,
    imageAlt,
    setImageAlt,
    imageTitle,
    setImageTitle,
    caption,
    setCaption,
  }
}

export default useAdminPosts
