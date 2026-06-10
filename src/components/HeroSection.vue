<template>
  <section class="hero">
    <div class="hero-bg">
      <div class="gem-pattern"></div>
      <div class="overlay"></div>
    </div>
    <div class="hero-content">
      <p class="hero-location font-accent fade-up" style="animation-delay:0.2s">{{ t('hero.location') }}</p>
      <h1 class="hero-title heading-serif fade-up" style="animation-delay:0.4s">
        {{ t('hero.title') }}<br/>
        <em>{{ t('hero.titleEm') }}</em>
      </h1>
      <div class="divider fade-up" style="animation-delay:0.6s"></div>
      <p class="hero-desc fade-up" style="animation-delay:0.8s" v-html="heroDesc" />
      <div class="hero-actions fade-up" style="animation-delay:1s">
        <a
          v-if="whatsappAvailable"
          :href="whatsappLink"
          target="_blank"
          class="btn-primary"
          data-ga-context="hero"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          {{ t('hero.ctaWhatsapp') }}
        </a>
        <a
          v-else
          :href="emailUrl"
          class="btn-primary"
          data-ga-context="hero_email"
        >
          {{ t('hero.ctaEmail') }}
        </a>
        <a href="#catalogo" class="btn-outline">{{ t('hero.ctaCatalog') }}</a>
      </div>
    </div>
    <div class="hero-stats fade-in" style="animation-delay:1.2s">
      <div class="stat">
        <span class="stat-num">{{ t('hero.stat1Num') }}</span>
        <span class="stat-label">{{ t('hero.stat1Label') }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat-num">{{ t('hero.stat2Num') }}</span>
        <span class="stat-label">{{ t('hero.stat2Label') }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat-num">{{ t('hero.stat3Num') }}</span>
        <span class="stat-label">{{ t('hero.stat3Label') }}</span>
      </div>
    </div>
    <div class="scroll-hint">
      <span>{{ t('hero.explore') }}</span>
      <div class="scroll-line"></div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWhatsapp } from '../composables/useWhatsapp'
import { useContact } from '../composables/useContact'

const { t } = useI18n()
const { hero: whatsappLink } = useWhatsapp()
const { whatsappAvailable, emailUrl } = useContact()

const heroDesc = computed(() => t('hero.desc').replace(', ', ',<br/>'))
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 30% 50%, rgba(45,122,79,0.3) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 30%, rgba(13,43,26,0.8) 0%, transparent 50%),
    linear-gradient(160deg, #0a1a10 0%, #0d2b1a 40%, #0a1a10 100%);
}
.gem-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    repeating-linear-gradient(60deg, transparent, transparent 80px, rgba(45,122,79,0.04) 80px, rgba(45,122,79,0.04) 81px),
    repeating-linear-gradient(-60deg, transparent, transparent 80px, rgba(45,122,79,0.04) 80px, rgba(45,122,79,0.04) 81px);
}
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, #0a1a10 100%);
}
.hero-content {
  position: relative;
  z-index: 2;
  padding: 0 1rem;
  max-width: 800px;
}
.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 1.05;
  color: #fdfcfa;
  margin-bottom: 0;
}
.hero-title em {
  color: #c9a84c;
}
.hero-location {
  color: var(--gold);
  margin-bottom: 1rem;
}
.hero-desc {
  font-size: 0.95rem;
  line-height: 1.75;
  color: rgba(245,240,232,0.65);
  margin-bottom: 2.5rem;
  letter-spacing: 0;
}
.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.hero-stats {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-top: 5rem;
  padding: 2rem 3rem;
  border-top: 1px solid rgba(201,168,76,0.15);
}
.stat { text-align: center; }
.stat-num {
  display: block;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  color: #c9a84c;
  letter-spacing: 0.05em;
}
.stat-label {
  font-size: 0.6rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.5);
}
.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(201,168,76,0.2);
}
.scroll-hint {
  position: absolute;
  bottom: 2rem;
  right: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
}
.scroll-hint span {
  font-size: 0.55rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.4);
  writing-mode: vertical-rl;
}
.scroll-line {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, rgba(201,168,76,0.6), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
@media (max-width: 900px) {
  .hero {
    padding-top: calc(5.5rem + env(safe-area-inset-top, 0px));
    justify-content: flex-start;
    padding-bottom: 3rem;
  }

  .hero-content {
    margin-top: 1.5rem;
  }

  .hero-stats {
    gap: 1.5rem;
    padding: 1.5rem;
    margin-top: 2.5rem;
  }

  .scroll-hint {
    display: none;
  }
}
</style>
