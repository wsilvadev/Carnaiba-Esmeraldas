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
          <div class="video-placeholder extraction">
            <video
              class="extraction-video"
              autoplay
              loop
              muted
              playsinline
              preload="metadata"
              poster="/extracao-poster.jpg"
              :aria-label="t('gallery.extraction')"
            >
              <source src="/extracao.mp4" type="video/mp4" />
            </video>
            <p class="video-label extraction-label">{{ t('gallery.extraction') }}</p>
          </div>
          <div class="video-info">
            <span class="video-tag">{{ t('gallery.extraction') }}</span>
            <h3>{{ t('gallery.video1Title') }}</h3>
            <p>{{ t('gallery.video1Sub') }}</p>
          </div>
        </div>

        <div class="foto-grid">
          <div class="foto-card" v-for="(foto, i) in fotos" :key="foto.src">
            <img
              :src="foto.src"
              :alt="t('gallery.photo', { n: i + 1 })"
              :width="foto.width"
              :height="foto.height"
              class="foto-img"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div class="video-card">
          <YoutubeVideo youtube-id="6_VvaCXfFqU" :title="t('gallery.video2Title')" />
        </div>

        <div class="video-card">
          <YoutubeVideo youtube-id="XJ-2-_FeWIk" :title="t('gallery.video3Title')" />
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
import YoutubeVideo from './YoutubeVideo.vue'

const { t } = useI18n()

const fotos = [
  { src: '/esmeralda_1.jpg', width: 1200, height: 717 },
  { src: '/esmeralda_2.jpg', width: 1200, height: 1170 },
  { src: '/esmeralda_3.jpg', width: 1200, height: 1058 },
  { src: '/esmeralda_4.jpg', width: 1195, height: 1200 },
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
  color: rgba(245,240,232,0.6);
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
  position: relative;
  overflow: hidden;
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
  color: #c9a84c;
  background: rgba(10,26,16,0.8);
  border-radius: 50%;
  width: 4.5rem;
  height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}
.play-icon.small {
  font-size: 1.5rem;
  width: 3.5rem;
  height: 3.5rem;
}
.video-placeholder:hover .play-icon { color: var(--gold); transform: scale(1.1); }
.extraction-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.extraction-label {
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 26, 16, 0.7);
  padding: 0.3rem 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.6rem;
  color: var(--cream);
  white-space: nowrap;
}
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
  color: rgba(245,240,232,0.6);
}
.foto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}
.foto-card { aspect-ratio: 1; overflow: hidden; }
.foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  cursor: pointer;
  transition: transform 0.4s ease;
}
.foto-card:hover .foto-img { transform: scale(1.05); }
@media (max-width: 768px) {
  .galeria-grid { grid-template-columns: 1fr; }
  .foto-grid { grid-template-columns: 1fr 1fr; }
}
</style>
