import { ref } from 'vue'

const STORAGE_KEY = 'carnaiba-consent-v1'
const CONSENT_VERSION = 1

const consent = ref(defaultConsent())
const ready = ref(false)
const showBanner = ref(false)
const showPreferences = ref(false)
const listeners = new Set()

function defaultConsent() {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: false,
    updatedAt: null,
  }
}

function readStoredConsent() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.version !== CONSENT_VERSION) return null
    return { ...defaultConsent(), ...parsed, necessary: true }
  } catch {
    return null
  }
}

function persist(next) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Armazenamento indisponível: a escolha vale apenas para esta sessão.
  }
}

function notify() {
  for (const listener of listeners) {
    try {
      listener(consent.value)
    } catch {
      // Um listener com erro não deve impedir os demais.
    }
  }
}

function apply(next) {
  consent.value = {
    ...defaultConsent(),
    ...next,
    necessary: true,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  }
  persist(consent.value)
  ready.value = true
  showBanner.value = false
  showPreferences.value = false
  notify()
}

export function initConsent() {
  if (typeof window === 'undefined' || ready.value) return
  const stored = readStoredConsent()
  if (stored) {
    consent.value = stored
    showBanner.value = false
  } else {
    consent.value = defaultConsent()
    showBanner.value = true
  }
  ready.value = true
}

export function hasAnalyticsConsent() {
  return consent.value.analytics === true
}

export function onConsentChange(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function acceptAll() {
  apply({ analytics: true })
}

export function rejectNonEssential() {
  apply({ analytics: false })
}

export function savePreferences(analytics) {
  apply({ analytics: Boolean(analytics) })
}

export function openPreferences() {
  showPreferences.value = true
}

export function closePreferences() {
  showPreferences.value = false
}

export function useConsent() {
  return {
    consent,
    ready,
    showBanner,
    showPreferences,
    acceptAll,
    rejectNonEssential,
    savePreferences,
    openPreferences,
    closePreferences,
    hasAnalyticsConsent,
  }
}
