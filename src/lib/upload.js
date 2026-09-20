import { supabase, supabaseConfigured } from './supabase'

const BUCKET = 'content'

// Downscales + compresses an image to a small WebP blob (big win for
// page weight). Used before storing anywhere.
export function compressImage(file, { maxDim = 1200, quality = 0.72 } = {}) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url)
        blob ? resolve(blob) : reject(new Error('Could not compress that image.'))
      }, 'image/webp', quality)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read that image.'))
    }
    img.src = url
  })
}

// Compresses a picked file and stores it. With Supabase connected the
// image goes into the "content" storage bucket and a public URL comes
// back. In demo mode a compact data-URL is returned so everything keeps
// working offline (in the browser only).
export async function saveImage(file) {
  const blob = await compressImage(file)
  if (!supabaseConfigured) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => resolve(fr.result)
      fr.onerror = () => reject(new Error('Could not store the image.'))
      fr.readAsDataURL(blob)
    })
  }
  const name = `images/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`
  const { error } = await supabase.storage.from(BUCKET).upload(name, blob, { contentType: 'image/webp', upsert: false })
  if (error) throw new Error('Upload failed: ' + error.message)
  return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl
}