import { supabase } from '../../../lib/supabase'
import { compressImage, deleteStorageFileByUrl } from '../../../lib/imageCompressor'

export const offerService = {
  async fetchPublishedOffers() {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('status', 'published')
      .gte('valid_until', today)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async fetchOfferBySlug(slug) {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (error) throw error
    return data
  },

  async fetchAllOffers() {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async deleteOffer(id) {
    const { data: offer } = await supabase
      .from('offers')
      .select('cover_image')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id)
    if (error) throw error

    if (offer?.cover_image) {
      await deleteStorageFileByUrl(offer.cover_image, 'offer-covers')
    }
  },

  async uploadImage(file) {
    const compressedFile = await compressImage(file)
    const fileExt = compressedFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `offers/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('offer-covers')
      .upload(filePath, compressedFile)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('offer-covers').getPublicUrl(filePath)
    return data.publicUrl
  },

  async updateOffer(id, offerData) {
    const { data: oldOffer } = await supabase
      .from('offers')
      .select('cover_image')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('offers')
      .update(offerData)
      .eq('id', id)
    if (error) throw error

    if (oldOffer?.cover_image && oldOffer.cover_image !== offerData.cover_image) {
      await deleteStorageFileByUrl(oldOffer.cover_image, 'offer-covers')
    }
  },

  async insertOffer(offerData) {
    const { error } = await supabase
      .from('offers')
      .insert([offerData])
    if (error) throw error
  }
}

export default offerService
