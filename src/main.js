import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import i18n from './i18n'
import { routes } from './router'
import { initLocale } from './composables/useLocale'
import { loadGems } from './composables/useGems'
import { createAnalyticsPlugin } from './plugins/analytics'
import './main.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      return { top: 0 }
    },
  },
  async ({ app, router, isClient, routePath }) => {
    app.use(i18n)
    if (isClient) app.use(createAnalyticsPlugin(router))

    await Promise.all([
      initLocale(i18n, { router, routePath, isClient }),
      loadGems(),
    ])

    router.afterEach((to) => {
      const metaLocale = to.meta?.locale
      if (metaLocale && i18n.global.locale.value !== metaLocale) {
        i18n.global.locale.value = metaLocale
        if (typeof document !== 'undefined') document.documentElement.lang = metaLocale
      }
    })
  },
)
