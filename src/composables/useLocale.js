import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { trackLocaleChange, trackLocaleDetected } from '../analytics'
import { localizePath, pathWithoutLocale, localeFromPath, PREFIXED_LOCALES, DEFAULT_LOCALE } from '../router'

const COUNTRY_CONFIG = {
  BR: { locale: 'pt', currency: 'BRL' },
  US: { locale: 'en', currency: 'USD' },
  GB: { locale: 'en', currency: 'GBP' },
  CA: { locale: 'en', currency: 'CAD' },
  AU: { locale: 'en', currency: 'AUD' },
  NZ: { locale: 'en', currency: 'NZD' },
  DE: { locale: 'de', currency: 'EUR' },
  FR: { locale: 'fr', currency: 'EUR' },
  IT: { locale: 'en', currency: 'EUR' },
  ES: { locale: 'es', currency: 'EUR' },
  PT: { locale: 'pt', currency: 'EUR' },
  NL: { locale: 'en', currency: 'EUR' },
  BE: { locale: 'fr', currency: 'EUR' },
  AT: { locale: 'de', currency: 'EUR' },
  CH: { locale: 'de', currency: 'CHF' },
  MX: { locale: 'es', currency: 'MXN' },
  AR: { locale: 'es', currency: 'ARS' },
  CL: { locale: 'es', currency: 'CLP' },
  CO: { locale: 'es', currency: 'COP' },
  PE: { locale: 'es', currency: 'PEN' },
  UY: { locale: 'es', currency: 'UYU' },
  JP: { locale: 'en', currency: 'JPY' },
  CN: { locale: 'en', currency: 'CNY' },
  HK: { locale: 'en', currency: 'HKD' },
  SG: { locale: 'en', currency: 'SGD' },
  IN: { locale: 'hi', currency: 'INR' },
  AE: { locale: 'en', currency: 'AED' },
  SA: { locale: 'en', currency: 'SAR' },
  QA: { locale: 'en', currency: 'QAR' },
  ZA: { locale: 'en', currency: 'ZAR' },
}

const DEFAULT_CONFIG = { locale: 'en', currency: 'USD' }

const countryCode = ref(null)
const currency = ref('BRL')
const rates = ref({ BRL: 1 })
const ratesLoaded = ref(false)
const localeReady = ref(false)
const ratesSource = ref(null)

const LOCALE_STORAGE_KEY = 'carnaiba-locale-override'
const CURRENCY_STORAGE_KEY = 'carnaiba-currency-override'

const LOCALE_CURRENCY = {
  pt: 'BRL',
}

function configForCountry(code) {
  return COUNTRY_CONFIG[code] || DEFAULT_CONFIG
}

function resolveCurrency(localeCode) {
  if (LOCALE_CURRENCY[localeCode]) return LOCALE_CURRENCY[localeCode]
  return configForCountry(countryCode.value).currency
}

function readSavedLocale() {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY)
  } catch {
    return null
  }
}

async function detectCountry() {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
    if (!res.ok) throw new Error('geo failed')
    const data = await res.json()
    countryCode.value = data.country_code || null
    return configForCountry(data.country_code)
  } catch {
    countryCode.value = null
    return DEFAULT_CONFIG
  }
}

async function fetchRatesFromFrankfurter(targetCurrency) {
  const res = await fetch(
    `https://api.frankfurter.app/latest?from=BRL&to=${targetCurrency}`,
    { signal: AbortSignal.timeout(5000) },
  )
  if (!res.ok) throw new Error('frankfurter failed')
  const data = await res.json()
  const rate = data.rates?.[targetCurrency]
  if (!rate) throw new Error('rate missing')
  return { BRL: 1, [targetCurrency]: rate }
}

async function fetchRatesFromOpenErApi() {
  const res = await fetch('https://open.er-api.com/v6/latest/BRL', {
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error('open.er-api failed')
  const data = await res.json()
  if (data.result !== 'success' || !data.rates) throw new Error('open.er-api invalid')
  return { BRL: 1, ...data.rates }
}

async function fetchRates(targetCurrency) {
  if (targetCurrency === 'BRL') {
    rates.value = { BRL: 1 }
    ratesLoaded.value = true
    ratesSource.value = 'local'
    return
  }

  ratesLoaded.value = false

  try {
    rates.value = await fetchRatesFromOpenErApi()
    ratesLoaded.value = true
    ratesSource.value = 'open.er-api.com'
    return
  } catch {
    // fallback abaixo
  }

  try {
    rates.value = await fetchRatesFromFrankfurter(targetCurrency)
    ratesLoaded.value = true
    ratesSource.value = 'frankfurter.app'
  } catch {
    rates.value = { BRL: 1 }
    ratesLoaded.value = true
    ratesSource.value = null
  }
}

export async function initLocale(i18n, { router, routePath, isClient } = {}) {
  const isSSR = !isClient

  let localeToUse = DEFAULT_LOCALE
  let shouldRedirect = false

  const urlLocale = isSSR
    ? localeFromPath(routePath)
    : localeFromPath(window.location.pathname)

  if (isSSR || PREFIXED_LOCALES.includes(urlLocale)) {
    localeToUse = urlLocale
  } else {
    const savedLocale = readSavedLocale()
    if (savedLocale) {
      localeToUse = savedLocale
      shouldRedirect = localeToUse !== DEFAULT_LOCALE
    } else {
      const geoConfig = await detectCountry()
      localeToUse = geoConfig.locale
      shouldRedirect = localeToUse !== DEFAULT_LOCALE
    }
  }

  i18n.global.locale.value = localeToUse
  if (typeof document !== 'undefined') document.documentElement.lang = localeToUse

  currency.value = resolveCurrency(localeToUse)
  if (!isSSR) await fetchRates(currency.value)
  localeReady.value = true

  if (!isSSR && shouldRedirect && router) {
    const currentPath = window.location.pathname
    const target = localizePath(pathWithoutLocale(currentPath), localeToUse)
    if (target !== currentPath) {
      await router.push({ path: target, query: window.location.search, hash: window.location.hash })
    }
  }

  if (!isSSR && !readSavedLocale()) {
    trackLocaleDetected(localeToUse, currency.value, countryCode.value)
  }
}

export function useLocalePath() {
  const { locale } = useI18n()
  const localize = (path) => localizePath(path, locale.value)
  return { localize, locale }
}

export function useLocale() {
  const { locale, t } = useI18n()
  const router = useRouter()

  const availableLocales = [
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ]

  const countryLabel = computed(() => {
    if (!countryCode.value) return null
    try {
      return new Intl.DisplayNames([locale.value], { type: 'region' }).of(countryCode.value)
    } catch {
      return countryCode.value
    }
  })

  const isManualCurrency = computed(() =>
    Boolean(localStorage.getItem(CURRENCY_STORAGE_KEY)),
  )

  async function setLocale(code) {
    const previous = locale.value
    locale.value = code
    document.documentElement.lang = code
    try { localStorage.setItem(LOCALE_STORAGE_KEY, code) } catch {}
    try { localStorage.removeItem(CURRENCY_STORAGE_KEY) } catch {}

    currency.value = resolveCurrency(code)
    await fetchRates(currency.value)

    trackLocaleChange(previous, code, currency.value)
  }

  async function switchLocale(code) {
    if (locale.value === code) return
    const { path, query, hash } = router.currentRoute.value
    await setLocale(code)
    const targetPath = localizePath(pathWithoutLocale(path), code)
    if (targetPath !== path) {
      await router.push({ path: targetPath, query, hash })
    }
  }

  async function setCurrency(code) {
    currency.value = code
    localStorage.setItem(CURRENCY_STORAGE_KEY, code)
    await fetchRates(code)
  }

  async function applyCountryPricing() {
    localStorage.removeItem(CURRENCY_STORAGE_KEY)
    currency.value = resolveCurrency(locale.value)
    await fetchRates(currency.value)
  }

  function resetLocaleOverride() {
    localStorage.removeItem(LOCALE_STORAGE_KEY)
    localStorage.removeItem(CURRENCY_STORAGE_KEY)
    window.location.reload()
  }

  return {
    locale,
    t,
    currency,
    rates,
    ratesLoaded,
    ratesSource,
    localeReady,
    countryCode,
    countryLabel,
    isManualCurrency,
    availableLocales,
    setLocale,
    switchLocale,
    setCurrency,
    applyCountryPricing,
    resetLocaleOverride,
  }
}
