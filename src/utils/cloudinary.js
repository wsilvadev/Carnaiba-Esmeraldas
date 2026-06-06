export function getCloudName() {
  return import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
}

export function isCloudinaryConfigured() {
  return Boolean(getCloudName())
}

export function buildCloudinaryImageUrl(publicId, { width = 1200 } = {}) {
  const cloud = getCloudName()
  if (!cloud || !publicId) return null

  const transforms = width
    ? `f_auto,q_auto,w_${width}`
    : 'f_auto,q_auto'

  return `https://res.cloudinary.com/${cloud}/image/upload/${transforms}/${publicId}`
}

export function resolveGemImageSrc(img, { width = 1200 } = {}) {
  if (!img) return null

  if (img.publicId && isCloudinaryConfigured()) {
    return buildCloudinaryImageUrl(img.publicId, { width })
  }

  if (img.url) return img.url
  if (img.src) return img.src

  return null
}
