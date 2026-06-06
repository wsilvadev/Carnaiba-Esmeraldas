import { initAnalytics, trackPageView, setupInteractionTracking } from '../analytics'

export function createAnalyticsPlugin(router) {
  return {
    install() {
      initAnalytics()
      setupInteractionTracking()

      router.afterEach((to) => {
        requestAnimationFrame(() => {
          trackPageView(to.fullPath, document.title)
        })
      })
    },
  }
}
