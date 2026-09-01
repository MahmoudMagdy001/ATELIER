import { supabase } from '../../../lib/supabase'
import { compressImage, deleteStorageFileByUrl } from '../../../lib/imageCompressor'

export const serviceService = {
  async fetchPublishedServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  async fetchServiceBySlug(slug) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (error) throw error
    return data
  },

  async fetchAllServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  async deleteService(id) {
    const { data: service } = await supabase
      .from('services')
      .select('image')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
    if (error) throw error

    if (service?.image) {
      await deleteStorageFileByUrl(service.image, 'service-images')
    }
  },

  async uploadImage(file) {
    const compressedFile = await compressImage(file)
    const fileExt = compressedFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `services/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('service-images')
      .upload(filePath, compressedFile)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('service-images').getPublicUrl(filePath)
    return data.publicUrl
  },

  async updateService(id, serviceData) {
    const { data: oldService } = await supabase
      .from('services')
      .select('image')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
    if (error) throw error

    if (oldService?.image && oldService.image !== serviceData.image) {
      await deleteStorageFileByUrl(oldService.image, 'service-images')
    }
  },

  async insertService(serviceData) {
    const { error } = await supabase
      .from('services')
      .insert([serviceData])
    if (error) throw error
  }
}

export default serviceService
