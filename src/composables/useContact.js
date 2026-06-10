import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from './useLocale'

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'contact@carnaibaesmeraldas.com.br'

/** Países onde WhatsApp é bloqueado ou pouco usado no dia a dia */
const WHATSAPP_LIMITED_COUNTRIES = new Set(['CN', 'KP', 'IR', 'JP', 'KR'])

export function useContact() {
  const { t, locale } = useI18n()
  const { countryCode } = useLocale()

  const whatsappAvailable = computed(() => {
    const code = countryCode.value
    if (!code) return true
    return !WHATSAPP_LIMITED_COUNTRIES.has(code)
  })

  const contactEmail = computed(() => CONTACT_EMAIL)

  function buildEmailUrl(options = {}) {
    locale.value
    const {
      subjectKey = 'contact.emailSubject',
      subjectParams = {},
      bodyKey = 'contact.emailBody',
      bodyParams = {},
    } = options

    const subject = encodeURIComponent(t(subjectKey, subjectParams))
    const body = encodeURIComponent(t(bodyKey, bodyParams))
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }

  const emailUrl = computed(() => buildEmailUrl())

  return {
    whatsappAvailable,
    contactEmail,
    emailUrl,
    buildEmailUrl,
  }
}
