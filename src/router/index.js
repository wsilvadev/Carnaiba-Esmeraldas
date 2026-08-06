import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GemDetailView from '../views/GemDetailView.vue'
import StockView from '../views/StockView.vue'

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

export function createLocalizedRoutes() {
  const baseRoutes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/estoque', name: 'stock', component: StockView },
    { path: '/esmeralda/:slug', name: 'gem', component: GemDetailView },
  ]

  const routes = []
  for (const locale of SUPPORTED_LOCALES) {
    for (const route of baseRoutes) {
      routes.push({
        ...route,
        path: localizePath(route.path, locale),
        name: locale === DEFAULT_LOCALE ? route.name : `${route.name}-${locale}`,
        meta: { ...route.meta, locale },
      })
    }
  }
  routes.push({ path: '/:pathMatch(.*)*', redirect: '/', meta: { locale: DEFAULT_LOCALE } })

  return routes
}

export function createAppRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: createLocalizedRoutes(),
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      return { top: 0 }
    },
  })
}

export const routes = createLocalizedRoutes()
