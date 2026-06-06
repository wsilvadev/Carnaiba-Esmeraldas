import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from './useLocale'

const CURRENCY_LOCALE = {
  BRL: 'pt-BR',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  CAD: 'en-CA',
  AUD: 'en-AU',
  NZD: 'en-NZ',
  MXN: 'es-MX',
  ARS: 'es-AR',
  CLP: 'es-CL',
  COP: 'es-CO',
  PEN: 'es-PE',
  UYU: 'es-UY',
  JPY: 'ja-JP',
  CNY: 'zh-CN',
  INR: 'hi-IN',
  CHF: 'de-CH',
  AED: 'ar-AE',
  SAR: 'ar-SA',
  QAR: 'ar-QA',
  ZAR: 'en-ZA',
  HKD: 'zh-HK',
  SGD: 'en-SG',
}

const ZERO_DECIMAL_CURRENCIES = new Set(['JPY', 'CLP', 'KRW'])

export function usePrice() {
  const { t } = useI18n()
  const { currency, rates, ratesLoaded, countryLabel } = useLocale()

  function formatBRL(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value)
  }

  function formatInCurrency(value, cur) {
    const intlLocale = CURRENCY_LOCALE[cur] || 'en-US'
    const decimals = ZERO_DECIMAL_CURRENCIES.has(cur) ? 0 : 0

    return new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: decimals,
    }).format(value)
  }

  function formatLocal(valueBRL) {
    if (!valueBRL) return null

    const cur = currency.value
    if (cur === 'BRL') return formatBRL(valueBRL)

    const rate = rates.value[cur]
    if (!rate || !ratesLoaded.value) return formatBRL(valueBRL)

    const converted = valueBRL * rate
    return formatInCurrency(converted, cur)
  }

  function gemPrice(gem) {
    if (!gem.disponivel) return { main: t('catalog.sold'), sub: null }
    if (!gem.precoBRL) return { main: t('catalog.onRequest'), sub: null }

    const local = formatLocal(gem.precoBRL)
    const brl = formatBRL(gem.precoBRL)

    if (currency.value === 'BRL') {
      return { main: brl, sub: null }
    }

    const countryNote = countryLabel.value
      ? t('price.forCountry', { country: countryLabel.value })
      : null

    return {
      main: local,
      sub: countryNote
        ? `${t('price.publishedInBRL', { price: brl })} · ${countryNote}`
        : t('price.publishedInBRL', { price: brl }),
    }
  }

  const currencyCode = computed(() => currency.value)

  return { formatBRL, formatLocal, gemPrice, currencyCode }
}
