import { supabase } from '../../../lib/supabase'
import { compressImage, deleteStorageFileByUrl } from '../../../lib/imageCompressor'
import type { Offer, OfferVariant } from '../../../types/database'

export const offerService = {
  async fetchPublishedOffers(): Promise<Offer[]> {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('status', 'published')
      .or(`valid_until.is.null,valid_until.gte.${today}`)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as Offer[]) || []
  },

  async fetchOfferBySlug(slug: string): Promise<Offer | null> {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data as Offer
  },

  async fetchAllOffers(): Promise<Offer[]> {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as Offer[]) || []
  },

  async deleteOffer(id: string): Promise<void> {
    const { data: offer } = await supabase
      .from('offers')
      .select('cover_image, variants')
      .eq('id', id)
      .single()

    const { error } = await supabase.from('offers').delete().eq('id', id)
    if (error) throw error

    const typedOffer = offer as { cover_image?: string | null; variants?: OfferVariant[] } | null
    if (typedOffer?.cover_image) {
      await deleteStorageFileByUrl(typedOffer.cover_image, 'offer-covers')
    }
    if (Array.isArray(typedOffer?.variants)) {
      for (const v of typedOffer.variants) {
        if (v.image) await deleteStorageFileByUrl(v.image, 'offer-covers')
      }
    }
  },

  async uploadImage(file: File): Promise<string> {
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

  async updateOffer(id: string, offerData: Partial<Offer>): Promise<void> {
    const { error } = await supabase
      .from('offers')
      .update(offerData)
      .eq('id', id)
    if (error) throw error
  },

  async insertOffer(offerData: Partial<Offer>): Promise<Offer> {
    const { data, error } = await supabase
      .from('offers')
      .insert([offerData])
      .select()
      .single()
    if (error) throw error
    return data as Offer
  }
}

export default offerService
