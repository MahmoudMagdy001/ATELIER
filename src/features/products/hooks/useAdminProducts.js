import { useState, useEffect } from 'react'
import { productService } from '../services/productService'
import { adminService } from '../../admin/services/adminService'
import { regenerateSitemapAndRobots } from '../../../lib/sitemapGenerator'
import { supabase } from '../../../lib/supabase'

export function useAdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)

  // Basic Form States
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [badge, setBadge] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [status, setStatus] = useState('published')
  const [mainImageFile, setMainImageFile] = useState(null)
  const [mainImageUrl, setMainImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Dynamic Variants State
  const [variants, setVariants] = useState([])

  // SEO States
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
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.fetchAllProducts()
      setProducts(data)
    } catch (err) {
      console.warn('Fetch products fallback:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await adminService.fetchCategories('products')
      setCategories(data)
    } catch (err) {
      console.warn('Fetch categories fallback:', err.message)
    }
  }

  // Variant Helpers
  const addVariant = () => {
    const newVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      price: '',
      image: '',
      sku: '',
      in_stock: true,
    }
    setVariants((prev) => [...prev, newVariant])
  }

  const updateVariant = (id, field, value) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    )
  }

  const removeVariant = (id) => {
    setVariants((prev) => prev.filter((v) => v.id !== id))
  }

  const handleVariantImageUpload = async (id, file) => {
    if (!file) return
    try {
      const url = await productService.uploadImage(file)
      updateVariant(id, 'image', url)
    } catch (err) {
      alert('فشل رفع صورة الخيار: ' + err.message)
    }
  }

  const handleEdit = (product) => {
    setCurrentProduct(product)
    setTitle(product.title || '')
    setSlug(product.slug || '')
    setDescription(product.description || '')
    setBadge(product.badge || '')
    setCategoryId(product.category_id || '')
    setDisplayOrder(product.display_order || 0)
    setStatus(product.status || 'published')
    setMainImageUrl(product.main_image || '')
    setMainImageFile(null)

    // Load existing variants or default to one empty variant
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      setVariants(product.variants)
    } else {
      setVariants([
        {
          id: `var-${Date.now()}`,
          name: 'الخيار القياسي الافتراضي',
          price: 0,
          image: product.main_image || '',
          sku: '',
          in_stock: true,
        },
      ])
    }

    // Populate SEO states
    setMetaTitle(product.meta_title || '')
    setMetaDescription(product.meta_description || '')
    setKeywords(product.keywords || '')
    setCanonicalUrl(product.canonical_url || '')
    setRobotsIndex(product.robots_index ?? true)
    setRobotsFollow(product.robots_follow ?? true)
    setRobotsNoarchive(product.robots_noarchive ?? false)
    setRobotsNosnippet(product.robots_nosnippet ?? false)
    setOgTitle(product.og_title || '')
    setOgDescription(product.og_description || '')
    setOgImage(product.og_image || '')
    setTwitterCard(product.twitter_card || 'summary_large_image')
    setImageAlt(product.image_alt || '')
    setImageTitle(product.image_title || '')

    setIsEditing(true)
  }

  const handleCreateNew = () => {
    setCurrentProduct(null)
    setTitle('')
    setSlug('')
    setDescription('')
    setBadge('')
    setCategoryId('')
    setDisplayOrder(0)
    setStatus('published')
    setMainImageUrl('')
    setMainImageFile(null)

    // Initialize with 1 default variant
    setVariants([
      {
        id: `var-${Date.now()}`,
        name: 'الخيار الأول (مثال: أزرق ملكي - مقاس 220 سم)',
        price: '',
        image: '',
        sku: '',
        in_stock: true,
      },
    ])

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
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج وجميع خياراته نهائياً؟')) return
    try {
      await productService.deleteProduct(id)
      fetchProducts()
      regenerateSitemapAndRobots()
    } catch (err) {
      alert('فشل الحذف: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (variants.length === 0) {
        alert('يرجى إضافة خيار واحد على الأقل للمنتج وتحديد سعره.')
        setSubmitting(false)
        return
      }

      // Check that all variants have a price
      const hasEmptyPrice = variants.some((v) => v.price === '' || isNaN(Number(v.price)))
      if (hasEmptyPrice) {
        alert('يرجى تحديد السعر لكل خيار / Variant مضاف.')
        setSubmitting(false)
        return
      }

      let finalMainImage = mainImageUrl
      if (mainImageFile) {
        finalMainImage = await productService.uploadImage(mainImageFile)
      }

      const targetSlug =
        slug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
          .replace(/(^-|-$)/g, '')

      if (currentProduct && currentProduct.slug !== targetSlug) {
        await supabase
          .from('redirects')
          .insert([
            {
              source_path: `/products/${currentProduct.slug}`,
              target_path: `/products/${targetSlug}`,
              status_code: 301,
            },
          ])
          .catch(() => {})
      }

      const cleanedVariants = variants.map((v) => ({
        ...v,
        price: Number(v.price),
        image: v.image || finalMainImage,
      }))

      const productData = {
        title,
        slug: targetSlug,
        description,
        main_image: finalMainImage,
        badge,
        category_id: categoryId || null,
        display_order: Number(displayOrder),
        status,
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

      if (currentProduct) {
        await productService.updateProduct(currentProduct.id, productData)
      } else {
        await productService.insertProduct(productData)
      }

      setIsEditing(false)
      fetchProducts()
      regenerateSitemapAndRobots()
    } catch (err) {
      alert('فشل حفظ المنتج: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    products,
    categories,
    loading,
    isEditing,
    currentProduct,
    title,
    setTitle,
    slug,
    setSlug,
    description,
    setDescription,
    badge,
    setBadge,
    categoryId,
    setCategoryId,
    displayOrder,
    setDisplayOrder,
    status,
    setStatus,
    mainImageFile,
    setMainImageFile,
    mainImageUrl,
    setMainImageUrl,
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

export default useAdminProducts
