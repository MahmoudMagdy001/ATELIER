import { useState, useEffect, type FormEvent } from 'react'
import { portfolioService } from '../services/portfolioService'
import type { PortfolioItem } from '../../../types/database'

export function useAdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null)

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [category, setCategory] = useState<string>('صالونات')
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const data = await portfolioService.fetchAllPortfolio()
      setItems(data)
    } catch (err: unknown) {
      console.warn('Fetch portfolio fallback:', (err as Error)?.message || err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: PortfolioItem) => {
    setCurrentItem(item)
    setTitle(item.title || '')
    setDescription(item.description || '')
    setCategory(item.category || 'صالونات')
    setDisplayOrder(item.display_order || 0)
    setIsVisible(item.is_visible ?? true)
    setImageUrl(item.image_url || '')
    setImageFile(null)
    setIsEditing(true)
  }

  const handleCreateNew = () => {
    setCurrentItem(null)
    setTitle('')
    setDescription('')
    setCategory('صالونات')
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
        description,
        category,
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
    description,
    setDescription,
    category,
    setCategory,
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
