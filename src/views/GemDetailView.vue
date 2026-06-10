<template>
  <div v-if="loading && !gem" class="gem-not-found">
    <div class="container">
      <p class="catalog-loading">{{ t('catalog.loading') }}</p>
    </div>
  </div>

  <div v-else-if="!gem" class="gem-not-found">
    <div class="container">
      <h1>{{ t('gem.notFound') }}</h1>
      <p>{{ t('gem.notFoundDesc') }}</p>
      <RouterLink to="/#catalogo" class="btn-outline">{{ t('gem.backToCatalog') }}</RouterLink>
    </div>
  </div>

  <div v-else class="gem-detail">
    <div class="container">
      <RouterLink to="/#catalogo" class="back-link">← {{ t('gem.backToCatalog') }}</RouterLink>

      <div class="detail-grid">
        <div class="detail-media">
          <ImageZoom
            :images="gem.imagens"
            :gradiente="gem.gradiente"
            :alt="gemName"
            :hint="t('gem.zoomHint')"
            :gem-slug="gem.slug"
          />
        </div>

        <div class="detail-info">
          <div class="detail-header">
            <span :class="['status-badge', gem.disponivel ? 'available' : 'sold']">
              {{ gem.disponivel ? t('catalog.available') : t('catalog.sold') }}
            </span>
            <span class="tipo-badge">{{ gemTipo }}</span>
          </div>

          <h1 :key="locale" class="detail-name">{{ gemName }}</h1>

          <div class="detail-price">
            <span class="price-main" :class="{ 'price-main--sold': !gem.disponivel }">{{ price.main }}</span>
            <span v-if="price.sub" class="price-sub">{{ price.sub }}</span>
          </div>

          <div v-if="gemDesc" class="detail-description">
            <h2>{{ t('gem.description') }}</h2>
            <p class="detail-desc">{{ gemDesc }}</p>
          </div>

          <div class="specs-table">
            <h2>{{ t('gem.specifications') }}</h2>
            <div class="spec-row" v-for="spec in specs.detail" :key="spec.label">
              <span class="spec-label">{{ spec.label }}</span>
              <span class="spec-value">{{ spec.value }}</span>
            </div>
          </div>

          <div class="detail-actions">
            <a
              v-if="gem.disponivel && whatsappAvailable"
              :href="whatsappUrl"
              target="_blank"
              class="btn-primary"
              data-ga-context="gem_detail"
            >
              {{ t('gem.consultWhatsapp') }}
            </a>
            <a
              v-else-if="gem.disponivel"
              :href="gemEmailUrl"
              class="btn-primary"
              data-ga-context="gem_detail_email"
            >
              {{ t('gem.consultEmail') }}
            </a>
            <button type="button" class="btn-outline" @click="shareGem">
              {{ t('gem.share') }}
            </button>
          </div>
        </div>
      </div>

      <section v-if="gem.videos?.length" class="detail-videos">
        <h2>{{ t('gem.videos') }}</h2>
        <div class="videos-grid">
          <YoutubeVideo
            v-for="(video, i) in gem.videos.filter(v => v.youtubeId)"
            :key="`${video.youtubeId}-${i}`"
            :youtube-id="video.youtubeId"
            :title="video.title"
          />
        </div>
      </section>

      <section v-else class="detail-videos empty">
        <h2>{{ t('gem.videos') }}</h2>
        <p>{{ t('gem.noVideos') }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGems } from '../composables/useGems'
import { useGemText, useGemCover } from '../composables/useGemText'
import { usePrice } from '../composables/usePrice'
import { useWhatsapp } from '../composables/useWhatsapp'
import { useContact } from '../composables/useContact'
import { trackEvent, trackGemView } from '../analytics'
import ImageZoom from '../components/ImageZoom.vue'
import YoutubeVideo from '../components/YoutubeVideo.vue'

const route = useRoute()
const { t, locale } = useI18n()
const { getGemBySlug, loading } = useGems()
const { gemPrice } = usePrice()
const { detail } = useWhatsapp()
const { whatsappAvailable, buildEmailUrl } = useContact()

const gem = computed(() => getGemBySlug(route.params.slug))
const gemRef = computed(() => gem.value)
const { gemName, gemTipo, gemDesc, specs } = useGemText(gemRef)
const { coverImage } = useGemCover(gemRef)
const price = computed(() => gem.value ? gemPrice(gem.value) : { main: '', sub: null })

const whatsappUrl = computed(() => {
  locale.value
  return detail(gemName.value, coverImage.value?.src || '')
})

const gemEmailUrl = computed(() => {
  locale.value
  return buildEmailUrl({
    subjectKey: 'gem.emailSubject',
    subjectParams: { name: gemName.value },
    bodyKey: 'gem.emailBody',
    bodyParams: { name: gemName.value },
  })
})

watch([gem, gemName, locale], ([g, name]) => {
  if (g && name) {
    document.title = `${name} — Carnaíba Esmeraldas`
  }
}, { immediate: true })

watch(gem, (g) => {
  if (g && gemName.value) {
    trackGemView(g.slug, gemName.value)
  }
}, { immediate: true })

async function shareGem() {
  const url = window.location.href
  if (navigator.share) {
    await navigator.share({ title: gemName.value, url })
    trackEvent('share', {
      method: 'native',
      item_id: gem.value?.slug,
      item_name: gemName.value,
    })
  } else {
    await navigator.clipboard.writeText(url)
    trackEvent('share', {
      method: 'clipboard',
      item_id: gem.value?.slug,
      item_name: gemName.value,
    })
  }
}
</script>

<style scoped>
.gem-detail {
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
  transition: color 0.2s;
}
.back-link:hover { color: var(--gold); }

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.detail-header {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.status-badge, .tipo-badge {
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.3rem 0.8rem;
}
.status-badge.available {
  background: rgba(77,184,122,0.2);
  color: #4db87a;
  border: 1px solid rgba(77,184,122,0.3);
}
.status-badge.sold {
  background: rgba(120, 45, 45, 0.22);
  color: rgba(220, 155, 155, 0.9);
  border: 1px solid rgba(180, 90, 90, 0.32);
}
.tipo-badge {
  color: var(--gold);
  border: 1px solid rgba(201,168,76,0.3);
}

.detail-name {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 500;
  color: var(--cream);
  margin-bottom: 1.5rem;
}

.detail-price { margin-bottom: 1.5rem; }
.price-main {
  display: block;
  font-family: var(--font-display);
  font-size: 1.8rem;
  color: var(--gold);
}
.price-main--sold {
  color: rgba(210, 140, 140, 0.85);
  font-size: 1.2rem;
  letter-spacing: 0.06em;
}
.price-sub {
  display: block;
  font-size: 0.72rem;
  color: rgba(245,240,232,0.45);
  margin-top: 0.35rem;
}
.price-note {
  display: block;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: rgba(245,240,232,0.3);
  margin-top: 0.25rem;
}

.detail-description h2 {
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 0.75rem;
}

.detail-desc {
  font-size: 0.85rem;
  line-height: 2;
  color: rgba(245,240,232,0.6);
  margin-bottom: 2rem;
}

.specs-table h2 {
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1rem;
}
.spec-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(201,168,76,0.08);
  gap: 1rem;
}
.spec-label {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.35);
}
.spec-value {
  font-size: 0.8rem;
  color: rgba(245,240,232,0.85);
  text-align: right;
}

.detail-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.detail-videos {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(201,168,76,0.1);
}
.detail-videos h2 {
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.5rem;
}
.detail-videos.empty p {
  font-size: 0.8rem;
  color: rgba(245,240,232,0.4);
}
.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.gem-not-found {
  padding: 10rem 0;
  text-align: center;
  min-height: 60vh;
}
.gem-not-found h1 {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--cream);
  margin-bottom: 1rem;
}
.gem-not-found p {
  color: rgba(245,240,232,0.5);
  margin-bottom: 2rem;
}
.catalog-loading {
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.35);
}

@media (max-width: 900px) {
  .detail-grid { grid-template-columns: 1fr; gap: 2rem; }
}
</style>
