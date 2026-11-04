import {
  disableAnalytics,
  initAnalytics,
  setupInteractionTracking,
  trackPageView,
} from '../analytics'
import { hasAnalyticsConsent, onConsentChange } from '../composables/useConsent'

export function createAnalyticsPlugin(router) {
  return {
    install() {
      setupInteractionTracking()

      if (hasAnalyticsConsent()) initAnalytics()

      onConsentChange((consent) => {
        if (consent.analytics) {
          initAnalytics()
          requestAnimationFrame(() => {
            const route = router.currentRoute.value
            trackPageView(route.fullPath, document.title)
          })
        } else {
          disableAnalytics()
        }
      })

      router.afterEach((to) => {
        requestAnimationFrame(() => {
          trackPageView(to.fullPath, document.title)
        })
      })
    },
  }
}
