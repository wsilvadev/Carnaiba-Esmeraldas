<template>
  <div class="youtube-video">
    <div v-if="!playing" class="youtube-thumb-wrap">
      <button
        type="button"
        class="youtube-thumb"
        :aria-label="playLabel"
        @click="play"
      >
        <img
          :src="thumbnailUrl"
          :alt="title || playLabel"
          class="youtube-thumb-img"
          width="480"
          height="360"
          loading="lazy"
          decoding="async"
        />
        <span class="youtube-play" aria-hidden="true">▶</span>
      </button>
      <p v-if="title" class="youtube-caption">{{ title }}</p>
    </div>

    <div v-else class="youtube-player">
      <iframe
        :src="embedUrl"
        :title="title || playLabel"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { youtubeEmbedUrl, youtubeThumbnailUrl } from '../utils/youtube'

const props = defineProps({
  youtubeId: { type: String, required: true },
  title: { type: String, default: '' },
})

const { t } = useI18n()
const playing = ref(false)

const playLabel = computed(() =>
  props.title
    ? t('gem.playVideoNamed', { title: props.title })
    : t('gem.playVideo'),
)

const thumbnailUrl = computed(() => youtubeThumbnailUrl(props.youtubeId))

const embedUrl = computed(() =>
  youtubeEmbedUrl(props.youtubeId, { autoplay: true }),
)

function play() {
  playing.value = true
}

watch(() => props.youtubeId, () => {
  playing.value = false
})
</script>

<style scoped>
.youtube-video {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.youtube-thumb-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.youtube-thumb {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  padding: 0;
  border: 1px solid rgba(45, 122, 79, 0.15);
  background: rgba(13, 43, 26, 0.4);
  cursor: pointer;
  overflow: hidden;
}

.youtube-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.youtube-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  color: rgba(201, 168, 76, 0.85);
  background: rgba(10, 26, 16, 0.35);
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

.youtube-thumb:hover .youtube-thumb-img {
  transform: scale(1.03);
  opacity: 0.92;
}

.youtube-thumb:hover .youtube-play {
  color: var(--gold);
  background: rgba(10, 26, 16, 0.5);
}

.youtube-caption {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.5;
  color: rgba(245, 240, 232, 0.65);
}

.youtube-player {
  aspect-ratio: 16 / 9;
  background: rgba(13, 43, 26, 0.4);
  border: 1px solid rgba(45, 122, 79, 0.15);
}

.youtube-player iframe {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
