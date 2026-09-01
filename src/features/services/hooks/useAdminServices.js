import { useState, useEffect } from 'react'
import { serviceService } from '../services/serviceService'
import { regenerateSitemapAndRobots } from '../../../lib/sitemapGenerator'
import { supabase } from '../../../lib/supabase'

export function useAdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentService, setCurrentService] = useState(null)

  // Form states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [badge, setBadge] = useState('')
  const [features, setFeatures] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [status, setStatus] = useState('published')
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // SEO specific states
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

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const data = await serviceService.fetchAllServices()
      setServices(data)
    } catch (err) {
      console.warn('Fetch services fallback:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service) => {
    setCurrentService(service)
    setTitle(service.title || '')
    setSlug(service.slug || '')
    setDescription(service.description || '')
    setSubtitle(service.subtitle || '')
    setBadge(service.badge || '')
    setFeatures(Array.isArray(service.features) ? service.features.join('\n') : (service.features || ''))
    setDisplayOrder(service.display_order || 0)
    setStatus(service.status || 'published')
    setImageUrl(service.image || service.hero_image || '')
    setImageFile(null)

    // Populate SEO states
    setMetaTitle(service.meta_title || '')
    setMetaDescription(service.meta_description || '')
    setKeywords(service.keywords || '')
    setCanonicalUrl(service.canonical_url || '')
    setRobotsIndex(service.robots_index ?? true)
    setRobotsFollow(service.robots_follow ?? true)
    setRobotsNoarchive(service.robots_noarchive ?? false)
    setRobotsNosnippet(service.robots_nosnippet ?? false)
    setOgTitle(service.og_title || '')
    setOgDescription(service.og_description || '')
    setOgImage(service.og_image || '')
    setTwitterCard(service.twitter_card || 'summary_large_image')
    setImageAlt(service.image_alt || '')
    setImageTitle(service.image_title || '')

    setIsEditing(true)
  }

  const handleCreateNew = () => {
    setCurrentService(null)
    setTitle('')
    setSlug('')
    setDescription('')
    setSubtitle('')
    setBadge('')
    setFeatures('')
    setDisplayOrder(0)
    setStatus('published')
    setImageUrl('')
    setImageFile(null)

    // Reset SEO states
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

    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذه الخدمة؟')) return
    try {
      await serviceService.deleteService(id)
      fetchServices()
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
        finalImageUrl = await serviceService.uploadImage(imageFile)
      }

      const targetSlug = slug || title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)/g, '')

      if (currentService && currentService.slug !== targetSlug) {
        await supabase.from('redirects').insert([
          {
            source_path: `/services/${currentService.slug}`,
            target_path: `/services/${targetSlug}`,
            status_code: 301,
          },
        ]).catch(() => {})
      }

      const featuresArray = features
        ? features.split('\n').map(f => f.trim()).filter(Boolean)
        : []

      const serviceData = {
        title,
        slug: targetSlug,
        description,
        subtitle,
        features: featuresArray,
        image: finalImageUrl,
        display_order: Number(displayOrder),
        status,
        badge,
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
      }

      if (currentService) {
        await serviceService.updateService(currentService.id, serviceData)
      } else {
        await serviceService.insertService(serviceData)
      }

      setIsEditing(false)
      fetchServices()
      regenerateSitemapAndRobots()
    } catch (err) {
      alert('فشل حفظ الخدمة: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    services,
    loading,
    isEditing,
    currentService,
    title,
    setTitle,
    slug,
    setSlug,
    description,
    setDescription,
    subtitle,
    setSubtitle,
    badge,
    setBadge,
    features,
    setFeatures,
    displayOrder,
    setDisplayOrder,
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
  }
}

export default useAdminServices
