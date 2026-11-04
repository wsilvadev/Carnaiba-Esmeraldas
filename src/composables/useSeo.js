import { computed, unref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@vueuse/head'
import { SUPPORTED_LOCALES, PREFIXED_LOCALES, localizePath, pathWithoutLocale } from '../router/locales'

export const SITE_DOMAIN = 'https://carnaibaesmeraldas.com.br'
export const SITE_NAME = 'Carnaíba Esmeraldas'

const HREFLANG_MAP = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  hi: 'hi',
}

const OG_LOCALE_MAP = {
  pt: 'pt_BR',
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  hi: 'hi_IN',
}

export const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/og-image.jpg`

export function htmlLangFor(locale) {
  return HREFLANG_MAP[locale] || 'pt-BR'
}

function valueOf(value) {
  return unref(value)
}

function canonicalPath(path) {
  const p = String(path || '/')
  if (p === '/') return '/'
  const first = p.split('/')[1]
  if (PREFIXED_LOCALES.includes(first) && p === `/${first}/`) return p
  return p.endsWith('/') ? p.replace(/\/+$/, '') : p
}

function absoluteUrl(url) {
  if (!url) return DEFAULT_OG_IMAGE
  if (/^https?:\/\//i.test(url)) return url
  return `${SITE_DOMAIN}${url.startsWith('/') ? '' : '/'}${url}`
}

function buildOrganization(description) {
  const email = import.meta.env.VITE_CONTACT_EMAIL
  const phone = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_DOMAIN}/#organization`,
    name: SITE_NAME,
    url: `${SITE_DOMAIN}/`,
    logo: `${SITE_DOMAIN}/icons/icon-512.png`,
    image: DEFAULT_OG_IMAGE,
    description: description || '',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Bahia',
      addressCountry: 'BR',
    },
    ...(email ? { email } : {}),
    ...(phone ? { telephone: `+${phone}` } : {}),
  }
}

function buildWebsite(locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_DOMAIN}/#website`,
    name: SITE_NAME,
    url: `${SITE_DOMAIN}/`,
    inLanguage: HREFLANG_MAP[locale] || 'pt-BR',
    publisher: { '@id': `${SITE_DOMAIN}/#organization` },
  }
}

export function usePageMeta({ title, description, image, type = 'website', jsonLd, noindex = false }) {
  const route = useRoute()
  const { locale } = useI18n()

  const basePath = computed(() => pathWithoutLocale(route.path) || '/')

  const canonical = computed(() => SITE_DOMAIN + canonicalPath(route.path))

  const fullTitle = computed(() => {
    const t = valueOf(title) || ''
    return t ? `${t} — ${SITE_NAME}` : SITE_NAME
  })

  const metaDescription = computed(() => valueOf(description) || '')

  const metaImage = computed(() => absoluteUrl(valueOf(image)))

  const isNoindex = computed(() => valueOf(noindex))

  const structuredData = computed(() => {
    const extra = valueOf(jsonLd)
    const extraItems = Array.isArray(extra) ? extra : extra ? [extra] : []
    return [
      buildOrganization(metaDescription.value),
      buildWebsite(locale.value),
      ...extraItems,
    ]
  })

  useHead(computed(() => ({
    htmlAttrs: { lang: htmlLangFor(locale.value) },
    title: fullTitle.value,
    meta: [
      { name: 'description', content: metaDescription.value },
      { name: 'robots', content: isNoindex.value ? 'noindex, nofollow' : 'index, follow' },
      { name: 'theme-color', content: '#0a1a10' },
      { property: 'og:title', content: fullTitle.value },
      { property: 'og:description', content: metaDescription.value },
      { property: 'og:url', content: canonical.value },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:image', content: metaImage.value },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: SITE_NAME },
      { property: 'og:locale', content: OG_LOCALE_MAP[locale.value] || 'pt_BR' },
      ...SUPPORTED_LOCALES
        .filter(code => code !== locale.value)
        .map(code => ({
          key: `og-locale-alt-${code}`,
          property: 'og:locale:alternate',
          content: OG_LOCALE_MAP[code],
        })),
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle.value },
      { name: 'twitter:description', content: metaDescription.value },
      { name: 'twitter:image', content: metaImage.value },
    ],
    link: [
      { rel: 'canonical', href: canonical.value },
      ...SUPPORTED_LOCALES.map((code) => ({
        rel: 'alternate',
        hreflang: HREFLANG_MAP[code],
        href: SITE_DOMAIN + canonicalPath(localizePath(basePath.value, code)),
      })),
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: SITE_DOMAIN + canonicalPath(localizePath(basePath.value, 'pt')),
      },
    ],
    script: structuredData.value.map((item, index) => ({
      key: `ld-json-${index}-${item['@type'] || 'data'}`,
      type: 'application/ld+json',
      textContent: JSON.stringify(item),
    })),
  })))
}
