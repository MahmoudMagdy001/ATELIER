import { supabase } from '../../../lib/supabase'
import { compressImage, deleteStorageFileByUrl } from '../../../lib/imageCompressor'

export const productService = {
  async fetchPublishedProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  async fetchProductBySlug(slug) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data
  },

  async fetchAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  async deleteProduct(id) {
    const { data: product } = await supabase
      .from('products')
      .select('main_image, variants')
      .eq('id', id)
      .single()

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error

    if (product?.main_image) {
      await deleteStorageFileByUrl(product.main_image, 'product-images')
    }
    if (Array.isArray(product?.variants)) {
      for (const v of product.variants) {
        if (v.image) await deleteStorageFileByUrl(v.image, 'product-images')
      }
    }
  },

  async uploadImage(file) {
    const compressedFile = await compressImage(file)
    const fileExt = compressedFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, compressedFile)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
    return data.publicUrl
  },

  async updateProduct(id, productData) {
    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
    if (error) throw error
  },

  async insertProduct(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export default productService
