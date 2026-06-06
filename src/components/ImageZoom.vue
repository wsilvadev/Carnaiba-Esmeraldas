<template>
  <div class="image-zoom">
    <div
      ref="viewport"
      class="zoom-viewport"
      @wheel.prevent="onWheel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
      @dblclick="reset"
      @touchstart.passive="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div
        class="zoom-content"
        :style="contentStyle"
      >
        <img
          v-if="currentImage?.src"
          :src="currentImage.src"
          :alt="alt"
          draggable="false"
        />
        <div
          v-else
          class="zoom-placeholder"
          :style="{ background: currentImage?.gradiente || gradiente }"
        >
          <span class="gem-icon">◆</span>
        </div>
      </div>
      <div class="zoom-controls">
        <button type="button" @click="zoomIn" aria-label="Zoom in">+</button>
        <button type="button" @click="zoomOut" aria-label="Zoom out">−</button>
        <button type="button" @click="reset" aria-label="Reset">↺</button>
      </div>
      <p class="zoom-hint">{{ hint }}</p>
    </div>

    <div v-if="images.length > 1" class="zoom-thumbs">
      <button
        v-for="(img, i) in images"
        :key="img.id || i"
        type="button"
        :class="['thumb', { active: activeIndex === i }]"
        @click="selectImage(i)"
      >
        <img v-if="img.src" :src="img.src" :alt="`${alt} ${i + 1}`" />
        <div v-else class="thumb-placeholder" :style="{ background: img.gradiente || gradiente }" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { trackEvent } from '../analytics'

const props = defineProps({
  images: { type: Array, default: () => [] },
  gradiente: { type: String, default: 'linear-gradient(135deg, #1a4a2e, #2d7a4f)' },
  alt: { type: String, default: '' },
  hint: { type: String, default: '' },
  gemSlug: { type: String, default: '' },
})

const activeIndex = ref(0)
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const dragging = ref(false)
const lastX = ref(0)
const lastY = ref(0)
const viewport = ref(null)

const currentImage = computed(() => props.images[activeIndex.value] || { gradiente: props.gradiente })

const contentStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
}))

function trackZoom(action, extra = {}) {
  trackEvent('gem_zoom', {
    action,
    item_id: props.gemSlug || undefined,
    ...extra,
  })
}

function selectImage(i) {
  trackEvent('gem_gallery', {
    action: 'select_image',
    image_index: i,
    item_id: props.gemSlug || undefined,
  })
  activeIndex.value = i
  reset(false)
}

function reset(track = true) {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
  if (track) trackZoom('reset')
}

function zoomIn() {
  scale.value = Math.min(scale.value + 0.5, 5)
  trackZoom('zoom_in', { scale: scale.value })
}

function zoomOut() {
  scale.value = Math.max(scale.value - 0.5, 1)
  if (scale.value === 1) reset(false)
  trackZoom('zoom_out', { scale: scale.value })
}

function onWheel(e) {
  const delta = e.deltaY > 0 ? -0.15 : 0.15
  scale.value = Math.min(Math.max(scale.value + delta, 1), 5)
  if (scale.value === 1) {
    translateX.value = 0
    translateY.value = 0
  }
}

function onMouseDown(e) {
  if (scale.value <= 1) return
  dragging.value = true
  lastX.value = e.clientX
  lastY.value = e.clientY
}

function onMouseMove(e) {
  if (!dragging.value) return
  translateX.value += e.clientX - lastX.value
  translateY.value += e.clientY - lastY.value
  lastX.value = e.clientX
  lastY.value = e.clientY
}

function onMouseUp() {
  dragging.value = false
}

let lastTouchDist = 0

function onTouchStart(e) {
  if (e.touches.length === 2) {
    lastTouchDist = getTouchDist(e.touches)
  } else if (e.touches.length === 1 && scale.value > 1) {
    dragging.value = true
    lastX.value = e.touches[0].clientX
    lastY.value = e.touches[0].clientY
  }
}

function onTouchMove(e) {
  if (e.touches.length === 2) {
    const dist = getTouchDist(e.touches)
    const delta = (dist - lastTouchDist) * 0.01
    scale.value = Math.min(Math.max(scale.value + delta, 1), 5)
    lastTouchDist = dist
  } else if (dragging.value && e.touches.length === 1) {
    translateX.value += e.touches[0].clientX - lastX.value
    translateY.value += e.touches[0].clientY - lastY.value
    lastX.value = e.touches[0].clientX
    lastY.value = e.touches[0].clientY
  }
}

function onTouchEnd() {
  dragging.value = false
  lastTouchDist = 0
}

function getTouchDist(touches) {
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.hypot(dx, dy)
}

watch(() => props.images, () => {
  activeIndex.value = 0
  reset(false)
})
</script>

<style scoped>
.image-zoom { display: flex; flex-direction: column; gap: 1rem; }

.zoom-viewport {
  position: relative;
  aspect-ratio: 1;
  background: rgba(13,43,26,0.4);
  border: 1px solid rgba(45,122,79,0.2);
  overflow: hidden;
  cursor: grab;
  user-select: none;
}
.zoom-viewport:active { cursor: grabbing; }

.zoom-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.05s linear;
  transform-origin: center center;
}
.zoom-content img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}
.zoom-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gem-icon {
  font-size: 6rem;
  color: rgba(255,255,255,0.15);
  text-shadow: 0 0 40px rgba(168,230,193,0.3);
}

.zoom-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  z-index: 2;
}
.zoom-controls button {
  width: 36px;
  height: 36px;
  background: rgba(10,26,16,0.85);
  border: 1px solid rgba(201,168,76,0.3);
  color: var(--gold);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
}
.zoom-controls button:hover {
  background: rgba(201,168,76,0.15);
  border-color: var(--gold);
}

.zoom-hint {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.6rem 1rem;
  background: linear-gradient(transparent, rgba(10,26,16,0.9));
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: rgba(245,240,232,0.45);
  text-align: center;
  pointer-events: none;
}

.zoom-thumbs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.thumb {
  width: 72px;
  height: 72px;
  padding: 0;
  border: 2px solid transparent;
  background: none;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s;
}
.thumb.active { border-color: var(--gold); }
.thumb img, .thumb-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
