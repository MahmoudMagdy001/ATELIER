import { useState, useEffect } from 'react'
import { portfolioService } from '../services/portfolioService'

export function useAdminPortfolio() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('صالونات')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const data = await portfolioService.fetchAllPortfolio()
      setItems(data)
    } catch (err) {
      console.warn('Fetch portfolio fallback:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
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

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العمل من المعرض؟')) return
    try {
      await portfolioService.deletePortfolioItem(id)
      fetchItems()
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
        finalImageUrl = await portfolioService.uploadImage(imageFile)
      }

      if (!finalImageUrl) {
        alert('يرجى تحديد أو رفع صورة للعمل')
        setSubmitting(false)
        return
      }

      const itemData = {
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
    } catch (err) {
      alert('فشل الحفظ: ' + err.message)
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
