import { useState, useEffect } from 'react'
import { blogService } from '../services/blogService'
import { adminService } from '../../admin/services/adminService'
import { regenerateSitemapAndRobots } from '../../../lib/sitemapGenerator'
import { supabase } from '../../../lib/supabase'

export function useAdminPosts() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Basic Form fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [tags, setTags] = useState('')
  const [status, setStatus] = useState('draft')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [categoryId, setCategoryId] = useState('')

  // Advanced SEO fields
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [robotsIndex, setRobotsIndex] = useState(true)
  const [robotsFollow, setRobotsFollow] = useState(true)
  const [robotsNoarchive, setRobotsNoarchive] = useState(false)
  const [robotsNosnippet, setRobotsNosnippet] = useState(false)
  const [ogTitle, setOgTitle] = useState('')
  const [ogDescription, setOgDescription] = useState('')
  const [ogImage, setOgImage] = useState('')
  const [twitterCard, setTwitterCard] = useState('summary_large_image')
  const [imageAlt, setImageAlt] = useState('')
  const [imageTitle, setImageTitle] = useState('')
  const [caption, setCaption] = useState('')

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const data = await blogService.fetchAllPosts()
      setPosts(data)
    } catch (err) {
      console.warn('Posts fetch:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await adminService.fetchCategories('blog')
      setCategories(data)
    } catch (err) {
      console.warn('Categories fetch:', err.message)
    }
  }

  const handleEdit = (post) => {
    setCurrentPost(post)
    setTitle(post.title || '')
    setSlug(post.slug || '')
    setExcerpt(post.excerpt || '')
    setContent(post.content || '')
    setAuthor(post.author || '')
    setTags(post.tags ? (Array.isArray(post.tags) ? post.tags.join(', ') : post.tags) : '')
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

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا المقال نهائياً؟')) return
    try {
      await blogService.deletePost(id)
      fetchPosts()
      regenerateSitemapAndRobots()
    } catch (err) {
      alert('فشل الحذف: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
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
        await supabase.from('redirects').insert([
          {
            source_path: oldPath,
            target_path: newPath,
            status_code: 301,
          },
        ]).catch(() => {})
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

      const postData = {
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
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ: ' + err.message)
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
