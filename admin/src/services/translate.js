const LOCALE_CODES = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  hi: 'hi',
}

const MAX_CHUNK_LENGTH = 450

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function translateChunk(text, targetLang) {
  const url = new URL('https://api.mymemory.translated.net/get')
  url.searchParams.set('q', text)
  url.searchParams.set('langpair', `pt|${targetLang}`)

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Tradução falhou (${response.status})`)
  }

  const data = await response.json()
  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || 'Tradução indisponível')
  }

  return data.responseData?.translatedText?.trim() || ''
}

async function translateText(text, targetLang) {
  const trimmed = text?.trim()
  if (!trimmed) return ''

  if (trimmed.length <= MAX_CHUNK_LENGTH) {
    return translateChunk(trimmed, targetLang)
  }

  const sentences = trimmed.match(/[^.!?]+[.!?]+|\S+/g) || [trimmed]
  const chunks = []
  let current = ''

  for (const sentence of sentences) {
    const piece = sentence.trim()
    if (!piece) continue

    if (`${current} ${piece}`.trim().length > MAX_CHUNK_LENGTH) {
      if (current) chunks.push(current.trim())
      current = piece
    } else {
      current = current ? `${current} ${piece}` : piece
    }
  }

  if (current) chunks.push(current.trim())

  const translated = []
  for (const chunk of chunks) {
    translated.push(await translateChunk(chunk, targetLang))
    await sleep(120)
  }

  return translated.join(' ')
}

export async function translatePtFields(ptFields, targetLocales = Object.keys(LOCALE_CODES)) {
  const fields = ['nome', 'tipo', 'cor', 'claridade', 'desc']
  const result = {}

  for (const locale of targetLocales) {
    const targetLang = LOCALE_CODES[locale]
    if (!targetLang) continue

    result[locale] = {}

    for (const field of fields) {
      const source = ptFields[field]
      if (!source?.trim()) {
        result[locale][field] = ''
        continue
      }

      result[locale][field] = await translateText(source, targetLang)
      await sleep(120)
    }
  }

  return result
}

export { LOCALE_CODES }
