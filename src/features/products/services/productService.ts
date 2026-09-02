import { supabase } from '../../../lib/supabase'
import { compressImage, deleteStorageFileByUrl } from '../../../lib/imageCompressor'
import type { LimitedEdition, ProductVariant } from '../../../types/database'

export const productService = {
  async fetchPublishedProducts(): Promise<LimitedEdition[]> {
    const { data, error } = await supabase
      .from('limited_editions')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
    if (error) throw error
    return (data as LimitedEdition[]) || []
  },

  async fetchProductBySlug(slug: string): Promise<LimitedEdition | null> {
    const { data, error } = await supabase
      .from('limited_editions')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data as LimitedEdition
  },

  async fetchAllProducts(): Promise<LimitedEdition[]> {
    const { data, error } = await supabase
      .from('limited_editions')
      .select('*')
      .order('display_order', { ascending: true })
    if (error) throw error
    return (data as LimitedEdition[]) || []
  },

  async deleteProduct(id: string): Promise<void> {
    const { data: product } = await supabase
      .from('limited_editions')
      .select('main_image, variants')
      .eq('id', id)
      .single()

    const { error } = await supabase.from('limited_editions').delete().eq('id', id)
    if (error) throw error

    const typedProduct = product as { main_image?: string | null; variants?: ProductVariant[] } | null
    if (typedProduct?.main_image) {
      await deleteStorageFileByUrl(typedProduct.main_image, 'limited-edition-images')
    }
    if (Array.isArray(typedProduct?.variants)) {
      for (const v of typedProduct.variants) {
        if (v.image) await deleteStorageFileByUrl(v.image, 'limited-edition-images')
      }
    }
  },

  async uploadImage(file: File): Promise<string> {
    const compressedFile = await compressImage(file)
    const fileExt = compressedFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `limited-editions/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('limited-edition-images')
      .upload(filePath, compressedFile)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('limited-edition-images').getPublicUrl(filePath)
    return data.publicUrl
  },

  async updateProduct(id: string, productData: Partial<LimitedEdition>): Promise<void> {
    const { error } = await supabase
      .from('limited_editions')
      .update(productData)
      .eq('id', id)
    if (error) throw error
  },

  async insertProduct(productData: Partial<LimitedEdition>): Promise<LimitedEdition> {
    const { data, error } = await supabase
      .from('limited_editions')
      .insert([productData])
      .select()
      .single()
    if (error) throw error
    return data as LimitedEdition
  }
}

export default productService
