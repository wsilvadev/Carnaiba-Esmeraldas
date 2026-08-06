<template>
  <section id="catalogo" class="catalogo">
    <div class="container">
      <div class="section-header">
        <p class="section-label">{{ t('catalog.label') }}</p>
        <h2 class="section-title">{{ t('catalog.title') }}</h2>
        <div class="divider center"></div>
        <p class="section-desc">{{ t('catalog.desc') }}</p>
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

      <div class="gems-grid">
        <GemCard v-for="gem in gemsFiltered" :key="gem.slug" :gem="gem" />
      </div>

      <div v-if="!loading && gemsFiltered.length === 0" class="catalog-empty">
        <span class="empty-icon">⬡</span>
        <h3>{{ t('catalog.emptyTitle') }}</h3>
        <p>{{ t('catalog.emptyText') }}</p>
      </div>

      <div class="catalogo-cta">
        <p>{{ t('catalog.ctaText') }}</p>
        <RouterLink to="/estoque" class="btn-outline" data-ga-event="cta_click" data-ga-label="view_stock">{{ t('catalog.ctaButton') }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGems } from '../composables/useGems'
import GemCard from './GemCard.vue'

const { t } = useI18n()
const { gems, loading } = useGems()

const filtroAtivo = ref('todos')

const filtros = computed(() => [
  { value: 'todos', label: t('catalog.filterAll') },
  { value: 'bruta', label: t('catalog.filterRaw') },
  { value: 'lapidada', label: t('catalog.filterCut') },
  { value: 'disponivel', label: t('catalog.filterAvailable') },
])

const gemsFiltered = computed(() => {
  if (filtroAtivo.value === 'todos') return gems.value
  if (filtroAtivo.value === 'disponivel') return gems.value.filter(g => g.disponivel)
  return gems.value.filter(g => g.categoria === filtroAtivo.value)
})
</script>

<style scoped>
.catalogo {
  padding: 8rem 0;
  background: var(--dark);
}
.section-header { text-align: center; margin-bottom: 3rem; }
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
.catalog-loading {
  text-align: center;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.6);
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
.catalogo-cta {
  text-align: center;
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(201,168,76,0.1);
}
.catalogo-cta p {
  font-size: 0.8rem;
  color: rgba(245,240,232,0.5);
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
}
.catalogo-cta .btn-outline {
  display: inline-block;
  text-decoration: none;
}
.catalog-empty {
  text-align: center;
  padding: 5rem 2rem;
  border: 1px dashed rgba(201,168,76,0.25);
  background: rgba(13,43,26,0.2);
}
.empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: var(--gold);
  margin-bottom: 1.25rem;
}
.catalog-empty h3 {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--cream);
  margin-bottom: 0.75rem;
}
.catalog-empty p {
  font-size: 0.8rem;
  line-height: 1.8;
  color: rgba(245,240,232,0.55);
  max-width: 420px;
  margin: 0 auto;
}
</style>
