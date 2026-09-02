import { supabase } from '../../../lib/supabase'
import { compressImage } from '../../../lib/imageCompressor'
import type { 
  SiteSettings, 
  RobotsSettings, 
  RedirectRule, 
  CustomScript, 
  Category, 
  MediaItem 
} from '../../../types/database'

export const adminService = {
  // Site Settings
  async fetchSettings(): Promise<SiteSettings | null> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
    if (error) throw error
    return data as SiteSettings | null
  },

  async updateSettings(settingsData: Partial<SiteSettings>): Promise<SiteSettings> {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...settingsData, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return data as SiteSettings
  },

  // Robots Settings
  async fetchRobots(): Promise<RobotsSettings | null> {
    const { data, error } = await supabase
      .from('robots_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
    if (error) throw error
    return data as RobotsSettings | null
  },

  async updateRobots(robotsData: Partial<RobotsSettings>): Promise<RobotsSettings> {
    const { data, error } = await supabase
      .from('robots_settings')
      .upsert({ id: 1, ...robotsData, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return data as RobotsSettings
  },

  // Redirects Manager
  async fetchRedirects(): Promise<RedirectRule[]> {
    const { data, error } = await supabase
      .from('redirects')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as RedirectRule[]) || []
  },

  async insertRedirect(redirectData: Partial<RedirectRule>): Promise<RedirectRule> {
    const { data, error } = await supabase
      .from('redirects')
      .insert([redirectData])
      .select()
      .single()
    if (error) throw error
    return data as RedirectRule
  },

  async updateRedirect(id: string, redirectData: Partial<RedirectRule>): Promise<RedirectRule> {
    const { data, error } = await supabase
      .from('redirects')
      .update(redirectData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as RedirectRule
  },

  async deleteRedirect(id: string): Promise<void> {
    const { error } = await supabase
      .from('redirects')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Custom Script Manager
  async fetchScripts(): Promise<CustomScript[]> {
    const { data, error } = await supabase
      .from('custom_scripts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as CustomScript[]) || []
  },

  async insertScript(scriptData: Partial<CustomScript>): Promise<CustomScript> {
    const { data, error } = await supabase
      .from('custom_scripts')
      .insert([scriptData])
      .select()
      .single()
    if (error) throw error
    return data as CustomScript
  },

  async updateScript(id: string, scriptData: Partial<CustomScript>): Promise<CustomScript> {
    const { data, error } = await supabase
      .from('custom_scripts')
      .update(scriptData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as CustomScript
  },

  async deleteScript(id: string): Promise<void> {
    const { error } = await supabase
      .from('custom_scripts')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Categories Manager
  async fetchCategories(type = ''): Promise<Category[]> {
    let query = supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
    if (type) {
      query = query.eq('type', type)
    }
    const { data, error } = await query
    if (error) throw error
    return (data as Category[]) || []
  },

  async uploadCategoryImage(file: File): Promise<string> {
    const compressed = await compressImage(file)
    const fileExt = compressed.name.split('.').pop()
    const uniqueName = `cat-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `categories/${uniqueName}`

    const { error: uploadError } = await supabase.storage
      .from('public-assets')
      .upload(filePath, compressed)

    if (!uploadError) {
      const { data } = supabase.storage.from('public-assets').getPublicUrl(filePath)
      return data.publicUrl
    }

    const { error: uploadError2 } = await supabase.storage
      .from('media-assets')
      .upload(filePath, compressed)

    if (uploadError2) throw uploadError2

    const { data } = supabase.storage.from('media-assets').getPublicUrl(filePath)
    return data.publicUrl
  },

  async insertCategory(categoryData: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single()
    if (error) throw error
    return data as Category
  },

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Category
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Media Library Manager
  async fetchMedia(): Promise<MediaItem[]> {
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as MediaItem[]) || []
  },

  async uploadMedia(
    file: File, 
    altText = '', 
    title = '', 
    caption = '', 
    folder = '/'
  ): Promise<MediaItem> {
    const compressed = await compressImage(file)
    const fileExt = compressed.name.split('.').pop()
    const uniqueName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `library/${uniqueName}`

    const { error: uploadError } = await supabase.storage
      .from('media-assets')
      .upload(filePath, compressed)
    if (uploadError) throw uploadError

    const { data: publicUrlData } = supabase.storage.from('media-assets').getPublicUrl(filePath)
    const fileUrl = publicUrlData.publicUrl

    let width: number | null = null
    let height: number | null = null
    if (file.type.startsWith('image/')) {
      await new Promise<void>((resolve) => {
        const img = new Image()
        img.src = URL.createObjectURL(file)
        img.onload = () => {
          width = img.width
          height = img.height
          URL.revokeObjectURL(img.src)
          resolve()
        }
        img.onerror = () => resolve()
      })
    }

    const newMediaItem = {
      name: file.name,
      file_path: filePath,
      file_url: fileUrl,
      url: fileUrl,
      file_size: file.size,
      file_type: file.type,
      width,
      height,
      alt_text: altText || file.name.split('.')[0],
      title: title || file.name.split('.')[0],
      caption,
      folder,
    }

    const { data, error } = await supabase
      .from('media_library')
      .insert([newMediaItem])
      .select()
      .single()
    if (error) throw error

    window.dispatchEvent(new CustomEvent('atelier:media-updated', { detail: { action: 'upload', item: data } }))
    return data as MediaItem
  },

  async updateMediaMetadata(id: string, metaData: Partial<MediaItem>): Promise<MediaItem> {
    const { data, error } = await supabase
      .from('media_library')
      .update(metaData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    window.dispatchEvent(new CustomEvent('atelier:media-updated', { detail: { action: 'update', item: data } }))
    return data as MediaItem
  },

  async deleteMedia(id: string): Promise<void> {
    const { data: media } = await supabase
      .from('media_library')
      .select('file_path')
      .eq('id', id)
      .single()

    const typedMedia = media as { file_path?: string } | null
    if (typedMedia?.file_path) {
      await supabase.storage
        .from('media-assets')
        .remove([typedMedia.file_path])
    }

    const { error } = await supabase
      .from('media_library')
      .delete()
      .eq('id', id)
    if (error) throw error

    window.dispatchEvent(new CustomEvent('atelier:media-updated', { detail: { action: 'delete', id } }))
  },
}

export default adminService
