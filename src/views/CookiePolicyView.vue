<template>
  <div class="policy-page">
    <div class="container">
      <RouterLink :to="localize('/')" class="back-link">← {{ t('cookies.backHome') }}</RouterLink>

      <header class="policy-header">
        <p class="section-label">{{ t('cookies.policyLabel') }}</p>
        <h1 class="section-title">{{ t('cookies.policyTitle') }}</h1>
        <div class="divider center"></div>
        <p class="policy-updated">{{ t('cookies.policyUpdated') }}</p>
      </header>

      <div class="policy-body">
        <p class="policy-intro">{{ t('cookies.policyIntro') }}</p>

        <section v-for="i in 9" :key="i" class="policy-section">
          <h2>{{ t(`cookies.policy${i}Title`) }}</h2>
          <p>{{ t(`cookies.policy${i}Body`, { email: contactEmail }) }}</p>
        </section>

        <div class="policy-actions">
          <button type="button" class="btn-outline" @click="openPreferences">
            {{ t('cookies.preferences') }}
          </button>
          <a :href="emailUrl" class="btn-primary">{{ t('footer.email') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '../composables/useSeo'
import { useLocalePath } from '../composables/useLocale'
import { useContact } from '../composables/useContact'
import { useConsent } from '../composables/useConsent'

const { t } = useI18n()
const { localize } = useLocalePath()
const { contactEmail, emailUrl } = useContact()
const { openPreferences } = useConsent()

usePageMeta({
  title: computed(() => t('cookies.policyTitle')),
  description: computed(() => t('meta.cookiePolicyDesc')),
})
</script>

<style scoped>
.policy-page {
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
.policy-header { text-align: center; margin-bottom: 2.5rem; }
.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--cream);
  font-weight: 500;
}
.policy-updated {
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gold);
}
.policy-body {
  max-width: 760px;
  margin: 0 auto;
}
.policy-intro {
  font-size: 0.85rem;
  line-height: 2;
  color: rgba(245,240,232,0.7);
  margin-bottom: 2rem;
}
.policy-section {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.07);
  margin-bottom: 1.5rem;
}
.policy-section h2 {
  font-size: 1rem;
  font-weight: 500;
  color: var(--cream);
  margin-bottom: 0.6rem;
}
.policy-section p {
  font-size: 0.8rem;
  line-height: 2;
  color: rgba(245,240,232,0.6);
}
.policy-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.07);
}
</style>
