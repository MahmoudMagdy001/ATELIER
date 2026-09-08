import { useState, useEffect, useCallback, type FormEvent } from 'react'
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
  const [titleEn, setTitleEn] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [excerpt, setExcerpt] = useState<string>('')
  const [excerptEn, setExcerptEn] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [contentEn, setContentEn] = useState<string>('')
  const [author, setAuthor] = useState<string>('')
  const [authorEn, setAuthorEn] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [status, setStatus] = useState<string>('draft')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState<string>('')

  // Advanced SEO fields
  const [metaTitle, setMetaTitle] = useState<string>('')
  const [metaTitleEn, setMetaTitleEn] = useState<string>('')
  const [metaDescription, setMetaDescription] = useState<string>('')
  const [metaDescriptionEn, setMetaDescriptionEn] = useState<string>('')
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

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await blogService.fetchAllPosts()
      setPosts(data)
    } catch (err: unknown) {
      console.warn('Posts fetch:', (err as Error)?.message || err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const data = await adminService.fetchCategories('blog')
      setCategories(data)
    } catch (err: unknown) {
      console.warn('Categories fetch:', (err as Error)?.message || err)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    Promise.all([
      blogService.fetchAllPosts().catch(err => {
        console.warn('Posts fetch:', (err as Error)?.message || err)
        return []
      }),
      adminService.fetchCategories('blog').catch(err => {
        console.warn('Categories fetch:', (err as Error)?.message || err)
        return []
      }),
    ]).then(([postsData, categoriesData]) => {
      if (isMounted) {
        setPosts(postsData)
        setCategories(categoriesData)
        setLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const handleEdit = (post: Article) => {
    setCurrentPost(post)
    setTitle(post.title || '')
    setTitleEn(post.title_en || '')
    setSlug(post.slug || '')
    setExcerpt(post.excerpt || '')
    setExcerptEn(post.excerpt_en || '')
    setContent(post.content || '')
    setContentEn(post.content_en || '')
    setAuthor(post.author || '')
    setAuthorEn(post.author_en || '')
    setTags(post.tags ? (Array.isArray(post.tags) ? post.tags.join(', ') : String(post.tags)) : '')
    setStatus(post.status || 'draft')
    setImageUrl(post.cover_image || '')
    setImageFile(null)
    setCategoryId(post.category_id || '')

    setMetaTitle(post.meta_title || '')
    setMetaTitleEn(post.meta_title_en || '')
    setMetaDescription(post.meta_description || '')
    setMetaDescriptionEn(post.meta_description_en || '')
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
    setTitleEn('')
    setSlug('')
    setExcerpt('')
    setExcerptEn('')
    setContent('')
    setContentEn('')
    setAuthor('')
    setAuthorEn('')
    setTags('')
    setStatus('draft')
    setImageUrl('')
    setImageFile(null)
    setCategoryId('')

    setMetaTitle('')
    setMetaTitleEn('')
    setMetaDescription('')
    setMetaDescriptionEn('')
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
        title_en: titleEn || null,
        slug: targetSlug,
        excerpt,
        excerpt_en: excerptEn || null,
        content,
        content_en: contentEn || null,
        author,
        author_en: authorEn || null,
        tags: postTags,
        status,
        cover_image: finalImageUrl,
        published_at: publishedAt,
        category_id: categoryId || null,
        word_count: wordCount,
        reading_time: readingTime,
        meta_title: metaTitle,
        meta_title_en: metaTitleEn || null,
        meta_description: metaDescription,
        meta_description_en: metaDescriptionEn || null,
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
    titleEn,
    setTitleEn,
    slug,
    setSlug,
    excerpt,
    setExcerpt,
    excerptEn,
    setExcerptEn,
    content,
    setContent,
    contentEn,
    setContentEn,
    author,
    setAuthor,
    authorEn,
    setAuthorEn,
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
    metaTitleEn,
    setMetaTitleEn,
    metaDescription,
    setMetaDescription,
    metaDescriptionEn,
    setMetaDescriptionEn,
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
    fetchCategories,
  }
}

export default useAdminPosts
