import { useState, useEffect, type FormEvent } from 'react'
import { offerService } from '../services/offerService'
import { productService } from '../../products/services/productService'
import { regenerateSitemapAndRobots } from '../../../lib/sitemapGenerator'
import { supabase } from '../../../lib/supabase'
import type { Offer, OfferVariant, LimitedEdition } from '../../../types/database'

export interface AdminOfferVariant extends OfferVariant {
  id?: string
  name: string
  price: number | string
  original_price?: number | string | null
  image?: string
  sku?: string
  in_stock?: boolean
}

export function useAdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [products, setProducts] = useState<LimitedEdition[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null)

  // Basic Form States
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [discountLabel, setDiscountLabel] = useState<string>('')
  const [validUntil, setValidUntil] = useState<string>('')
  const [badge, setBadge] = useState<string>('')
  const [status, setStatus] = useState<string>('published')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  // Dynamic Variants State
  const [variants, setVariants] = useState<AdminOfferVariant[]>([])

  // SEO States
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

  useEffect(() => {
    fetchOffers()
    fetchProducts()
  }, [])

  const fetchOffers = async () => {
    setLoading(true)
    try {
      const data = await offerService.fetchAllOffers()
      setOffers(data)
    } catch (err: unknown) {
      console.warn('Fetch offers fallback:', (err as Error)?.message || err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const data = await productService.fetchAllProducts()
      setProducts(data)
    } catch (err: unknown) {
      console.warn('Fetch products fallback:', (err as Error)?.message || err)
    }
  }

  // Auto-fill from selected Product
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId)
    if (!productId) return

    const product = products.find((p) => p.id === productId)
    if (!product) return

    setTitle(`عرض حصري: ${product.title}`)
    setSlug(`offer-${product.slug}`)
    setDescription(product.description || '')
    setImageUrl(product.main_image || '')
    setImageFile(null)
    setBadge(product.badge ? `عرض ${product.badge}` : 'عرض خاص لفترة محدودة')
    setDiscountLabel('خصم 15% لفترة محدودة')
    
    // Copy variants with original_price and default 15% discount
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      const copiedVariants: AdminOfferVariant[] = product.variants.map((v) => {
        const origPrice = Number(v.price) || 0
        const discountedPrice = origPrice > 0 ? Math.round(origPrice * 0.85) : 0
        return {
          id: `off-var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: v.name,
          original_price: origPrice,
          price: discountedPrice,
          image: v.image || product.main_image || '',
          sku: v.sku ? `OFF-${v.sku}` : '',
          in_stock: true,
        }
      })
      setVariants(copiedVariants)
    }

    setMetaTitle(`عرض ${product.title} | تخفيضات ATELIER`)
    setMetaDescription(`استفد من العرض الحصري على ${product.title}. خصومات خاصة مع شحن وتركيب مجاني.`)
    setKeywords(product.keywords ? `عروض, ${product.keywords}` : 'عروض أثاث, تخفيضات')
  }

  // Bulk Discount Applier (e.g. apply 20% discount on all variant prices)
  const applyBulkDiscount = (percent: number | string) => {
    if (!percent || isNaN(Number(percent))) return
    const factor = (100 - Number(percent)) / 100
    setVariants((prev) =>
      prev.map((v) => {
        const base = Number(v.original_price) || Number(v.price) || 0
        return {
          ...v,
          original_price: Number(v.original_price) || base,
          price: Math.round(base * factor),
        }
      })
    )
    setDiscountLabel(`خصم ${percent}% لفترة محدودة`)
  }

  // Variant Helpers
  const addVariant = () => {
    const newVariant: AdminOfferVariant = {
      id: `off-var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      price: '',
      original_price: '',
      image: '',
      sku: '',
      in_stock: true,
    }
    setVariants((prev) => [...prev, newVariant])
  }

  const updateVariant = (id: string, field: string, value: unknown) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    )
  }

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id))
  }

  const handleVariantImageUpload = async (id: string, file: File) => {
    if (!file) return
    try {
      const url = await offerService.uploadImage(file)
      updateVariant(id, 'image', url)
    } catch (err: unknown) {
      alert('فشل رفع صورة الخيار: ' + ((err as Error)?.message || String(err)))
    }
  }

  const handleEdit = (offer: Offer) => {
    setCurrentOffer(offer)
    setSelectedProductId(offer.product_id || '')
    setTitle(offer.title || '')
    setSlug(offer.slug || '')
    setDescription(offer.description || '')
    setDiscountLabel(offer.discount_label || '')
    setValidUntil(offer.valid_until || '')
    setBadge(offer.badge || '')
    setStatus(offer.status || 'published')
    setImageUrl(offer.cover_image || '')
    setImageFile(null)

    if (Array.isArray(offer.variants) && offer.variants.length > 0) {
      setVariants(offer.variants as AdminOfferVariant[])
    } else {
      setVariants([
        {
          id: `off-var-${Date.now()}`,
          name: 'الخيار القياسي المشمول بالعرض',
          price: 0,
          original_price: 0,
          image: offer.cover_image || '',
          sku: '',
          in_stock: true,
        },
      ])
    }

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
    setSelectedProductId('')
    setTitle('')
    setSlug('')
    setDescription('')
    setDiscountLabel('')
    setValidUntil('')
    setBadge('')
    setStatus('published')
    setImageUrl('')
    setImageFile(null)

    setVariants([
      {
        id: `off-var-${Date.now()}`,
        name: 'الخيار الأول (مثال: طقم كامل VIP مع التركيب)',
        price: '',
        original_price: '',
        image: '',
        sku: '',
        in_stock: true,
      },
    ])

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

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العرض نهائياً؟')) return
    try {
      await offerService.deleteOffer(id)
      fetchOffers()
      regenerateSitemapAndRobots()
    } catch (err: unknown) {
      alert('فشل الحذف: ' + ((err as Error)?.message || String(err)))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (variants.length === 0) {
        alert('يرجى إضافة خيار واحد على الأقل للعرض وتحديد سعره.')
        setSubmitting(false)
        return
      }

      const hasEmptyPrice = variants.some((v) => v.price === '' || isNaN(Number(v.price)))
      if (hasEmptyPrice) {
        alert('يرجى تحديد سعر العرض لكل خيار / Variant.')
        setSubmitting(false)
        return
      }

      let finalCoverImage = imageUrl
      if (imageFile) {
        finalCoverImage = await offerService.uploadImage(imageFile)
      }

      const targetSlug =
        slug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
          .replace(/(^-|-$)/g, '')

      if (currentOffer && currentOffer.slug !== targetSlug) {
        try {
          await supabase
            .from('redirects')
            .insert([
              {
                source_path: `/offers/${currentOffer.slug}`,
                target_path: `/offers/${targetSlug}`,
                status_code: 301,
              },
            ])
        } catch {
          // ignore
        }
      }

      const cleanedVariants = variants.map((v) => ({
        ...v,
        price: Number(v.price),
        original_price: v.original_price ? Number(v.original_price) : null,
        image: v.image || finalCoverImage,
      }))

      const offerData: Partial<Offer> = {
        title,
        slug: targetSlug,
        description,
        discount_label: discountLabel,
        valid_until: validUntil || null,
        badge,
        status,
        cover_image: finalCoverImage,
        product_id: selectedProductId || null,
        variants: cleanedVariants,
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
    } catch (err: unknown) {
      alert('فشل حفظ العرض: ' + ((err as Error)?.message || String(err)))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    offers,
    products,
    loading,
    isEditing,
    currentOffer,
    selectedProductId,
    handleSelectProduct,
    applyBulkDiscount,
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
    variants,
    setVariants,
    addVariant,
    updateVariant,
    removeVariant,
    handleVariantImageUpload,
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
