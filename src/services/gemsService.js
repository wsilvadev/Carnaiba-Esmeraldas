import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { db, storage, isFirebaseConfigured } from '../firebase/app'
import { fallbackGems } from '../data/gems'
import { resolveGemImageSrc } from '../utils/cloudinary'

async function resolveImage(img) {
  const fromCloudinary = resolveGemImageSrc(img)
  if (fromCloudinary) {
    return { ...img, src: fromCloudinary }
  }

  if (img.storagePath && storage) {
    try {
      const url = await getDownloadURL(ref(storage, img.storagePath))
      return { ...img, src: url }
    } catch {
      return img
    }
  }

  return img
}

async function normalizeGem(raw) {
  const imagens = await Promise.all((raw.imagens || []).map(resolveImage))
  return {
    ...raw,
    id: raw.id ?? raw.ordem ?? null,
    ordem: raw.ordem ?? raw.id ?? null,
    imagens,
    videos: raw.videos || [],
    traducoes: raw.traducoes || {},
  }
}

function mapDoc(doc) {
  return { ...doc.data(), slug: doc.data().slug || doc.id }
}

export async function fetchGemsFromFirestore() {
  if (!isFirebaseConfigured() || !db) {
    return null
  }

  const q = query(collection(db, 'gems'), orderBy('ordem', 'asc'))
  const snapshot = await getDocs(q)

  if (snapshot.empty) return null

  const gems = await Promise.all(snapshot.docs.map(async (doc) => {
    return normalizeGem(mapDoc(doc))
  }))

  return gems
}

export function getFallbackGems() {
  return fallbackGems.map(g => ({
    ...g,
    traducoes: g.traducoes || {},
  }))
}
