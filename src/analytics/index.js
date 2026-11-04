const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

let enabled = false
let scriptLoaded = false

function canTrack() {
  return enabled && typeof window.gtag === 'function'
}

export function initAnalytics() {
  if (!MEASUREMENT_ID || enabled || typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args) {
    window.dataLayer.push(args)
  }

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  })
  window.gtag('consent', 'update', { analytics_storage: 'granted' })

  if (!scriptLoaded) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
    document.head.appendChild(script)
    scriptLoaded = true
  }

  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  })

  enabled = true
}

function clearAnalyticsCookies() {
  if (typeof document === 'undefined') return

  const names = document.cookie
    .split(';')
    .map((entry) => entry.trim().split('=')[0])
    .filter((name) =>
      name === '_ga' ||
      name === '_gid' ||
      name === '_gat' ||
      name.startsWith('_ga_') ||
      name.startsWith('_gcl') ||
      name.startsWith('_gac')
    )

  const host = window.location.hostname
  const rootDomain = host.endsWith('.com.br')
    ? host.split('.').slice(-3).join('.')
    : host.split('.').slice(-2).join('.')
  const domains = new Set(['', host, `.${host}`, rootDomain, `.${rootDomain}`])

  for (const name of names) {
    for (const domain of domains) {
      const domainAttr = domain ? `; domain=${domain}` : ''
      document.cookie = `${name}=; Max-Age=0; path=/${domainAttr}; SameSite=Lax`
    }
  }
}

export function disableAnalytics() {
  if (typeof window === 'undefined') return

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    })
  }

  enabled = false
  clearAnalyticsCookies()
}

export function trackPageView(path, title) {
  if (!canTrack()) return

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: `${window.location.origin}${path}`,
  })
}

export function trackEvent(eventName, params = {}) {
  if (!canTrack()) return
  window.gtag('event', eventName, params)
}

function readGaParams(el) {
  const params = {}
  const { gaContext, gaLabel, gaItemId, gaItemName, gaSection } = el.dataset
  if (gaContext) params.context = gaContext
  if (gaLabel) params.label = gaLabel
  if (gaItemId) params.item_id = gaItemId
  if (gaItemName) params.item_name = gaItemName
  if (gaSection) params.section = gaSection
  return params
}

function whatsappContext(link) {
  if (link.dataset.gaContext) return link.dataset.gaContext
  if (link.classList.contains('wpp-float')) return 'float_button'
  if (link.classList.contains('wpp-btn')) return 'contact_section'
  if (link.classList.contains('footer-wpp')) return 'footer'

  const section = link.closest('section[id]')
  if (section?.id) return section.id

  return 'unknown'
}

function handleDocumentClick(event) {
  const gaTarget = event.target.closest('[data-ga-event]')
  if (gaTarget) {
    trackEvent(gaTarget.dataset.gaEvent, readGaParams(gaTarget))
  }

  const whatsappLink = event.target.closest('a[href*="wa.me"]')
  if (whatsappLink) {
    trackEvent('whatsapp_click', {
      context: whatsappContext(whatsappLink),
      link_url: whatsappLink.href,
      ...readGaParams(whatsappLink),
    })
  }

  const filterBtn = event.target.closest('.filter-btn')
  if (filterBtn) {
    trackEvent('filter_click', {
      filter_label: filterBtn.textContent?.trim() || '',
      page_path: window.location.pathname,
    })
  }

  const navLink = event.target.closest('a[href^="#"]')
  if (navLink?.getAttribute('href')?.startsWith('#')) {
    trackEvent('section_navigate', {
      section: navLink.getAttribute('href').slice(1),
    })
  }
}

export function setupInteractionTracking() {
  document.addEventListener('click', handleDocumentClick, { capture: true })
}

export function trackLocaleDetected(locale, currency, countryCode) {
  trackEvent('locale_detected', {
    locale,
    currency,
    country_code: countryCode || 'unknown',
  })
}

export function trackLocaleChange(from, to, currency) {
  trackEvent('locale_change', {
    locale_from: from,
    locale_to: to,
    currency,
  })
}

export function trackGemView(slug, name) {
  trackEvent('view_item', {
    item_id: slug,
    item_name: name,
    item_category: 'emerald',
  })
}

export function isAnalyticsEnabled() {
  return enabled
}
