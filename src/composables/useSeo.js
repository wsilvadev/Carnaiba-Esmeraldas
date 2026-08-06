import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@vueuse/head'
import { SUPPORTED_LOCALES, localizePath, pathWithoutLocale } from '../router'

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

function cleanPath(p) {
  const clean = p.endsWith('/') ? p.slice(0, -1) : p
  return clean || '/'
}

export function usePageMeta({ title, description, image, type = 'website' }) {
  const route = useRoute()
  const { locale } = useI18n()

  const basePath = computed(() => pathWithoutLocale(route.path) || '/')

  const canonical = computed(() => SITE_DOMAIN + cleanPath(basePath.value))

  const fullTitle = computed(() => {
    const t = title.value || ''
    return t ? `${t} — ${SITE_NAME}` : SITE_NAME
  })

  useHead(computed(() => ({
    htmlAttrs: { lang: HREFLANG_MAP[locale.value] || 'pt-BR' },
    title: fullTitle.value,
    meta: [
      { name: 'description', content: description.value || '' },
      { property: 'og:title', content: fullTitle.value },
      { property: 'og:description', content: description.value || '' },
      { property: 'og:url', content: canonical.value },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:image', content: image?.value || `${SITE_DOMAIN}/og-image.png` },
    ],
    link: [
      { rel: 'canonical', href: canonical.value },
      ...SUPPORTED_LOCALES.map((code) => ({
        rel: 'alternate',
        hreflang: HREFLANG_MAP[code],
        href: SITE_DOMAIN + cleanPath(localizePath(basePath.value, code)),
      })),
      { rel: 'alternate', hreflang: 'x-default', href: canonical.value },
    ],
  })))
}
