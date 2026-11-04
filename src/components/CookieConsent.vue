<template>
  <Teleport v-if="mounted" to="body">
    <Transition name="cookie-fade">
      <section
        v-if="showBanner && !showPreferences"
        class="cookie-banner"
        role="region"
        aria-labelledby="cookie-banner-title"
      >
        <div class="cookie-banner__inner">
          <div class="cookie-banner__copy">
            <h2 id="cookie-banner-title">{{ t('cookies.bannerTitle') }}</h2>
            <p>
              {{ t('cookies.bannerText') }}
              <RouterLink :to="localize('/politica-de-cookies')">{{ t('cookies.policyLink') }}</RouterLink>
            </p>
          </div>
          <div class="cookie-banner__actions">
            <button type="button" class="cookie-btn cookie-btn--ghost" @click="rejectNonEssential">
              {{ t('cookies.rejectNonEssential') }}
            </button>
            <button type="button" class="cookie-btn cookie-btn--ghost" @click="openPreferences">
              {{ t('cookies.preferences') }}
            </button>
            <button type="button" class="cookie-btn cookie-btn--primary" @click="acceptAll">
              {{ t('cookies.acceptAll') }}
            </button>
          </div>
        </div>
      </section>
    </Transition>

    <Transition name="cookie-fade">
      <div
        v-if="showPreferences"
        class="cookie-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
        @click.self="closePreferences"
      >
        <div class="cookie-modal__card">
          <div class="cookie-modal__header">
            <h2 id="cookie-modal-title">{{ t('cookies.bannerTitle') }}</h2>
            <button type="button" class="cookie-close" :aria-label="t('cookies.close')" @click="closePreferences">
              ×
            </button>
          </div>
          <p class="cookie-modal__intro">{{ t('cookies.bannerText') }}</p>

          <div class="cookie-option cookie-option--locked">
            <div class="cookie-option__text">
              <h3>{{ t('cookies.necessaryTitle') }}</h3>
              <p>{{ t('cookies.necessaryText') }}</p>
            </div>
            <span class="cookie-always">{{ t('cookies.alwaysActive') }}</span>
          </div>

          <label class="cookie-option">
            <span class="cookie-option__text">
              <h3>{{ t('cookies.analyticsTitle') }}</h3>
              <p>{{ t('cookies.analyticsText') }}</p>
            </span>
            <span class="cookie-switch">
              <input v-model="analyticsChoice" type="checkbox" />
              <span class="cookie-switch__track" aria-hidden="true" />
            </span>
          </label>

          <div class="cookie-modal__actions">
            <button type="button" class="cookie-btn cookie-btn--ghost" @click="rejectNonEssential">
              {{ t('cookies.rejectNonEssential') }}
            </button>
            <button type="button" class="cookie-btn cookie-btn--primary" @click="savePreferences(analyticsChoice)">
              {{ t('cookies.savePreferences') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '../composables/useLocale'
import { useConsent } from '../composables/useConsent'

const { t } = useI18n()
const { localize } = useLocalePath()
const {
  consent,
  showBanner,
  showPreferences,
  acceptAll,
  rejectNonEssential,
  savePreferences,
  openPreferences,
  closePreferences,
} = useConsent()

const mounted = ref(false)
const analyticsChoice = ref(false)

watch(
  showPreferences,
  (open) => {
    if (open) analyticsChoice.value = consent.value.analytics === true
  },
  { immediate: true },
)

function handleKeydown(event) {
  if (event.key === 'Escape' && showPreferences.value) closePreferences()
}

onMounted(() => {
  mounted.value = true
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background: rgba(4, 10, 6, 0.98);
  border-top: 1px solid rgba(201, 168, 76, 0.35);
  box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.45);
  padding: 1.1rem 1.25rem;
  backdrop-filter: blur(12px);
}
.cookie-banner__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.cookie-banner__copy { flex: 1; min-width: 0; }
.cookie-banner__copy h2 {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 400;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 0.35rem;
}
.cookie-banner__copy p {
  font-size: 0.75rem;
  line-height: 1.7;
  color: rgba(245, 240, 232, 0.72);
}
.cookie-banner__copy a {
  color: var(--gold);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.cookie-banner__actions {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-shrink: 0;
}
.cookie-btn {
  font-family: var(--font-body);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.65rem 1rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.cookie-btn--ghost {
  background: transparent;
  border-color: rgba(245, 240, 232, 0.22);
  color: rgba(245, 240, 232, 0.75);
}
.cookie-btn--ghost:hover {
  border-color: rgba(201, 168, 76, 0.6);
  color: var(--cream);
}
.cookie-btn--primary {
  background: var(--gold);
  border-color: var(--gold);
  color: #08110b;
  font-weight: 600;
}
.cookie-btn--primary:hover { background: #d9b95c; border-color: #d9b95c; }

.cookie-modal {
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
}
.cookie-modal__card {
  width: min(560px, 100%);
  max-height: 86vh;
  overflow-y: auto;
  background: #07110b;
  border: 1px solid rgba(201, 168, 76, 0.3);
  padding: 1.6rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}
.cookie-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.cookie-modal__header h2 {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
}
.cookie-close {
  background: transparent;
  border: 0;
  color: rgba(245, 240, 232, 0.65);
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.2rem;
}
.cookie-close:hover { color: var(--cream); }
.cookie-modal__intro {
  font-size: 0.76rem;
  line-height: 1.75;
  color: rgba(245, 240, 232, 0.65);
  margin: 0.75rem 0 1.25rem;
}
.cookie-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
}
.cookie-option--locked { cursor: default; }
.cookie-option__text h3 {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--cream);
  margin-bottom: 0.3rem;
}
.cookie-option__text p {
  font-size: 0.7rem;
  line-height: 1.65;
  color: rgba(245, 240, 232, 0.55);
}
.cookie-always {
  flex-shrink: 0;
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(77, 184, 122, 0.9);
}
.cookie-switch {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: 42px;
  height: 24px;
}
.cookie-switch input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
  z-index: 1;
}
.cookie-switch__track {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: rgba(245, 240, 232, 0.18);
  transition: background 0.2s ease;
}
.cookie-switch__track::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #f5f0e8;
  transition: transform 0.2s ease;
}
.cookie-switch input:checked + .cookie-switch__track { background: var(--gold); }
.cookie-switch input:checked + .cookie-switch__track::after { transform: translateX(18px); }
.cookie-switch input:focus-visible + .cookie-switch__track {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}
.cookie-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding-top: 1.1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  margin-top: 0.4rem;
  flex-wrap: wrap;
}

.cookie-fade-enter-active,
.cookie-fade-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.cookie-fade-enter-from,
.cookie-fade-leave-to { opacity: 0; }
.cookie-banner.cookie-fade-enter-from,
.cookie-banner.cookie-fade-leave-to { transform: translateY(100%); }

@media (max-width: 860px) {
  .cookie-banner__inner { flex-direction: column; align-items: stretch; gap: 0.9rem; }
  .cookie-banner__actions { justify-content: flex-end; flex-wrap: wrap; }
}
@media (max-width: 520px) {
  .cookie-banner { padding: 1rem; }
  .cookie-banner__actions { display: grid; grid-template-columns: 1fr 1fr; }
  .cookie-btn--primary { grid-column: 1 / -1; }
  .cookie-modal__card { padding: 1.25rem; }
}
</style>
