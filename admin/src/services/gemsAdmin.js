import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { db, storage } from '../firebase'
import {
  resolveGemImageSrc,
  uploadImageToCloudinary,
} from './cloudinary'

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #1a4a2e, #2d7a4f)'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function fetchAllGems() {
  const q = query(collection(db, 'gems'), orderBy('ordem', 'asc'))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((item) => ({
    ...item.data(),
    slug: item.data().slug || item.id,
  }))
}

export async function fetchGem(slug) {
  const snap = await getDoc(doc(db, 'gems', slug))
  if (!snap.exists()) return null
  return { ...snap.data(), slug: snap.data().slug || snap.id }
}

export async function resolveImageUrl(img) {
  if (img.previewUrl) return img.previewUrl

  const fromCloudinary = resolveGemImageSrc(img)
  if (fromCloudinary) return fromCloudinary

  if (img.storagePath && storage) {
    try {
      return await getDownloadURL(ref(storage, img.storagePath))
    } catch {
      return null
    }
  }

  return null
}

async function uploadImage(slug, image) {
  const { url, publicId } = await uploadImageToCloudinary(image.file, slug, image.id)

  return {
    id: image.id,
    url,
    publicId,
    gradiente: image.gradiente || DEFAULT_GRADIENT,
  }
}

function normalizeExistingImage(image) {
  return {
    id: image.id,
    url: image.url || '',
    publicId: image.publicId || '',
    storagePath: image.storagePath || '',
    gradiente: image.gradiente || DEFAULT_GRADIENT,
  }
}

export async function saveGem(slug, data, imageItems = []) {
  const uploadedImages = []

  for (const image of imageItems) {
    if (image.file) {
      uploadedImages.push(await uploadImage(slug, image))
    } else if (image.url || image.publicId || image.storagePath) {
      uploadedImages.push(normalizeExistingImage(image))
    }
  }

  const payload = {
    ...data,
    slug,
    imagens: uploadedImages.map(({ id, url, publicId, storagePath, gradiente }) => {
      const entry = { id, gradiente }
      if (url) entry.url = url
      if (publicId) entry.publicId = publicId
      if (storagePath) entry.storagePath = storagePath
      return entry
    }),
    videos: data.videos || [],
    traducoes: data.traducoes || {},
  }

  await setDoc(doc(db, 'gems', slug), payload, { merge: false })
  return payload
}

export async function toggleDisponivel(slug, disponivel) {
  await updateDoc(doc(db, 'gems', slug), { disponivel })
}

export async function deleteGem(slug) {
  await deleteDoc(doc(db, 'gems', slug))
}

export async function getNextOrdem() {
  const gems = await fetchAllGems()
  if (!gems.length) return 1
  return Math.max(...gems.map((g) => g.ordem || g.id || 0)) + 1
}

export function buildSlug(nome, ordem) {
  const base = slugify(nome || `carnaiba-${ordem}`)
  return base.startsWith('carnaiba-') ? base : `carnaiba-${base}`
}

export { DEFAULT_GRADIENT, slugify }
