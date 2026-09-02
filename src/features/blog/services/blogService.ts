import { supabase } from '../../../lib/supabase'
import { compressImage, deleteStorageFileByUrl, extractImageUrlsFromHtml } from '../../../lib/imageCompressor'
import type { Article } from '../../../types/database'

export const blogService = {
  async fetchPublishedPosts(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as Article[]) || []
  },

  async fetchPostBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (error) throw error
    return data as Article
  },

  async fetchPostById(id: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as Article
  },

  async fetchAllPosts(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as Article[]) || []
  },

  async deletePost(id: string): Promise<void> {
    const { data: post } = await supabase
      .from('articles')
      .select('cover_image, content')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)
    if (error) throw error

    const typedPost = post as { cover_image?: string | null; content?: string | null } | null
    if (typedPost?.cover_image) {
      await deleteStorageFileByUrl(typedPost.cover_image, 'blog-covers')
    }

    if (typedPost?.content) {
      const contentImages = extractImageUrlsFromHtml(typedPost.content)
      for (const imgUrl of contentImages) {
        await deleteStorageFileByUrl(imgUrl, 'media-assets')
      }
    }
  },

  async uploadImage(file: File): Promise<string> {
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

  async uploadEditorImage(file: File): Promise<string> {
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

  async updatePost(id: string, postData: Partial<Article>): Promise<void> {
    const { data: oldPost } = await supabase
      .from('articles')
      .select('cover_image, content')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('articles')
      .update(postData)
      .eq('id', id)
    if (error) throw error

    const typedOldPost = oldPost as { cover_image?: string | null; content?: string | null } | null
    if (typedOldPost) {
      if (typedOldPost.cover_image && typedOldPost.cover_image !== postData.cover_image) {
        await deleteStorageFileByUrl(typedOldPost.cover_image, 'blog-covers')
      }

      const oldImages = extractImageUrlsFromHtml(typedOldPost.content)
      const newImages = extractImageUrlsFromHtml(postData.content)
      const removedImages = oldImages.filter(img => !newImages.includes(img))

      for (const imgUrl of removedImages) {
        await deleteStorageFileByUrl(imgUrl, 'media-assets')
      }
    }
  },

  async insertPost(postData: Partial<Article>): Promise<void> {
    const { error } = await supabase
      .from('articles')
      .insert([postData])
    if (error) throw error
  }
}

export default blogService
