import { buildCloudinaryImageUrl, resolveGemImageSrc } from '@shared/utils/cloudinary.js'

export { buildCloudinaryImageUrl, resolveGemImageSrc }

export function isCloudinaryUploadConfigured() {
  return Boolean(
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME &&
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  )
}

export async function uploadImageToCloudinary(file, slug, imageId) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Configure VITE_CLOUDINARY_CLOUD_NAME e VITE_CLOUDINARY_UPLOAD_PRESET no .env')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', `carnaiba/gems/${slug}`)
  formData.append('public_id', imageId)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData },
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error?.message || 'Falha ao enviar imagem para o Cloudinary.')
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}
