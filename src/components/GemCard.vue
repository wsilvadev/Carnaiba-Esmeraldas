<template>
  <article
    :class="['gem-card', { 'gem-card--available': gem.disponivel, 'gem-card--sold': !gem.disponivel }]"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <RouterLink
      :to="gemLink"
      class="gem-image-wrap"
      data-ga-event="gem_card_click"
      :data-ga-item-id="gem.slug"
      :data-ga-item-name="gemName"
    >
      <div class="gem-placeholder" :style="coverStyle">
        <img v-if="coverImage?.src" :src="coverImage.src" :alt="gemName" class="gem-cover" loading="lazy" decoding="async" />
        <div v-else class="gem-icon">◆</div>
        <span class="gem-status" :class="gem.disponivel ? 'disponivel' : 'vendida'">
          <span v-if="gem.disponivel" class="status-dot" aria-hidden="true" />
          {{ gem.disponivel ? t('catalog.available') : t('catalog.sold') }}
        </span>
      </div>
      <div :class="['gem-overlay', { visible: hovered }]">
        <span class="btn-primary overlay-btn">{{ t('catalog.viewDetails') }}</span>
      </div>
    </RouterLink>
    <div class="gem-info">
      <div class="gem-header">
        <h3 :key="locale" class="gem-name">{{ gemName }}</h3>
        <span class="gem-tipo">{{ gemTipo }}</span>
      </div>
      <div class="gem-specs">
        <div v-for="spec in specs.card" :key="spec.label" class="spec">
          <span class="spec-label">{{ spec.label }}</span>
          <span class="spec-value">{{ spec.value }}</span>
        </div>
      </div>
      <div class="gem-footer">
        <div class="price-block">
          <span class="gem-price" :class="{ 'gem-price--sold': !gem.disponivel }">{{ price.main }}</span>
          <span v-if="price.sub" class="gem-price-sub">{{ price.sub }}</span>
        </div>
        <RouterLink
          :to="gemLink"
          class="gem-cta"
          data-ga-event="gem_card_click"
          :data-ga-item-id="gem.slug"
          :data-ga-item-name="gemName"
          data-ga-context="card_footer"
        >
          {{ t('catalog.viewDetails') }} →
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePrice } from '../composables/usePrice'
import { useGemText, useGemCover } from '../composables/useGemText'
import { useLocalePath } from '../composables/useLocale'

const props = defineProps({
  gem: { type: Object, required: true },
})

const { t, locale } = useI18n()
const { localize } = useLocalePath()
const { gemPrice } = usePrice()
const hovered = ref(false)

const gemLink = computed(() => localize(`/esmeralda/${props.gem.slug}`))

const gemRef = toRef(props, 'gem')
const { gemName, gemTipo, specs } = useGemText(gemRef)
const { coverImage, coverStyle } = useGemCover(gemRef)
const price = computed(() => gemPrice(props.gem))
</script>

<style scoped>
.gem-card {
  background: rgba(13,43,26,0.3);
  border: 1px solid rgba(45,122,79,0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.gem-card--available {
  border-color: rgba(77,184,122,0.45);
  box-shadow:
    0 0 0 1px rgba(77,184,122,0.12),
    0 8px 28px rgba(77,184,122,0.08);
}
.gem-card--available:hover {
  border-color: rgba(77,184,122,0.65);
  box-shadow:
    0 0 0 1px rgba(77,184,122,0.2),
    0 12px 32px rgba(77,184,122,0.12);
}
.gem-card--sold {
  border-color: rgba(180, 90, 90, 0.28);
  box-shadow:
    0 0 0 1px rgba(180, 90, 90, 0.08),
    0 8px 28px rgba(120, 45, 45, 0.06);
}
.gem-card:hover { border-color: rgba(201,168,76,0.3); }
.gem-card--available:hover { border-color: rgba(77,184,122,0.65); }
.gem-card--sold:hover { border-color: rgba(180, 90, 90, 0.4); }
.gem-image-wrap {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  display: block;
  text-decoration: none;
}
.gem-placeholder {
  width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.5s ease;
  overflow: hidden;
}
.gem-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
}
.gem-card:hover .gem-placeholder { transform: scale(1.03); }
.gem-icon {
  font-size: 4rem;
  color: rgba(255,255,255,0.15);
  text-shadow: 0 0 40px rgba(168,230,193,0.3);
}
.gem-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  z-index: 1;
  backdrop-filter: blur(6px);
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.disponivel {
  background: rgba(13, 43, 26, 0.82);
  color: #8fd4a8;
  border: 1px solid rgba(77, 184, 122, 0.55);
  box-shadow: 0 0 16px rgba(77, 184, 122, 0.25);
}
.disponivel .status-dot {
  background: #4db87a;
  box-shadow: 0 0 8px rgba(77, 184, 122, 0.9);
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.75; transform: scale(0.92); }
}
.vendida {
  background: rgba(80, 28, 28, 0.55);
  color: rgba(220, 155, 155, 0.92);
  border: 1px solid rgba(180, 90, 90, 0.35);
  box-shadow: 0 0 12px rgba(120, 45, 45, 0.15);
}
.gem-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10,26,16,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 2;
}
.gem-overlay.visible { opacity: 1; }
.overlay-btn {
  font-size: 0.6rem;
  padding: 0.7rem 1.5rem;
}
.gem-info { padding: 1.5rem; }
.gem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 0.75rem;
}
.gem-name {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--cream);
}
.gem-tipo {
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  border: 1px solid rgba(201,168,76,0.3);
  padding: 0.2rem 0.6rem;
}
.gem-specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
}
.spec {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.spec-label {
  font-size: 0.55rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.6);
}
.spec-value {
  font-size: 0.78rem;
  color: rgba(245,240,232,0.8);
}
.gem-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 1rem;
  border-top: 1px solid rgba(201,168,76,0.1);
  gap: 1rem;
}
.price-block { display: flex; flex-direction: column; gap: 0.2rem; }
.gem-price {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--gold);
}
.gem-price--sold {
  color: rgba(210, 140, 140, 0.85);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
}
.gem-price-sub {
  font-size: 0.6rem;
  color: rgba(245,240,232,0.6);
}
.gem-cta {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.5);
  transition: color 0.2s;
  text-decoration: none;
  white-space: nowrap;
}
.gem-cta:hover { color: var(--gold); }
</style>
