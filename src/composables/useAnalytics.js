import { trackEvent, trackGemView, trackLocaleChange, trackLocaleDetected } from '../analytics'

export function useAnalytics() {
  return {
    trackEvent,
    trackGemView,
    trackLocaleChange,
    trackLocaleDetected,
  }
}
