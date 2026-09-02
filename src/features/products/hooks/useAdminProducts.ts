import { useState, useEffect, type FormEvent } from 'react'
import { productService } from '../services/productService'
import { adminService } from '../../admin/services/adminService'
import { regenerateSitemapAndRobots } from '../../../lib/sitemapGenerator'
import { supabase } from '../../../lib/supabase'
import type { LimitedEdition, Category, ProductVariant } from '../../../types/database'

export interface AdminProductVariant extends ProductVariant {
  id: string
  name: string
  price: number | string
  image: string
  sku?: string
  in_stock?: boolean
}

export function useAdminProducts() {
  const [products, setProducts] = useState<LimitedEdition[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentProduct, setCurrentProduct] = useState<LimitedEdition | null>(null)

  // Basic Form States
  const [title, setTitle] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [badge, setBadge] = useState<string>('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [status, setStatus] = useState<string>('published')
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImageUrl, setMainImageUrl] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  // Dynamic Variants State
  const [variants, setVariants] = useState<AdminProductVariant[]>([])

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
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.fetchAllProducts()
      setProducts(data)
    } catch (err: unknown) {
      console.warn('Fetch products fallback:', (err as Error)?.message || err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await adminService.fetchCategories('products')
      setCategories(data)
    } catch (err: unknown) {
      console.warn('Fetch categories fallback:', (err as Error)?.message || err)
    }
  }

  // Variant Helpers
  const addVariant = () => {
    const newVariant: AdminProductVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      price: '',
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
      const url = await productService.uploadImage(file)
      updateVariant(id, 'image', url)
    } catch (err: unknown) {
      alert('فشل رفع صورة الخيار: ' + ((err as Error)?.message || String(err)))
    }
  }

  const handleEdit = (product: LimitedEdition) => {
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
      setVariants(product.variants as AdminProductVariant[])
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج وجميع خياراته نهائياً؟')) return
    try {
      await productService.deleteProduct(id)
      fetchProducts()
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
        try {
          await supabase
            .from('redirects')
            .insert([
              {
                source_path: `/limited-edition/${currentProduct.slug}`,
                target_path: `/limited-edition/${targetSlug}`,
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
        image: v.image || finalMainImage,
      }))

      const productData: Partial<LimitedEdition> = {
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
    } catch (err: unknown) {
      alert('فشل حفظ المنتج: ' + ((err as Error)?.message || String(err)))
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
