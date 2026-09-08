import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { portfolioService } from '../services/portfolioService'
import type { PortfolioItem } from '../../../types/database'

export function useAdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null)

  const [title, setTitle] = useState<string>('')
  const [titleEn, setTitleEn] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [descriptionEn, setDescriptionEn] = useState<string>('')
  const [category, setCategory] = useState<string>('صالونات')
  const [categoryEn, setCategoryEn] = useState<string>('')
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const data = await portfolioService.fetchAllPortfolio()
      setItems(data)
    } catch (err: unknown) {
      console.warn('Fetch portfolio fallback:', (err as Error)?.message || err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    portfolioService.fetchAllPortfolio()
      .then(data => {
        if (mounted) {
          setItems(data)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        console.warn('Fetch portfolio fallback:', (err as Error)?.message || err)
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const handleEdit = (item: PortfolioItem) => {
    setCurrentItem(item)
    setTitle(item.title || '')
    setTitleEn(item.title_en || '')
    setDescription(item.description || '')
    setDescriptionEn(item.description_en || '')
    setCategory(item.category || 'صالونات')
    setCategoryEn(item.category_en || '')
    setDisplayOrder(item.display_order || 0)
    setIsVisible(item.is_visible ?? true)
    setImageUrl(item.image_url || '')
    setImageFile(null)
    setIsEditing(true)
  }

  const handleCreateNew = () => {
    setCurrentItem(null)
    setTitle('')
    setTitleEn('')
    setDescription('')
    setDescriptionEn('')
    setCategory('صالونات')
    setCategoryEn('')
    setDisplayOrder(0)
    setIsVisible(true)
    setImageUrl('')
    setImageFile(null)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العمل من المعرض؟')) return
    try {
      await portfolioService.deletePortfolioItem(id)
      fetchItems()
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
        finalImageUrl = await portfolioService.uploadImage(imageFile)
      }

      if (!finalImageUrl) {
        alert('يرجى تحديد أو رفع صورة للعمل')
        setSubmitting(false)
        return
      }

      const itemData: Partial<PortfolioItem> = {
        title,
        title_en: titleEn || null,
        description,
        description_en: descriptionEn || null,
        category,
        category_en: categoryEn || null,
        display_order: Number(displayOrder),
        is_visible: isVisible,
        image_url: finalImageUrl,
      }

      if (currentItem) {
        await portfolioService.updatePortfolioItem(currentItem.id, itemData)
      } else {
        await portfolioService.insertPortfolioItem(itemData)
      }

      setIsEditing(false)
      fetchItems()
    } catch (err: unknown) {
      alert('فشل الحفظ: ' + ((err as Error)?.message || String(err)))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    items,
    loading,
    isEditing,
    currentItem,
    title,
    setTitle,
    titleEn,
    setTitleEn,
    description,
    setDescription,
    descriptionEn,
    setDescriptionEn,
    category,
    setCategory,
    categoryEn,
    setCategoryEn,
    displayOrder,
    setDisplayOrder,
    isVisible,
    setIsVisible,
    imageUrl,
    setImageUrl,
    imageFile,
    setImageFile,
    submitting,
    handleEdit,
    handleCreateNew,
    handleDelete,
    handleSubmit,
    setIsEditing,
  }
}

export default useAdminPortfolio
