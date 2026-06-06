import { computed, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import i18n from '../i18n'
import { gemKey } from './useWhatsapp'
import { formatCarats, formatMassFromCarats } from '../utils/gemWeight'

const FIELD_MAP = {
  name: 'nome',
  tipo: 'tipo',
  cor: 'cor',
  claridade: 'claridade',
  desc: 'desc',
}

const FALLBACK_LOCALES = ['en']

function i18nFieldKey(fieldName) {
  if (fieldName === 'desc') return 'desc'
  if (fieldName === 'name') return 'name'
  return FIELD_MAP[fieldName] || fieldName
}

function readTraducao(gem, localeCode, trKey, { skipPtDuplicate = false, currentLocale } = {}) {
  const value = gem.traducoes?.[localeCode]?.[trKey]
  if (typeof value !== 'string' || !value.trim()) return null

  const trimmed = value.trim()

  if (
    skipPtDuplicate &&
    localeCode !== 'pt' &&
    currentLocale !== 'pt'
  ) {
    const ptValue = gem.traducoes?.pt?.[trKey]?.trim()
    if (ptValue && ptValue === trimmed) return null
  }

  return trimmed
}

function resolveI18nGemKey(gem) {
  const numericId = gem.id ?? gem.ordem
  if (numericId != null && !Number.isNaN(Number(numericId))) {
    return gemKey(numericId)
  }

  const slugMatch = gem.slug?.match(/(\d+)\s*$/)
  if (slugMatch) return slugMatch[1].padStart(2, '0')

  return null
}

function fromStaticMessages(gem, fieldName, localeCode) {
  const gemId = resolveI18nGemKey(gem)
  if (!gemId) return null

  const messages = i18n.global.getLocaleMessage(localeCode)
  const value = messages?.gems?.[gemId]?.[i18nFieldKey(fieldName)]
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

export function useGemText(gemSource) {
  const { locale } = useI18n()

  function resolveField(fieldName) {
    const currentLocale = locale.value
    const gem = unref(gemSource)
    if (!gem) return ''

    const trKey = FIELD_MAP[fieldName] || fieldName
    const readOpts = { skipPtDuplicate: true, currentLocale }

    const fromFirestore = readTraducao(gem, currentLocale, trKey, readOpts)
    if (fromFirestore) return fromFirestore

    const fromStatic = fromStaticMessages(gem, fieldName, currentLocale)
    if (fromStatic) return fromStatic

    for (const fallbackLocale of FALLBACK_LOCALES) {
      if (fallbackLocale === currentLocale) continue

      const firestoreFallback = readTraducao(gem, fallbackLocale, trKey, readOpts)
      if (firestoreFallback) return firestoreFallback

      const staticFallback = fromStaticMessages(gem, fieldName, fallbackLocale)
      if (staticFallback) return staticFallback
    }

    if (currentLocale === 'pt') {
      return readTraducao(gem, 'pt', trKey) || ''
    }

    return ''
  }

  function enumLabel(type, value) {
    if (!value) return ''
    locale.value
    return i18n.global.t(`${type}.${value}`)
  }

  const specs = computed(() => {
    locale.value

    const gem = unref(gemSource)
    if (!gem) return { card: [], detail: [] }

    const card = [
      { label: i18n.global.t('gem.carats'), value: formatCarats(gem.peso, locale.value) },
      { label: i18n.global.t('gem.mass'), value: formatMassFromCarats(gem.peso, locale.value) },
      { label: i18n.global.t('catalog.color'), value: resolveField('cor') },
      { label: i18n.global.t('catalog.clarity'), value: resolveField('claridade') },
      { label: i18n.global.t('catalog.origin'), value: i18n.global.t('gem.originValue') },
    ]

    const detail = [
      ...card,
      { label: i18n.global.t('gem.dimensions'), value: gem.dimensoes },
      { label: i18n.global.t('gem.format'), value: enumLabel('formats', gem.formato) },
      { label: i18n.global.t('gem.treatment'), value: enumLabel('treatments', gem.tratamento) },
      { label: i18n.global.t('gem.certification'), value: enumLabel('certifications', gem.certificacao) },
      { label: i18n.global.t('gem.type'), value: resolveField('tipo') },
    ]

    return { card, detail }
  })

  return {
    gemName: computed(() => {
      locale.value
      return resolveField('name')
    }),
    gemTipo: computed(() => {
      locale.value
      return resolveField('tipo')
    }),
    gemCor: computed(() => {
      locale.value
      return resolveField('cor')
    }),
    gemClaridade: computed(() => {
      locale.value
      return resolveField('claridade')
    }),
    gemDesc: computed(() => {
      locale.value
      return resolveField('desc')
    }),
    specs,
  }
}

export function useGemCover(gemSource) {
  const coverImage = computed(() => {
    const gem = unref(gemSource)
    if (!gem?.imagens?.length) return null
    return gem.imagens.find(img => img.src) || null
  })

  const coverStyle = computed(() => {
    const gem = unref(gemSource)
    const img = coverImage.value
    const gradiente = img?.gradiente || gem?.imagens?.[0]?.gradiente || gem?.gradiente
    return gradiente ? { background: gradiente } : {}
  })

  return { coverImage, coverStyle }
}
