import { supabase } from '../../../lib/supabase'
import { compressImage, deleteStorageFileByUrl, extractImageUrlsFromHtml } from '../../../lib/imageCompressor'

export const blogService = {
  async fetchPublishedPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async fetchPostBySlug(slug) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (error) throw error
    return data
  },

  async fetchPostById(id) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async fetchAllPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async deletePost(id) {
    const { data: post } = await supabase
      .from('posts')
      .select('cover_image, content')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    if (error) throw error

    if (post?.cover_image) {
      await deleteStorageFileByUrl(post.cover_image, 'blog-covers')
    }

    if (post?.content) {
      const contentImages = extractImageUrlsFromHtml(post.content)
      for (const imgUrl of contentImages) {
        await deleteStorageFileByUrl(imgUrl, 'media-assets')
      }
    }
  },

  async uploadImage(file) {
    const compressedFile = await compressImage(file)
    const fileExt = compressedFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `covers/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('blog-covers')
      .upload(filePath, compressedFile)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('blog-covers').getPublicUrl(filePath)
    return data.publicUrl
  },

  async uploadEditorImage(file) {
    const compressedFile = await compressImage(file)
    const fileExt = compressedFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `posts/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('media-assets')
      .upload(filePath, compressedFile)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('media-assets').getPublicUrl(filePath)
    return data.publicUrl
  },

  async updatePost(id, postData) {
    const { data: oldPost } = await supabase
      .from('posts')
      .select('cover_image, content')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('posts')
      .update(postData)
      .eq('id', id)
    if (error) throw error

    if (oldPost) {
      if (oldPost.cover_image && oldPost.cover_image !== postData.cover_image) {
        await deleteStorageFileByUrl(oldPost.cover_image, 'blog-covers')
      }

      const oldImages = extractImageUrlsFromHtml(oldPost.content)
      const newImages = extractImageUrlsFromHtml(postData.content)
      const removedImages = oldImages.filter(img => !newImages.includes(img))

      for (const imgUrl of removedImages) {
        await deleteStorageFileByUrl(imgUrl, 'media-assets')
      }
    }
  },

  async insertPost(postData) {
    const { error } = await supabase
      .from('posts')
      .insert([postData])
    if (error) throw error
  }
}

export default blogService
