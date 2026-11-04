const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1'

export function decodeFirestoreValue(value) {
  if (!value || typeof value !== 'object') return value
  if ('stringValue' in value) return value.stringValue
  if ('integerValue' in value) return Number(value.integerValue)
  if ('doubleValue' in value) return Number(value.doubleValue)
  if ('booleanValue' in value) return value.booleanValue
  if ('nullValue' in value) return null
  if ('timestampValue' in value) return value.timestampValue
  if ('arrayValue' in value) {
    return (value.arrayValue.values || []).map(decodeFirestoreValue)
  }
  if ('mapValue' in value) {
    return decodeFirestoreFields(value.mapValue.fields || {})
  }
  return value
}

export function decodeFirestoreFields(fields) {
  const result = {}
  for (const [key, value] of Object.entries(fields)) {
    result[key] = decodeFirestoreValue(value)
  }
  return result
}

export function decodeFirestoreDocument(document) {
  const data = decodeFirestoreFields(document.fields || {})
  data.slug = data.slug || document.name?.split('/').pop() || null
  return data
}

function cloudinarySrc(img, cloudName) {
  if (img.publicId && cloudName) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_1200/${img.publicId}`
  }
  return img.url || img.src || null
}

export function normalizeRestGem(raw, { cloudName = '' } = {}) {
  return {
    ...raw,
    id: raw.id ?? raw.ordem ?? null,
    ordem: raw.ordem ?? raw.id ?? null,
    imagens: (raw.imagens || []).map((img) => {
      const src = cloudinarySrc(img, cloudName)
      return src ? { ...img, src } : { ...img }
    }),
    videos: raw.videos || [],
    traducoes: raw.traducoes || {},
  }
}

export async function fetchGemsFromRest({
  projectId,
  apiKey,
  cloudName = '',
  timeout = 8000,
  fetchImpl = globalThis.fetch,
} = {}) {
  if (!projectId || !apiKey || typeof fetchImpl !== 'function') return []

  const documents = []
  let pageToken = ''

  do {
    const params = new URLSearchParams({ pageSize: '1000' })
    params.set('key', apiKey)
    if (pageToken) params.set('pageToken', pageToken)

    const url = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/gems?${params}`
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(timeout) })
    if (!res.ok) throw new Error(`Firestore REST ${res.status}`)

    const data = await res.json()
    documents.push(...(data.documents || []))
    pageToken = data.nextPageToken || ''
  } while (pageToken)

  return documents
    .map((doc) => decodeFirestoreDocument(doc))
    .map((gem) => normalizeRestGem(gem, { cloudName }))
}

export async function fetchGemSlugs(options = {}) {
  const gems = await fetchGemsFromRest(options)
  return gems
    .filter((gem) => gem.slug && gem.publicado !== false)
    .map((gem) => gem.slug)
}
