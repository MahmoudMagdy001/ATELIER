import { supabase } from './supabase'

/**
 * Extracts relative storage path from Supabase public URL
 */
export function getStoragePathFromUrl(url, bucketName) {
  if (!url) return null
  const separator = `/storage/v1/object/public/${bucketName}/`
  const index = url.indexOf(separator)
  if (index !== -1) {
    return url.substring(index + separator.length).split('?')[0]
  }
  return null
}

/**
 * Deletes a file from Supabase storage using its public URL
 */
export async function deleteStorageFileByUrl(url, bucketName) {
  const path = getStoragePathFromUrl(url, bucketName)
  if (!path) return
  try {
    const { error } = await supabase.storage.from(bucketName).remove([path])
    if (error) {
      console.error(`Error deleting storage file ${path} from ${bucketName}:`, error)
    }
  } catch (err) {
    console.error(`Exception deleting storage file from ${bucketName}:`, err)
  }
}

/**
 * Native browser canvas-based image compressor to convert to optimized WebP
 */
export async function compressImage(file, { maxWidth = 1600, maxHeight = 1600, quality = 0.82 } = {}) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return file
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          } else {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }
            const lastDotIndex = file.name.lastIndexOf('.')
            const baseName = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name
            const newName = `${baseName}.webp`
            
            const compressedFile = new File([blob], newName, {
              type: 'image/webp',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          'image/webp',
          quality
        )
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}

/**
 * Extracts all image src URLs from an HTML string
 */
export function extractImageUrlsFromHtml(html) {
  if (!html) return []
  const urls = []
  const regex = /<img[^>]+src="([^">]+)"/g
  let match
  while ((match = regex.exec(html)) !== null) {
    urls.push(match[1])
  }
  return urls
}
