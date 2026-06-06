export function extractYoutubeId(input) {
  if (!input) return ''

  const trimmed = String(input).trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match) return match[1]
  }

  return ''
}

export function youtubeThumbnailUrl(youtubeId, quality = 'hqdefault') {
  if (!youtubeId) return ''
  return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`
}

export function youtubeEmbedUrl(youtubeId, { autoplay = false } = {}) {
  if (!youtubeId) return ''
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
  })
  if (autoplay) params.set('autoplay', '1')
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params}`
}
