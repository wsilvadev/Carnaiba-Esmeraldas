import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5574981287563'

export function useWhatsapp() {
  const { t } = useI18n()

  function buildUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

  function gemInquiry(name, photoUrl = '') {
    const lines = []
    if (name) lines.push(name)
    if (photoUrl) lines.push(photoUrl)
    if (lines.length) lines.push('')
    lines.push(t('whatsapp.interested'))
    return buildUrl(lines.join('\n'))
  }

  const site = computed(() => buildUrl(t('whatsapp.site')))
  const hero = computed(() => buildUrl(t('whatsapp.hero')))
  const catalog = computed(() => buildUrl(t('whatsapp.catalog')))
  const contact = computed(() => buildUrl(t('whatsapp.contact')))

  function gem(name, photoUrl) {
    return gemInquiry(name, photoUrl)
  }

  function detail(name, photoUrl) {
    return gemInquiry(name, photoUrl)
  }

  return { site, hero, catalog, contact, gem, detail, buildUrl }
}

export function gemKey(id) {
  return String(id).padStart(2, '0')
}
