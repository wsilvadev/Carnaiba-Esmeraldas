<template>
  <section id="galeria" class="galeria">
    <div class="container">
      <div class="section-header">
        <p class="section-label">{{ t('gallery.label') }}</p>
        <h2 class="section-title">{{ t('gallery.title') }}</h2>
        <div class="divider center"></div>
        <p class="section-desc">{{ t('gallery.desc') }}</p>
      </div>

      <div class="galeria-grid">
        <div class="video-card featured">
          <div class="video-placeholder">
            <div class="play-icon">▶</div>
            <p class="video-label">{{ t('gallery.extraction') }}</p>
          </div>
          <div class="video-info">
            <span class="video-tag">{{ t('gallery.extraction') }}</span>
            <h3>{{ t('gallery.video1Title') }}</h3>
            <p>{{ t('gallery.video1Sub') }}</p>
          </div>
        </div>

        <div class="foto-grid">
          <div class="foto-card" v-for="i in 4" :key="i">
            <div class="foto-placeholder" :style="{ background: fotoColors[i-1] }">
              <span class="foto-icon">◈</span>
              <span class="foto-num">{{ t('gallery.photo', { n: i }) }}</span>
            </div>
          </div>
        </div>

        <div class="video-card">
          <div class="video-placeholder small">
            <div class="play-icon small">▶</div>
            <p class="video-label">{{ t('gallery.video2Title') }}</p>
          </div>
          <div class="video-info">
            <span class="video-tag">{{ t('gallery.quality') }}</span>
            <h3>{{ t('gallery.video2Title') }}</h3>
            <p>{{ t('gallery.video2Sub') }}</p>
          </div>
        </div>

        <div class="video-card">
          <div class="video-placeholder small">
            <div class="play-icon small">▶</div>
            <p class="video-label">{{ t('gallery.video3Title') }}</p>
          </div>
          <div class="video-info">
            <span class="video-tag">{{ t('gallery.reference') }}</span>
            <h3>{{ t('gallery.video3Title') }}</h3>
            <p>{{ t('gallery.video3Sub') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const fotoColors = [
  'linear-gradient(135deg, #1a4a2e, #2d7a4f)',
  'linear-gradient(135deg, #0d2b1a, #1a5a35)',
  'linear-gradient(135deg, #2d7a4f, #4db87a)',
  'linear-gradient(135deg, #0a1a10, #1a4a2e)',
]
</script>

<style scoped>
.galeria {
  padding: 8rem 0;
  background: #080f0a;
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
  font-size: 0.78rem;
  line-height: 2;
  color: rgba(245,240,232,0.45);
}
.galeria-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-template-rows: auto auto;
  gap: 2px;
}
.video-card { background: rgba(13,43,26,0.4); border: 1px solid rgba(45,122,79,0.1); }
.video-card.featured { grid-row: span 1; }
.video-placeholder {
  aspect-ratio: 16/9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0d2b1a, #1a4a2e);
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
  padding: 1rem;
  text-align: center;
}
.video-placeholder.small { aspect-ratio: 16/7; }
.video-placeholder:hover { background: linear-gradient(135deg, #1a4a2e, #2d7a4f); }
.play-icon {
  font-size: 2.5rem;
  color: rgba(201,168,76,0.6);
  transition: all 0.3s;
}
.play-icon.small { font-size: 1.5rem; }
.video-placeholder:hover .play-icon { color: var(--gold); transform: scale(1.1); }
.video-label {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: rgba(245,240,232,0.7);
}
.video-info {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.video-tag {
  font-size: 0.55rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gold);
}
.video-info h3 {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--cream);
}
.video-info p {
  font-size: 0.7rem;
  color: rgba(245,240,232,0.4);
}
.foto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}
.foto-card { aspect-ratio: 1; overflow: hidden; }
.foto-placeholder {
  width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.4s ease;
}
.foto-card:hover .foto-placeholder { transform: scale(1.05); }
.foto-icon {
  font-size: 2rem;
  color: rgba(255,255,255,0.15);
}
.foto-num {
  font-size: 0.6rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
}
@media (max-width: 768px) {
  .galeria-grid { grid-template-columns: 1fr; }
  .foto-grid { grid-template-columns: 1fr 1fr; }
}
</style>
