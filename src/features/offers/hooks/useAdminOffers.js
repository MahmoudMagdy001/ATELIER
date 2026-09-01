import { useState, useEffect } from 'react'
import { offerService } from '../services/offerService'
import { regenerateSitemapAndRobots } from '../../../lib/sitemapGenerator'
import { supabase } from '../../../lib/supabase'

export function useAdminOffers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentOffer, setCurrentOffer] = useState(null)

  // Form states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [discountLabel, setDiscountLabel] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [badge, setBadge] = useState('')
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
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    setLoading(true)
    try {
      const data = await offerService.fetchAllOffers()
      setOffers(data)
    } catch (err) {
      console.warn('Fetch offers fallback:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (offer) => {
    setCurrentOffer(offer)
    setTitle(offer.title || '')
    setSlug(offer.slug || '')
    setDescription(offer.description || '')
    setDiscountLabel(offer.discount_label || offer.discount_text || '')
    setValidUntil(offer.valid_until || '')
    setBadge(offer.badge || '')
    setStatus(offer.status || 'published')
    setImageUrl(offer.cover_image || offer.banner_image || '')
    setImageFile(null)

    // Populate SEO states
    setMetaTitle(offer.meta_title || '')
    setMetaDescription(offer.meta_description || '')
    setKeywords(offer.keywords || '')
    setCanonicalUrl(offer.canonical_url || '')
    setRobotsIndex(offer.robots_index ?? true)
    setRobotsFollow(offer.robots_follow ?? true)
    setRobotsNoarchive(offer.robots_noarchive ?? false)
    setRobotsNosnippet(offer.robots_nosnippet ?? false)
    setOgTitle(offer.og_title || '')
    setOgDescription(offer.og_description || '')
    setOgImage(offer.og_image || '')
    setTwitterCard(offer.twitter_card || 'summary_large_image')
    setImageAlt(offer.image_alt || '')
    setImageTitle(offer.image_title || '')

    setIsEditing(true)
  }

  const handleCreateNew = () => {
    setCurrentOffer(null)
    setTitle('')
    setSlug('')
    setDescription('')
    setDiscountLabel('')
    setValidUntil('')
    setBadge('')
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
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا العرض؟')) return
    try {
      await offerService.deleteOffer(id)
      fetchOffers()
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
        finalImageUrl = await offerService.uploadImage(imageFile)
      }

      const targetSlug = slug || title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)/g, '')

      if (currentOffer && currentOffer.slug !== targetSlug) {
        await supabase.from('redirects').insert([
          {
            source_path: `/offers/${currentOffer.slug}`,
            target_path: `/offers/${targetSlug}`,
            status_code: 301,
          },
        ]).catch(() => {})
      }

      const offerData = {
        title,
        slug: targetSlug,
        description,
        discount_label: discountLabel,
        valid_until: validUntil || null,
        badge,
        status,
        cover_image: finalImageUrl,
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

      if (currentOffer) {
        await offerService.updateOffer(currentOffer.id, offerData)
      } else {
        await offerService.insertOffer(offerData)
      }

      setIsEditing(false)
      fetchOffers()
      regenerateSitemapAndRobots()
    } catch (err) {
      alert('فشل حفظ العرض: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    offers,
    loading,
    isEditing,
    currentOffer,
    title,
    setTitle,
    slug,
    setSlug,
    description,
    setDescription,
    discountLabel,
    setDiscountLabel,
    validUntil,
    setValidUntil,
    badge,
    setBadge,
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

export default useAdminOffers
