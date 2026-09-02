import { supabase } from '../../../lib/supabase'
import { compressImage } from '../../../lib/imageCompressor'
import type { BespokeServiceConfig } from '../../../types/database'

export const bespokeService = {
  async fetchBespokeContent(): Promise<BespokeServiceConfig | null> {
    const { data, error } = await supabase
      .from('bespoke_service')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
    if (error) throw error
    return data as BespokeServiceConfig | null
  },

  async updateBespokeContent(contentData: Partial<BespokeServiceConfig>): Promise<BespokeServiceConfig> {
    const { data, error } = await supabase
      .from('bespoke_service')
      .upsert({ id: 1, ...contentData, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return data as BespokeServiceConfig
  },

  async uploadHeroImage(file: File): Promise<string> {
    const compressed = await compressImage(file)
    const fileExt = compressed.name.split('.').pop()
    const fileName = `bespoke-hero-${Date.now()}.${fileExt}`
    const filePath = `bespoke/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('media-assets')
      .upload(filePath, compressed)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('media-assets').getPublicUrl(filePath)
    return data.publicUrl
  }
}

export default bespokeService
