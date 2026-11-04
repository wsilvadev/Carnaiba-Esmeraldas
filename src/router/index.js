import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GemDetailView from '../views/GemDetailView.vue'
import StockView from '../views/StockView.vue'
import CookiePolicyView from '../views/CookiePolicyView.vue'
import {
  SUPPORTED_LOCALES,
  PREFIXED_LOCALES,
  DEFAULT_LOCALE,
  localizePath,
  pathWithoutLocale,
  localeFromPath,
} from './locales'

export {
  SUPPORTED_LOCALES,
  PREFIXED_LOCALES,
  DEFAULT_LOCALE,
  localizePath,
  pathWithoutLocale,
  localeFromPath,
}

export function createLocalizedRoutes() {
  const baseRoutes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/estoque', name: 'stock', component: StockView },
    { path: '/politica-de-cookies', name: 'cookie-policy', component: CookiePolicyView },
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
