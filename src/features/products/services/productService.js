import { supabase } from '../../../lib/supabase'
import { compressImage, deleteStorageFileByUrl } from '../../../lib/imageCompressor'

export const productService = {
  async fetchPublishedProducts() {
    const { data, error } = await supabase
      .from('limited_editions')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  async fetchProductBySlug(slug) {
    const { data, error } = await supabase
      .from('limited_editions')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data
  },

  async fetchAllProducts() {
    const { data, error } = await supabase
      .from('limited_editions')
      .select('*')
      .order('display_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  async deleteProduct(id) {
    const { data: product } = await supabase
      .from('limited_editions')
      .select('main_image, variants')
      .eq('id', id)
      .single()

    const { error } = await supabase.from('limited_editions').delete().eq('id', id)
    if (error) throw error

    if (product?.main_image) {
      await deleteStorageFileByUrl(product.main_image, 'limited-edition-images')
    }
    if (Array.isArray(product?.variants)) {
      for (const v of product.variants) {
        if (v.image) await deleteStorageFileByUrl(v.image, 'limited-edition-images')
      }
    }
  },

  async uploadImage(file) {
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

  async updateProduct(id, productData) {
    const { error } = await supabase
      .from('limited_editions')
      .update(productData)
      .eq('id', id)
    if (error) throw error
  },

  async insertProduct(productData) {
    const { data, error } = await supabase
      .from('limited_editions')
      .insert([productData])
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export default productService
