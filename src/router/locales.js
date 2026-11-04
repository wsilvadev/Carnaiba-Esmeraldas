export const SUPPORTED_LOCALES = ['pt', 'en', 'es', 'fr', 'de', 'hi']
export const PREFIXED_LOCALES = SUPPORTED_LOCALES.filter(l => l !== 'pt')
export const DEFAULT_LOCALE = 'pt'

export function localizePath(path, locale = DEFAULT_LOCALE) {
  const target = path || '/'
  if (locale === DEFAULT_LOCALE) return target
  if (target === '/') return `/${locale}/`
  return `/${locale}${target}`
}

export function pathWithoutLocale(path) {
  const first = String(path || '/').split('/')[1]
  if (PREFIXED_LOCALES.includes(first)) {
    const rest = path.slice(first.length + 1)
    return rest === '' ? '/' : rest
  }
  return path || '/'
}

export function localeFromPath(path) {
  const first = String(path || '/').split('/')[1]
  return PREFIXED_LOCALES.includes(first) ? first : DEFAULT_LOCALE
}
