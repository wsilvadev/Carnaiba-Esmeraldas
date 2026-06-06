const CARAT_TO_GRAMS = 0.2

const INTL_LOCALE = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  hi: 'hi-IN',
}

export function caratsToGrams(carats) {
  if (carats == null || Number.isNaN(Number(carats))) return null
  return Number(carats) * CARAT_TO_GRAMS
}

function intlLocaleFor(locale) {
  return INTL_LOCALE[locale] || 'en-US'
}

export function formatCarats(carats, locale = 'pt') {
  if (carats == null || Number.isNaN(Number(carats))) return '—'

  const formatted = new Intl.NumberFormat(intlLocaleFor(locale), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(carats))

  return `${formatted} ct`
}

export function formatMassFromCarats(carats, locale = 'pt') {
  const grams = caratsToGrams(carats)
  if (grams == null) return '—'

  const intlLocale = intlLocaleFor(locale)

  if (grams >= 1000) {
    const kg = grams / 1000
    const formatted = new Intl.NumberFormat(intlLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(kg)
    return `${formatted} kg`
  }

  const formatted = new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(grams)

  return `${formatted} g`
}
