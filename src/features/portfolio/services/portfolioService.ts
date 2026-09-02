import { supabase } from '../../../lib/supabase'
import { compressImage, deleteStorageFileByUrl } from '../../../lib/imageCompressor'
import type { PortfolioItem } from '../../../types/database'

export const portfolioService = {
  async fetchVisiblePortfolio(): Promise<PortfolioItem[]> {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return (data as PortfolioItem[]) || []
  },

  async fetchAllPortfolio(): Promise<PortfolioItem[]> {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('display_order', { ascending: true })
    if (error) throw error
    return (data as PortfolioItem[]) || []
  },

  async insertPortfolioItem(itemData: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio')
      .insert([itemData])
      .select()
      .single()
    if (error) throw error
    return data as PortfolioItem
  },

  async updatePortfolioItem(id: string, itemData: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio')
      .update(itemData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as PortfolioItem
  },

  async deletePortfolioItem(id: string): Promise<void> {
    const { data: item } = await supabase
      .from('portfolio')
      .select('image_url')
      .eq('id', id)
      .single()

    const { error } = await supabase.from('portfolio').delete().eq('id', id)
    if (error) throw error

    const typedItem = item as { image_url?: string | null } | null
    if (typedItem?.image_url) {
      await deleteStorageFileByUrl(typedItem.image_url, 'media-assets')
    }
  },

  async uploadImage(file: File): Promise<string> {
    const compressed = await compressImage(file)
    const fileExt = compressed.name.split('.').pop()
    const fileName = `portfolio-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `portfolio/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('media-assets')
      .upload(filePath, compressed)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('media-assets').getPublicUrl(filePath)
    return data.publicUrl
  }
}

export default portfolioService
