<template>
  <div class="stock-page">
    <div class="container">
      <RouterLink to="/#catalogo" class="back-link">← {{ t('stock.backToCatalog') }}</RouterLink>

      <div class="section-header">
        <p class="section-label">{{ sectionLabel }}</p>
        <h1 class="section-title">{{ sectionTitle }}</h1>
        <div class="divider center"></div>
        <p class="section-desc">{{ sectionDesc }}</p>
        <p class="stock-count">{{ countLabel }}</p>
      </div>

      <div class="status-tabs">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          :class="['status-tab', { active: statusAtivo === tab.value }]"
          @click="setStatus(tab.value)"
        >{{ tab.label }}</button>
      </div>

      <div class="filters">
        <button
          v-for="f in filtros"
          :key="f.value"
          :class="['filter-btn', { active: filtroAtivo === f.value }]"
          @click="filtroAtivo = f.value"
        >{{ f.label }}</button>
      </div>

      <p v-if="loading" class="catalog-loading">{{ t('catalog.loading') }}</p>

      <div v-if="gemsFiltered.length" class="gems-grid">
        <GemCard v-for="gem in gemsFiltered" :key="gem.slug" :gem="gem" />
      </div>

      <div v-else-if="!loading" class="stock-empty">
        <p>{{ emptyMessage }}</p>
        <RouterLink
          v-if="statusAtivo === 'sold'"
          to="/estoque"
          class="btn-outline"
        >
          {{ t('stock.viewAvailable') }}
        </RouterLink>
        <a
          v-else
          :href="contactUrl"
          :target="whatsappAvailable ? '_blank' : undefined"
          class="btn-primary"
        >
          {{ whatsappAvailable ? t('stock.contactWhatsapp') : t('stock.contactEmail') }}
        </a>
      </div>

      <div v-if="statusAtivo === 'available'" class="stock-cta">
        <p>{{ t('stock.soldHistoryPrompt') }}</p>
        <button type="button" class="btn-outline" @click="setStatus('sold')">
          {{ t('stock.viewSoldHistory') }}
        </button>
      </div>

      <div v-else-if="statusAtivo === 'sold'" class="stock-cta">
        <p>{{ t('stock.availablePrompt') }}</p>
        <button type="button" class="btn-outline" @click="setStatus('available')">
          {{ t('stock.viewAvailable') }}
        </button>
      </div>

      <div v-else class="stock-cta">
        <p>{{ t('stock.ctaText') }}</p>
        <a :href="contactUrl" :target="whatsappAvailable ? '_blank' : undefined" class="btn-outline">
          {{ whatsappAvailable ? t('stock.ctaButton') : t('stock.contactEmail') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGems } from '../composables/useGems'
import { useWhatsapp } from '../composables/useWhatsapp'
import { useContact } from '../composables/useContact'
import GemCard from '../components/GemCard.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { gems, availableGems, soldGems, loading } = useGems()
const { catalog: whatsappUrl } = useWhatsapp()
const { whatsappAvailable, emailUrl } = useContact()

const contactUrl = computed(() =>
  whatsappAvailable.value ? whatsappUrl.value : emailUrl.value,
)

const filtroAtivo = ref('todos')
const statusAtivo = ref('available')

const statusTabs = computed(() => [
  { value: 'available', label: t('stock.tabAvailable') },
  { value: 'sold', label: t('stock.tabSold') },
  { value: 'all', label: t('stock.tabAll') },
])

const filtros = computed(() => [
  { value: 'todos', label: t('stock.filterAll') },
  { value: 'bruta', label: t('catalog.filterRaw') },
  { value: 'lapidada', label: t('catalog.filterCut') },
])

const gemsByStatus = computed(() => {
  if (statusAtivo.value === 'sold') return soldGems.value
  if (statusAtivo.value === 'all') return gems.value
  return availableGems.value
})

const gemsFiltered = computed(() => {
  if (filtroAtivo.value === 'todos') return gemsByStatus.value
  return gemsByStatus.value.filter(g => g.categoria === filtroAtivo.value)
})

const sectionLabel = computed(() => {
  if (statusAtivo.value === 'sold') return t('stock.soldLabel')
  if (statusAtivo.value === 'all') return t('stock.allLabel')
  return t('stock.label')
})

const sectionTitle = computed(() => {
  if (statusAtivo.value === 'sold') return t('stock.soldTitle')
  if (statusAtivo.value === 'all') return t('stock.allTitle')
  return t('stock.title')
})

const sectionDesc = computed(() => {
  if (statusAtivo.value === 'sold') return t('stock.soldDesc')
  if (statusAtivo.value === 'all') return t('stock.allDesc')
  return t('stock.desc')
})

const countLabel = computed(() => {
  const n = gemsFiltered.value.length
  if (statusAtivo.value === 'sold') return t('stock.soldCount', { n })
  if (statusAtivo.value === 'all') return t('stock.allCount', { n })
  return t('stock.count', { n })
})

const emptyMessage = computed(() => {
  if (statusAtivo.value === 'sold') return t('stock.soldEmpty')
  if (statusAtivo.value === 'all') return t('stock.allEmpty')
  return t('stock.empty')
})

function setStatus(value) {
  statusAtivo.value = value
  router.replace({
    query: value === 'available' ? {} : { view: value },
  })
}

function syncStatusFromRoute() {
  const view = route.query.view
  if (view === 'sold' || view === 'all') {
    statusAtivo.value = view
    return
  }
  statusAtivo.value = 'available'
}

watch(() => route.query.view, syncStatusFromRoute, { immediate: true })

watch(
  [sectionTitle, statusAtivo],
  ([title]) => {
    document.title = `${title} — Carnaíba Esmeraldas`
  },
  { immediate: true },
)
</script>

<style scoped>
.stock-page {
  padding: 8rem 0 5rem;
  min-height: 100vh;
  background: var(--dark);
}
.back-link {
  display: inline-block;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.5);
  margin-bottom: 2rem;
  text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover { color: var(--gold); }
.section-header { text-align: center; margin-bottom: 2rem; }
.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--cream);
  font-weight: 500;
}
.section-desc {
  max-width: 560px;
  margin: 0 auto;
  font-size: 0.8rem;
  line-height: 2;
  color: rgba(245,240,232,0.55);
}
.stock-count {
  margin-top: 1rem;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gold);
}
.status-tabs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}
.status-tab {
  padding: 0.55rem 1.25rem;
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(13,43,26,0.45);
  border: 1px solid rgba(201,168,76,0.15);
  color: rgba(245,240,232,0.55);
  cursor: pointer;
  transition: all 0.3s;
}
.status-tab.active,
.status-tab:hover {
  border-color: var(--gold);
  color: var(--gold);
  background: rgba(201,168,76,0.08);
}
.catalog-loading {
  text-align: center;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.35);
  margin-bottom: 1.5rem;
}
.filters {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}
.filter-btn {
  padding: 0.5rem 1.5rem;
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid rgba(201,168,76,0.2);
  color: rgba(245,240,232,0.5);
  cursor: pointer;
  transition: all 0.3s;
}
.filter-btn.active, .filter-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
}
.gems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
.stock-empty {
  text-align: center;
  padding: 4rem 2rem;
  border: 1px solid rgba(45,122,79,0.15);
  background: rgba(13,43,26,0.3);
}
.stock-empty p {
  font-size: 0.85rem;
  color: rgba(245,240,232,0.5);
  margin-bottom: 1.5rem;
}
.stock-cta {
  text-align: center;
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(201,168,76,0.1);
}
.stock-cta p {
  font-size: 0.8rem;
  color: rgba(245,240,232,0.5);
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
}
</style>
