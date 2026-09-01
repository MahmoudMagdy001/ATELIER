import { supabase } from '../../../lib/supabase'
import { compressImage } from '../../../lib/imageCompressor'

export const adminService = {
  // Site Settings
  async fetchSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async updateSettings(settingsData) {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...settingsData, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Robots Settings
  async fetchRobots() {
    const { data, error } = await supabase
      .from('robots_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async updateRobots(robotsData) {
    const { data, error } = await supabase
      .from('robots_settings')
      .upsert({ id: 1, ...robotsData, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Redirects Manager
  async fetchRedirects() {
    const { data, error } = await supabase
      .from('redirects')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async insertRedirect(redirectData) {
    const { data, error } = await supabase
      .from('redirects')
      .insert([redirectData])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateRedirect(id, redirectData) {
    const { data, error } = await supabase
      .from('redirects')
      .update(redirectData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteRedirect(id) {
    const { error } = await supabase
      .from('redirects')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Custom Script Manager
  async fetchScripts() {
    const { data, error } = await supabase
      .from('custom_scripts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async insertScript(scriptData) {
    const { data, error } = await supabase
      .from('custom_scripts')
      .insert([scriptData])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateScript(id, scriptData) {
    const { data, error } = await supabase
      .from('custom_scripts')
      .update(scriptData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteScript(id) {
    const { error } = await supabase
      .from('custom_scripts')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Categories Manager
  async fetchCategories(type = '') {
    let query = supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })
    if (type) {
      query = query.eq('type', type)
    }
    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async insertCategory(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateCategory(id, categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteCategory(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Media Library Manager
  async fetchMedia() {
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async uploadMedia(file, altText = '', title = '', caption = '', folder = '/') {
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

    let width = null
    let height = null
    if (file.type.startsWith('image/')) {
      await new Promise((resolve) => {
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

    const { data, error } = await supabase
      .from('media_library')
      .insert([
        {
          name: file.name,
          file_path: filePath,
          file_url: fileUrl,
          file_size: file.size,
          file_type: file.type,
          width,
          height,
          alt_text: altText || file.name.split('.')[0],
          title: title || file.name.split('.')[0],
          caption,
          folder,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateMediaMetadata(id, metaData) {
    const { data, error } = await supabase
      .from('media_library')
      .update(metaData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteMedia(id) {
    const { data: media } = await supabase
      .from('media_library')
      .select('file_path')
      .eq('id', id)
      .single()

    if (media?.file_path) {
      await supabase.storage
        .from('media-assets')
        .remove([media.file_path])
    }

    const { error } = await supabase
      .from('media_library')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}

export default adminService
